import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import {
  getMembershipPlans,
  createMembershipPlan,
  updateMembershipPlan,
} from '@/api/admin'
import type { AdminMembershipPlan } from '@/types/admin'
import {
  Plus,
  Pencil,
  Star,
  X,
  Check,
  CreditCard,
  Trash2,
} from 'lucide-react'

interface PlanFormData {
  name: string
  description: string
  price: number
  classesPerMonth: number | null
  durationDays: number
  features: string[]
  isPopular: boolean
  isActive: boolean
  displayOrder: number
}

const initialFormData: PlanFormData = {
  name: '',
  description: '',
  price: 0,
  classesPerMonth: 8,
  durationDays: 30,
  features: [],
  isPopular: false,
  isActive: true,
  displayOrder: 0,
}

export default function AdminMembershipPlansPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<AdminMembershipPlan | null>(null)
  const [formData, setFormData] = useState<PlanFormData>(initialFormData)
  const [newFeature, setNewFeature] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'membership-plans'],
    queryFn: getMembershipPlans,
  })

  const createMutation = useMutation({
    mutationFn: createMembershipPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'membership-plans'] })
      toast.success('Membership plan created successfully')
      closeModal()
    },
    onError: () => {
      toast.error('Failed to create membership plan')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<PlanFormData> }) =>
      updateMembershipPlan(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'membership-plans'] })
      toast.success('Membership plan updated successfully')
      closeModal()
    },
    onError: () => {
      toast.error('Failed to update membership plan')
    },
  })

  const openCreateModal = () => {
    setEditingPlan(null)
    setFormData({
      ...initialFormData,
      displayOrder: (data?.results?.length || 0) + 1,
    })
    setIsModalOpen(true)
  }

  const openEditModal = (plan: AdminMembershipPlan) => {
    setEditingPlan(plan)
    setFormData({
      name: plan.name,
      description: plan.description,
      price: plan.price,
      classesPerMonth: plan.classesPerMonth,
      durationDays: plan.durationDays,
      features: plan.features || [],
      isPopular: plan.isPopular,
      isActive: plan.isActive,
      displayOrder: plan.displayOrder,
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingPlan(null)
    setFormData(initialFormData)
    setNewFeature('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast.error('Plan name is required')
      return
    }
    if (formData.price <= 0) {
      toast.error('Price must be greater than 0')
      return
    }

    if (editingPlan) {
      updateMutation.mutate({ id: editingPlan.id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()],
      })
      setNewFeature('')
    }
  }

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    })
  }

  const toggleActive = (plan: AdminMembershipPlan) => {
    updateMutation.mutate({
      id: plan.id,
      data: { isActive: !plan.isActive },
    })
  }

  const togglePopular = (plan: AdminMembershipPlan) => {
    updateMutation.mutate({
      id: plan.id,
      data: { isPopular: !plan.isPopular },
    })
  }

  const plans = data?.results || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-gray-900">Membership Plans</h1>
          <p className="text-gray-500 mt-1">Configure pricing and membership options</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-blush-600 text-white font-medium rounded-lg hover:bg-blush-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Plan
        </button>
      </div>

      {/* Plans Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      ) : plans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((plan) => (
              <div
                key={plan.id}
                className={cn(
                  'bg-white rounded-xl border-2 p-6 relative',
                  plan.isPopular ? 'border-blush-400' : 'border-gray-200',
                  !plan.isActive && 'opacity-60'
                )}
              >
                {/* Popular Badge */}
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blush-500 text-white text-xs font-medium rounded-full">
                      <Star className="h-3 w-3 fill-current" />
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Status Badge */}
                {!plan.isActive && (
                  <div className="absolute top-4 right-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                      Inactive
                    </span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-gray-900">₹{plan.price.toLocaleString()}</span>
                    <span className="text-gray-500">/{plan.durationDays} days</span>
                  </div>
                </div>

                {/* Classes */}
                <div className="text-center mb-4">
                  <span className="text-sm text-gray-600">
                    {plan.classesPerMonth === null
                      ? 'Unlimited classes'
                      : `${plan.classesPerMonth} classes per month`}
                  </span>
                </div>

                {/* Features */}
                {plan.features && plan.features.length > 0 && (
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <Check className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => openEditModal(plan)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => togglePopular(plan)}
                    className={cn(
                      'px-3 py-2 rounded-lg transition-colors',
                      plan.isPopular
                        ? 'text-amber-600 bg-amber-50'
                        : 'text-gray-400 hover:bg-gray-50'
                    )}
                    title={plan.isPopular ? 'Remove popular badge' : 'Mark as popular'}
                  >
                    <Star className={cn('h-4 w-4', plan.isPopular && 'fill-current')} />
                  </button>
                  <button
                    onClick={() => toggleActive(plan)}
                    className={cn(
                      'px-3 py-2 rounded-lg transition-colors',
                      plan.isActive
                        ? 'text-emerald-600 hover:bg-emerald-50'
                        : 'text-gray-400 hover:bg-gray-100'
                    )}
                    title={plan.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {plan.isActive ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <CreditCard className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No membership plans yet</h3>
          <p className="text-gray-500 mb-4">Create your first plan to start accepting memberships</p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blush-600 text-white font-medium rounded-lg hover:bg-blush-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Plan
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50" onClick={closeModal} />
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingPlan ? 'Edit Membership Plan' : 'Add Membership Plan'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Plan Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., 8 Classes/Month"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the plan..."
                    rows={2}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400 resize-none"
                  />
                </div>

                {/* Price & Duration */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                      }
                      min={0}
                      step={100}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (days)
                    </label>
                    <input
                      type="number"
                      value={formData.durationDays}
                      onChange={(e) =>
                        setFormData({ ...formData, durationDays: parseInt(e.target.value) || 30 })
                      }
                      min={1}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400"
                    />
                  </div>
                </div>

                {/* Classes Per Month */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Classes Per Month
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      value={formData.classesPerMonth ?? ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          classesPerMonth: e.target.value ? parseInt(e.target.value) : null,
                        })
                      }
                      min={1}
                      placeholder="Leave empty for unlimited"
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400"
                      disabled={formData.classesPerMonth === null}
                    />
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={formData.classesPerMonth === null}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            classesPerMonth: e.target.checked ? null : 8,
                          })
                        }
                        className="h-4 w-4 rounded border-gray-300 text-blush-600"
                      />
                      Unlimited
                    </label>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
                  <div className="space-y-2">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="flex-1 px-3 py-2 bg-gray-50 rounded-lg text-sm">
                          {feature}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            addFeature()
                          }
                        }}
                        placeholder="Add a feature..."
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400"
                      />
                      <button
                        type="button"
                        onClick={addFeature}
                        className="px-4 py-2 bg-gray-100 text-gray-600 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Display Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) =>
                      setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })
                    }
                    min={0}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400"
                  />
                </div>

                {/* Checkboxes */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="isPopular"
                      checked={formData.isPopular}
                      onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                      className="h-4 w-4 rounded border-gray-300 text-blush-600 focus:ring-blush-500"
                    />
                    <label htmlFor="isPopular" className="text-sm text-gray-700">
                      Mark as "Most Popular"
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="h-4 w-4 rounded border-gray-300 text-blush-600 focus:ring-blush-500"
                    />
                    <label htmlFor="isActive" className="text-sm text-gray-700">
                      Active (available for purchase)
                    </label>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="px-4 py-2 bg-blush-600 text-white font-medium rounded-lg hover:bg-blush-700 transition-colors disabled:opacity-50"
                  >
                    {createMutation.isPending || updateMutation.isPending
                      ? 'Saving...'
                      : editingPlan
                        ? 'Update Plan'
                        : 'Create Plan'}
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
