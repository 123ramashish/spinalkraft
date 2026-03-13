import Link from 'next/link'
import Image from 'next/image'
import { Phone, MapPin, Clock, Star, Mail } from 'lucide-react'
import logo from './images/logo.png'

// ─── Data ─────────────────────────────────────────────────────────────────────

const QUICK_LINKS = [
  { label: 'Home',       href: '/'          },
  { label: 'About Us',   href: '/about'     },
  { label: 'Services',   href: '/services'  },
  { label: 'Conditions', href: '/conditions'},
  { label: 'Contact',    href: '/contact'   },
]

const SERVICES = [
  { label: 'Spinal Physiotherapy', href: '/services#spinal'      },
  { label: 'Sports Injury Rehab',  href: '/services#sports'      },
  { label: 'Neurological Therapy', href: '/services#neuro'       },
  { label: 'Orthopedic Therapy',   href: '/services#ortho'       },
  { label: 'Pain Management',      href: '/services#pain'        },
  { label: 'Post-Surgery Rehab',   href: '/services#postsurgery' },
  { label: 'Home Physiotherapy',   href: '/services#home'        },
]

// ─────────────────────────────────────────────────────────────────────────────

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-ink-950" role="contentinfo" aria-label="Site footer">

      {/* Top gradient rule */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        aria-hidden="true"
        style={{ background: 'linear-gradient(90deg, transparent, #C9A84C 30%, #4CAF50 70%, transparent)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">

        {/* ── Main grid: 1-col mobile → 2-col sm → 4-col lg ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mb-10">

          {/* Brand column — spans 2 cols on sm so it sits above the link columns */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2.5 mb-4 group w-fit min-h-[44px]"
              aria-label="SpinalKraft Home"
            >
              <div className="w-9 h-9 rounded-full border border-brand-gold/40 bg-ink-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
                <Image src={logo} alt="SpinalKraft logo" width={30} height={30} className="rounded-full" />
              </div>
              <div>
                <p className="font-display font-bold text-base leading-tight">
                  <span className="text-brand-green">Spinal</span><span className="text-brand-gold">Kraft</span>
                </p>
                <p className="text-[9px] tracking-[0.16em] uppercase text-gray-600 font-sans">Physiotherapy Clinic</p>
              </div>
            </Link>

            <p className="text-gray-500 font-sans text-sm leading-relaxed mb-4 max-w-[280px]">
              Greater Noida's trusted physiotherapy clinic — restoring movement and relieving pain with compassion.
            </p>
            <p className="text-brand-gold/60 font-display italic text-sm mb-4">— Your Recovery, Our Priority —</p>

            {/* Star rating */}
            <div className="flex items-center gap-1" aria-label="Rated 4.9 out of 5 from 180 reviews">
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} size={13} className="fill-brand-gold text-brand-gold" aria-hidden="true" />
              ))}
              <span className="text-xs text-gray-400 font-sans ml-1.5">4.9 (180+ reviews)</span>
            </div>
          </div>

          {/* Quick Links */}
          <nav aria-label="Quick links">
            <h3 className="font-sans font-bold text-white text-xs uppercase tracking-widest mb-4">Quick Links</h3>
            <ul className="space-y-1" role="list">
              {QUICK_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="flex items-center gap-2 text-sm font-sans text-gray-500 hover:text-brand-gold transition-colors duration-200 group min-h-[40px]"
                  >
                    <span className="w-4 h-px bg-brand-gold/0 group-hover:bg-brand-gold/70 group-hover:w-5 transition-all duration-300 flex-shrink-0" aria-hidden="true" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <nav aria-label="Services">
            <h3 className="font-sans font-bold text-white text-xs uppercase tracking-widest mb-4">Services</h3>
            <ul className="space-y-1" role="list">
              {SERVICES.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="flex items-center gap-2 text-sm font-sans text-gray-500 hover:text-brand-green transition-colors duration-200 group min-h-[38px]"
                  >
                    <span
                      className="w-1 h-1 rounded-full bg-brand-green/30 group-hover:bg-brand-green transition-colors flex-shrink-0"
                      aria-hidden="true"
                    />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h3 className="font-sans font-bold text-white text-xs uppercase tracking-widest mb-4">Contact</h3>
            <address className="not-italic space-y-3.5">
              <a
                href="tel:+918128370332"
                className="flex items-start gap-3 group min-h-[40px]"
                aria-label="Call SpinalKraft"
              >
                <Phone size={14} className="text-brand-gold mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span className="text-sm font-sans text-gray-400 group-hover:text-white transition-colors">
                  +91 81283 70332
                </span>
              </a>

              <div className="flex items-start gap-3">
                <MapPin size={14} className="text-brand-green mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span className="text-sm font-sans text-gray-400">
                  Sector 4, near Char Murti,<br />Greater Noida, UP
                </span>
              </div>

              <div className="flex items-start gap-3">
                <Clock size={14} className="text-brand-gold mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span className="text-sm font-sans text-gray-400">
                  Mon–Sun · 7:00 AM – 11:30 PM
                </span>
              </div>

              <a
                href="mailto:info@spinalkraft.in"
                className="flex items-start gap-3 group min-h-[40px]"
                aria-label="Email SpinalKraft"
              >
                <Mail size={14} className="text-brand-green mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span className="text-sm font-sans text-gray-400 group-hover:text-white transition-colors">
                  info@spinalkraft.in
                </span>
              </a>
            </address>

            <a
              href="tel:+918128370332"
              className="mt-5 btn-brand text-sm w-full justify-center min-h-[48px]"
              aria-label="Book appointment at SpinalKraft — ₹500"
            >
              📞 Book — ₹500
            </a>
          </div>
        </div>

        <div className="divider mb-5" aria-hidden="true" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-center sm:text-left">
          <p className="text-xs font-sans text-gray-600">
            © {new Date().getFullYear()} SpinalKraft Physiotherapy Clinic. All rights reserved.
          </p>
          <p className="text-xs font-sans text-gray-700">Greater Noida, Uttar Pradesh, India</p>
        </div>
      </div>
    </footer>
  )
}