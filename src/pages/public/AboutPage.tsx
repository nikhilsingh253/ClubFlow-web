import { APP_NAME } from '@/lib/constants'

export default function AboutPage() {
  return (
    <div className="section container-wide">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="font-display text-display-md md:text-display-lg text-foreground">
          About {APP_NAME}
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Welcome to {APP_NAME}, your sanctuary for mindful movement and holistic wellness.
          Our state-of-the-art Reformer Pilates studio is designed to help you achieve
          balance, strength, and inner peace.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-2xl bg-taupe-50">
          <h3 className="font-display text-xl font-semibold text-foreground mb-4">
            Our Story
          </h3>
          <p className="text-muted-foreground">
            Founded with a passion for wellness and movement, {APP_NAME} brings the
            transformative power of Reformer Pilates to the NCR region. Our certified
            instructors guide you through every session with expertise and care.
          </p>
        </div>
        <div className="p-8 rounded-2xl bg-taupe-50">
          <h3 className="font-display text-xl font-semibold text-foreground mb-4">
            Our Philosophy
          </h3>
          <p className="text-muted-foreground">
            We believe that everyone deserves access to mindful movement practices.
            Our approach combines traditional Pilates principles with modern techniques
            to deliver results that last.
          </p>
        </div>
      </div>
    </div>
  )
}
