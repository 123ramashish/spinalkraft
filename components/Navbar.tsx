'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone, ChevronRight } from 'lucide-react'
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
        } else if (y > lastY.current + 8) {
          // Scrolling down — hide
          setVisible(false)
          setMobileOpen(false)
        } else if (y < lastY.current - 8) {
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
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = '0px' // Potential fix for scrollbar shift
    } else {
      document.body.style.overflow = ''
    }
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
        initial={{ y: -100, opacity: 0 }}
        animate={{
          y:       visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          y:       { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
          opacity: { duration: 0.3 },
        }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass shadow-2xl py-2'
            : 'bg-transparent py-4 md:py-6'
        }`}
        role="banner"
      >
        <div className="container-fluid flex items-center justify-between gap-4">

          {/* ── Logo ── */}
          <Link
            href="/"
            className="flex items-center gap-3 sm:gap-4 group flex-shrink-0"
            aria-label="SpinalKraft Physiotherapy — Home"
          >
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full border border-brand-gold/30 flex-shrink-0 overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105">
              <div
                className="absolute inset-0 rounded-full bg-brand-gold/0 blur-md group-hover:bg-brand-gold/10 transition-all duration-300 z-10"
                aria-hidden="true"
              />
              <Image
                src={logo}
                alt="SpinalKraft logo"
                fill
                sizes="(max-width: 640px) 48px, 64px"
                className="object-cover rounded-full"
                priority
              />
            </div>
            <div className="flex flex-col">
              <p className="font-display font-bold text-lg sm:text-xl md:text-2xl leading-none tracking-tight">
                <span className="text-brand-green">Spinal</span><span className="text-brand-gold">Kraft</span>
              </p>
              <p className="hidden sm:block text-[8px] sm:text-[10px] tracking-[0.2em] uppercase text-gray-500 font-sans font-bold mt-1">
                Physiotherapy Clinic
              </p>
            </div>
          </Link>

          {/* ── Desktop nav ── */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Main navigation">
            {NAV_LINKS.map(({ label, href }) => {
              const active = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={`relative px-4 py-2 rounded-xl text-sm font-sans font-bold transition-all duration-300 group ${
                    active ? 'text-brand-gold bg-brand-gold/5' : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {label}
                  <span
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] rounded-full transition-all duration-500 ${
                      active ? 'w-1/2 bg-brand-gold shadow-glow-sm' : 'w-0 group-hover:w-1/4 bg-brand-gold/40'
                    }`}
                    aria-hidden="true"
                  />
                </Link>
              )
            })}
          </nav>

          {/* ── CTAs + mobile toggle ── */}
          <div className="flex items-center gap-2">
            <a
              href="tel:08766304045"
              className="inline-flex sm:hidden items-center justify-center h-11 w-11 rounded-2xl border border-white/10 bg-white/5 text-brand-gold transition-all duration-300 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-brand-gold"
              aria-label="Call SpinalKraft"
            >
              <Phone size={18} aria-hidden="true" />
            </a>
            {/* <a
              href="tel:08766304045"
              className="hidden sm:inline-flex btn-brand h-11 px-5 text-sm shadow-gold"
              aria-label="Call SpinalKraft to book appointment"
            >
              <Phone size={14} className="mr-2" aria-hidden="true" /> 08766304045
            </a> */}

            <button
              onClick={() => setMobileOpen(v => !v)}
              className="lg:hidden p-3 rounded-2xl text-gray-300 hover:text-brand-gold hover:bg-white/5 transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-brand-gold"
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
            >
              {mobileOpen ? <X size={26} aria-hidden="true" /> : <Menu size={26} aria-hidden="true" />}
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
              transition={{ duration: 0.3 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md lg:hidden"
              aria-hidden="true"
            />

            {/* Drawer panel */}
            <motion.aside
              id="mobile-nav"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[min(320px,90vw)] z-[70] bg-ink-950 border-l border-white/5 flex flex-col overflow-y-auto lg:hidden shadow-[-20px_0_60px_rgba(0,0,0,0.5)]"
              aria-label="Mobile navigation"
              role="dialog"
              aria-modal="true"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 py-6 border-b border-white/5">
                <Link
                  href="/"
                  className="flex items-center gap-3"
                  aria-label="SpinalKraft Home"
                  onClick={() => setMobileOpen(false)}
                >
                  <div className="relative w-10 h-10 rounded-full border border-brand-gold/30 overflow-hidden shadow-lg">
                    <Image src={logo} alt="SpinalKraft logo" fill sizes="40px" className="object-cover" />
                  </div>
                  <p className="font-display font-bold text-lg">
                    <span className="text-brand-green">Spinal</span><span className="text-brand-gold">Kraft</span>
                  </p>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-xl text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Drawer links */}
              <nav className="flex flex-col p-6 gap-2 flex-1">
                {NAV_LINKS.map(({ label, href }, i) => {
                  const active = pathname === href
                  return (
                    <motion.div
                      key={href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 + 0.1 }}
                    >
                      <Link
                        href={href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center justify-between px-5 py-4 rounded-2xl font-sans font-bold text-base transition-all duration-300 ${
                          active
                            ? 'text-brand-gold bg-brand-gold/10 border border-brand-gold/20'
                            : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        <span>{label}</span>
                        <ChevronRight size={16} className={active ? 'opacity-100' : 'opacity-0'} />
                      </Link>
                    </motion.div>
                  )
                })}
              </nav>

              {/* Drawer footer */}
              <div className="p-8 border-t border-white/5 bg-white/[0.01]">
                <a
                  href="tel:08766304045"
                  className="btn-brand w-full h-[56px] text-base shadow-gold mb-4"
                >
                  <Phone size={18} className="mr-2" /> 08766304045
                </a>
                <div className="flex flex-col items-center gap-1 opacity-60">
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest font-sans">Open 24/7 Hours</p>
                  <p className="text-[10px] text-brand-gold uppercase font-bold tracking-widest font-sans">Consultation Fee: ₹500</p>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}