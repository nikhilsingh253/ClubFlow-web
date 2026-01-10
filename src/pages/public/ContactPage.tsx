import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { CONTACT } from '@/lib/constants'
import { submitContactForm } from '@/api/contact'

interface FormData {
  name: string
  email: string
  phone: string
  message: string
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)

    try {
      await submitContactForm({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        message: formData.message,
      })

      setIsSubmitted(true)
      toast.success('Message sent successfully!')
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to send message. Please try again.'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSendAnother = () => {
    setFormData({ name: '', email: '', phone: '', message: '' })
    setIsSubmitted(false)
  }

  return (
    <div className="section container-wide">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="font-display text-display-md md:text-display-lg text-foreground">
          Get in Touch
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Have questions? We'd love to hear from you. Send us a message and
          we'll respond as soon as possible.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="p-8 bg-white rounded-2xl border border-border">
          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto bg-sage-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="h-8 w-8 text-sage-600" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                Message Sent!
              </h3>
              <p className="text-muted-foreground mb-6">
                Thank you for reaching out. We'll respond within 24 hours.
              </p>
              <button
                onClick={handleSendAnother}
                className="text-sm font-medium text-blush-600 hover:text-blush-700"
              >
                Send another message
              </button>
            </div>
          ) : (
            <>
              <h3 className="font-display text-xl font-semibold text-foreground mb-6">
                Send us a Message
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blush-400 focus:border-transparent"
                    placeholder="Your name"
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
                    Phone (optional)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blush-400 focus:border-transparent"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blush-400 focus:border-transparent resize-none"
                    placeholder="How can we help you?"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-elegant-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          <div className="p-6 bg-taupe-50 rounded-2xl">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-lg">
                <MapPin className="h-6 w-6 text-blush-500" />
              </div>
              <div>
                <h4 className="font-medium text-foreground">Visit Us</h4>
                <p className="mt-1 text-muted-foreground">{CONTACT.ADDRESS}</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-taupe-50 rounded-2xl">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-lg">
                <Phone className="h-6 w-6 text-blush-500" />
              </div>
              <div>
                <h4 className="font-medium text-foreground">Call Us</h4>
                <a
                  href={`tel:${CONTACT.PHONE}`}
                  className="mt-1 text-muted-foreground hover:text-blush-500"
                >
                  {CONTACT.PHONE}
                </a>
              </div>
            </div>
          </div>

          <div className="p-6 bg-taupe-50 rounded-2xl">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-lg">
                <Mail className="h-6 w-6 text-blush-500" />
              </div>
              <div>
                <h4 className="font-medium text-foreground">Email Us</h4>
                <a
                  href={`mailto:${CONTACT.EMAIL}`}
                  className="mt-1 text-muted-foreground hover:text-blush-500"
                >
                  {CONTACT.EMAIL}
                </a>
              </div>
            </div>
          </div>

          <div className="p-6 bg-taupe-50 rounded-2xl">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-lg">
                <Clock className="h-6 w-6 text-blush-500" />
              </div>
              <div>
                <h4 className="font-medium text-foreground">Studio Hours</h4>
                <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <p>Monday - Friday: {CONTACT.HOURS.weekdays}</p>
                  <p>Saturday: {CONTACT.HOURS.saturday}</p>
                  <p>Sunday: {CONTACT.HOURS.sunday}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Google Maps */}
      <div className="mt-12">
        <h3 className="font-display text-xl font-semibold text-foreground text-center mb-6">
          Find Us
        </h3>
        <div className="rounded-2xl overflow-hidden border border-border">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3507.123456789!2d77.0266!3d28.4595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDI3JzM0LjIiTiA3N8KwMDEnMzUuOCJF!5e0!3m2!1sen!2sin!4v1234567890"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="FitRit Studio Location"
            className="grayscale hover:grayscale-0 transition-all duration-300"
          />
        </div>
        <div className="mt-4 text-center">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT.ADDRESS)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blush-600 hover:text-blush-700 font-medium"
          >
            Get Directions →
          </a>
        </div>
      </div>
    </div>
  )
}
