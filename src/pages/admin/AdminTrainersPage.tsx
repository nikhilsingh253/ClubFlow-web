import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import {
  getTrainers,
  createTrainer,
  updateTrainer,
} from '@/api/admin'
import type { AdminTrainer } from '@/types/admin'
import {
  Plus,
  Pencil,
  User,
  Mail,
  Phone,
  X,
  Check,
  AlertCircle,
  Award,
  Trash2,
} from 'lucide-react'

interface TrainerFormData {
  name: string
  email: string
  phone: string
  bio: string
  yearsExperience: number
  specializations: string[]
  certifications: string[]
  isActive: boolean
  displayOrder: number
}

const initialFormData: TrainerFormData = {
  name: '',
  email: '',
  phone: '',
  bio: '',
  yearsExperience: 0,
  specializations: [],
  certifications: [],
  isActive: true,
  displayOrder: 0,
}

export default function AdminTrainersPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTrainer, setEditingTrainer] = useState<AdminTrainer | null>(null)
  const [formData, setFormData] = useState<TrainerFormData>(initialFormData)
  const [newSpecialization, setNewSpecialization] = useState('')
  const [newCertification, setNewCertification] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'trainers'],
    queryFn: getTrainers,
  })

  const createMutation = useMutation({
    mutationFn: createTrainer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'trainers'] })
      toast.success('Trainer added successfully')
      closeModal()
    },
    onError: () => {
      toast.error('Failed to add trainer')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<TrainerFormData> }) =>
      updateTrainer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'trainers'] })
      toast.success('Trainer updated successfully')
      closeModal()
    },
    onError: () => {
      toast.error('Failed to update trainer')
    },
  })

  const openCreateModal = () => {
    setEditingTrainer(null)
    setFormData({
      ...initialFormData,
      displayOrder: (data?.results?.length || 0) + 1,
    })
    setIsModalOpen(true)
  }

  const openEditModal = (trainer: AdminTrainer) => {
    setEditingTrainer(trainer)
    setFormData({
      name: trainer.name,
      email: trainer.email,
      phone: trainer.phone,
      bio: trainer.bio,
      yearsExperience: trainer.yearsExperience,
      specializations: trainer.specializations || [],
      certifications: trainer.certifications || [],
      isActive: trainer.isActive,
      displayOrder: trainer.displayOrder,
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingTrainer(null)
    setFormData(initialFormData)
    setNewSpecialization('')
    setNewCertification('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast.error('Name is required')
      return
    }
    if (!formData.email.trim()) {
      toast.error('Email is required')
      return
    }

    if (editingTrainer) {
      updateMutation.mutate({ id: editingTrainer.id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const addSpecialization = () => {
    if (newSpecialization.trim()) {
      setFormData({
        ...formData,
        specializations: [...formData.specializations, newSpecialization.trim()],
      })
      setNewSpecialization('')
    }
  }

  const removeSpecialization = (index: number) => {
    setFormData({
      ...formData,
      specializations: formData.specializations.filter((_, i) => i !== index),
    })
  }

  const addCertification = () => {
    if (newCertification.trim()) {
      setFormData({
        ...formData,
        certifications: [...formData.certifications, newCertification.trim()],
      })
      setNewCertification('')
    }
  }

  const removeCertification = (index: number) => {
    setFormData({
      ...formData,
      certifications: formData.certifications.filter((_, i) => i !== index),
    })
  }

  const toggleActive = (trainer: AdminTrainer) => {
    updateMutation.mutate({
      id: trainer.id,
      data: { isActive: !trainer.isActive },
    })
  }

  const trainers = data?.results || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-gray-900">Trainers</h1>
          <p className="text-gray-500 mt-1">Manage your studio's instructors</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-blush-600 text-white font-medium rounded-lg hover:bg-blush-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Trainer
        </button>
      </div>

      {/* Trainers Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      ) : trainers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainers
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((trainer) => (
              <div
                key={trainer.id}
                className={cn(
                  'bg-white rounded-xl border border-gray-200 overflow-hidden',
                  !trainer.isActive && 'opacity-60'
                )}
              >
                {/* Trainer Photo/Avatar */}
                <div className="h-32 bg-gradient-to-br from-blush-100 to-violet-100 flex items-center justify-center relative">
                  {trainer.photoUrl ? (
                    <img
                      src={trainer.photoUrl}
                      alt={trainer.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-16 w-16 text-blush-300" />
                  )}
                  {!trainer.isActive && (
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-1 bg-gray-800/70 text-white text-xs font-medium rounded-full">
                        Inactive
                      </span>
                    </div>
                  )}
                </div>

                {/* Trainer Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-lg">{trainer.name}</h3>
                  {trainer.yearsExperience > 0 && (
                    <p className="text-sm text-gray-500">
                      {trainer.yearsExperience} years experience
                    </p>
                  )}

                  {/* Contact */}
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="truncate">{trainer.email}</span>
                    </div>
                    {trainer.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4 text-gray-400" />
                        {trainer.phone}
                      </div>
                    )}
                  </div>

                  {/* Specializations */}
                  {trainer.specializations && trainer.specializations.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {trainer.specializations.slice(0, 3).map((spec, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 text-xs font-medium bg-violet-100 text-violet-700 rounded-full"
                        >
                          {spec}
                        </span>
                      ))}
                      {trainer.specializations.length > 3 && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                          +{trainer.specializations.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => openEditModal(trainer)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => toggleActive(trainer)}
                      className={cn(
                        'px-3 py-2 rounded-lg transition-colors',
                        trainer.isActive
                          ? 'text-emerald-600 hover:bg-emerald-50'
                          : 'text-gray-400 hover:bg-gray-100'
                      )}
                      title={trainer.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {trainer.isActive ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No trainers yet</h3>
          <p className="text-gray-500 mb-4">Add your first trainer to start scheduling classes</p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blush-600 text-white font-medium rounded-lg hover:bg-blush-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Trainer
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
                  {editingTrainer ? 'Edit Trainer' : 'Add Trainer'}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Full name"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400"
                    required
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@example.com"
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Brief biography..."
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400 resize-none"
                  />
                </div>

                {/* Experience & Order */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Years Experience
                    </label>
                    <input
                      type="number"
                      value={formData.yearsExperience}
                      onChange={(e) =>
                        setFormData({ ...formData, yearsExperience: parseInt(e.target.value) || 0 })
                      }
                      min={0}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400"
                    />
                  </div>
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
                </div>

                {/* Specializations */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specializations
                  </label>
                  <div className="space-y-2">
                    {formData.specializations.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.specializations.map((spec, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-violet-100 text-violet-700 text-sm rounded-full"
                          >
                            {spec}
                            <button
                              type="button"
                              onClick={() => removeSpecialization(index)}
                              className="hover:text-violet-900"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newSpecialization}
                        onChange={(e) => setNewSpecialization(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            addSpecialization()
                          }
                        }}
                        placeholder="e.g., Reformer, Rehabilitation"
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400"
                      />
                      <button
                        type="button"
                        onClick={addSpecialization}
                        className="px-4 py-2 bg-gray-100 text-gray-600 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Award className="h-4 w-4 inline mr-1" />
                    Certifications
                  </label>
                  <div className="space-y-2">
                    {formData.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="flex-1 px-3 py-2 bg-gray-50 rounded-lg text-sm">
                          {cert}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeCertification(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newCertification}
                        onChange={(e) => setNewCertification(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            addCertification()
                          }
                        }}
                        placeholder="e.g., STOTT Pilates Certified"
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400"
                      />
                      <button
                        type="button"
                        onClick={addCertification}
                        className="px-4 py-2 bg-gray-100 text-gray-600 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
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
                    Active (can be assigned to classes)
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
                      : editingTrainer
                        ? 'Update Trainer'
                        : 'Add Trainer'}
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
