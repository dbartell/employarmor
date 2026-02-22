import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getEmployeeProfile } from "@/lib/auth/roles"
import { Card } from "@/components/ui/card"
import { FileText, GraduationCap, Wrench, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"

export default async function PortalDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get employee profile - try org ID as user.id first (for owners)
  let profile = await getEmployeeProfile(user.id, user.id)
  
  // If not found, search for their profile across orgs
  if (!profile) {
    const { data: profiles } = await supabase
      .from('employee_profiles')
      .select('*')
      .eq('user_id', user.id)
      .limit(1)
    
    if (profiles && profiles.length > 0) {
      profile = profiles[0]
    }
  }

  if (!profile) {
    redirect('/dashboard') // No employee profile, redirect to admin
  }

  // Get task counts
  const { count: pendingDisclosures } = await supabase
    .from('disclosure_acknowledgments')
    .select('*', { count: 'exact', head: true })
    .eq('employee_id', profile.id)
    .is('signed_at', null)

  const { count: incompleteTraining } = await supabase
    .from('training_assignments')
    .select('*', { count: 'exact', head: true })
    .eq('employee_id', profile.id)
    .in('status', ['assigned', 'in_progress'])

  const { count: pendingRequests } = await supabase
    .from('tool_requests')
    .select('*', { count: 'exact', head: true })
    .eq('employee_id', profile.id)
    .eq('status', 'pending')

  const totalTasks = (pendingDisclosures || 0) + (incompleteTraining || 0)
  
  // Get completed counts
  const { count: completedDisclosures } = await supabase
    .from('disclosure_acknowledgments')
    .select('*', { count: 'exact', head: true })
    .eq('employee_id', profile.id)

  const { count: completedTraining } = await supabase
    .from('training_assignments')
    .select('*', { count: 'exact', head: true })
    .eq('employee_id', profile.id)
    .eq('status', 'completed')

  const { count: approvedTools } = await supabase
    .from('tool_requests')
    .select('*', { count: 'exact', head: true })
    .eq('employee_id', profile.id)
    .eq('status', 'approved')

  // Calculate compliance percentage (simple version)
  const totalRequired = (pendingDisclosures || 0) + (completedDisclosures || 0) + 
                        (incompleteTraining || 0) + (completedTraining || 0)
  const totalCompleted = (completedDisclosures || 0) + (completedTraining || 0)
  const compliancePercentage = totalRequired > 0 ? Math.round((totalCompleted / totalRequired) * 100) : 100

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome Back!</h1>
        <p className="text-gray-600 mt-1">Here's your compliance overview</p>
      </div>

      {/* Compliance Status */}
      <Card className="p-6 mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">My Compliance Status</h2>
            <p className="text-sm text-gray-600">Keep up the great work!</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-blue-600">{compliancePercentage}%</div>
            <p className="text-sm text-gray-600">Complete</p>
          </div>
        </div>
        <div className="mt-4 bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-blue-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${compliancePercentage}%` }}
          />
        </div>
      </Card>

      {/* My Tasks */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">My Tasks</h2>
        {totalTasks > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {(pendingDisclosures || 0) > 0 && (
              <Link href="/portal/disclosures">
                <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer border-orange-200 bg-orange-50">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">Disclosures to Sign</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {pendingDisclosures} {pendingDisclosures === 1 ? 'disclosure' : 'disclosures'} waiting for your signature
                      </p>
                      <div className="flex items-center gap-1 mt-2 text-orange-600 text-sm font-medium">
                        <AlertCircle className="w-4 h-4" />
                        Action required
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            )}

            {(incompleteTraining || 0) > 0 && (
              <Link href="/portal/training">
                <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer border-blue-200 bg-blue-50">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">Training Modules</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {incompleteTraining} {incompleteTraining === 1 ? 'module' : 'modules'} to complete
                      </p>
                      <div className="flex items-center gap-1 mt-2 text-blue-600 text-sm font-medium">
                        <Clock className="w-4 h-4" />
                        In progress
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            )}
          </div>
        ) : (
          <Card className="p-8 text-center border-green-200 bg-green-50">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">All Caught Up!</h3>
            <p className="text-gray-600 text-sm">You have no pending tasks at the moment.</p>
          </Card>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid md:grid-cols-3 gap-4">
        <Link href="/portal/disclosures">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-gray-700" />
              </div>
              <h3 className="font-semibold text-gray-900">My Disclosures</h3>
            </div>
            <p className="text-sm text-gray-600">{completedDisclosures || 0} signed</p>
          </Card>
        </Link>

        <Link href="/portal/training">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-gray-700" />
              </div>
              <h3 className="font-semibold text-gray-900">My Training</h3>
            </div>
            <p className="text-sm text-gray-600">{completedTraining || 0} completed</p>
          </Card>
        </Link>

        <Link href="/portal/tools">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Wrench className="w-5 h-5 text-gray-700" />
              </div>
              <h3 className="font-semibold text-gray-900">Tool Requests</h3>
            </div>
            <p className="text-sm text-gray-600">
              {approvedTools || 0} approved · {pendingRequests || 0} pending
            </p>
          </Card>
        </Link>
      </div>
    </div>
  )
}
