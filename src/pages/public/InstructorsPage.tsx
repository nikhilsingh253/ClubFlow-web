import { useQuery } from '@tanstack/react-query'
import { User } from 'lucide-react'
import { getTrainers } from '@/api/trainers'
import LoadingSpinner from '@/components/common/LoadingSpinner'

export default function InstructorsPage() {
  const { data: trainers, isLoading } = useQuery({
    queryKey: ['trainers'],
    queryFn: getTrainers,
  })

  return (
    <div className="section container-wide">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="font-display text-display-md md:text-display-lg text-foreground">
          Meet Our Instructors
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Our certified instructors are passionate about helping you achieve
          your wellness goals through expert guidance and personalized attention.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      ) : trainers && trainers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trainers.map((trainer) => (
            <div
              key={trainer.id}
              className="p-6 bg-white rounded-2xl border border-border card-hover text-center"
            >
              {trainer.photoUrl ? (
                <img
                  src={trainer.photoUrl}
                  alt={trainer.fullName}
                  className="w-24 h-24 mx-auto rounded-full object-cover mb-6"
                />
              ) : (
                <div className="w-24 h-24 mx-auto rounded-full bg-blush-100 flex items-center justify-center mb-6">
                  <User className="h-12 w-12 text-blush-400" />
                </div>
              )}
              <h3 className="font-display text-xl font-semibold text-foreground">
                {trainer.fullName}
              </h3>
              {trainer.specializations.length > 0 && (
                <p className="text-sm text-blush-600 font-medium mt-1">
                  {trainer.specializations[0]}
                </p>
              )}
              {trainer.bio && (
                <p className="mt-4 text-muted-foreground text-sm">
                  {trainer.bio}
                </p>
              )}
              {trainer.certifications.length > 0 && (
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {trainer.certifications.map((cert, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-taupe-100 text-taupe-700 rounded"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-border">
          <User className="h-12 w-12 text-taupe-300 mx-auto mb-4" />
          <p className="text-muted-foreground">No instructors available at the moment</p>
        </div>
      )}
    </div>
  )
}
