import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import {
  getClassTypes,
  createClassType,
  updateClassType,
} from '@/api/admin'
import type { AdminClassType } from '@/types/admin'
import {
  Plus,
  Pencil,
  Clock,
  Users,
  GripVertical,
  X,
  Check,
  AlertCircle,
} from 'lucide-react'

const LEVEL_OPTIONS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'all_levels', label: 'All Levels' },
]

const COLOR_OPTIONS = [
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#06B6D4', // Cyan
  '#84CC16', // Lime
]

interface ClassTypeFormData {
  name: string
  description: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'all_levels'
  durationMinutes: number
  maxCapacity: number
  color: string
  imageUrl: string | null
  isActive: boolean
  displayOrder: number
}

const initialFormData: ClassTypeFormData = {
  name: '',
  description: '',
  level: 'all_levels',
  durationMinutes: 50,
  maxCapacity: 8,
  color: '#10B981',
  imageUrl: null,
  isActive: true,
  displayOrder: 0,
}

export default function AdminClassTypesPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingClassType, setEditingClassType] = useState<AdminClassType | null>(null)
  const [formData, setFormData] = useState<ClassTypeFormData>(initialFormData)

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'class-types'],
    queryFn: getClassTypes,
  })

  const createMutation = useMutation({
    mutationFn: createClassType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'class-types'] })
      toast.success('Class type created successfully')
      closeModal()
    },
    onError: () => {
      toast.error('Failed to create class type')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ClassTypeFormData> }) =>
      updateClassType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'class-types'] })
      toast.success('Class type updated successfully')
      closeModal()
    },
    onError: () => {
      toast.error('Failed to update class type')
    },
  })

  const openCreateModal = () => {
    setEditingClassType(null)
    setFormData({
      ...initialFormData,
      displayOrder: (data?.results?.length || 0) + 1,
    })
    setIsModalOpen(true)
  }

  const openEditModal = (classType: AdminClassType) => {
    setEditingClassType(classType)
    setFormData({
      name: classType.name,
      description: classType.description,
      level: classType.level,
      durationMinutes: classType.durationMinutes,
      maxCapacity: classType.maxCapacity,
      color: classType.color,
      imageUrl: classType.imageUrl,
      isActive: classType.isActive,
      displayOrder: classType.displayOrder,
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingClassType(null)
    setFormData(initialFormData)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast.error('Class name is required')
      return
    }

    if (editingClassType) {
      updateMutation.mutate({ id: editingClassType.id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const toggleActive = (classType: AdminClassType) => {
    updateMutation.mutate({
      id: classType.id,
      data: { isActive: !classType.isActive },
    })
  }

  const getLevelLabel = (level: string) => {
    return LEVEL_OPTIONS.find((l) => l.value === level)?.label || level
  }

  const classTypes = data?.results || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-gray-900">Class Types</h1>
          <p className="text-gray-500 mt-1">Manage your studio's class offerings</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-blush-600 text-white font-medium rounded-lg hover:bg-blush-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Class Type
        </button>
      </div>

      {/* Class Types List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner />
          </div>
        ) : classTypes.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {classTypes
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map((classType) => (
                <div
                  key={classType.id}
                  className={cn(
                    'p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors',
                    !classType.isActive && 'opacity-60'
                  )}
                >
                  {/* Drag Handle */}
                  <GripVertical className="h-5 w-5 text-gray-300 cursor-grab" />

                  {/* Color Indicator */}
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: classType.color }}
                  />

                  {/* Class Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">{classType.name}</h3>
                      {!classType.isActive && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">{classType.description}</p>
                  </div>

                  {/* Level Badge */}
                  <span
                    className={cn(
                      'px-2 py-1 text-xs font-medium rounded-full',
                      classType.level === 'beginner' && 'bg-green-100 text-green-700',
                      classType.level === 'intermediate' && 'bg-blue-100 text-blue-700',
                      classType.level === 'advanced' && 'bg-purple-100 text-purple-700',
                      classType.level === 'all_levels' && 'bg-gray-100 text-gray-700'
                    )}
                  >
                    {getLevelLabel(classType.level)}
                  </span>

                  {/* Duration */}
                  <div className="flex items-center gap-1 text-sm text-gray-500 w-20">
                    <Clock className="h-4 w-4" />
                    {classType.durationMinutes} min
                  </div>

                  {/* Capacity */}
                  <div className="flex items-center gap-1 text-sm text-gray-500 w-16">
                    <Users className="h-4 w-4" />
                    {classType.maxCapacity}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleActive(classType)}
                      className={cn(
                        'p-2 rounded-lg transition-colors',
                        classType.isActive
                          ? 'text-emerald-600 hover:bg-emerald-50'
                          : 'text-gray-400 hover:bg-gray-100'
                      )}
                      title={classType.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {classType.isActive ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => openEditModal(classType)}
                      className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No class types yet</h3>
            <p className="text-gray-500 mb-4">Create your first class type to get started</p>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blush-600 text-white font-medium rounded-lg hover:bg-blush-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Class Type
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50" onClick={closeModal} />
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingClassType ? 'Edit Class Type' : 'Add Class Type'}
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
                    Class Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Intro Reformer"
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
                    placeholder="Brief description of the class..."
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400 resize-none"
                  />
                </div>

                {/* Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                  <select
                    value={formData.level}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        level: e.target.value as ClassTypeFormData['level'],
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400"
                  >
                    {LEVEL_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Duration & Capacity */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={formData.durationMinutes}
                      onChange={(e) =>
                        setFormData({ ...formData, durationMinutes: parseInt(e.target.value) || 50 })
                      }
                      min={15}
                      max={180}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Capacity
                    </label>
                    <input
                      type="number"
                      value={formData.maxCapacity}
                      onChange={(e) =>
                        setFormData({ ...formData, maxCapacity: parseInt(e.target.value) || 8 })
                      }
                      min={1}
                      max={50}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400"
                    />
                  </div>
                </div>

                {/* Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                  <div className="flex gap-2">
                    {COLOR_OPTIONS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({ ...formData, color })}
                        className={cn(
                          'w-8 h-8 rounded-full transition-all',
                          formData.color === color && 'ring-2 ring-offset-2 ring-gray-400'
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
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

                {/* Active */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-blush-600 focus:ring-blush-500"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-700">
                    Active (visible to customers)
                  </label>
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
                      : editingClassType
                        ? 'Update Class Type'
                        : 'Create Class Type'}
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
