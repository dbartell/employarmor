import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Mail, Users, Shield, Globe, ArrowRight } from "lucide-react"
import Link from "next/link"

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: org } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', user?.id)
    .single()

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account and organization settings</p>
        </div>

        <div className="space-y-6">
          {/* Organization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Organization
              </CardTitle>
              <CardDescription>Your organization details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Company Name</label>
                  <div className="text-lg">{org?.name || 'Not set'}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Industry</label>
                  <div className="text-lg capitalize">{org?.industry || 'Not set'}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Company Size</label>
                  <div className="text-lg capitalize">{org?.size || 'Not set'}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Account
              </CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                  <div className="text-lg">{user?.email}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Account ID</label>
                  <div className="text-sm text-gray-500 font-mono">{user?.id}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Subscription
              </CardTitle>
              <CardDescription>Your current plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <div className="font-semibold text-blue-900">Free Trial</div>
                  <div className="text-sm text-blue-700">14 days remaining</div>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Active
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Disclosure Page */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Disclosure Page
              </CardTitle>
              <CardDescription>Public page explaining your AI hiring practices</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Create a public disclosure page that candidates can view to understand how you use AI in hiring.
                Required for compliance with NYC LL144, Colorado AI Act, and more.
              </p>
              <Link href="/settings/disclosure">
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Configure Disclosure Page
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
