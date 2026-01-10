import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { ROUTES, CLASS_LEVELS } from '@/lib/constants'

export default function ClassesPage() {
  return (
    <div className="section container-wide">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="font-display text-display-md md:text-display-lg text-foreground">
          Reformer Pilates Classes
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Our carefully designed classes cater to all levels, from beginners
          discovering the reformer to advanced practitioners seeking a challenge.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {CLASS_LEVELS.map((level, index) => (
          <div
            key={level.value}
            className="p-8 rounded-2xl bg-white border border-border card-hover"
          >
            <div className="w-12 h-12 rounded-lg bg-blush-100 flex items-center justify-center mb-6">
              <span className="font-display font-semibold text-blush-600">
                {index + 1}
              </span>
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              {level.label}
            </h3>
            <p className="text-muted-foreground mb-4">{level.description}</p>
            <p className="text-sm text-muted-foreground">
              {level.value === 'intro' && '50 minutes • Perfect for first-timers'}
              {level.value === 'foundation' && '50 minutes • Build your fundamentals'}
              {level.value === 'intermediate' && '55 minutes • Take it to the next level'}
              {level.value === 'advanced' && '55 minutes • For experienced practitioners'}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link to={ROUTES.TRIAL} className="btn-elegant-primary">
          Book Your First Class
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
        <Link to={ROUTES.SCHEDULE} className="btn-elegant-outline">
          View Class Schedule
        </Link>
      </div>
    </div>
  )
}
