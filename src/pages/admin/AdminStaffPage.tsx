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
  getTrainers,
  linkTrainerToUser,
  unlinkTrainerFromUser,
  resetStaffPassword,
  resendStaffInvitation,
} from '@/api/admin'
import type { AdminStaffMember, AdminRole, AdminTrainer } from '@/types/admin'
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
  Link2,
  Unlink,
  Dumbbell,
  RefreshCw,
} from 'lucide-react'

export default function AdminStaffPage() {
  const queryClient = useQueryClient()
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [inviteData, setInviteData] = useState({ email: '', name: '', role: 'staff' as AdminRole })
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false)
  const [selectedStaffForLinking, setSelectedStaffForLinking] = useState<AdminStaffMember | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'staff'],
    queryFn: getStaffMembers,
  })

  // Fetch trainers for linking
  const { data: trainersData } = useQuery({
    queryKey: ['admin', 'trainers'],
    queryFn: getTrainers,
  })

  const inviteMutation = useMutation({
    mutationFn: inviteStaff,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'staff'] })
      if (data.invitationSent) {
        toast.success('Staff member created and invitation email sent')
      } else {
        toast.success('Staff member created (email delivery pending)')
      }
      closeInviteModal()
    },
    onError: (error: unknown) => {
      // Check for duplicate email error
      const axiosError = error as { response?: { data?: { error?: { fields?: { email?: string[] } } } } }
      const emailErrors = axiosError.response?.data?.error?.fields?.email
      if (emailErrors && emailErrors.some(e => e.toLowerCase().includes('already exists'))) {
        toast.error('A user with this email already exists. Use "Resend Invitation" from the staff list.')
      } else {
        toast.error('Failed to send invitation')
      }
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

  const resetPasswordMutation = useMutation({
    mutationFn: resetStaffPassword,
    onSuccess: (data) => {
      if (data.sent) {
        toast.success('Password reset email sent successfully')
      } else {
        toast.success('Password reset initiated (email delivery pending)')
      }
    },
    onError: () => {
      toast.error('Failed to send password reset email')
    },
  })

  const resendInvitationMutation = useMutation({
    mutationFn: resendStaffInvitation,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'staff'] })
      if (data.invitationSent) {
        toast.success('Invitation email resent successfully')
      } else {
        toast.success('Invitation resent (email delivery pending)')
      }
    },
    onError: () => {
      toast.error('Failed to resend invitation')
    },
  })

  const linkTrainerMutation = useMutation({
    mutationFn: ({ trainerId, userId }: { trainerId: number; userId: string }) =>
      linkTrainerToUser(trainerId, userId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'staff'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'trainers'] })
      if (data.notificationSent) {
        toast.success('Trainer profile linked and notification email sent')
      } else {
        toast.success('Trainer profile linked (notification pending)')
      }
      closeLinkModal()
    },
    onError: () => {
      toast.error('Failed to link trainer profile')
    },
  })

  const unlinkTrainerMutation = useMutation({
    mutationFn: unlinkTrainerFromUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'staff'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'trainers'] })
      toast.success('Trainer profile unlinked')
    },
    onError: () => {
      toast.error('Failed to unlink trainer profile')
    },
  })

  const closeInviteModal = () => {
    setIsInviteModalOpen(false)
    setInviteData({ email: '', name: '', role: 'staff' })
  }

  const closeLinkModal = () => {
    setIsLinkModalOpen(false)
    setSelectedStaffForLinking(null)
  }

  const openLinkModal = (staff: AdminStaffMember) => {
    setSelectedStaffForLinking(staff)
    setIsLinkModalOpen(true)
    setOpenMenuId(null)
  }

  const handleLinkTrainer = (trainer: AdminTrainer) => {
    if (!selectedStaffForLinking) return
    linkTrainerMutation.mutate({
      trainerId: trainer.id,
      userId: String(selectedStaffForLinking.id),
    })
  }

  const handleUnlinkTrainer = (trainer: AdminTrainer) => {
    if (confirm(`Unlink ${trainer.name} from their user account? They will lose trainer portal access.`)) {
      unlinkTrainerMutation.mutate(trainer.id)
    }
    setOpenMenuId(null)
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

  const trainers = trainersData?.results || []

  // Helper to find if a staff member is linked to a trainer profile
  const getLinkedTrainer = (staffId: number): AdminTrainer | undefined => {
    return trainers.find((t) => t.userId === String(staffId))
  }

  // Get trainers that are not yet linked to any user (available for linking)
  const unlinkedTrainers = trainers.filter((t) => !t.userId)

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
                    <div className="flex items-center gap-2 flex-wrap">
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
                      {/* Trainer badge if linked */}
                      {getLinkedTrainer(member.id) && (
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-1">
                          <Dumbbell className="h-3 w-3" />
                          Trainer
                        </span>
                      )}
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
                            onClick={() => {
                              resetPasswordMutation.mutate(member.id)
                              setOpenMenuId(null)
                            }}
                            disabled={resetPasswordMutation.isPending}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
                          >
                            <Key className="h-4 w-4" />
                            {resetPasswordMutation.isPending ? 'Sending...' : 'Reset Password'}
                          </button>
                          {!member.lastLogin && (
                            <button
                              onClick={() => {
                                resendInvitationMutation.mutate(member.id)
                                setOpenMenuId(null)
                              }}
                              disabled={resendInvitationMutation.isPending}
                              className="w-full px-4 py-2 text-left text-sm text-blue-600 hover:bg-blue-50 flex items-center gap-2 disabled:opacity-50"
                            >
                              <RefreshCw className="h-4 w-4" />
                              {resendInvitationMutation.isPending ? 'Sending...' : 'Resend Invitation'}
                            </button>
                          )}
                          <hr className="my-1" />
                          {/* Trainer linking options */}
                          {getLinkedTrainer(member.id) ? (
                            <button
                              onClick={() => {
                                const trainer = getLinkedTrainer(member.id)
                                if (trainer) handleUnlinkTrainer(trainer)
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-amber-600 hover:bg-amber-50 flex items-center gap-2"
                            >
                              <Unlink className="h-4 w-4" />
                              Unlink Trainer Profile
                            </button>
                          ) : (
                            <button
                              onClick={() => openLinkModal(member)}
                              className="w-full px-4 py-2 text-left text-sm text-emerald-600 hover:bg-emerald-50 flex items-center gap-2"
                            >
                              <Link2 className="h-4 w-4" />
                              Link Trainer Profile
                            </button>
                          )}
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

      {/* Link Trainer Modal */}
      {isLinkModalOpen && selectedStaffForLinking && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50" onClick={closeLinkModal} />
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Link Trainer Profile</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Link a trainer profile to {selectedStaffForLinking.name}
                  </p>
                </div>
                <button
                  onClick={closeLinkModal}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {unlinkedTrainers.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {unlinkedTrainers.map((trainer) => (
                    <button
                      key={trainer.id}
                      onClick={() => handleLinkTrainer(trainer)}
                      disabled={linkTrainerMutation.isPending}
                      className="w-full p-3 text-left rounded-lg border border-gray-200 hover:border-blush-300 hover:bg-blush-50 transition-colors disabled:opacity-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                          {trainer.photoUrl ? (
                            <img
                              src={trainer.photoUrl}
                              alt={trainer.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <Dumbbell className="h-5 w-5 text-emerald-600" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{trainer.name}</h4>
                          <p className="text-sm text-gray-500">{trainer.email}</p>
                          {trainer.specializations.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {trainer.specializations.slice(0, 2).map((spec) => (
                                <span
                                  key={spec}
                                  className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                                >
                                  {spec}
                                </span>
                              ))}
                              {trainer.specializations.length > 2 && (
                                <span className="text-xs text-gray-400">
                                  +{trainer.specializations.length - 2} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Dumbbell className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <h3 className="font-medium text-gray-900 mb-1">No unlinked trainers</h3>
                  <p className="text-sm text-gray-500">
                    All trainer profiles are already linked to staff accounts.
                  </p>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 flex items-start gap-2">
                  <Link2 className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  Linking a trainer profile will give this staff member access to the Trainer Portal, where they can view their assigned classes and check-in attendees.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
