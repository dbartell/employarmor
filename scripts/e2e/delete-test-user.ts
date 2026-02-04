#!/usr/bin/env npx tsx
/**
 * Delete Test User
 * 
 * Cleans up the test user from:
 * 1. Supabase (cascades to related records)
 * 2. Stripe (subscriptions + customer)
 * 
 * Run: npx tsx scripts/e2e/delete-test-user.ts
 */

import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const TEST_EMAIL = process.env.E2E_TEST_EMAIL || 'e2e-test@hireshield.test'

// Initialize clients
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Need service role for admin operations
)

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

async function deleteTestUser() {
  console.log(`🧹 Cleaning up test user: ${TEST_EMAIL}`)
  
  // 1. Find user in Supabase auth
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
  
  if (listError) {
    console.error('❌ Failed to list users:', listError.message)
    process.exit(1)
  }
  
  const testUser = users.find(u => u.email === TEST_EMAIL)
  
  if (!testUser) {
    console.log('ℹ️  No existing test user found in auth')
  } else {
    console.log(`📍 Found user: ${testUser.id}`)
    
    // 2. Get organization/profile data before deletion (for Stripe customer ID)
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, organization_id')
      .eq('id', testUser.id)
      .single()
    
    // 3. Delete from Stripe if customer exists
    if (profile?.stripe_customer_id) {
      console.log(`💳 Cleaning up Stripe customer: ${profile.stripe_customer_id}`)
      try {
        // Cancel any active subscriptions first
        const subs = await stripe.subscriptions.list({
          customer: profile.stripe_customer_id,
          status: 'all'
        })
        
        for (const sub of subs.data) {
          if (sub.status !== 'canceled') {
            await stripe.subscriptions.cancel(sub.id)
            console.log(`   ↳ Canceled subscription: ${sub.id}`)
          }
        }
        
        // Delete the customer
        await stripe.customers.del(profile.stripe_customer_id)
        console.log(`   ↳ Deleted Stripe customer`)
      } catch (e: any) {
        if (e.code === 'resource_missing') {
          console.log('   ↳ Stripe customer already deleted')
        } else {
          console.error('   ↳ Stripe error:', e.message)
        }
      }
    }
    
    // 4. Delete organization if exists (will cascade to org members, documents, etc.)
    if (profile?.organization_id) {
      const { error: orgError } = await supabase
        .from('organizations')
        .delete()
        .eq('id', profile.organization_id)
      
      if (orgError) {
        console.log(`   ↳ Org delete note: ${orgError.message}`)
      } else {
        console.log(`   ↳ Deleted organization: ${profile.organization_id}`)
      }
    }
    
    // 5. Delete user from auth (cascades to profiles via FK)
    const { error: deleteError } = await supabase.auth.admin.deleteUser(testUser.id)
    
    if (deleteError) {
      console.error('❌ Failed to delete user:', deleteError.message)
      process.exit(1)
    }
    
    console.log('✅ User deleted from Supabase auth')
  }
  
  // 6. Also check leads table
  const { error: leadsError } = await supabase
    .from('leads')
    .delete()
    .eq('email', TEST_EMAIL)
  
  if (!leadsError) {
    console.log('✅ Cleaned up leads table')
  }
  
  console.log('🎉 Test user cleanup complete!')
}

deleteTestUser().catch(err => {
  console.error('❌ Cleanup failed:', err)
  process.exit(1)
})
