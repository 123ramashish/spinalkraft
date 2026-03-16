'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone } from 'lucide-react'
import logo from './images/logo.png'

const NAV_LINKS = [
  { label: 'Home',       href: '/'          },
  { label: 'About',      href: '/about'     },
  { label: 'Services',   href: '/services'  },
  { label: 'Conditions', href: '/conditions'},
  { label: 'Contact',    href: '/contact'   },
]

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false)
  const [visible,    setVisible]    = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname   = usePathname()
  const lastY      = useRef(0)
  const ticking    = useRef(false)

  /* ── Hide on scroll down, show on scroll up ── */
  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return
      ticking.current = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        setScrolled(y > 50)
        if (y < 60) {
          // Always show near top
          setVisible(true)
        } else if (y > lastY.current + 6) {
          // Scrolling down — hide
          setVisible(false)
          setMobileOpen(false)
        } else if (y < lastY.current - 6) {
          // Scrolling up — show
          setVisible(true)
        }
        lastY.current  = y
        ticking.current = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ── Close drawer on route change ── */
  useEffect(() => { setMobileOpen(false) }, [pathname])

  /* ── Lock body scroll when drawer open ── */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      {/* ── Focus ring removal (global, scoped to navbar) ── */}
      <style>{`
        header *:focus          { outline: none !important; box-shadow: none !important; }
        header *:focus-visible  { outline: none !important; box-shadow: none !important; }
        aside  *:focus          { outline: none !important; box-shadow: none !important; }
        aside  *:focus-visible  { outline: none !important; box-shadow: none !important; }
      `}</style>

      {/* ── Main header ── */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{
          y:       visible ? 0 : -90,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          y:       { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
          opacity: { duration: 0.28 },
        }}
        className={`fixed top-0 inset-x-0 z-50 transition-[background,padding,box-shadow] duration-500 ${
          scrolled
            ? 'glass shadow-[0_2px_40px_rgba(0,0,0,0.6)] py-2'
            : 'bg-transparent py-3 md:py-5'
        }`}
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">

          {/* ── Logo ── */}
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-3 group flex-shrink-0 min-h-[44px]"
            aria-label="SpinalKraft Physiotherapy — Home"
          >
            <div className="relative w-16 h-16 rounded-full border border-brand-gold/40 flex-shrink-0 overflow-hidden">
              <div
                className="absolute inset-0 rounded-full bg-brand-gold/0 blur-md group-hover:bg-brand-gold/15 transition-all duration-300 z-10"
                aria-hidden="true"
              />
              <Image
                src={logo}
                alt="SpinalKraft logo"
                fill
                sizes="36px"
                className="object-cover rounded-full"
              />
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

          {/* ── Desktop nav ── */}
          <nav className="hidden lg:flex items-center gap-0.5" aria-label="Main navigation">
            {NAV_LINKS.map(({ label, href }) => {
              const active = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={`relative px-3.5 py-2 rounded-lg text-sm font-sans font-semibold transition-colors duration-300 group min-h-[44px] flex items-center ${
                    active ? 'text-brand-gold' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {label}
                  <span
                    className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-[2px] rounded-full transition-all duration-300 ${
                      active ? 'w-4/5 bg-brand-gold' : 'w-0 group-hover:w-3/5 bg-brand-gold/60'
                    }`}
                    aria-hidden="true"
                  />
                </Link>
              )
            })}
          </nav>

          {/* ── CTAs + mobile toggle ── */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="md:hidden p-2.5 rounded-xl text-gray-300 hover:text-brand-gold hover:bg-white/5 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
            >
              {mobileOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
              aria-hidden="true"
            />

            {/* Drawer panel */}
            <motion.aside
              id="mobile-nav"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 right-0 bottom-0 w-[min(290px,85vw)] z-50 bg-ink-800 border-l border-white/5 flex flex-col overflow-y-auto md:hidden"
              aria-label="Mobile navigation"
              role="dialog"
              aria-modal="true"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 flex-shrink-0">
                <Link
                  href="/"
                  className="flex items-center gap-2.5 min-h-[44px]"
                  aria-label="SpinalKraft Home"
                  onClick={() => setMobileOpen(false)}
                >
                  <div className="relative w-8 h-8 rounded-full border border-brand-gold/40 overflow-hidden flex-shrink-0">
                    <Image src={logo} alt="SpinalKraft logo" fill sizes="32px" className="object-cover rounded-full" />
                  </div>
                  <p className="font-display font-bold text-[15px]">
                    <span className="text-brand-green">Spinal</span><span className="text-brand-gold">Kraft</span>
                  </p>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-lg text-gray-400 hover:text-brand-gold hover:bg-white/5 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Close navigation menu"
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </div>

              {/* Drawer links */}
              <nav className="flex flex-col p-4 gap-1 flex-1" aria-label="Mobile navigation links">
                {NAV_LINKS.map(({ label, href }, i) => {
                  const active = pathname === href
                  return (
                    <motion.div
                      key={href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                    >
                      <Link
                        href={href}
                        aria-current={active ? 'page' : undefined}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-sans font-semibold text-[15px] transition-all duration-200 min-h-[48px] ${
                          active
                            ? 'text-brand-gold bg-brand-gold/8 border border-brand-gold/15'
                            : 'text-gray-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          aria-hidden="true"
                          style={{ background: active ? '#C9A84C' : 'rgba(255,255,255,0.2)' }}
                        />
                        {label}
                      </Link>
                    </motion.div>
                  )
                })}
              </nav>

              {/* Drawer footer */}
              <div className="p-5 border-t border-white/5 flex-shrink-0 space-y-3">
                <a
                  href="tel:+918128370332"
                  className="btn-brand w-full text-sm min-h-[48px] justify-center"
                  aria-label="Call SpinalKraft: +91 81283 70332"
                >
                  <Phone size={15} aria-hidden="true" /> +91-8766304045
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