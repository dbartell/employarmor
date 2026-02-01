'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Users, UserPlus, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { InviteModal } from '@/components/team/invite-modal'
import { MembersList } from '@/components/team/members-list'
import { PendingInvites } from '@/components/team/pending-invites'
import type { OrganizationMember, TeamInvite, MemberRole } from '@/types'

interface TeamData {
  members: OrganizationMember[]
  invites: TeamInvite[]
  organization: {
    seat_limit: number
    seats_used: number
    employee_count: number
  }
  currentUserRole: MemberRole
}

export default function TeamSettingsPage() {
  const router = useRouter()
  const [data, setData] = useState<TeamData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string>('')

  const fetchTeamData = useCallback(async () => {
    try {
      const res = await fetch('/api/team/members')
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to fetch team data')
      }
      const teamData = await res.json()
      setData(teamData)
      
      // Find current user ID from members
      const currentMember = teamData.members.find(
        (m: OrganizationMember) => m.role === teamData.currentUserRole
      )
      if (currentMember) {
        setCurrentUserId(currentMember.user_id)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load team data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTeamData()
  }, [fetchTeamData])

  const handleInvite = async (email: string, role: Exclude<MemberRole, 'owner'>) => {
    const res = await fetch('/api/team/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role }),
    })
    
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Failed to send invite')
    }
    
    await fetchTeamData()
  }

  const handleRemoveMember = async (memberId: string) => {
    const res = await fetch(`/api/team/members/${memberId}`, {
      method: 'DELETE',
    })
    
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Failed to remove member')
    }
    
    await fetchTeamData()
  }

  const handleChangeRole = async (memberId: string, newRole: MemberRole) => {
    const res = await fetch(`/api/team/members/${memberId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole }),
    })
    
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Failed to update role')
    }
    
    await fetchTeamData()
  }

  const handleCancelInvite = async (token: string) => {
    const res = await fetch(`/api/invite/${token}`, {
      method: 'DELETE',
    })
    
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Failed to cancel invite')
    }
    
    await fetchTeamData()
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => router.push('/settings')}>
                Back to Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const canManage = ['owner', 'admin'].includes(data?.currentUserRole || '')
  const seatsAvailable = (data?.organization.seat_limit || 0) - (data?.organization.seats_used || 0)

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600">Manage your team members and their roles</p>
        </div>

        {/* Seat Usage Card */}
        <Card className="mb-6">
          <CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Team Members</div>
                <div className="text-2xl font-bold text-gray-900">
                  {data?.organization.seats_used} <span className="text-gray-400 font-normal text-lg">/ {data?.organization.seat_limit}</span>
                </div>
              </div>
            </div>
            
            {canManage && (
              <Button onClick={() => setShowInviteModal(true)} className="gap-2">
                <UserPlus className="w-4 h-4" />
                Invite Member
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Members List */}
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>
              {data?.members.length === 1 
                ? "You're the only team member. Invite others to collaborate!"
                : `${data?.members.length} team members with access to your organization`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data && (
              <>
                <MembersList
                  members={data.members}
                  currentUserId={currentUserId}
                  currentUserRole={data.currentUserRole}
                  onRemove={handleRemoveMember}
                  onChangeRole={handleChangeRole}
                />
                
                <PendingInvites
                  invites={data.invites}
                  canManage={canManage}
                  onCancel={handleCancelInvite}
                  onResend={handleInvite}
                />
              </>
            )}
          </CardContent>
        </Card>

        {/* Upgrade Prompt */}
        {seatsAvailable <= 1 && canManage && (
          <Card className="mt-6 border-amber-200 bg-amber-50">
            <CardContent className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <div>
                  <div className="font-medium text-amber-900">
                    {seatsAvailable === 0 ? "You've reached your seat limit" : "Only 1 seat remaining"}
                  </div>
                  <div className="text-sm text-amber-700">
                    Upgrade your plan to add more team members
                  </div>
                </div>
              </div>
              <Button variant="outline" onClick={() => router.push('/settings')}>
                Manage Plan
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Invite Modal */}
      <InviteModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onInvite={handleInvite}
        seatsAvailable={seatsAvailable}
      />
    </div>
  )
}
