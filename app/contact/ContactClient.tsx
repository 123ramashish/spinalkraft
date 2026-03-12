'use client'

import { useState, ChangeEvent, FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Phone, Clock, Star, Send, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import Anim from '@/components/Anim'

interface FormData {
  name: string; phone: string; email: string
  condition: string; message: string; preferredTime: string
}

const INITIAL: FormData = { name: '', phone: '', email: '', condition: '', message: '', preferredTime: '' }

const CONDITIONS = ['Back Pain','Neck Pain','Sciatica','Frozen Shoulder','Knee Pain','Slip Disc','Sports Injury','Paralysis / Stroke','Arthritis','Muscle Strain','Other']
const TIME_SLOTS = ['7:00 AM – 10:00 AM','10:00 AM – 1:00 PM','1:00 PM – 4:00 PM','4:00 PM – 7:00 PM','7:00 PM – 11:30 PM']

const INFO_CARDS = [
  { icon: Phone,   title: 'Call Us',       primary: '+91 81283 70332',             secondary: 'Consultation: ₹500/session',       color: '#C9A84C', link: 'tel:+918128370332' },
  { icon: MapPin,  title: 'Visit Us',      primary: 'Greater Noida Sector 4',      secondary: 'near Char Murti / Ek Murti',       color: '#4CAF50', link: 'https://maps.google.com/?q=Greater+Noida+Sector+4' },
  { icon: Clock,   title: 'Open Hours',    primary: 'Monday – Sunday',             secondary: '7:00 AM – 11:30 PM',               color: '#C9A84C' },
  { icon: Star,    title: 'Rating',        primary: '4.9★ Rating',                 secondary: '180+ happy patients',              color: '#4CAF50' },
]

type Status = 'idle' | 'sending' | 'success' | 'error'

export default function ContactClient() {
  const [form, setForm]     = useState<FormData>(INITIAL)
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Partial<FormData>>({})

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

  const inputCls = (hasError: boolean) =>
    `w-full bg-white/4 border rounded-xl px-4 py-3 font-sans text-sm text-white placeholder-gray-600 focus:outline-none transition-all duration-300 min-h-[44px] appearance-none ${
      hasError ? 'border-red-400/50 focus:border-red-400' : 'border-white/8 focus:border-brand-gold/50 focus:bg-white/6'
    }`

  return (
    <main className="pb-14 md:pb-24">
      {/* ── Info Cards ── */}
      <section className="py-10 md:py-16" aria-labelledby="contact-info-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 id="contact-info-heading" className="sr-only">Contact Information</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5 mb-10 md:mb-16">
            {INFO_CARDS.map(({ icon: Icon, title, primary, secondary, color, link }, i) => (
              <Anim key={title} direction="up" delay={i * 0.1}>
                <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-white/5 hover:border-brand-gold/20 transition-all duration-300 group h-full flex flex-col">
                  <div className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-lg sm:rounded-xl mb-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0"
                    style={{ background: `rgba(${color === '#C9A84C' ? '201,168,76' : '76,175,80'},.12)` }}>
                    <Icon size={16} style={{ color }} />
                  </div>
                  <p className="font-sans font-bold text-[10px] sm:text-xs uppercase tracking-wider text-gray-500 mb-1.5">{title}</p>
                  {link ? (
                    <a href={link} target={link.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                      className="font-display font-bold text-sm sm:text-base md:text-lg text-white hover:text-brand-gold transition-colors mb-1">
                      {primary}
                    </a>
                  ) : (
                    <p className="font-display font-bold text-sm sm:text-base md:text-lg text-white mb-1">{primary}</p>
                  )}
                  <p className="font-sans text-[11px] sm:text-sm text-gray-500 leading-snug">{secondary}</p>
                </div>
              </Anim>
            ))}
          </div>

          {/* ── Main Grid: Form + Map ── */}
          <div className="grid lg:grid-cols-2 gap-8 md:gap-10">

            {/* Form */}
            <Anim direction="left">
              <div className="glass-gold rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-10 border border-brand-gold/15 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 opacity-[0.04] pointer-events-none"
                  style={{ background: 'radial-gradient(circle,#C9A84C,transparent)', transform: 'translate(30%,-30%)' }} />
                <div className="relative z-10">
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-white mb-1">Book an Appointment</h2>
                  <p className="text-gray-500 font-sans text-xs sm:text-sm mb-6">Fill in your details and we'll confirm your slot.</p>

                  <AnimatePresence mode="wait">
                    {status === 'success' ? (
                      <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-12 sm:py-16 text-center"
                        role="alert" aria-live="polite">
                        <CheckCircle size={48} className="text-brand-green mb-4" />
                        <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-2">Appointment Requested!</h3>
                        <p className="text-gray-400 font-sans text-sm sm:text-base">
                          We'll call you shortly. For urgent care:{' '}
                          <a href="tel:+918128370332" className="text-brand-gold font-semibold">+91 81283 70332</a>
                        </p>
                      </motion.div>
                    ) : (
                      <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        onSubmit={handleSubmit} className="space-y-4" noValidate aria-label="Appointment booking form">

                        {/* Name + Phone */}
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs sm:text-sm font-sans text-gray-400 mb-1.5">Full Name *</label>
                            <input type="text" name="name" value={form.name} onChange={handleChange}
                              placeholder="Your full name" required className={inputCls(!!errors.name)} aria-required="true" />
                            {errors.name && <ErrMsg msg={errors.name} />}
                          </div>
                          <div>
                            <label className="block text-xs sm:text-sm font-sans text-gray-400 mb-1.5">Phone *</label>
                            <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                              placeholder="+91 XXXXX XXXXX" required className={inputCls(!!errors.phone)} aria-required="true" />
                            {errors.phone && <ErrMsg msg={errors.phone} />}
                          </div>
                        </div>

                        {/* Email */}
                        <div>
                          <label className="block text-xs sm:text-sm font-sans text-gray-400 mb-1.5">Email (optional)</label>
                          <input type="email" name="email" value={form.email} onChange={handleChange}
                            placeholder="you@email.com" className={inputCls(!!errors.email)} />
                          {errors.email && <ErrMsg msg={errors.email} />}
                        </div>

                        {/* Condition + Time */}
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs sm:text-sm font-sans text-gray-400 mb-1.5">Condition</label>
                            <select name="condition" value={form.condition} onChange={handleChange} className={inputCls(false)}>
                              <option value="">Select condition</option>
                              {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs sm:text-sm font-sans text-gray-400 mb-1.5">Preferred Time</label>
                            <select name="preferredTime" value={form.preferredTime} onChange={handleChange} className={inputCls(false)}>
                              <option value="">Any time</option>
                              {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                          </div>
                        </div>

                        {/* Message */}
                        <div>
                          <label className="block text-xs sm:text-sm font-sans text-gray-400 mb-1.5">Additional Details</label>
                          <textarea name="message" value={form.message} onChange={handleChange}
                            placeholder="Describe your pain, duration, any previous treatment..."
                            rows={4} className={`${inputCls(false)} resize-none`} />
                        </div>

                        {/* Submit */}
                        <motion.button type="submit" disabled={status === 'sending'}
                          whileHover={{ scale: status === 'sending' ? 1 : 1.02 }} whileTap={{ scale: 0.97 }}
                          className="btn-brand w-full justify-center shadow-gold disabled:opacity-60 disabled:cursor-not-allowed"
                          aria-busy={status === 'sending'}>
                          {status === 'sending' ? (
                            <><motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}>⏳</motion.span> Booking...</>
                          ) : (
                            <><Send size={14} /> Book Appointment — ₹500</>
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

            {/* Map + Directions */}
            <div className="space-y-5 sm:space-y-6">
              <Anim direction="right">
                <div className="glass rounded-xl sm:rounded-2xl overflow-hidden border border-white/5 relative" style={{ aspectRatio: '4/3' }}>
                  <iframe
                    title="SpinalKraft location map"
                    src="https://maps.google.com/maps?q=Sector+4,+Greater+Noida,+Uttar+Pradesh&output=embed&z=14"
                    className="w-full h-full"
                    style={{ border: 0, opacity: 0.75 }}
                    allowFullScreen loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4"
                    style={{ background: 'linear-gradient(to top,rgba(5,10,14,.9),transparent)' }}>
                    <p className="font-sans font-semibold text-white text-xs sm:text-sm">SpinalKraft Physiotherapy Clinic</p>
                    <p className="font-sans text-[10px] sm:text-xs text-gray-400">Sector 4, Greater Noida · near Char Murti / Ek Murti</p>
                  </div>
                </div>
              </Anim>

              <Anim direction="right" delay={0.1}>
                <div className="glass-green rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-brand-green/15">
                  <h3 className="font-display text-lg sm:text-xl font-bold text-white mb-4">Directions</h3>
                  <div className="space-y-3 sm:space-y-4">
                    {[
                      { label: 'From Delhi',   desc: 'DND Flyway → Greater Noida Expressway → Sector 4 (≈ 40 min)' },
                      { label: 'From Noida',   desc: 'Noida–Greater Noida Expressway → Sector 4 exit (≈ 20 min)' },
                      { label: 'Landmark',     desc: 'Near Char Murti Chowk / Ek Murti / Iteda Gol Chakkar' },
                    ].map(({ label, desc }) => (
                      <div key={label}>
                        <p className="font-sans font-bold text-[10px] sm:text-xs text-brand-green uppercase tracking-wider mb-1">{label}</p>
                        <p className="font-sans text-xs sm:text-sm text-gray-400 leading-relaxed">{desc}</p>
                      </div>
                    ))}
                  </div>
                  <a href="https://maps.google.com/?q=Spinalkraft+Physiotherapy+Greater+Noida+Sector+4"
                    target="_blank" rel="noopener noreferrer"
                    className="btn-outline mt-4 text-sm py-3 w-full justify-center block text-center">
                    📍 Open in Google Maps
                  </a>
                </div>
              </Anim>

              <Anim direction="right" delay={0.2}>
                <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-brand-gold/15 flex items-start gap-3">
                  <AlertCircle size={18} className="text-brand-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-sans font-semibold text-white text-sm mb-1">Need Urgent Care?</p>
                    <p className="font-sans text-xs sm:text-sm text-gray-400">
                      Call{' '}
                      <a href="tel:+918128370332" className="text-brand-gold font-semibold hover:underline">+91 81283 70332</a>
                      {' '}— Open 7 days, 7AM–11:30PM.
                    </p>
                  </div>
                </div>
              </Anim>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function ErrMsg({ msg }: { msg: string }) {
  return (
    <p className="mt-1 text-xs font-sans text-red-400 flex items-center gap-1" role="alert">
      <AlertCircle size={11} />{msg}
    </p>
  )
}
