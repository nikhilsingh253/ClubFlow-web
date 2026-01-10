import { Link } from 'react-router-dom'
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin } from 'lucide-react'
import { APP_NAME, APP_TAGLINE, CONTACT, SOCIAL_LINKS, ROUTES } from '@/lib/constants'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-taupe-50 border-t border-border">
      <div className="container-wide py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="font-display text-2xl font-semibold text-foreground">
              <span className="text-blush-500">{APP_NAME}</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              {APP_TAGLINE}
            </p>
            {/* Social Links */}
            <div className="mt-6 flex items-center gap-4">
              <a
                href={SOCIAL_LINKS.INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white text-muted-foreground hover:text-blush-500 hover:bg-blush-50 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={SOCIAL_LINKS.FACEBOOK}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white text-muted-foreground hover:text-blush-500 hover:bg-blush-50 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href={SOCIAL_LINKS.YOUTUBE}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white text-muted-foreground hover:text-blush-500 hover:bg-blush-50 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="mt-4 space-y-3">
              <li>
                <Link to={ROUTES.TRIAL} className="text-sm font-medium text-blush-600 hover:text-blush-700 transition-colors">
                  Book a Trial Class
                </Link>
              </li>
              <li>
                <Link to={ROUTES.ABOUT} className="text-sm text-muted-foreground hover:text-blush-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to={ROUTES.CLASSES} className="text-sm text-muted-foreground hover:text-blush-500 transition-colors">
                  Our Classes
                </Link>
              </li>
              <li>
                <Link to={ROUTES.SCHEDULE} className="text-sm text-muted-foreground hover:text-blush-500 transition-colors">
                  Schedule
                </Link>
              </li>
              <li>
                <Link to={ROUTES.PRICING} className="text-sm text-muted-foreground hover:text-blush-500 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to={ROUTES.FAQ} className="text-sm text-muted-foreground hover:text-blush-500 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Studio Hours
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex justify-between">
                <span>Monday - Friday</span>
                <span>{CONTACT.HOURS.weekdays}</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday</span>
                <span>{CONTACT.HOURS.saturday}</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span>{CONTACT.HOURS.sunday}</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Contact Us
            </h4>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href={`tel:${CONTACT.PHONE}`}
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-blush-500 transition-colors"
                >
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span>{CONTACT.PHONE}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT.EMAIL}`}
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-blush-500 transition-colors"
                >
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span>{CONTACT.EMAIL}</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>{CONTACT.ADDRESS}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {currentYear} {APP_NAME}. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link to="/privacy" className="hover:text-blush-500 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-blush-500 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
