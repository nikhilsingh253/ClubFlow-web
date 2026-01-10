import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Check, Star, CreditCard } from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils'
import { getMembershipPlans } from '@/api/membershipPlans'
import LoadingSpinner from '@/components/common/LoadingSpinner'

export default function PricingPage() {
  const { data: plans, isLoading } = useQuery({
    queryKey: ['membership-plans'],
    queryFn: getMembershipPlans,
  })

  // Filter to only show active plans
  const activePlans = plans?.filter(plan => plan.isActive) || []

  return (
    <div className="section container-wide">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="font-display text-display-md md:text-display-lg text-foreground">
          Membership Plans
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Explore our membership options. All plans include access to our
          state-of-the-art reformer equipment and certified instructors.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      ) : activePlans.length > 0 ? (
        <div className={`grid grid-cols-1 gap-8 max-w-5xl mx-auto ${
          activePlans.length === 1 ? 'md:grid-cols-1 max-w-md' :
          activePlans.length === 2 ? 'md:grid-cols-2 max-w-3xl' :
          'md:grid-cols-3'
        }`}>
          {activePlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative p-8 rounded-2xl border-2 ${
                plan.isPopular
                  ? 'border-blush-400 bg-white shadow-soft-lg'
                  : 'border-border bg-white'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blush-500 text-white text-sm font-medium">
                    <Star className="h-3 w-3" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="font-display text-xl font-semibold text-foreground">
                  {plan.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {plan.description}
                </p>
              </div>

              <div className="text-center mb-6">
                <span className="font-display text-4xl font-bold text-foreground">
                  {formatCurrency(plan.price)}
                </span>
                <span className="text-muted-foreground">
                  /{plan.durationMonths === 1 ? 'month' : `${plan.durationMonths} months`}
                </span>
                <p className="text-xs text-muted-foreground mt-1">
                  + 18% GST
                </p>
                {plan.classesPerMonth && (
                  <p className="text-sm text-blush-600 mt-2">
                    {plan.classesPerMonth} classes per month
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-sage-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={ROUTES.TRIAL}
                className={`block w-full text-center py-3 rounded-lg font-medium transition-colors ${
                  plan.isPopular
                    ? 'bg-blush-500 text-white hover:bg-blush-600'
                    : 'bg-taupe-100 text-taupe-700 hover:bg-taupe-200'
                }`}
              >
                Book a Trial
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-border max-w-md mx-auto">
          <CreditCard className="h-12 w-12 text-taupe-300 mx-auto mb-4" />
          <p className="text-muted-foreground">No membership plans available at the moment</p>
          <p className="text-sm text-muted-foreground mt-2">Please check back later</p>
        </div>
      )}

      <div className="mt-12 max-w-2xl mx-auto">
        <div className="p-6 bg-blush-50 rounded-2xl text-center">
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">
            Ready to get started?
          </h3>
          <p className="text-muted-foreground mb-4">
            Book a trial class to experience our studio, then our team will help
            you choose the perfect plan during your visit.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to={ROUTES.TRIAL} className="btn-elegant-primary">
              Book Your Trial Class
            </Link>
            <Link to={ROUTES.CONTACT} className="btn-elegant-outline">
              Contact Us
            </Link>
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          All prices are subject to 18% GST.{' '}
          <Link to={ROUTES.CONTACT} className="text-blush-600 hover:underline">
            Have questions? Get in touch
          </Link>
        </p>
      </div>
    </div>
  )
}
