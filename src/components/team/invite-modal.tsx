'use client'

import { useState } from 'react'
import { X, Send, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { MemberRole } from '@/types'

interface InviteModalProps {
  isOpen: boolean
  onClose: () => void
  onInvite: (email: string, role: Exclude<MemberRole, 'owner'>) => Promise<void>
  seatsAvailable: number
}

export function InviteModal({ isOpen, onClose, onInvite, seatsAvailable }: InviteModalProps) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<Exclude<MemberRole, 'owner'>>('member')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await onInvite(email, role)
      setEmail('')
      setRole('member')
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send invite')
    } finally {
      setLoading(false)
    }
  }

  const roles: { value: Exclude<MemberRole, 'owner'>; label: string; description: string }[] = [
    { value: 'admin', label: 'Admin', description: 'Full access except billing' },
    { value: 'manager', label: 'Manager', description: 'Run audits, generate docs, view team progress' },
    { value: 'member', label: 'Team Member', description: 'Complete training, view own certificates' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Invite Team Member</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@company.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            />
          </div>

          {/* Role Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <div className="space-y-2">
              {roles.map((r) => (
                <label
                  key={r.value}
                  className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${
                    role === r.value 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={r.value}
                    checked={role === r.value}
                    onChange={(e) => setRole(e.target.value as Exclude<MemberRole, 'owner'>)}
                    className="mt-0.5"
                  />
                  <div className="ml-3">
                    <div className="font-medium text-gray-900">{r.label}</div>
                    <div className="text-sm text-gray-500">{r.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Seat Info */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
            <p className="text-sm text-gray-600">
              {seatsAvailable > 0 ? (
                <>Adding this member will use 1 of your remaining <strong>{seatsAvailable}</strong> seat{seatsAvailable !== 1 ? 's' : ''}.</>
              ) : (
                <span className="text-amber-600">You&apos;ve reached your seat limit. You can still send invites, but new members won&apos;t be able to join until you upgrade.</span>
              )}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="gap-2"
            >
              <Send className="w-4 h-4" />
              {loading ? 'Sending...' : 'Send Invite'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
