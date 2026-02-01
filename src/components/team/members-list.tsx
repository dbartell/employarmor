'use client'

import { useState } from 'react'
import { MoreHorizontal, UserMinus, Shield, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { OrganizationMember, MemberRole } from '@/types'
import { getRoleLabel } from '@/lib/permissions'

interface MembersListProps {
  members: OrganizationMember[]
  currentUserId: string
  currentUserRole: MemberRole
  onRemove: (memberId: string) => Promise<void>
  onChangeRole: (memberId: string, newRole: MemberRole) => Promise<void>
}

export function MembersList({ 
  members, 
  currentUserId, 
  currentUserRole,
  onRemove, 
  onChangeRole 
}: MembersListProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null)
  const [roleMenuId, setRoleMenuId] = useState<string | null>(null)

  const canManage = ['owner', 'admin'].includes(currentUserRole)

  const handleRemove = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this team member?')) return
    
    setLoadingId(memberId)
    try {
      await onRemove(memberId)
    } finally {
      setLoadingId(null)
      setMenuOpenId(null)
    }
  }

  const handleRoleChange = async (memberId: string, newRole: MemberRole) => {
    setLoadingId(memberId)
    try {
      await onChangeRole(memberId, newRole)
    } finally {
      setLoadingId(null)
      setRoleMenuId(null)
    }
  }

  const getRoleBadgeColor = (role: MemberRole) => {
    switch (role) {
      case 'owner': return 'bg-purple-100 text-purple-700'
      case 'admin': return 'bg-blue-100 text-blue-700'
      case 'manager': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }
    return email ? email[0].toUpperCase() : '?'
  }

  return (
    <div className="divide-y divide-gray-100">
      {members.map((member) => {
        const isCurrentUser = member.user_id === currentUserId
        const isOwner = member.role === 'owner'
        const canModify = canManage && !isCurrentUser && !isOwner
        const canModifyRole = currentUserRole === 'owner' || (currentUserRole === 'admin' && member.role !== 'admin')

        return (
          <div
            key={member.id}
            className="flex items-center justify-between py-4 px-2"
          >
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium">
                {getInitials(member.user?.full_name, member.user?.email)}
              </div>
              
              {/* Info */}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">
                    {member.user?.full_name || member.user?.email?.split('@')[0] || 'Unknown'}
                  </span>
                  {isCurrentUser && (
                    <span className="text-xs text-gray-500">(you)</span>
                  )}
                </div>
                <div className="text-sm text-gray-500">{member.user?.email}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Role Badge / Dropdown */}
              <div className="relative">
                {canModify && canModifyRole ? (
                  <button
                    onClick={() => setRoleMenuId(roleMenuId === member.id ? null : member.id)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(member.role)}`}
                    disabled={loadingId === member.id}
                  >
                    {getRoleLabel(member.role)}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                ) : (
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(member.role)}`}>
                    {getRoleLabel(member.role)}
                  </span>
                )}

                {/* Role Dropdown */}
                {roleMenuId === member.id && (
                  <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                    {(['admin', 'manager', 'member'] as MemberRole[]).map((role) => (
                      <button
                        key={role}
                        onClick={() => handleRoleChange(member.id, role)}
                        disabled={role === member.role}
                        className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 ${
                          role === member.role ? 'text-gray-400' : 'text-gray-700'
                        }`}
                      >
                        {getRoleLabel(role)}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions Menu */}
              {canModify && (
                <div className="relative">
                  <button
                    onClick={() => setMenuOpenId(menuOpenId === member.id ? null : member.id)}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    disabled={loadingId === member.id}
                  >
                    <MoreHorizontal className="w-5 h-5 text-gray-400" />
                  </button>

                  {menuOpenId === member.id && (
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                      <button
                        onClick={() => handleRemove(member.id)}
                        className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <UserMinus className="w-4 h-4" />
                        Remove from team
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
