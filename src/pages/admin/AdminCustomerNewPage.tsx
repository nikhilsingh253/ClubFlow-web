import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { ArrowLeft, User, Phone, Mail, Calendar, AlertCircle, Heart } from 'lucide-react'
import toast from 'react-hot-toast'
import { createCustomer } from '@/api/admin'
import type { CustomerSource } from '@/types/admin'
import { ROUTES } from '@/lib/constants'

const SOURCE_OPTIONS: { value: CustomerSource; label: string }[] = [
  { value: 'walk_in', label: 'Walk-in' },
  { value: 'website', label: 'Website' },
  { value: 'referral', label: 'Referral' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'google', label: 'Google' },
  { value: 'other', label: 'Other' },
]

interface FormData {
  name: string
  email: string
  phone: string
  dateOfBirth: string
  emergencyContactName: string
  emergencyContactPhone: string
  healthNotes: string
  source: CustomerSource | ''
}

export default function AdminCustomerNewPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    healthNotes: '',
    source: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  const createMutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: (data) => {
      toast.success('Customer created successfully')
      navigate(`${ROUTES.ADMIN_CUSTOMERS}/${data.id}`)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create customer')
    },
  })

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required'
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Invalid Indian phone number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    createMutation.mutate({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      dateOfBirth: formData.dateOfBirth || undefined,
      emergencyContactName: formData.emergencyContactName.trim() || undefined,
      emergencyContactPhone: formData.emergencyContactPhone.trim() || undefined,
      healthNotes: formData.healthNotes.trim() || undefined,
      source: formData.source || undefined,
    })
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(ROUTES.ADMIN_CUSTOMERS)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-display font-semibold text-gray-900">New Customer</h1>
          <p className="text-gray-500">Create a new customer record</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-gray-400" />
            Basic Information
          </h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blush-400 ${
                  errors.name ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="Enter full name"
              />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  <Mail className="h-4 w-4 inline mr-1" />
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blush-400 ${
                    errors.email ? 'border-red-300' : 'border-gray-200'
                  }`}
                  placeholder="email@example.com"
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  <Phone className="h-4 w-4 inline mr-1" />
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blush-400 ${
                    errors.phone ? 'border-red-300' : 'border-gray-200'
                  }`}
                  placeholder="9876543210"
                />
                {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="dateOfBirth"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400"
                />
              </div>

              <div>
                <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">
                  How did they hear about us?
                </label>
                <select
                  id="source"
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400"
                >
                  <option value="">Select source</option>
                  {SOURCE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-gray-400" />
            Emergency Contact
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="emergencyContactName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Contact Name
              </label>
              <input
                type="text"
                id="emergencyContactName"
                name="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400"
                placeholder="Emergency contact name"
              />
            </div>

            <div>
              <label
                htmlFor="emergencyContactPhone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Contact Phone
              </label>
              <input
                type="tel"
                id="emergencyContactPhone"
                name="emergencyContactPhone"
                value={formData.emergencyContactPhone}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400"
                placeholder="Emergency contact phone"
              />
            </div>
          </div>
        </div>

        {/* Health Notes */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Heart className="h-5 w-5 text-gray-400" />
            Health Information
          </h2>

          <div>
            <label htmlFor="healthNotes" className="block text-sm font-medium text-gray-700 mb-1">
              Health Notes / Medical Conditions
            </label>
            <textarea
              id="healthNotes"
              name="healthNotes"
              value={formData.healthNotes}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400"
              placeholder="Any medical conditions, injuries, or health notes to be aware of..."
            />
            <p className="text-sm text-gray-500 mt-1">
              This information will be visible to staff to ensure safe exercise.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(ROUTES.ADMIN_CUSTOMERS)}
            className="px-6 py-2 border border-gray-200 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="px-6 py-2 bg-blush-600 text-white font-medium rounded-lg hover:bg-blush-700 transition-colors disabled:opacity-50"
          >
            {createMutation.isPending ? 'Creating...' : 'Create Customer'}
          </button>
        </div>
      </form>
    </div>
  )
}
