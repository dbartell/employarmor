"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Shield, Mail, UserPlus, CheckCircle2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

interface InviteData {
  id: string
  email: string
  role: string
  department: string | null
  organization_id: string
  organization_name: string
  expires_at: string
  accepted_at: string | null
}

export default function InviteAcceptPage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string
  
  const [loading, setLoading] = useState(true)
  const [invite, setInvite] = useState<InviteData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [accepting, setAccepting] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    loadInvite()
  }, [token])

  async function loadInvite() {
    try {
      const supabase = createClient()
      
      // Get invite details
      const { data: inviteData, error: inviteError } = await supabase
        .from('employee_invites')
        .select('*, organization:organizations(name)')
        .eq('token', token)
        .is('accepted_at', null)
        .single()

      if (inviteError || !inviteData) {
        setError("Invalid or expired invitation link")
        setLoading(false)
        return
      }

      // Check if expired
      if (new Date(inviteData.expires_at) < new Date()) {
        setError("This invitation has expired")
        setLoading(false)
        return
      }

      setInvite({
        ...inviteData,
        organization_name: inviteData.organization?.name || 'Unknown Organization'
      })
      setLoading(false)
    } catch (err) {
      console.error("Error loading invite:", err)
      setError("Failed to load invitation")
      setLoading(false)
    }
  }

  async function handleAcceptInvite(e: React.FormEvent) {
    e.preventDefault()
    
    if (!invite) return
    
    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setAccepting(true)
    setError(null)

    try {
      const supabase = createClient()

      // Create auth account
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: invite.email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/portal`
        }
      })

      if (signUpError) throw signUpError
      if (!authData.user) throw new Error("Failed to create account")

      // Create employee profile
      const { error: profileError } = await supabase
        .from('employee_profiles')
        .insert({
          user_id: authData.user.id,
          organization_id: invite.organization_id,
          email: invite.email,
          role: invite.role,
          department: invite.department,
          invited_at: new Date().toISOString(),
          joined_at: new Date().toISOString()
        })

      if (profileError) throw profileError

      // Mark invite as accepted
      const { error: updateError } = await supabase
        .from('employee_invites')
        .update({
          accepted_at: new Date().toISOString(),
          employee_profile_id: authData.user.id
        })
        .eq('id', invite.id)

      if (updateError) throw updateError

      setSuccess(true)
      
      // Redirect to portal after 2 seconds
      setTimeout(() => {
        router.push('/portal')
      }, 2000)

    } catch (err: any) {
      console.error("Accept invite error:", err)
      setError(err.message || "Failed to accept invitation")
      setAccepting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading invitation...</p>
          </div>
        </Card>
      </div>
    )
  }

  if (error && !invite) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Invitation</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => router.push('/login')}>Go to Login</Button>
          </div>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to EmployArmor!</h1>
            <p className="text-gray-600 mb-4">Your account has been created successfully.</p>
            <p className="text-sm text-gray-500">Redirecting to your portal...</p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Join {invite?.organization_name}</h1>
          <p className="text-gray-600">You've been invited as a <span className="font-semibold capitalize">{invite?.role}</span></p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-blue-600" />
            <span className="text-gray-700">{invite?.email}</span>
          </div>
          {invite?.department && (
            <div className="flex items-center gap-2 text-sm mt-2">
              <UserPlus className="w-4 h-4 text-blue-600" />
              <span className="text-gray-700">{invite.department}</span>
            </div>
          )}
        </div>

        <form onSubmit={handleAcceptInvite} className="space-y-4">
          <div>
            <Label htmlFor="password">Create Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              required
              minLength={8}
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={accepting}>
            {accepting ? "Creating Account..." : "Accept Invitation & Create Account"}
          </Button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-6">
          By accepting, you agree to EmployArmor's Terms of Service and Privacy Policy
        </p>
      </Card>
    </div>
  )
}
