import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import {
  Mail,
  Phone,
  CheckCircle,
  MessageSquare,
  Filter,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { getContactMessages, updateContactMessage } from '@/api/admin'
import type { AdminContactMessage, ContactMessageStatus } from '@/types/admin'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { cn } from '@/lib/utils'

const STATUS_OPTIONS: { value: ContactMessageStatus | ''; label: string }[] = [
  { value: '', label: 'All Status' },
  { value: 'new', label: 'New' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
]

export default function AdminMessagesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedMessage, setSelectedMessage] = useState<AdminContactMessage | null>(null)
  const [staffNotes, setStaffNotes] = useState('')
  const queryClient = useQueryClient()

  const status = (searchParams.get('status') as ContactMessageStatus) || ''

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'messages', { status }],
    queryFn: () => getContactMessages({ status: status || undefined }),
  })

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      status,
      staffNotes,
    }: {
      id: number
      status?: ContactMessageStatus
      staffNotes?: string
    }) => updateContactMessage(id, { status, staffNotes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'messages'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
      toast.success('Message updated')
      setSelectedMessage(null)
      setStaffNotes('')
    },
    onError: () => {
      toast.error('Failed to update message')
    },
  })

  const handleStatusFilter = (newStatus: string) => {
    setSearchParams((prev) => {
      if (newStatus) {
        prev.set('status', newStatus)
      } else {
        prev.delete('status')
      }
      return prev
    })
  }

  const getStatusBadge = (status: ContactMessageStatus) => {
    switch (status) {
      case 'new':
        return 'bg-amber-100 text-amber-700'
      case 'in_progress':
        return 'bg-blue-100 text-blue-700'
      case 'resolved':
        return 'bg-emerald-100 text-emerald-700'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const handleOpenMessage = (message: AdminContactMessage) => {
    setSelectedMessage(message)
    setStaffNotes(message.staffNotes || '')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-semibold text-gray-900">Contact Messages</h1>
        <p className="text-gray-500 mt-1">Manage inquiries from the contact form</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={status}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400 bg-white"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-4">
          {data?.results.map((message) => (
            <div
              key={message.id}
              onClick={() => handleOpenMessage(message)}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{message.name}</h3>
                    <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {message.email}
                      </span>
                      {message.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {message.phone}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-gray-700 line-clamp-2">{message.message}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span
                    className={cn(
                      'px-3 py-1 text-sm font-medium rounded-full capitalize',
                      getStatusBadge(message.status)
                    )}
                  >
                    {message.status.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(message.createdAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {data?.results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl border border-gray-200">
              <MessageSquare className="h-12 w-12 text-gray-300 mb-4" />
              <p className="text-gray-500">No messages found</p>
            </div>
          )}
        </div>
      )}

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSelectedMessage(null)}
          />
          <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{selectedMessage.name}</h2>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {selectedMessage.email}
                    </span>
                    {selectedMessage.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {selectedMessage.phone}
                      </span>
                    )}
                  </div>
                </div>
                <span
                  className={cn(
                    'px-3 py-1 text-sm font-medium rounded-full capitalize',
                    getStatusBadge(selectedMessage.status)
                  )}
                >
                  {selectedMessage.status.replace('_', ' ')}
                </span>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Staff Notes
                </label>
                <textarea
                  value={staffNotes}
                  onChange={(e) => setStaffNotes(e.target.value)}
                  rows={3}
                  placeholder="Add notes about this inquiry..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400"
                />
              </div>

              <div className="flex flex-wrap justify-between gap-3">
                <div className="flex gap-2">
                  {selectedMessage.status === 'new' && (
                    <button
                      onClick={() =>
                        updateMutation.mutate({
                          id: selectedMessage.id,
                          status: 'in_progress',
                          staffNotes,
                        })
                      }
                      disabled={updateMutation.isPending}
                      className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      Mark In Progress
                    </button>
                  )}
                  {selectedMessage.status !== 'resolved' && (
                    <button
                      onClick={() =>
                        updateMutation.mutate({
                          id: selectedMessage.id,
                          status: 'resolved',
                          staffNotes,
                        })
                      }
                      disabled={updateMutation.isPending}
                      className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Mark Resolved
                    </button>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Close
                  </button>
                  {staffNotes !== (selectedMessage.staffNotes || '') && (
                    <button
                      onClick={() =>
                        updateMutation.mutate({
                          id: selectedMessage.id,
                          staffNotes,
                        })
                      }
                      disabled={updateMutation.isPending}
                      className="px-4 py-2 text-sm font-medium text-white bg-blush-600 hover:bg-blush-700 rounded-lg disabled:opacity-50"
                    >
                      {updateMutation.isPending ? 'Saving...' : 'Save Notes'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
