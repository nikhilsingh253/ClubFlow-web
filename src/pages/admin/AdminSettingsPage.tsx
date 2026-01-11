import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { getStudioConfig, updateStudioConfig } from '@/api/admin'
import type { StudioConfig } from '@/types/admin'
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Instagram,
  Facebook,
  FileText,
  Clock,
  Shield,
  Save,
  RotateCcw,
} from 'lucide-react'

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
]

export default function AdminSettingsPage() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<'general' | 'hours' | 'billing' | 'policies'>('general')
  const [formData, setFormData] = useState<Partial<StudioConfig>>({})
  const [hasChanges, setHasChanges] = useState(false)

  const { data: config, isLoading } = useQuery({
    queryKey: ['admin', 'studio-config'],
    queryFn: getStudioConfig,
  })

  useEffect(() => {
    if (config) {
      setFormData(config)
    }
  }, [config])

  const updateMutation = useMutation({
    mutationFn: updateStudioConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'studio-config'] })
      toast.success('Settings saved successfully')
      setHasChanges(false)
    },
    onError: () => {
      toast.error('Failed to save settings')
    },
  })

  const handleFieldChange = <K extends keyof StudioConfig>(
    field: K,
    value: StudioConfig[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const handleNestedChange = (
    parent: 'socialLinks' | 'policies',
    field: string,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as Record<string, unknown>),
        [field]: value,
      },
    }))
    setHasChanges(true)
  }

  const handleOperatingHoursChange = (
    day: string,
    field: 'open' | 'close',
    value: string | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: {
          ...(prev.operatingHours?.[day] || { open: null, close: null }),
          [field]: value,
        },
      },
    }))
    setHasChanges(true)
  }

  const handleSave = () => {
    updateMutation.mutate(formData)
  }

  const handleReset = () => {
    if (config) {
      setFormData(config)
      setHasChanges(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-gray-900">Studio Settings</h1>
          <p className="text-gray-500 mt-1">Configure your studio's information and policies</p>
        </div>
        <div className="flex items-center gap-3">
          {hasChanges && (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={!hasChanges || updateMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 bg-blush-600 text-white font-medium rounded-lg hover:bg-blush-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4" />
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex px-4 -mb-px">
            {[
              { id: 'general', label: 'General', icon: Building2 },
              { id: 'hours', label: 'Operating Hours', icon: Clock },
              { id: 'billing', label: 'Billing & GST', icon: FileText },
              { id: 'policies', label: 'Policies', icon: Shield },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blush-500 text-blush-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              {/* Studio Info */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-4">Studio Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Studio Name
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => handleFieldChange('name', e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.phone || ''}
                        onChange={(e) => handleFieldChange('phone', e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => handleFieldChange('email', e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="url"
                        value={formData.website || ''}
                        onChange={(e) => handleFieldChange('website', e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-4">Address</h3>
                <div className="space-y-4">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.addressLine1 || ''}
                      onChange={(e) => handleFieldChange('addressLine1', e.target.value)}
                      placeholder="Address Line 1"
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400"
                    />
                  </div>
                  <input
                    type="text"
                    value={formData.addressLine2 || ''}
                    onChange={(e) => handleFieldChange('addressLine2', e.target.value)}
                    placeholder="Address Line 2 (optional)"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400"
                  />
                  <div className="grid grid-cols-3 gap-4">
                    <input
                      type="text"
                      value={formData.city || ''}
                      onChange={(e) => handleFieldChange('city', e.target.value)}
                      placeholder="City"
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400"
                    />
                    <input
                      type="text"
                      value={formData.state || ''}
                      onChange={(e) => handleFieldChange('state', e.target.value)}
                      placeholder="State"
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400"
                    />
                    <input
                      type="text"
                      value={formData.pincode || ''}
                      onChange={(e) => handleFieldChange('pincode', e.target.value)}
                      placeholder="PIN Code"
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400"
                    />
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-4">Social Media</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                    <div className="relative">
                      <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="url"
                        value={formData.socialLinks?.instagram || ''}
                        onChange={(e) => handleNestedChange('socialLinks', 'instagram', e.target.value)}
                        placeholder="https://instagram.com/..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                    <div className="relative">
                      <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="url"
                        value={formData.socialLinks?.facebook || ''}
                        onChange={(e) => handleNestedChange('socialLinks', 'facebook', e.target.value)}
                        placeholder="https://facebook.com/..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Operating Hours Tab */}
          {activeTab === 'hours' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 mb-4">
                Set your studio's operating hours. Leave blank for closed days.
              </p>
              {DAYS_OF_WEEK.map((day) => {
                const hours = formData.operatingHours?.[day.key] || { open: null, close: null }
                const isClosed = !hours.open && !hours.close

                return (
                  <div
                    key={day.key}
                    className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0"
                  >
                    <div className="w-28 font-medium text-gray-700">{day.label}</div>
                    <div className="flex items-center gap-3 flex-1">
                      <input
                        type="time"
                        value={hours.open || ''}
                        onChange={(e) =>
                          handleOperatingHoursChange(day.key, 'open', e.target.value || null)
                        }
                        className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400"
                      />
                      <span className="text-gray-400">to</span>
                      <input
                        type="time"
                        value={hours.close || ''}
                        onChange={(e) =>
                          handleOperatingHoursChange(day.key, 'close', e.target.value || null)
                        }
                        className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400"
                      />
                      {isClosed && (
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                          Closed
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        handleOperatingHoursChange(day.key, 'open', null)
                        handleOperatingHoursChange(day.key, 'close', null)
                      }}
                      className="text-sm text-gray-500 hover:text-red-600"
                    >
                      Clear
                    </button>
                  </div>
                )
              })}
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === 'billing' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-4">GST Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">GSTIN</label>
                    <input
                      type="text"
                      value={formData.gstin || ''}
                      onChange={(e) => handleFieldChange('gstin', e.target.value.toUpperCase())}
                      placeholder="e.g., 06AABCT1234F1ZH"
                      maxLength={15}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      HSN/SAC Code
                    </label>
                    <input
                      type="text"
                      value={formData.hsnSacCode || ''}
                      onChange={(e) => handleFieldChange('hsnSacCode', e.target.value)}
                      placeholder="e.g., 999293"
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-4">Invoice Settings</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Invoice Number Prefix
                  </label>
                  <input
                    type="text"
                    value={formData.invoicePrefix || ''}
                    onChange={(e) => handleFieldChange('invoicePrefix', e.target.value.toUpperCase())}
                    placeholder="e.g., INV"
                    maxLength={10}
                    className="w-48 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Invoices will be numbered as {formData.invoicePrefix || 'INV'}-2024-000001
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">GST Rates</h4>
                <p className="text-sm text-blue-700">
                  GST is automatically calculated at 18% (CGST 9% + SGST 9%) for all invoices.
                  This is the standard rate for fitness services in India.
                </p>
              </div>
            </div>
          )}

          {/* Policies Tab */}
          {activeTab === 'policies' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-4">Booking Policies</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <div className="font-medium text-gray-900">Advance Booking Days</div>
                      <div className="text-sm text-gray-500">
                        How many days in advance can customers book?
                      </div>
                    </div>
                    <input
                      type="number"
                      value={formData.policies?.advanceBookingDays || 7}
                      onChange={(e) =>
                        handleNestedChange('policies', 'advanceBookingDays', parseInt(e.target.value) || 7)
                      }
                      min={1}
                      max={30}
                      className="w-20 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400 text-center"
                    />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <div className="font-medium text-gray-900">Cancellation Window (Hours)</div>
                      <div className="text-sm text-gray-500">
                        Minimum hours before class to cancel without penalty
                      </div>
                    </div>
                    <input
                      type="number"
                      value={formData.policies?.cancellationHours || 12}
                      onChange={(e) =>
                        handleNestedChange('policies', 'cancellationHours', parseInt(e.target.value) || 12)
                      }
                      min={1}
                      max={72}
                      className="w-20 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400 text-center"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-4">Penalty Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <div className="font-medium text-gray-900">Late Cancellation Penalty</div>
                      <div className="text-sm text-gray-500">
                        Deduct class credit for late cancellations
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.policies?.lateCancelPenalty ?? true}
                        onChange={(e) =>
                          handleNestedChange('policies', 'lateCancelPenalty', e.target.checked)
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blush-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blush-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <div className="font-medium text-gray-900">No-Show Penalty</div>
                      <div className="text-sm text-gray-500">
                        Deduct class credit for no-shows
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.policies?.noShowPenalty ?? true}
                        onChange={(e) =>
                          handleNestedChange('policies', 'noShowPenalty', e.target.checked)
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blush-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blush-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-4">Waitlist Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <div className="font-medium text-gray-900">Enable Waitlist</div>
                      <div className="text-sm text-gray-500">
                        Allow customers to join waitlist for full classes
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.policies?.waitlistEnabled ?? true}
                        onChange={(e) =>
                          handleNestedChange('policies', 'waitlistEnabled', e.target.checked)
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blush-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blush-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <div className="font-medium text-gray-900">Auto-Book from Waitlist</div>
                      <div className="text-sm text-gray-500">
                        Automatically book first waitlisted customer when spot opens
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.policies?.autoBookFromWaitlist ?? false}
                        onChange={(e) =>
                          handleNestedChange('policies', 'autoBookFromWaitlist', e.target.checked)
                        }
                        disabled={!formData.policies?.waitlistEnabled}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blush-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blush-600 peer-disabled:opacity-50"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
