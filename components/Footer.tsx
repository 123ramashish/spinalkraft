import Link from 'next/link'
import Image from 'next/image'
import { Phone, MapPin, Clock, Star, Mail, ArrowRight, MessageCircle } from 'lucide-react'
import logo from './images/logo.png'

// ─── Data ─────────────────────────────────────────────────────────────────────

const QUICK_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Conditions', href: '/conditions' },
  { label: 'Contact', href: '/contact' },
]

const SERVICES = [
  { label: 'Spinal Physiotherapy', href: '/services#spinal' },
  { label: 'Sports Injury Rehab', href: '/services#sports' },
  { label: 'Neurological Therapy', href: '/services#neuro' },
  { label: 'Orthopedic Therapy', href: '/services#ortho' },
  { label: 'Pain Management', href: '/services#pain' },
  { label: 'Post-Surgery Rehab', href: '/services#postsurgery' },
  { label: 'Home Physiotherapy', href: '/services#home' },
]

// ─────────────────────────────────────────────────────────────────────────────

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-ink-950 pt-16 pb-8" role="contentinfo" aria-label="Site footer">

      {/* Top gradient rule */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        aria-hidden="true"
        style={{ background: 'linear-gradient(90deg, transparent, #C9A84C 30%, #4CAF50 70%, transparent)' }}
      />

      <div className="container-fluid">

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 mb-16">

          {/* Brand column */}
          <div className="lg:col-span-4 space-y-6">
            <Link
              href="/"
              className="flex items-center gap-4 group w-fit"
              aria-label="SpinalKraft Home"
            >
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-brand-gold/30 flex-shrink-0 overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105">
                <div
                  className="absolute inset-0 rounded-full bg-brand-gold/0 blur-md group-hover:bg-brand-gold/10 transition-all duration-300 z-10"
                  aria-hidden="true"
                />
                <Image
                  src={logo}
                  alt="SpinalKraft logo"
                  fill
                  sizes="64px"
                  className="object-cover rounded-full"
                />
              </div>
              <div className="flex flex-col">
                <p className="font-display font-bold text-xl sm:text-2xl leading-none tracking-tight">
                  <span className="text-brand-green">Spinal</span><span className="text-brand-gold">Kraft</span>
                </p>
                <p className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-gray-600 font-sans font-bold mt-1.5">
                  Physiotherapy Clinic
                </p>
              </div>
            </Link>

            <p className="text-gray-400 font-sans text-sm sm:text-base leading-relaxed max-w-sm">
              Greater Noida's premier destination for advanced physiotherapy and rehabilitation. We combine clinical expertise with compassionate care to help you move pain-free.
            </p>

            {/* Social proof */}
            <div className="pt-2 flex flex-col gap-4">
              <div className="flex items-center gap-1" aria-label="Rated 5.0 out of 5">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} size={14} className="fill-brand-gold text-brand-gold shadow-glow-sm" aria-hidden="true" />
                ))}
                <span className="text-xs text-gray-500 font-bold font-sans ml-2 uppercase tracking-widest">5.0 (10000+ Patients)</span>
              </div>
              <p className="text-brand-gold/60 font-display italic text-base">— Your Recovery, Our Priority —</p>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8 md:gap-12">
            {/* Quick Links */}
            <nav aria-label="Quick links" className="space-y-6">
              <h3 className="font-sans font-bold text-white text-[11px] sm:text-xs uppercase tracking-[0.2em] px-1">Explore</h3>
              <ul className="space-y-1" role="list">
                {QUICK_LINKS.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="flex items-center gap-2 py-2 text-sm font-sans font-bold text-gray-500 hover:text-brand-gold transition-all duration-300 group"
                    >
                      <ArrowRight size={12} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Services */}
            <nav aria-label="Services" className="space-y-6">
              <h3 className="font-sans font-bold text-white text-[11px] sm:text-xs uppercase tracking-[0.2em] px-1">Services</h3>
              <ul className="space-y-1" role="list">
                {SERVICES.slice(0, 5).map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="flex items-center gap-2 py-2 text-sm font-sans font-bold text-gray-500 hover:text-brand-green transition-all duration-300 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-brand-green/20 group-hover:bg-brand-green group-hover:scale-150 transition-all duration-300 shrink-0" />
                      {label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/services" className="text-xs font-bold text-brand-gold/70 hover:text-brand-gold uppercase tracking-widest mt-2 block transition-colors">View All &rarr;</Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-4 space-y-8">
            <div className="glass rounded-3xl p-8 border border-white/5 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 blur-3xl pointer-events-none" />

              <h3 className="font-sans font-bold text-white text-[11px] sm:text-xs uppercase tracking-[0.2em]">Contact & Visit</h3>

              <address className="not-italic space-y-5">
                <a
                  href="tel:08766304045"
                  className="flex items-start gap-4 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-gold/10 flex items-center justify-center shrink-0 group-hover:bg-brand-gold/20 transition-colors">
                    <Phone size={18} className="text-brand-gold" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Call for Booking</span>
                    <span className="text-base font-sans font-bold text-gray-300 group-hover:text-white transition-colors">08766304045</span>
                  </div>
                </a>
                <a
                  href="https://wa.me/918766304045"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0 group-hover:bg-green-500/20 transition-colors">
                    <MessageCircle size={18} className="text-green-500" />
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">
                      Chat on WhatsApp
                    </span>

                    <span className="text-base font-sans font-bold text-gray-300 group-hover:text-white transition-colors">
                      +91 87663 04045
                    </span>
                  </div>
                </a>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-brand-green" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Our Clinic</span>
                    <span className="text-sm font-sans font-medium text-gray-400 leading-relaxed">
                      Galaxy Blue Sapphire Plaza, Medicenter 3rd Floor, Sector 4, Greater Noida West
                    </span>
                  </div>
                </div>

                <a
                  href="mailto:spinalkraftphysio@gmail.com"
                  className="flex items-start gap-4 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
                    <Mail size={18} className="text-gray-400 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Email Us</span>
                    <span className="text-sm font-sans font-bold text-gray-400 group-hover:text-white transition-colors underline decoration-white/10 underline-offset-4">spinalkraftphysio@gmail.com</span>
                  </div>
                </a>
              </address>

              <div className="pt-2">
                <a
                  href="tel:08766304045"
                  className="btn-brand w-full h-[52px] text-sm shadow-gold"
                >
                  📞 Book Appointment — ₹500
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="divider mb-8 opacity-10" aria-hidden="true" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="space-y-1">
            <p className="text-xs font-sans font-bold text-gray-600 uppercase tracking-widest">
              © {new Date().getFullYear()} SpinalKraft Physiotherapy Clinic
            </p>
            <p className="text-[10px] font-sans text-gray-700 uppercase font-bold tracking-widest">Greater Noida · Uttar Pradesh · India</p>
          </div>

          <div className="flex gap-6">
            <Link href="/" className="text-[10px] font-bold text-gray-600 hover:text-white uppercase tracking-widest transition-colors">Privacy Policy</Link>
            <Link href="/" className="text-[10px] font-bold text-gray-600 hover:text-white uppercase tracking-widest transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}