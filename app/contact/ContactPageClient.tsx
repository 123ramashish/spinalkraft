'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useState, ChangeEvent, FormEvent, ReactNode } from 'react'
import { motion, AnimatePresence, Variants, MotionProps } from 'framer-motion'
import { ChevronRight, MapPin, Phone, Clock, Star, Send, CheckCircle, AlertCircle, MessageCircle } from 'lucide-react'

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
  up: { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } },
  down: { hidden: { opacity: 0, y: -40 }, visible: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: 60 }, visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: -60 }, visible: { opacity: 1, x: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.85 }, visible: { opacity: 1, scale: 1 } },
  fade: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
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
  '1:00 PM – 4:00 PM', '4:00 PM – 7:00 PM', '7:00 PM – 11:30 PM',
]

const INFO_CARDS = [
  {
    icon: Phone, title: 'Call Us', primary: '08766304045', secondary: 'Consultation: ₹500/session',
    color: '#C9A84C', link: 'tel:08766304045',
  },
  {
    icon: MessageCircle, title: 'Chat With Us', primary: 'WhatsApp', secondary: '24*7 Availability',
    color: '#4CAF50', link: 'https://wa.me/918766304045',
  },
  {
    icon: MapPin, title: 'Visit Us', primary: 'Galaxy Blue Sapphire Plaza', secondary: 'Medicenter 3rd Floor, Sector 4, Greater Noida West',
    color: '#4CAF50', link: 'https://www.google.com/maps/place/SpinalKraft+Physiotherapy+Clinic/@28.6070951,77.4324067,815m/data=!3m2!1e3!4b1!4m6!3m5!1s0x390cefb08541b083:0x3ae67d116f9e3324!8m2!3d28.6070951!4d77.4349816!16s%2Fg%2F11mcc2kvkk?entry=ttu&g_ep=EgoyMDI2MDMxMS4wIKXMDSoASAFQAw%3D%3D',
  },
  {
    icon: Clock, title: 'Open Hours', primary: 'Monday – Sunday', secondary: '24*7 Availability',
    color: '#C9A84C',
  },
  {
    icon: Star, title: 'Rating', primary: '5.0★ Rating', secondary: '10000+ recovered patients',
    color: '#4CAF50',
  },
] as const

type Status = 'idle' | 'sending' | 'success' | 'error'

// ─────────────────────────────────────────────────────────────────────────────
// 5. Small reusable pieces
// ─────────────────────────────────────────────────────────────────────────────

function ErrMsg({ msg }: { msg: string }) {
  return (
    <p className="mt-1.5 text-xs font-sans text-red-400 flex items-center gap-1.5" role="alert">
      <AlertCircle size={12} aria-hidden="true" /> {msg}
    </p>
  )
}

function Label({ children, required }: { children: ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs sm:text-sm font-sans font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">
      {children} {required && <span className="text-brand-gold" aria-hidden="true">*</span>}
    </label>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. Input class helper
// ─────────────────────────────────────────────────────────────────────────────

const inputCls = (hasError: boolean) =>
  `w-full bg-white/4 border rounded-2xl px-5 py-3.5 font-sans text-sm text-white placeholder-gray-600 
   focus:outline-none transition-all duration-300 min-h-[52px] appearance-none ${hasError
    ? 'border-red-400/50 focus:border-red-400'
    : 'border-white/10 focus:border-brand-gold/50 focus:bg-white/6'
  }`

// ─────────────────────────────────────────────────────────────────────────────
// 7. Default export — full Contact page
// ─────────────────────────────────────────────────────────────────────────────

export default function ContactPageClient() {
  const [form, setForm] = useState<FormData>(INITIAL)
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Partial<FormData>>({})

  /* ── Validation ── */
  const validate = (): boolean => {
    const e: Partial<FormData> = {}
    if (!form.name.trim()) e.name = 'Name is required'
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
      <PageHero
        badge="Get In Touch"
        title={<><span className="text-white">Book Your </span><span className="text-shimmer">Appointment</span></>}
        subtitle="Take the first step towards a pain-free life. Visit us, call or fill in the form — our team will get back to you promptly."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
        accentColor="gold"
        scene={<ContactScene />}
      />

      <main id="main-content" className="section-py">

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* ── Info cards ── */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 sm:gap-6 mb-16 sm:mb-20">
            {INFO_CARDS.map(({ icon: Icon, title, primary, secondary, color, link }: any, i) => {
              const rgb = color === '#C9A84C' ? '201,168,76' : '76,175,80'
              return (
                <Anim key={title} direction="up" delay={i * 0.1}>
                  <div className="glass rounded-3xl p-6 sm:p-8 border border-white/5 hover:border-brand-gold/20 transition-all duration-500 group h-full flex flex-col items-center text-center">
                    <div
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl mb-5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 flex-shrink-0 shadow-lg"
                      style={{ background: `rgba(${rgb},.12)` }}
                    >
                      <Icon size={24} style={{ color }} aria-hidden="true" className="animate-pulse" />
                    </div>
                    <p className="font-sans font-bold text-[10px] sm:text-xs uppercase tracking-widest text-gray-500 mb-3">
                      {title}
                    </p>
                    {link ? (
                      <a
                        href={link}
                        target={link.startsWith('http') ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        className=" font-serif font-bold text-lg sm:text-xl text-white hover:text-brand-gold transition-colors mb-2 leading-tight"
                      >
                        {primary}
                      </a>
                    ) : (
                      <p className="font-display font-bold text-lg sm:text-xl text-white mb-2 leading-tight">{primary}</p>
                    )}
                    <p className="font-sans text-sm text-gray-500 leading-relaxed mt-auto max-w-[200px]">{secondary}</p>
                  </div>
                </Anim>
              )
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* ── Appointment form ── */}
            <Anim direction="left" className="lg:col-span-7">
              <div className="glass-gold rounded-3xl p-6 sm:p-10 md:p-14 border border-brand-gold/15 relative overflow-hidden shadow-2xl">
                <div
                  className="absolute top-0 right-0 w-64 h-64 opacity-[0.06] pointer-events-none"
                  aria-hidden="true"
                  style={{
                    background: 'radial-gradient(circle,#C9A84C,transparent)',
                    transform: 'translate(30%,-30%)',
                  }}
                />

                <div className="relative z-10">
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
                    Reserve Your Session
                  </h2>
                  <p className="text-gray-400 font-sans text-sm sm:text-base mb-10 leading-relaxed">
                    Fill in your details below and our team will contact you shortly to confirm your booking.
                  </p>

                  <AnimatePresence mode="wait">
                    {status === 'success' ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-16 sm:py-24 text-center"
                        role="alert"
                        aria-live="polite"
                      >
                        <div className="w-20 h-20 bg-brand-green/10 rounded-full flex items-center justify-center mb-8">
                          <CheckCircle size={48} className="text-brand-green" aria-hidden="true" />
                        </div>
                        <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">
                          Booking Requested!
                        </h3>
                        <p className="text-gray-400 font-sans text-base sm:text-lg mb-8 max-w-sm">
                          We have received your details. Our clinic will call you shortly to confirm your slot.
                        </p>
                        <a href="tel:08766304045" className="btn-brand px-10 py-4 shadow-gold">
                           Call Now: 08766304045
                        </a>
                      </motion.div>
                    ) : (
                      <motion.form
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onSubmit={handleSubmit}
                        className="space-y-6 sm:space-y-8"
                        noValidate
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                          <div>
                            <Label required>Full Name</Label>
                            <input
                              type="text" name="name" value={form.name} onChange={handleChange}
                              placeholder="e.g. Rahul Sharma" required
                              className={inputCls(!!errors.name)}
                              autoComplete="name"
                            />
                            {errors.name && <ErrMsg msg={errors.name} />}
                          </div>
                          <div>
                            <Label required>Phone Number</Label>
                            <input
                              type="tel" name="phone" value={form.phone} onChange={handleChange}
                              placeholder="e.g. 08766304045" required
                              className={inputCls(!!errors.phone)}
                              autoComplete="tel"
                            />
                            {errors.phone && <ErrMsg msg={errors.phone} />}
                          </div>
                        </div>

                        <div>
                          <Label>Email Address (Optional)</Label>
                          <input
                            type="email" name="email" value={form.email} onChange={handleChange}
                            placeholder="yourname@email.com"
                            className={inputCls(!!errors.email)}
                            autoComplete="email"
                          />
                          {errors.email && <ErrMsg msg={errors.email} />}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                          <div>
                            <Label>What are you experiencing?</Label>
                            <select
                              name="condition" value={form.condition} onChange={handleChange}
                              className={inputCls(false)}
                            >
                              <option value="">Select Condition</option>
                              {CONDITION_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                          </div>
                          <div>
                            <Label>Preferred Appointment Time</Label>
                            <select
                              name="preferredTime" value={form.preferredTime} onChange={handleChange}
                              className={inputCls(false)}
                            >
                              <option value="">Any Available Time</option>
                              {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                          </div>
                        </div>

                        <div>
                          <Label>Additional Details (Optional)</Label>
                          <textarea
                            name="message" value={form.message} onChange={handleChange}
                            placeholder="Briefly describe your pain, duration, or any specific concerns..."
                            rows={4}
                            className={`${inputCls(false)} resize-none min-h-[120px]`}
                          />
                        </div>

                        <motion.button
                          type="submit"
                          disabled={status === 'sending'}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          className="btn-brand w-full justify-center shadow-gold h-[56px] text-base font-bold disabled:opacity-50"
                        >
                          {status === 'sending' ? (
                            <span className="flex items-center gap-3">
                              <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>⏳</motion.span>
                              Sending Request...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <Send size={18} /> Confirm Appointment Request
                            </span>
                          )}
                        </motion.button>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </Anim>

            {/* ── Sidebar: Map & Directions ── */}
            <div className="lg:col-span-5 space-y-8">
              {/* Map */}
              <Anim direction="right">
                <div className="glass rounded-3xl overflow-hidden border border-white/5 relative aspect-square lg:aspect-auto lg:h-[400px] shadow-2xl">
                  <iframe
                    title="SpinalKraft Location"
                    src="https://www.google.com/maps?q=SpinalKraft+Physiotherapy+Clinic+Greater+Noida&output=embed"
                    className="w-full h-full grayscale-[20%] opacity-80"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                  />
                  <div className="absolute top-6 left-6 right-6">
                    <div className="glass p-4 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md">
                      <p className="font-sans font-bold text-xs text-brand-gold uppercase tracking-widest mb-1">Our Location</p>
                      <p className="font-display font-bold text-white text-sm">Sector 4, Greater Noida West</p>
                    </div>
                  </div>
                </div>
              </Anim>

              {/* Directions */}
              <Anim direction="right" delay={0.1}>
                <div className="glass-green rounded-3xl p-8 border border-brand-green/10 shadow-2xl">
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-6 underline underline-offset-8 decoration-brand-green/20">How to Reach Us</h3>
                  <div className="space-y-6">
                    {[
                      { label: 'Primary Landmark', desc: "Galaxy Blue Sapphire Plaza ( Doctor's Chamber-28  Medicenter 3rd Floor), near Gaur city , Char Murti Chowk" },
                      { label: 'Public Transport', desc: 'Well connected via Gaur City and Greater Noida Link Road' },
                      { label: 'Parking', desc: 'Dedicated free basement and open parking available at the plaza' },
                    ].map(({ label, desc }) => (
                      <div key={label} className="group">
                        <p className="font-sans font-bold text-[10px] text-brand-green uppercase tracking-widest mb-1 transition-colors group-hover:text-brand-gold">{label}</p>
                        <p className="font-sans text-sm sm:text-base text-gray-400 leading-snug">{desc}</p>
                      </div>
                    ))}
                  </div>
                  <a
                    href="https://maps.google.com/?q=Spinalkraft+Physiotherapy+Greater+Noida+Sector+4"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline mt-8 w-full justify-center py-4 rounded-2xl"
                  >
                    📍 Open in Google Maps
                  </a>
                </div>
              </Anim>

              {/* Urgent Care */}
              <Anim direction="right" delay={0.2}>
                <div className="glass rounded-2xl p-6 border border-brand-gold/15 flex items-start gap-4 shadow-xl">
                  <div className="w-12 h-12 rounded-xl bg-brand-gold/10 flex items-center justify-center shrink-0">
                    <AlertCircle size={24} className="text-brand-gold" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-white text-lg mb-1">Need Urgent Help?</p>
                    <p className="font-sans text-sm text-gray-400 leading-snug mb-3">Our physiotherapists are available for immediate consultation 24/7.</p>
                    <a href="tel:08766304045" className="text-brand-gold font-bold hover:underline underline-offset-4">Call 08766304045 Now</a>
                  </div>
                </div>
              </Anim>
            </div>
          </div>
        </div>

      </main>
    </>
  )
}