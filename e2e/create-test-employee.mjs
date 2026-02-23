#!/usr/bin/env node
/**
 * Create test employee account for E2E testing
 * Creates both auth user and employee_profile record
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');

// Load env
const envPath = path.join(PROJECT_ROOT, '.env.local');
const envFile = fs.readFileSync(envPath, 'utf8');
const env = Object.fromEntries(
  envFile.split('\n')
    .filter(line => line && !line.startsWith('#'))
    .map(line => {
      const [key, ...valueParts] = line.split('=');
      return [key, valueParts.join('=').replace(/^"(.*)"$/, '$1')];
    })
);

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_EMAIL = 'test-e2e@employarmor.com';
const EMPLOYEE_EMAIL = 'test-employee@employarmor.com';
const EMPLOYEE_PASSWORD = 'TestEmployee!2026';

async function main() {
  console.log('🔧 Creating test employee account...\n');

  // Step 1: Find the admin's organization
  console.log('1. Finding admin organization...');
  const adminProfileResp = await fetch(
    `${SUPABASE_URL}/rest/v1/employee_profiles?email=eq.${encodeURIComponent(ADMIN_EMAIL)}&select=*`,
    {
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );
  const adminProfiles = await adminProfileResp.json();
  
  if (!adminProfiles || adminProfiles.length === 0) {
    console.error('❌ Admin profile not found. Run E2E auth scenario first to create admin account.');
    process.exit(1);
  }
  
  const orgId = adminProfiles[0].organization_id;
  console.log(`   ✅ Found org: ${orgId}`);

  // Step 2: Check if employee user already exists
  console.log('\n2. Checking if employee user exists...');
  const existingUserResp = await fetch(
    `${SUPABASE_URL}/auth/v1/admin/users`,
    {
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );
  const existingUsers = await existingUserResp.json();
  const existingEmployee = existingUsers.users?.find(u => u.email === EMPLOYEE_EMAIL);

  let userId;
  if (existingEmployee) {
    console.log(`   ℹ️  User already exists: ${existingEmployee.id}`);
    userId = existingEmployee.id;
  } else {
    // Step 3: Create auth user
    console.log('\n3. Creating auth user...');
    const createUserResp = await fetch(
      `${SUPABASE_URL}/auth/v1/admin/users`,
      {
        method: 'POST',
        headers: {
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: EMPLOYEE_EMAIL,
          password: EMPLOYEE_PASSWORD,
          email_confirm: true,
          user_metadata: {
            full_name: 'Test Employee'
          }
        })
      }
    );

    const createUserData = await createUserResp.json();
    if (createUserData.error) {
      console.error('❌ Failed to create user:', createUserData.error);
      process.exit(1);
    }

    userId = createUserData.id;
    console.log(`   ✅ Created user: ${userId}`);
  }

  // Step 4: Check if employee profile exists
  console.log('\n4. Checking if employee profile exists...');
  const existingProfileResp = await fetch(
    `${SUPABASE_URL}/rest/v1/employee_profiles?user_id=eq.${userId}&organization_id=eq.${orgId}`,
    {
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );
  const existingProfiles = await existingProfileResp.json();

  if (existingProfiles && existingProfiles.length > 0) {
    console.log(`   ℹ️  Employee profile already exists: ${existingProfiles[0].id}`);
    console.log('\n✅ Test employee account ready!');
    console.log(`   Email: ${EMPLOYEE_EMAIL}`);
    console.log(`   Password: ${EMPLOYEE_PASSWORD}`);
    console.log(`   Role: employee`);
    console.log(`   Organization: ${orgId}`);
    return;
  }

  // Step 5: Create employee profile
  console.log('\n5. Creating employee profile...');
  const createProfileResp = await fetch(
    `${SUPABASE_URL}/rest/v1/employee_profiles`,
    {
      method: 'POST',
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        user_id: userId,
        organization_id: orgId,
        email: EMPLOYEE_EMAIL,
        role: 'employee',
        department: 'Engineering',
        joined_at: new Date().toISOString()
      })
    }
  );

  const profileData = await createProfileResp.json();
  if (createProfileResp.status !== 201) {
    console.error('❌ Failed to create employee profile:', profileData);
    process.exit(1);
  }

  console.log(`   ✅ Created profile: ${profileData[0].id}`);

  console.log('\n✅ Test employee account created successfully!');
  console.log(`   Email: ${EMPLOYEE_EMAIL}`);
  console.log(`   Password: ${EMPLOYEE_PASSWORD}`);
  console.log(`   Role: employee`);
  console.log(`   Organization: ${orgId}`);
  console.log(`   Profile ID: ${profileData[0].id}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
