'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function DeleteAccountPage() {
  const [confirmText, setConfirmText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') return
    
    setIsDeleting(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setError('Not authenticated')
        return
      }

      // Delete user data (cascade should handle related records)
      // Delete organization
      await supabase.from('organizations').delete().eq('id', user.id)
      
      // Delete documents
      await supabase.from('documents').delete().eq('org_id', user.id)
      
      // Delete consents
      await supabase.from('consents').delete().eq('org_id', user.id)
      
      // Delete training assignments
      await supabase.from('training_assignments').delete().eq('org_id', user.id)
      
      // Delete audits
      await supabase.from('audits').delete().eq('org_id', user.id)
      
      // Delete hiring states and tools
      await supabase.from('hiring_states').delete().eq('org_id', user.id)
      await supabase.from('hiring_tools').delete().eq('org_id', user.id)
      
      // Delete disclosure pages
      await supabase.from('disclosure_pages').delete().eq('organization_id', user.id)

      // Sign out
      await supabase.auth.signOut()
      
      // Redirect to homepage
      router.push('/')
    } catch (err) {
      console.error('Error deleting account:', err)
      setError('Failed to delete account. Please try again or contact support.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-8">
      <div className="bg-white rounded-xl border border-red-200 overflow-hidden">
        <div className="bg-red-50 px-6 py-4 border-b border-red-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-red-900">Delete Account</h1>
              <p className="text-sm text-red-700">This action cannot be undone</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h2 className="font-semibold text-red-900 mb-2">Warning: All data will be permanently deleted</h2>
            <ul className="text-sm text-red-800 space-y-1 list-disc list-inside">
              <li>All compliance documents and templates</li>
              <li>Training records and certificates</li>
              <li>Consent tracking records</li>
              <li>Audit history and findings</li>
              <li>Organization settings and integrations</li>
            </ul>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type <span className="font-mono bg-gray-100 px-1 rounded">DELETE</span> to confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => router.back()}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={confirmText !== 'DELETE' || isDeleting}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Delete My Account
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
