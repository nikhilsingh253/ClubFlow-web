import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, HelpCircle } from 'lucide-react'
import { ROUTES, CONTACT, APP_NAME } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface FAQItem {
  question: string
  answer: string
  category: 'general' | 'classes' | 'membership' | 'policies'
}

const faqs: FAQItem[] = [
  // General
  {
    category: 'general',
    question: 'What is Reformer Pilates?',
    answer: `Reformer Pilates is a form of exercise performed on a specialized machine called a Reformer. It uses springs for resistance and a sliding carriage to create low-impact, full-body workouts that build strength, flexibility, and balance. It's suitable for all fitness levels.`,
  },
  {
    category: 'general',
    question: 'I\'m a complete beginner. Is Reformer Pilates right for me?',
    answer: `Absolutely! Our Intro and Foundation classes are specifically designed for beginners. Our certified instructors will guide you through proper form and technique. We recommend starting with an Intro class to learn the basics of the Reformer machine.`,
  },
  {
    category: 'general',
    question: 'What should I wear to class?',
    answer: `Wear comfortable, form-fitting workout clothes that allow you to move freely. Avoid loose or baggy clothing as it can get caught in the equipment. We practice barefoot or in grip socks (available for purchase at the studio).`,
  },
  {
    category: 'general',
    question: 'What should I bring to my first class?',
    answer: `Just bring yourself and a water bottle! We provide all equipment including mats and towels. Please arrive 10-15 minutes early for your first class to complete registration and receive an orientation.`,
  },
  // Classes
  {
    category: 'classes',
    question: 'How long are the classes?',
    answer: `Most classes are 50-55 minutes long. Intro classes are 50 minutes, while Intermediate and Advanced classes may run up to 55 minutes to accommodate more challenging sequences.`,
  },
  {
    category: 'classes',
    question: 'How do I book a class?',
    answer: `Once you're a member, you can book classes through our website by signing into your account and visiting the Schedule page. You can book up to 7 days in advance. We recommend booking early as classes fill up quickly!`,
  },
  {
    category: 'classes',
    question: 'What\'s the difference between class levels?',
    answer: `We offer four levels: Intro (perfect for first-timers), Foundation (building fundamentals), Intermediate (more challenging sequences), and Advanced (for experienced practitioners). We recommend starting with Intro or Foundation and progressing as you build strength and familiarity with the equipment.`,
  },
  {
    category: 'classes',
    question: 'How many people are in each class?',
    answer: `Our small group classes have a maximum of 8 participants to ensure personalized attention. Each person has their own Reformer machine.`,
  },
  // Membership
  {
    category: 'membership',
    question: 'How do I become a member?',
    answer: `Visit our studio to sign up for a membership. Our team will help you choose the right plan based on your goals and schedule. You can also book a trial class first to experience our studio before committing.`,
  },
  {
    category: 'membership',
    question: 'Can I try a class before committing to a membership?',
    answer: `Yes! We offer trial classes for new clients. Book your trial class through our website and our team will contact you to confirm your session. It's a great way to experience our studio and instructors.`,
  },
  {
    category: 'membership',
    question: 'Do unused classes roll over to the next month?',
    answer: `Unfortunately, unused classes do not roll over to the following month. We encourage you to make the most of your membership by booking classes regularly!`,
  },
  {
    category: 'membership',
    question: 'Can I freeze my membership?',
    answer: `Yes, you can request a membership freeze for medical reasons or extended travel. Please contact our studio to discuss freeze options and requirements.`,
  },
  // Policies
  {
    category: 'policies',
    question: 'What is your cancellation policy?',
    answer: `You can cancel a booking up to 12 hours before the class start time without penalty. Late cancellations (less than 12 hours) or no-shows will result in the class being deducted from your membership.`,
  },
  {
    category: 'policies',
    question: 'What if I\'m running late to class?',
    answer: `If you're more than 10 minutes late, you may not be able to join the class for safety reasons. Please arrive 5 minutes before class to set up your Reformer. If you know you'll be late, please call us.`,
  },
  {
    category: 'policies',
    question: 'Are there any health conditions that prevent me from doing Pilates?',
    answer: `Reformer Pilates is generally safe for most people, but please inform your instructor of any injuries, pregnancies, or medical conditions before class. If you have serious health concerns, please consult your doctor before starting any exercise program.`,
  },
  {
    category: 'policies',
    question: 'Do you offer private sessions?',
    answer: `Yes, we offer private one-on-one sessions for those who prefer personalized attention or have specific rehabilitation needs. Contact us to learn more about private session rates and availability.`,
  },
]

const categories = [
  { id: 'all', label: 'All Questions' },
  { id: 'general', label: 'General' },
  { id: 'classes', label: 'Classes' },
  { id: 'membership', label: 'Membership' },
  { id: 'policies', label: 'Policies' },
] as const

function FAQAccordionItem({ item, isOpen, onToggle }: {
  item: FAQItem
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={onToggle}
        className="w-full py-5 flex items-start justify-between gap-4 text-left"
      >
        <span className="font-medium text-foreground">{item.question}</span>
        <ChevronDown
          className={cn(
            'h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      {isOpen && (
        <div className="pb-5 pr-12 text-muted-foreground animate-fade-in">
          {item.answer}
        </div>
      )}
    </div>
  )
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const filteredFAQs = activeCategory === 'all'
    ? faqs
    : faqs.filter(faq => faq.category === activeCategory)

  return (
    <div className="section container-wide">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="font-display text-display-md md:text-display-lg text-foreground">
          Frequently Asked Questions
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Find answers to common questions about {APP_NAME}, our classes, and memberships.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              setActiveCategory(category.id)
              setOpenIndex(0)
            }}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              activeCategory === category.id
                ? 'bg-blush-500 text-white'
                : 'bg-taupe-100 text-foreground hover:bg-taupe-200'
            )}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* FAQ Accordion */}
      <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-border p-6 md:p-8">
        {filteredFAQs.map((faq, index) => (
          <FAQAccordionItem
            key={index}
            item={faq}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? null : index)}
          />
        ))}
      </div>

      {/* Still have questions */}
      <div className="mt-12 max-w-2xl mx-auto text-center p-8 bg-blush-50 rounded-2xl">
        <HelpCircle className="h-10 w-10 text-blush-500 mx-auto mb-4" />
        <h2 className="font-display text-xl font-semibold text-foreground mb-2">
          Still have questions?
        </h2>
        <p className="text-muted-foreground mb-6">
          Can't find the answer you're looking for? Our team is here to help.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to={ROUTES.CONTACT} className="btn-elegant-primary">
            Contact Us
          </Link>
          <a
            href={`tel:${CONTACT.PHONE}`}
            className="btn-elegant-outline"
          >
            Call {CONTACT.PHONE}
          </a>
        </div>
      </div>
    </div>
  )
}
