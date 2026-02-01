'use client'

import { useState } from 'react'
import { Mail, Clock, X, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { TeamInvite, MemberRole } from '@/types'
import { getRoleLabel } from '@/lib/permissions'

interface PendingInvitesProps {
  invites: TeamInvite[]
  canManage: boolean
  onCancel: (token: string) => Promise<void>
  onResend: (email: string, role: Exclude<MemberRole, 'owner'>) => Promise<void>
}

export function PendingInvites({ invites, canManage, onCancel, onResend }: PendingInvitesProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null)

  if (invites.length === 0) return null

  const handleCancel = async (invite: TeamInvite) => {
    if (!confirm('Cancel this invite?')) return
    
    setLoadingId(invite.id)
    try {
      await onCancel(invite.token)
    } finally {
      setLoadingId(null)
    }
  }

  const handleResend = async (invite: TeamInvite) => {
    setLoadingId(invite.id)
    try {
      await onCancel(invite.token) // Cancel old invite
      await onResend(invite.email, invite.role) // Send new one
    } finally {
      setLoadingId(null)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'today'
    if (diffDays === 1) return 'yesterday'
    return `${diffDays} days ago`
  }

  const formatExpiresIn = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays <= 0) return 'expired'
    if (diffDays === 1) return 'expires tomorrow'
    return `expires in ${diffDays} days`
  }

  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium text-gray-700 mb-3">
        Pending Invites ({invites.length})
      </h3>
      <div className="space-y-2">
        {invites.map((invite) => {
          const isLoading = loadingId === invite.id
          
          return (
            <div
              key={invite.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{invite.email}</div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="px-2 py-0.5 bg-gray-200 rounded text-xs">
                      {getRoleLabel(invite.role)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Sent {formatTimeAgo(invite.created_at)} • {formatExpiresIn(invite.expires_at)}
                    </span>
                  </div>
                </div>
              </div>

              {canManage && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleResend(invite)}
                    disabled={isLoading}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    <span className="ml-1">Resend</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCancel(invite)}
                    disabled={isLoading}
                    className="text-gray-600 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                    <span className="ml-1">Cancel</span>
                  </Button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
