'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Home',       href: '/'          },
  { label: 'About',      href: '/about'     },
  { label: 'Services',   href: '/services'  },
  { label: 'Conditions', href: '/conditions'},
  { label: 'Contact',    href: '/contact'   },
]

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled ? 'glass shadow-[0_2px_40px_rgba(0,0,0,0.6)] py-2' : 'bg-transparent py-3 md:py-5'
        }`}
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0 min-h-[44px]" aria-label="SpinalKraft Home">
            <div className="relative w-9 h-9 rounded-full border border-brand-gold/40 bg-ink-800 flex items-center justify-center flex-shrink-0">
              <div className="absolute inset-0 rounded-full bg-brand-gold/0 blur-md group-hover:bg-brand-gold/15 transition-all duration-300" />
              <SpineIcon />
            </div>
            <div>
              <p className="font-display font-bold text-[15px] md:text-[17px] leading-tight">
                <span className="text-brand-green">Spinal</span><span className="text-brand-gold">Kraft</span>
              </p>
              <p className="hidden sm:block text-[9px] tracking-[0.15em] uppercase text-gray-500 font-sans">
                Physiotherapy Clinic
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5" aria-label="Main navigation">
            {NAV_LINKS.map(({ label, href }) => {
              const active = pathname === href
              return (
                <Link key={href} href={href}
                  className={`relative px-3.5 py-2 rounded-lg text-sm font-sans font-semibold transition-colors duration-300 group min-h-[44px] flex items-center ${
                    active ? 'text-brand-gold' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {label}
                  <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-[2px] rounded-full bg-brand-gradient transition-all duration-300 ${
                    active ? 'w-4/5' : 'w-0 group-hover:w-3/5'
                  }`} />
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-2">
            {/* Desktop CTA */}
            <a href="tel:+918128370332" className="hidden lg:flex btn-brand py-2.5 px-5 text-sm gap-1.5">
              <Phone size={13} /> +91 81283 70332
            </a>
            {/* Tablet CTA */}
            <a href="tel:+918128370332" className="hidden md:flex lg:hidden btn-brand py-2 px-4 text-sm gap-1.5">
              <Phone size={13} /> Call
            </a>
            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="md:hidden p-2.5 rounded-xl text-gray-300 hover:text-brand-gold hover:bg-white/5 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 right-0 bottom-0 w-[min(290px,85vw)] z-50 bg-ink-800 border-l border-white/5 flex flex-col overflow-y-auto md:hidden"
              aria-label="Mobile navigation"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 flex-shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full border border-brand-gold/40 bg-ink-900 flex items-center justify-center">
                    <SpineIcon />
                  </div>
                  <p className="font-display font-bold text-[15px]">
                    <span className="text-brand-green">Spinal</span><span className="text-brand-gold">Kraft</span>
                  </p>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-lg text-gray-400 hover:text-brand-gold hover:bg-white/5 transition-colors"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Links */}
              <nav className="flex flex-col p-4 gap-1 flex-1" aria-label="Mobile navigation links">
                {NAV_LINKS.map(({ label, href }, i) => {
                  const active = pathname === href
                  return (
                    <motion.div key={href} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                      <Link href={href}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-sans font-semibold text-[15px] transition-all duration-200 ${
                          active ? 'text-brand-gold bg-brand-gold/8 border border-brand-gold/15' : 'text-gray-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: active ? '#C9A84C' : 'rgba(255,255,255,0.2)' }} />
                        {label}
                      </Link>
                    </motion.div>
                  )
                })}
              </nav>

              {/* Bottom */}
              <div className="p-5 border-t border-white/5 flex-shrink-0 space-y-3">
                <a href="tel:+918128370332" className="btn-brand w-full text-sm">
                  <Phone size={15} /> +91 81283 70332
                </a>
                <p className="text-center text-xs text-gray-600 font-sans">Open 7AM – 11:30PM · ₹500</p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function SpineIcon() {
  return (
    <svg viewBox="0 0 28 28" width="17" height="17" aria-hidden>
      {[0,1,2,3,4].map(i => (
        <rect key={i} x="8" y={3 + i * 5} width="12" height="3.5" rx="1.5"
          fill={i % 2 === 0 ? '#C9A84C' : '#4CAF50'} />
      ))}
    </svg>
  )
}
