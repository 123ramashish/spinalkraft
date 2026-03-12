import Link from 'next/link'
import { Phone, MapPin, Clock, Star, Mail } from 'lucide-react'

const quickLinks = [
  { label: 'Home',       href: '/'          },
  { label: 'About Us',   href: '/about'     },
  { label: 'Services',   href: '/services'  },
  { label: 'Conditions', href: '/conditions'},
  { label: 'Contact',    href: '/contact'   },
]

const services = [
  'Spinal Physiotherapy',
  'Sports Injury Rehab',
  'Neurological Therapy',
  'Orthopedic Therapy',
  'Pain Management',
  'Post-Surgery Rehab',
  'Home Physiotherapy',
]

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-ink-950" role="contentinfo">
      <div className="absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #C9A84C 30%, #4CAF50 70%, transparent)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mb-10">

          {/* Brand — full width on mobile */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group w-fit" aria-label="SpinalKraft Home">
              <div className="w-9 h-9 rounded-full border border-brand-gold/40 bg-ink-800 flex items-center justify-center flex-shrink-0">
                <SpineIconSmall />
              </div>
              <div>
                <p className="font-display font-bold text-base leading-tight">
                  <span className="text-brand-green">Spinal</span><span className="text-brand-gold">Kraft</span>
                </p>
                <p className="text-[9px] tracking-[0.16em] uppercase text-gray-600 font-sans">Physiotherapy Clinic</p>
              </div>
            </Link>

            <p className="text-gray-500 font-sans text-sm leading-relaxed mb-4 max-w-[260px]">
              Greater Noida's trusted physiotherapy clinic — restoring movement and relieving pain with compassion.
            </p>
            <p className="text-brand-gold/60 font-display italic text-sm mb-4">— Your Recovery, Our Priority —</p>
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(i => <Star key={i} size={13} className="fill-brand-gold text-brand-gold" />)}
              <span className="text-xs text-gray-400 font-sans ml-1.5">4.9 (180+ reviews)</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-sans font-bold text-white text-xs uppercase tracking-widest mb-4">Quick Links</h3>
            <ul className="space-y-2.5" role="list">
              {quickLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href}
                    className="flex items-center gap-2 text-sm font-sans text-gray-500 hover:text-brand-gold transition-colors duration-200 group min-h-[36px]">
                    <span className="w-4 h-px bg-brand-gold/0 group-hover:bg-brand-gold/70 group-hover:w-5 transition-all duration-300" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services — hide on smallest mobile to save space */}
          <div className="hidden sm:block">
            <h3 className="font-sans font-bold text-white text-xs uppercase tracking-widest mb-4">Services</h3>
            <ul className="space-y-2" role="list">
              {services.map(s => (
                <li key={s}>
                  <Link href="/services"
                    className="flex items-center gap-2 text-sm font-sans text-gray-500 hover:text-brand-green transition-colors duration-200 group min-h-[32px]">
                    <span className="w-1 h-1 rounded-full bg-brand-green/30 group-hover:bg-brand-green transition-colors flex-shrink-0" />
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 sm:col-span-1">
            <h3 className="font-sans font-bold text-white text-xs uppercase tracking-widest mb-4">Contact</h3>
            <address className="not-italic space-y-3.5">
              <a href="tel:+918128370332" className="flex items-start gap-3 group min-h-[36px]">
                <Phone size={14} className="text-brand-gold mt-0.5 flex-shrink-0" />
                <span className="text-sm font-sans text-gray-400 group-hover:text-white transition-colors">+91 81283 70332</span>
              </a>
              <div className="flex items-start gap-3">
                <MapPin size={14} className="text-brand-green mt-0.5 flex-shrink-0" />
                <span className="text-sm font-sans text-gray-400">Sector 4, near Char Murti, Greater Noida, UP</span>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={14} className="text-brand-gold mt-0.5 flex-shrink-0" />
                <span className="text-sm font-sans text-gray-400">Mon–Sun · 7:00 AM – 11:30 PM</span>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={14} className="text-brand-green mt-0.5 flex-shrink-0" />
                <span className="text-sm font-sans text-gray-400">info@spinalkraft.in</span>
              </div>
            </address>

            <a href="tel:+918128370332"
              className="mt-5 btn-brand text-sm w-full sm:w-auto block sm:inline-flex justify-center">
              📞 Book — ₹500
            </a>
          </div>
        </div>

        <div className="divider mb-5" />
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs font-sans text-gray-600 text-center sm:text-left">
            © {new Date().getFullYear()} SpinalKraft Physiotherapy Clinic. All rights reserved.
          </p>
          <p className="text-xs font-sans text-gray-700">Greater Noida, Uttar Pradesh, India</p>
        </div>
      </div>
    </footer>
  )
}

function SpineIconSmall() {
  return (
    <svg viewBox="0 0 28 28" width="17" height="17" aria-hidden>
      {[0,1,2,3,4].map(i => (
        <rect key={i} x="8" y={3 + i * 5} width="12" height="3.5" rx="1.5"
          fill={i % 2 === 0 ? '#C9A84C' : '#4CAF50'} />
      ))}
    </svg>
  )
}
