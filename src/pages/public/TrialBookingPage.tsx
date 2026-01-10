import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, Phone, Mail, MapPin, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { CONTACT, ROUTES, APP_NAME } from '@/lib/constants'
import { submitTrialBooking } from '@/api/trialBookings'

interface FormData {
  fullName: string
  email: string
  phone: string
  preferredTime: string
  notes: string
}

const PREFERRED_TIMES = [
  { value: 'morning', label: 'Morning (6 AM - 12 PM)' },
  { value: 'afternoon', label: 'Afternoon (12 PM - 5 PM)' },
  { value: 'evening', label: 'Evening (5 PM - 9 PM)' },
  { value: 'flexible', label: 'Flexible - Any time works' },
]

export default function TrialBookingPage() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    preferredTime: '',
    notes: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!formData.fullName || !formData.email || !formData.phone) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)

    try {
      await submitTrialBooking({
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        preferred_time: formData.preferredTime as 'morning' | 'afternoon' | 'evening' | 'flexible' | '',
        notes: formData.notes || undefined,
      })

      setIsSubmitted(true)
      toast.success('Trial class request submitted!')
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to submit request. Please try again.'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="section container-wide">
        <div className="max-w-xl mx-auto text-center">
          <div className="p-8 bg-white rounded-2xl border border-border">
            <div className="w-16 h-16 mx-auto bg-sage-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-8 w-8 text-sage-600" />
            </div>
            <h1 className="font-display text-2xl font-semibold text-foreground">
              Thank You!
            </h1>
            <p className="mt-4 text-muted-foreground">
              We've received your trial class request. Our team will contact you
              within 24 hours to confirm your session.
            </p>
            <div className="mt-8 p-4 bg-taupe-50 rounded-lg text-left">
              <p className="text-sm font-medium text-foreground mb-2">What's next?</p>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• We'll call or WhatsApp you to confirm a time</li>
                <li>• Wear comfortable workout clothes</li>
                <li>• Arrive 10 minutes early for orientation</li>
                <li>• Bring a water bottle and towel</li>
              </ul>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={ROUTES.HOME} className="btn-elegant-primary">
                Back to Home
              </Link>
              <Link to={ROUTES.CLASSES} className="btn-elegant-outline">
                Learn About Classes
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="section container-wide">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="font-display text-display-md md:text-display-lg text-foreground">
          Book Your Trial Class
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Experience Reformer Pilates at {APP_NAME}. Fill out the form below and
          our team will contact you to confirm your trial session.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
        {/* Trial Form */}
        <div className="p-8 bg-white rounded-2xl border border-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blush-100 rounded-lg">
              <Calendar className="h-5 w-5 text-blush-600" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground">
              Request Your Trial
            </h3>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blush-400 focus:border-transparent"
                placeholder="Your full name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blush-400 focus:border-transparent"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blush-400 focus:border-transparent"
                placeholder="+91 98765 43210"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Preferred Time
              </label>
              <select
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blush-400 focus:border-transparent"
              >
                <option value="">Select a preferred time...</option>
                {PREFERRED_TIMES.map((time) => (
                  <option key={time.value} value={time.value}>
                    {time.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Questions or Notes (optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blush-400 focus:border-transparent resize-none"
                placeholder="Any questions or special requirements?"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-elegant-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Book My Trial Class'}
            </button>
            <p className="text-xs text-center text-muted-foreground">
              By submitting, you agree to be contacted by our team.
            </p>
          </form>
        </div>

        {/* Info Section */}
        <div className="space-y-6">
          <div className="p-6 bg-blush-50 rounded-2xl">
            <h4 className="font-display text-lg font-semibold text-foreground mb-4">
              What to Expect
            </h4>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-sage-500 flex-shrink-0 mt-0.5" />
                <span>One-on-one introduction to Reformer Pilates</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-sage-500 flex-shrink-0 mt-0.5" />
                <span>Equipment orientation and safety briefing</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-sage-500 flex-shrink-0 mt-0.5" />
                <span>45-minute introductory session</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-sage-500 flex-shrink-0 mt-0.5" />
                <span>Personalized guidance from certified instructors</span>
              </li>
            </ul>
          </div>

          <div className="p-6 bg-taupe-50 rounded-2xl">
            <h4 className="font-display text-lg font-semibold text-foreground mb-4">
              Studio Information
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blush-500 flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{CONTACT.ADDRESS}</span>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-blush-500 flex-shrink-0 mt-0.5" />
                <a
                  href={`tel:${CONTACT.PHONE}`}
                  className="text-muted-foreground hover:text-blush-500"
                >
                  {CONTACT.PHONE}
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-blush-500 flex-shrink-0 mt-0.5" />
                <a
                  href={`mailto:${CONTACT.EMAIL}`}
                  className="text-muted-foreground hover:text-blush-500"
                >
                  {CONTACT.EMAIL}
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-blush-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p>Mon-Fri: {CONTACT.HOURS.weekdays}</p>
                  <p>Sat: {CONTACT.HOURS.saturday}</p>
                  <p>Sun: {CONTACT.HOURS.sunday}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-sage-50 rounded-2xl">
            <h4 className="font-display text-lg font-semibold text-foreground mb-2">
              Already a Member?
            </h4>
            <p className="text-muted-foreground text-sm mb-4">
              Sign in to book classes and manage your membership.
            </p>
            <Link
              to={ROUTES.LOGIN}
              className="text-sm font-medium text-blush-600 hover:text-blush-700"
            >
              Sign in to your account →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
