'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useState, ChangeEvent, FormEvent, ReactNode } from 'react'
import { motion, AnimatePresence, Variants, MotionProps } from 'framer-motion'
import { ChevronRight, MapPin, Phone, Clock, Star, Send, CheckCircle, AlertCircle } from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// 1. Anim  (was @/components/Anim)
// ─────────────────────────────────────────────────────────────────────────────

type Direction = 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade'

interface AnimProps extends Omit<MotionProps, 'variants'> {
  children: ReactNode
  direction?: Direction
  delay?: number
  duration?: number
  className?: string
  once?: boolean
  amount?: number
}

const variantMap: Record<Direction, Variants> = {
  up:    { hidden: { opacity: 0, y: 40       }, visible: { opacity: 1, y: 0    } },
  down:  { hidden: { opacity: 0, y: -40      }, visible: { opacity: 1, y: 0    } },
  left:  { hidden: { opacity: 0, x: 60       }, visible: { opacity: 1, x: 0    } },
  right: { hidden: { opacity: 0, x: -60      }, visible: { opacity: 1, x: 0    } },
  scale: { hidden: { opacity: 0, scale: 0.85 }, visible: { opacity: 1, scale: 1 } },
  fade:  { hidden: { opacity: 0              }, visible: { opacity: 1           } },
}

function Anim({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.65,
  className,
  once = true,
  amount = 0.15,
  ...rest
}: AnimProps) {
  return (
    <motion.div
      variants={variantMap[direction]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. PageHero  (was @/components/PageHero)
// ─────────────────────────────────────────────────────────────────────────────

interface Crumb { label: string; href?: string }

interface PageHeroProps {
  badge: string
  title: ReactNode
  subtitle: string
  breadcrumbs: Crumb[]
  accentColor?: 'gold' | 'green'
  scene?: ReactNode
}

function PageHero({ badge, title, subtitle, breadcrumbs, accentColor = 'gold', scene }: PageHeroProps) {
  const glowColor = accentColor === 'gold' ? 'rgba(201,168,76,0.10)' : 'rgba(76,175,80,0.10)'

  return (
    <section
      className="relative pt-28 sm:pt-32 md:pt-40 pb-16 md:pb-24 overflow-hidden min-h-[38vh] flex flex-col justify-center"
      aria-label="Page header"
    >
      {/* Three.js scene */}
      {scene && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {scene}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, rgba(5,10,14,0.55), rgba(5,10,14,0.70) 60%, rgba(5,10,14,0.92) 100%)',
            }}
          />
        </div>
      )}

      {/* Static gradient fallback */}
      {!scene && (
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{ background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${glowColor}, transparent 65%)` }}
        />
      )}

      {/* Decorative blobs */}
      <div
        className="absolute -top-24 -right-24 w-64 h-64 md:w-96 md:h-96 rounded-full opacity-[0.04] pointer-events-none"
        aria-hidden="true"
        style={{ background: accentColor === 'gold' ? '#C9A84C' : '#4CAF50' }}
      />
      <div
        className="absolute -bottom-12 -left-12 w-40 h-40 md:w-64 md:h-64 rounded-full opacity-[0.03] pointer-events-none"
        aria-hidden="true"
        style={{ background: accentColor === 'gold' ? '#4CAF50' : '#C9A84C' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center w-full">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-1 sm:gap-1.5 mb-5 flex-wrap">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1 sm:gap-1.5">
              {i > 0 && <ChevronRight size={12} className="text-gray-600" aria-hidden="true" />}
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="text-xs sm:text-sm font-sans text-gray-500 hover:text-brand-gold transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span
                  className="text-xs sm:text-sm font-sans text-brand-gold font-semibold"
                  aria-current="page"
                >
                  {crumb.label}
                </span>
              )}
            </span>
          ))}
        </nav>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="section-badge mx-auto w-fit mb-3"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse flex-shrink-0" aria-hidden="true" />
          {badge}
        </motion.div>

        {/* H1 */}
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 px-2"
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.22 }}
          className="text-gray-400 font-sans text-base sm:text-lg max-w-2xl mx-auto leading-relaxed px-2"
        >
          {subtitle}
        </motion.p>

        {/* Accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 mx-auto w-20 h-[3px] rounded-full"
          aria-hidden="true"
          style={{ background: 'linear-gradient(90deg, #C9A84C, #4CAF50)' }}
        />
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. ContactScene  (was @/components/ContactScene)
// ─────────────────────────────────────────────────────────────────────────────

const ContactScene = dynamic(() => import('@/components/ContactScene'), { ssr: false })

// ─────────────────────────────────────────────────────────────────────────────
// 4. Form helpers & data
// ─────────────────────────────────────────────────────────────────────────────

interface FormData {
  name: string; phone: string; email: string
  condition: string; message: string; preferredTime: string
}

const INITIAL: FormData = { name: '', phone: '', email: '', condition: '', message: '', preferredTime: '' }

const CONDITION_LIST = [
  'Back Pain', 'Neck Pain', 'Sciatica', 'Frozen Shoulder', 'Knee Pain',
  'Slip Disc', 'Sports Injury', 'Paralysis / Stroke', 'Arthritis', 'Muscle Strain', 'Other',
]

const TIME_SLOTS = [
  '7:00 AM – 10:00 AM', '10:00 AM – 1:00 PM',
  '1:00 PM – 4:00 PM',  '4:00 PM – 7:00 PM', '7:00 PM – 11:30 PM',
]

const INFO_CARDS = [
  {
    icon: Phone, title: 'Call Us',    primary: '+91 81283 70332',        secondary: 'Consultation: ₹500/session',
    color: '#C9A84C', link: 'tel:+918128370332',
  },
  {
    icon: MapPin, title: 'Visit Us',  primary: 'Greater Noida Sector 4', secondary: 'near Char Murti / Ek Murti',
    color: '#4CAF50', link: 'https://maps.google.com/?q=Greater+Noida+Sector+4',
  },
  {
    icon: Clock, title: 'Open Hours', primary: 'Monday – Sunday',        secondary: '7:00 AM – 11:30 PM',
    color: '#C9A84C',
  },
  {
    icon: Star,  title: 'Rating',     primary: '4.9★ Rating',            secondary: '180+ happy patients',
    color: '#4CAF50',
  },
] as const

type Status = 'idle' | 'sending' | 'success' | 'error'

// ─────────────────────────────────────────────────────────────────────────────
// 5. Small reusable pieces
// ─────────────────────────────────────────────────────────────────────────────

function ErrMsg({ msg }: { msg: string }) {
  return (
    <p className="mt-1 text-xs font-sans text-red-400 flex items-center gap-1" role="alert">
      <AlertCircle size={11} aria-hidden="true" /> {msg}
    </p>
  )
}

function Label({ children, required }: { children: ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs sm:text-sm font-sans text-gray-400 mb-1.5">
      {children} {required && <span className="text-brand-gold" aria-hidden="true">*</span>}
    </label>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. Input class helper
// ─────────────────────────────────────────────────────────────────────────────

const inputCls = (hasError: boolean) =>
  `w-full bg-white/4 border rounded-xl px-4 py-3 font-sans text-sm text-white placeholder-gray-600 
   focus:outline-none transition-all duration-300 min-h-[44px] appearance-none ${
     hasError
       ? 'border-red-400/50 focus:border-red-400'
       : 'border-white/8 focus:border-brand-gold/50 focus:bg-white/6'
   }`

// ─────────────────────────────────────────────────────────────────────────────
// 7. Default export — full Contact page
// ─────────────────────────────────────────────────────────────────────────────

export default function ContactPageClient() {
  const [form, setForm]     = useState<FormData>(INITIAL)
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Partial<FormData>>({})

  /* ── Validation ── */
  const validate = (): boolean => {
    const e: Partial<FormData> = {}
    if (!form.name.trim())              e.name  = 'Name is required'
    if (!/^\+?[\d\s-]{10,}$/.test(form.phone)) e.phone = 'Enter a valid phone number'
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormData]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validate()) return
    setStatus('sending')
    await new Promise(r => setTimeout(r, 1400))
    setStatus('success')
    setForm(INITIAL)
    setTimeout(() => setStatus('idle'), 5000)
  }

  return (
    <>
      {/* ── Hero (PageHeroWrapper + PageHero inlined) ── */}
      <PageHero
        badge="Get In Touch"
        title={<><span className="text-white">Book Your </span><span className="text-shimmer">Appointment</span></>}
        subtitle="Take the first step towards a pain-free life. Visit us, call or fill in the form — our team will get back to you promptly."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
        accentColor="gold"
        scene={<ContactScene />}
      />

      <main id="main-content" className="pb-14 md:pb-24">

        {/* ── Info cards ── */}
        <section className="py-10 md:py-16" aria-labelledby="contact-info-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">

            <h2 id="contact-info-heading" className="sr-only">Contact Information</h2>

            {/* 2-col mobile → 4-col md */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5 mb-10 md:mb-16">
              {INFO_CARDS.map(({ icon: Icon, title, primary, secondary, color, link }, i) => {
                const rgb = color === '#C9A84C' ? '201,168,76' : '76,175,80'
                return (
                  <Anim key={title} direction="up" delay={i * 0.1}>
                    <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-white/5 hover:border-brand-gold/20 transition-all duration-300 group h-full flex flex-col">
                      <div
                        className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-lg sm:rounded-xl mb-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0"
                        style={{ background: `rgba(${rgb},.12)` }}
                      >
                        <Icon size={16} style={{ color }} aria-hidden="true" />
                      </div>
                      <p className="font-sans font-bold text-[10px] sm:text-xs uppercase tracking-wider text-gray-500 mb-1.5">
                        {title}
                      </p>
                      {'link' in INFO_CARDS[i] && link ? (
                        <a
                          href={link}
                          target={link.startsWith('http') ? '_blank' : undefined}
                          rel="noopener noreferrer"
                          className="font-display font-bold text-sm sm:text-base md:text-lg text-white hover:text-brand-gold transition-colors mb-1"
                        >
                          {primary}
                        </a>
                      ) : (
                        <p className="font-display font-bold text-sm sm:text-base md:text-lg text-white mb-1">{primary}</p>
                      )}
                      <p className="font-sans text-[11px] sm:text-sm text-gray-500 leading-snug mt-auto">{secondary}</p>
                    </div>
                  </Anim>
                )
              })}
            </div>

            {/* ── Main grid: form + map ── */}
            <div className="grid lg:grid-cols-2 gap-8 md:gap-10">

              {/* ── Appointment form ── */}
              <Anim direction="left">
                <div className="glass-gold rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-10 border border-brand-gold/15 relative overflow-hidden">
                  {/* Corner glow */}
                  <div
                    className="absolute top-0 right-0 w-40 h-40 opacity-[0.04] pointer-events-none"
                    aria-hidden="true"
                    style={{
                      background: 'radial-gradient(circle,#C9A84C,transparent)',
                      transform: 'translate(30%,-30%)',
                    }}
                  />

                  <div className="relative z-10">
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-white mb-1">
                      Book an Appointment
                    </h2>
                    <p className="text-gray-500 font-sans text-xs sm:text-sm mb-6">
                      Fill in your details and we'll confirm your slot.
                    </p>

                    <AnimatePresence mode="wait">
                      {status === 'success' ? (
                        /* ── Success state ── */
                        <motion.div
                          key="success"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col items-center justify-center py-12 sm:py-16 text-center"
                          role="alert"
                          aria-live="polite"
                        >
                          <CheckCircle size={48} className="text-brand-green mb-4" aria-hidden="true" />
                          <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-2">
                            Appointment Requested!
                          </h3>
                          <p className="text-gray-400 font-sans text-sm sm:text-base">
                            We'll call you shortly. For urgent care:{' '}
                            <a href="tel:+918128370332" className="text-brand-gold font-semibold">
                              +91 81283 70332
                            </a>
                          </p>
                        </motion.div>
                      ) : (
                        /* ── Form ── */
                        <motion.form
                          key="form"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          onSubmit={handleSubmit}
                          className="space-y-4"
                          noValidate
                          aria-label="Appointment booking form"
                        >
                          {/* Name + Phone — side by side on sm+ */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Label required>Full Name</Label>
                              <input
                                type="text" name="name" value={form.name} onChange={handleChange}
                                placeholder="Your full name" required
                                className={inputCls(!!errors.name)}
                                aria-required="true" autoComplete="name"
                              />
                              {errors.name && <ErrMsg msg={errors.name} />}
                            </div>
                            <div>
                              <Label required>Phone</Label>
                              <input
                                type="tel" name="phone" value={form.phone} onChange={handleChange}
                                placeholder="+91 XXXXX XXXXX" required
                                className={inputCls(!!errors.phone)}
                                aria-required="true" autoComplete="tel"
                              />
                              {errors.phone && <ErrMsg msg={errors.phone} />}
                            </div>
                          </div>

                          {/* Email */}
                          <div>
                            <Label>Email (optional)</Label>
                            <input
                              type="email" name="email" value={form.email} onChange={handleChange}
                              placeholder="you@email.com"
                              className={inputCls(!!errors.email)}
                              autoComplete="email"
                            />
                            {errors.email && <ErrMsg msg={errors.email} />}
                          </div>

                          {/* Condition + Preferred time — side by side on sm+ */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Label>Condition</Label>
                              <select
                                name="condition" value={form.condition} onChange={handleChange}
                                className={inputCls(false)}
                                aria-label="Select your condition"
                              >
                                <option value="">Select condition</option>
                                {CONDITION_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                              </select>
                            </div>
                            <div>
                              <Label>Preferred Time</Label>
                              <select
                                name="preferredTime" value={form.preferredTime} onChange={handleChange}
                                className={inputCls(false)}
                                aria-label="Select preferred time slot"
                              >
                                <option value="">Any time</option>
                                {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                              </select>
                            </div>
                          </div>

                          {/* Message */}
                          <div>
                            <Label>Additional Details</Label>
                            <textarea
                              name="message" value={form.message} onChange={handleChange}
                              placeholder="Describe your pain, duration, any previous treatment…"
                              rows={4}
                              className={`${inputCls(false)} resize-none`}
                            />
                          </div>

                          {/* Submit */}
                          <motion.button
                            type="submit"
                            disabled={status === 'sending'}
                            whileHover={{ scale: status === 'sending' ? 1 : 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            className="btn-brand w-full justify-center shadow-gold disabled:opacity-60 disabled:cursor-not-allowed"
                            aria-busy={status === 'sending'}
                          >
                            {status === 'sending' ? (
                              <>
                                <motion.span
                                  animate={{ rotate: 360 }}
                                  transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                                  aria-hidden="true"
                                >
                                  ⏳
                                </motion.span>{' '}
                                Booking…
                              </>
                            ) : (
                              <><Send size={14} aria-hidden="true" /> Book Appointment — ₹500</>
                            )}
                          </motion.button>

                          <p className="text-[10px] sm:text-xs text-center font-sans text-gray-600">
                            By submitting you agree to be contacted by SpinalKraft for appointment confirmation.
                          </p>
                        </motion.form>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </Anim>

              {/* ── Map + Directions ── */}
              <div className="space-y-4 sm:space-y-5">

                {/* Embedded map */}
                <Anim direction="right">
                  <div
                    className="glass rounded-xl sm:rounded-2xl overflow-hidden border border-white/5 relative"
                    style={{ aspectRatio: '4/3' }}
                  >
                    <iframe
                      title="SpinalKraft Physiotherapy Clinic location — Greater Noida Sector 4"
                      src="https://maps.google.com/maps?q=Sector+4,+Greater+Noida,+Uttar+Pradesh&output=embed&z=14"
                      className="w-full h-full"
                      style={{ border: 0, opacity: 0.75 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                    <div
                      className="absolute bottom-0 inset-x-0 p-3 sm:p-4"
                      style={{ background: 'linear-gradient(to top,rgba(5,10,14,.9),transparent)' }}
                    >
                      <p className="font-sans font-semibold text-white text-xs sm:text-sm">
                        SpinalKraft Physiotherapy Clinic
                      </p>
                      <p className="font-sans text-[10px] sm:text-xs text-gray-400">
                        Sector 4, Greater Noida · near Char Murti / Ek Murti
                      </p>
                    </div>
                  </div>
                </Anim>

                {/* Directions */}
                <Anim direction="right" delay={0.1}>
                  <div className="glass-green rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-brand-green/15">
                    <h3 className="font-display text-lg sm:text-xl font-bold text-white mb-4">Directions</h3>
                    <div className="space-y-3 sm:space-y-4">
                      {[
                        { label: 'From Delhi',  desc: 'DND Flyway → Greater Noida Expressway → Sector 4 (≈ 40 min)' },
                        { label: 'From Noida',  desc: 'Noida–Greater Noida Expressway → Sector 4 exit (≈ 20 min)' },
                        { label: 'Landmark',    desc: 'Near Char Murti Chowk / Ek Murti / Iteda Gol Chakkar' },
                      ].map(({ label, desc }) => (
                        <div key={label}>
                          <p className="font-sans font-bold text-[10px] sm:text-xs text-brand-green uppercase tracking-wider mb-1">
                            {label}
                          </p>
                          <p className="font-sans text-xs sm:text-sm text-gray-400 leading-relaxed">{desc}</p>
                        </div>
                      ))}
                    </div>
                    <a
                      href="https://maps.google.com/?q=Spinalkraft+Physiotherapy+Greater+Noida+Sector+4"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline mt-4 sm:mt-5 text-sm py-3 w-full justify-center block text-center"
                      aria-label="Open SpinalKraft location in Google Maps"
                    >
                      📍 Open in Google Maps
                    </a>
                  </div>
                </Anim>

                {/* Urgent care callout */}
                <Anim direction="right" delay={0.2}>
                  <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-brand-gold/15 flex items-start gap-3">
                    <AlertCircle size={18} className="text-brand-gold mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <p className="font-sans font-semibold text-white text-sm mb-1">Need Urgent Care?</p>
                      <p className="font-sans text-xs sm:text-sm text-gray-400">
                        Call{' '}
                        <a
                          href="tel:+918128370332"
                          className="text-brand-gold font-semibold hover:underline"
                          aria-label="Call SpinalKraft for urgent care"
                        >
                          +91 81283 70332
                        </a>
                        {' '}— Open 7 days, 7 AM–11:30 PM.
                      </p>
                    </div>
                  </div>
                </Anim>
              </div>
            </div>
          </div>
        </section>

        {/* ── Structured data for local business (JSON-LD) ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'PhysicalTherapy',
              name: 'SpinalKraft Physiotherapy Clinic',
              url: 'https://spinalkraft.in',
              telephone: '+918128370332',
              priceRange: '₹500',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Greater Noida',
                addressRegion: 'Uttar Pradesh',
                addressCountry: 'IN',
                streetAddress: 'Sector 4',
              },
              openingHours: 'Mo-Su 07:00-23:30',
              aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '180' },
            }),
          }}
        />
      </main>
    </>
  )
}