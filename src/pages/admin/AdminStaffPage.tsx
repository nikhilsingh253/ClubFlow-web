import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import {
  getStaffMembers,
  inviteStaff,
  updateStaffMember,
  deactivateStaff,
} from '@/api/admin'
import type { AdminStaffMember, AdminRole } from '@/types/admin'
import {
  Plus,
  Mail,
  Shield,
  ShieldCheck,
  X,
  UserCog,
  Clock,
  MoreVertical,
  UserX,
  Key,
} from 'lucide-react'

export default function AdminStaffPage() {
  const queryClient = useQueryClient()
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [inviteData, setInviteData] = useState({ email: '', name: '', role: 'staff' as AdminRole })
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'staff'],
    queryFn: getStaffMembers,
  })

  const inviteMutation = useMutation({
    mutationFn: inviteStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'staff'] })
      toast.success('Invitation sent successfully')
      closeInviteModal()
    },
    onError: () => {
      toast.error('Failed to send invitation')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { role?: AdminRole; isActive?: boolean } }) =>
      updateStaffMember(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'staff'] })
      toast.success('Staff member updated')
    },
    onError: () => {
      toast.error('Failed to update staff member')
    },
  })

  const deactivateMutation = useMutation({
    mutationFn: deactivateStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'staff'] })
      toast.success('Staff member deactivated')
    },
    onError: () => {
      toast.error('Failed to deactivate staff member')
    },
  })

  const closeInviteModal = () => {
    setIsInviteModalOpen(false)
    setInviteData({ email: '', name: '', role: 'staff' })
  }

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteData.email.trim() || !inviteData.name.trim()) {
      toast.error('Please fill in all required fields')
      return
    }
    inviteMutation.mutate(inviteData)
  }

  const handleChangeRole = (staff: AdminStaffMember, newRole: AdminRole) => {
    updateMutation.mutate({ id: staff.id, data: { role: newRole } })
    setOpenMenuId(null)
  }

  const handleDeactivate = (staff: AdminStaffMember) => {
    if (confirm(`Are you sure you want to deactivate ${staff.name}? They will lose access to the admin dashboard.`)) {
      deactivateMutation.mutate(staff.id)
    }
    setOpenMenuId(null)
  }

  const handleReactivate = (staff: AdminStaffMember) => {
    updateMutation.mutate({ id: staff.id, data: { isActive: true } })
    setOpenMenuId(null)
  }

  const formatLastLogin = (dateString: string | null) => {
    if (!dateString) return 'Never'
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const staff = data?.results || []
  const activeStaff = staff.filter((s) => s.isActive)
  const inactiveStaff = staff.filter((s) => !s.isActive)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-gray-900">Staff Management</h1>
          <p className="text-gray-500 mt-1">Manage team members and their access</p>
        </div>
        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blush-600 text-white font-medium rounded-lg hover:bg-blush-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Invite Staff
        </button>
      </div>

      {/* Roles Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Owner</h3>
              <p className="text-sm text-gray-500">Full access to all features including settings</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Staff</h3>
              <p className="text-sm text-gray-500">Operations access (no settings or reports)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Staff List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner />
          </div>
        ) : staff.length > 0 ? (
          <>
            {/* Active Staff */}
            <div className="divide-y divide-gray-100">
              {activeStaff.map((member) => (
                <div
                  key={member.id}
                  className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-blush-100 flex items-center justify-center">
                    <span className="text-blush-600 font-medium">
                      {member.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">{member.name}</h3>
                      <span
                        className={cn(
                          'px-2 py-0.5 text-xs font-medium rounded-full capitalize',
                          member.role === 'owner'
                            ? 'bg-violet-100 text-violet-700'
                            : 'bg-blue-100 text-blue-700'
                        )}
                      >
                        {member.role}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </div>

                  {/* Last Login */}
                  <div className="text-right hidden sm:block">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      Last login: {formatLastLogin(member.lastLogin)}
                    </div>
                  </div>

                  {/* Actions Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === member.id ? null : member.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>

                    {openMenuId === member.id && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setOpenMenuId(null)}
                        />
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                          {member.role === 'staff' ? (
                            <button
                              onClick={() => handleChangeRole(member, 'owner')}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <ShieldCheck className="h-4 w-4" />
                              Promote to Owner
                            </button>
                          ) : (
                            <button
                              onClick={() => handleChangeRole(member, 'staff')}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Shield className="h-4 w-4" />
                              Demote to Staff
                            </button>
                          )}
                          <button
                            onClick={() => toast.success('Password reset email sent')}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Key className="h-4 w-4" />
                            Reset Password
                          </button>
                          <hr className="my-1" />
                          <button
                            onClick={() => handleDeactivate(member)}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <UserX className="h-4 w-4" />
                            Deactivate
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Inactive Staff */}
            {inactiveStaff.length > 0 && (
              <>
                <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-500">
                    Inactive ({inactiveStaff.length})
                  </h3>
                </div>
                <div className="divide-y divide-gray-100 opacity-60">
                  {inactiveStaff.map((member) => (
                    <div
                      key={member.id}
                      className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
                    >
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 font-medium">
                          {member.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()
                            .slice(0, 2)}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-600">{member.name}</h3>
                          <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                            Inactive
                          </span>
                        </div>
                        <p className="text-sm text-gray-400">{member.email}</p>
                      </div>

                      {/* Reactivate Button */}
                      <button
                        onClick={() => handleReactivate(member)}
                        className="px-3 py-1.5 text-sm font-medium text-blush-600 hover:bg-blush-50 rounded-lg transition-colors"
                      >
                        Reactivate
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <UserCog className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No staff members yet</h3>
            <p className="text-gray-500 mb-4">Invite your first team member to get started</p>
            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blush-600 text-white font-medium rounded-lg hover:bg-blush-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Invite Staff
            </button>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50" onClick={closeInviteModal} />
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Invite Staff Member</h2>
                <button
                  onClick={closeInviteModal}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleInvite} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={inviteData.name}
                    onChange={(e) => setInviteData({ ...inviteData, name: e.target.value })}
                    placeholder="Full name"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={inviteData.email}
                    onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                    placeholder="email@example.com"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400"
                    required
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setInviteData({ ...inviteData, role: 'staff' })}
                      className={cn(
                        'p-4 rounded-lg border-2 text-left transition-colors',
                        inviteData.role === 'staff'
                          ? 'border-blush-400 bg-blush-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Shield className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-gray-900">Staff</span>
                      </div>
                      <p className="text-xs text-gray-500">Operations access only</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setInviteData({ ...inviteData, role: 'owner' })}
                      className={cn(
                        'p-4 rounded-lg border-2 text-left transition-colors',
                        inviteData.role === 'owner'
                          ? 'border-blush-400 bg-blush-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <ShieldCheck className="h-5 w-5 text-violet-600" />
                        <span className="font-medium text-gray-900">Owner</span>
                      </div>
                      <p className="text-xs text-gray-500">Full admin access</p>
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="bg-blue-50 rounded-lg p-3 flex items-start gap-2">
                  <Mail className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-700">
                    An invitation email will be sent with instructions to set up their account.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={closeInviteModal}
                    className="px-4 py-2 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={inviteMutation.isPending}
                    className="px-4 py-2 bg-blush-600 text-white font-medium rounded-lg hover:bg-blush-700 transition-colors disabled:opacity-50"
                  >
                    {inviteMutation.isPending ? 'Sending...' : 'Send Invitation'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
