import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getUserRole, canManageEmployees } from "@/lib/auth/roles"
import { Card } from "@/components/ui/card"
import { Users, UserPlus, Mail, Shield, MoreVertical, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { InviteEmployeeDialog } from "@/components/employees/invite-employee-dialog"

export default async function EmployeesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user's organization
  const { data: org } = await supabase
    .from('organizations')
    .select('id, name')
    .eq('id', user.id)
    .single()

  if (!org) {
    redirect('/dashboard')
  }

  // Check permissions
  const role = await getUserRole(user.id, org.id)
  if (!canManageEmployees(role)) {
    redirect('/portal')
  }

  // Get all employee profiles
  const { data: employees } = await supabase
    .from('employee_profiles')
    .select('*')
    .eq('organization_id', org.id)
    .order('created_at', { ascending: false })

  // Get pending invites
  const { data: pendingInvites } = await supabase
    .from('employee_invites')
    .select('*')
    .eq('organization_id', org.id)
    .is('accepted_at', null)
    .order('created_at', { ascending: false })

  const employeeCount = employees?.length || 0
  const inviteCount = pendingInvites?.length || 0

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Team</h1>
            </div>
            <p className="text-gray-600">Manage your organization's employees and invitations</p>
          </div>
          <InviteEmployeeDialog orgId={org.id} />
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{employeeCount}</div>
                <div className="text-sm text-gray-600">Active Employees</div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{inviteCount}</div>
                <div className="text-sm text-gray-600">Pending Invites</div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {employees?.filter(e => e.role === 'admin' || e.role === 'owner').length || 0}
                </div>
                <div className="text-sm text-gray-600">Admins</div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Pending Invites */}
      {pendingInvites && pendingInvites.length > 0 && (
        <Card className="mb-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              Pending Invitations
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {pendingInvites.map(invite => (
              <div key={invite.id} className="p-6 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{invite.email}</div>
                    <div className="text-sm text-gray-600">
                      Invited as <span className="capitalize font-medium">{invite.role}</span>
                      {invite.department && ` · ${invite.department}`}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">
                    Invited {new Date(invite.created_at).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-orange-600 font-medium">
                    Expires {new Date(invite.expires_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Active Employees */}
      <Card>
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Active Employees
          </h2>
        </div>
        {employees && employees.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {employees.map(employee => (
              <div key={employee.id} className="p-6 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{employee.email}</div>
                    <div className="text-sm text-gray-600">
                      <span className="capitalize font-medium">{employee.role}</span>
                      {employee.department && ` · ${employee.department}`}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-gray-600">
                      {employee.joined_at 
                        ? `Joined ${new Date(employee.joined_at).toLocaleDateString()}`
                        : 'Not yet joined'
                      }
                    </div>
                    <div className="text-xs text-gray-500">
                      Created {new Date(employee.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">No employees yet</h3>
            <p className="text-gray-600 mb-6">Get started by inviting your first team member</p>
            <InviteEmployeeDialog orgId={org.id} />
          </div>
        )}
      </Card>
    </div>
  )
}
