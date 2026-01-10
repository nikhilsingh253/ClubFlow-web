import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Heart, Zap, Star, Quote } from 'lucide-react'
import { ROUTES, APP_NAME, APP_TAGLINE } from '@/lib/constants'

// Static testimonials data
const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Member since 2023',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    text: 'FitRit has completely transformed my approach to fitness. The instructors are incredibly knowledgeable and the Reformer classes have helped me build strength I never knew I had.',
  },
  {
    name: 'Arjun Mehta',
    role: 'Member since 2024',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    text: 'As someone who sits at a desk all day, the Foundation classes have been a game-changer for my posture and back pain. The studio atmosphere is so welcoming and calming.',
  },
  {
    name: 'Ananya Reddy',
    role: 'Member since 2023',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    text: 'I was nervous to try Pilates as a complete beginner, but the Intro classes made everything so approachable. Now I look forward to my sessions every week!',
  },
  {
    name: 'Vikram Patel',
    role: 'Member since 2024',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    text: 'The small class sizes mean you get personalized attention. The instructors always remember your progress and push you just the right amount.',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blush-50 to-background">
        <div className="container-wide section">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-display-lg md:text-display-xl lg:text-display-2xl font-display font-semibold text-foreground animate-fade-up">
              {APP_TAGLINE}
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '0.1s' }}>
              Experience the transformative power of Reformer Pilates at {APP_NAME}.
              Build strength, improve flexibility, and find balance in our elegant studio.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <Link to={ROUTES.TRIAL} className="btn-elegant-primary px-8 py-4 text-base">
                Book Your Trial Class
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link to={ROUTES.SCHEDULE} className="btn-elegant-outline px-8 py-4 text-base">
                View Schedule
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blush-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-sage-200/30 rounded-full blur-3xl" />
      </section>

      {/* Benefits Section */}
      <section className="section bg-white">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="font-display text-display-sm md:text-display-md text-foreground">
              Why Choose Reformer Pilates?
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Discover the benefits that have made Pilates the preferred choice for
              mindful movement and lasting results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: 'Build Core Strength',
                description:
                  'Develop deep core muscles that support your spine and improve posture naturally.',
              },
              {
                icon: Heart,
                title: 'Enhance Flexibility',
                description:
                  'Gentle stretching and controlled movements increase your range of motion safely.',
              },
              {
                icon: Zap,
                title: 'Boost Energy',
                description:
                  'Leave each session feeling refreshed, centered, and ready to take on the day.',
              },
            ].map((benefit, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl bg-taupe-50 card-hover text-center"
              >
                <div className="w-14 h-14 mx-auto rounded-xl bg-blush-100 flex items-center justify-center mb-6">
                  <benefit.icon className="h-7 w-7 text-blush-600" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section bg-taupe-50">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="font-display text-display-sm md:text-display-md text-foreground">
              What Our Members Say
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Join our community of members who have transformed their fitness journey with {APP_NAME}.
            </p>
          </div>

          {/* Desktop Grid / Mobile Scroll */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-soft flex flex-col"
              >
                {/* Quote Icon */}
                <Quote className="h-8 w-8 text-blush-200 mb-4" />

                {/* Testimonial Text */}
                <p className="text-muted-foreground text-sm leading-relaxed flex-grow">
                  "{testimonial.text}"
                </p>

                {/* Rating */}
                <div className="flex items-center gap-0.5 mt-4 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-gradient-to-r from-blush-400 to-rosegold">
        <div className="container-wide text-center">
          <h2 className="font-display text-display-sm md:text-display-md text-white mb-6">
            Ready to Experience Reformer Pilates?
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8">
            Visit our studio and discover why {APP_NAME} is the preferred choice for
            mindful movement. Book your trial class today.
          </p>
          <Link
            to={ROUTES.TRIAL}
            className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-white text-blush-600 font-medium hover:bg-taupe-50 transition-colors"
          >
            Schedule Your Visit
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
