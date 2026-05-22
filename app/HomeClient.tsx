'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ReactNode } from 'react'
import { motion, Variants, MotionProps } from 'framer-motion'
import {
  Phone, ChevronDown, Star, Clock, MapPin, ArrowRight,
  Bone, Activity, Brain, Dumbbell, Zap, HeartPulse, Home, CheckCircle2,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// 1. Anim
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
// 2. Three.js Hero Scene — loaded client-side only
// ─────────────────────────────────────────────────────────────────────────────

const HeroScene = dynamic(() => import('@/components/HeroScene'), { ssr: false })

// ─────────────────────────────────────────────────────────────────────────────
// 3. Page data
// ─────────────────────────────────────────────────────────────────────────────

const STATS = [
  { icon: Star,   value: '5.0★',    label: '500+ Reviews' ,url:"" },
  { icon: Clock,  value: '24h/day', label: 'Open Daily' ,url:""   },
  { icon: MapPin, value: 'Greater Noida West', label: 'Sector 4', url:'https://www.google.com/maps/place/SpinalKraft+Physiotherapy+Clinic/@28.6070951,77.4324067,815m/data=!3m2!1e3!4b1!4m6!3m5!1s0x390cefb08541b083:0x3ae67d116f9e3324!8m2!3d28.6070951!4d77.4349816!16s%2Fg%2F11mcc2kvkk?entry=ttu&g_ep=EgoyMDI2MDMxMS4wIKXMDSoASAFQAw%3D%3D' },
  { icon: Phone,  value: '₹500',    label: 'Consultation' ,url:"" },
] as const

const SERVICES = [
  { icon: Bone,       title: 'Orthopedics Physiotherapy',  color: '#C9A84C', href: '/services#spinal'      },
  { icon: Activity,   title: 'Sports Injury Physiotherapy',   color: '#4CAF50', href: '/services#sports'      },
  { icon: Brain,      title: 'Neurological Physiotherapy',    color: '#C9A84C', href: '/services#neuro'       },
  { icon: Dumbbell,   title: 'Cardiopulmonay Physiotherapy',      color: '#4CAF50', href: '/services#ortho'       },
  { icon: Zap,        title: 'Geriatric & Pediactric Physiotherapy', color: '#C9A84C', href: '/services#pain'        },
  { icon: HeartPulse, title: 'Womens Health Physiotherapy',    color: '#4CAF50', href: '/services#postsurgery' },
  { icon: Home,       title: 'Workplace & Ergonomic Physiotherapy',     color: '#C9A84C', href: '/services#home'        },
  { icon: Home,       title: 'Oncology Physiotherapy',     color: '#C9A84C', href: '/services#home'        },
] as const

const WHY = [
  'Experienced & certified physiotherapists',
  'Personalised treatment plans',
  'Modern therapy equipment',
  'Fast pain relief techniques',
  'Affordable ₹500 consultation',
  'Open 7 days, 24 Hrs/day',
] as const

const AVATAR_COLORS   = ['#C9A84C', '#4CAF50', '#A8872F', '#388E3C', '#E8C96A'] as const
const AVATAR_INITIALS = ['R', 'A', 'S', 'M', 'P'] as const

// ─────────────────────────────────────────────────────────────────────────────
// 4. Default export
// ─────────────────────────────────────────────────────────────────────────────

export default function HomeClient() {
  return (
    <main id="main-content">

      {/* ════ HERO ════ */}
      <section
        id="hero"
        className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden"
        aria-label="Welcome to SpinalKraft Physiotherapy"
      >
        {/* ── Three.js background ── */}
        <div className="absolute inset-0 w-full h-full" aria-hidden="true">
          <HeroScene />
        </div>

        {/* Gradient overlays */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              'linear-gradient(to bottom right, rgba(3,10,16,0.92) 0%, rgba(3,10,16,0.85) 50%, rgba(3,10,16,0.80) 100%)',
          }}
        />

        {/* ── All foreground content ── */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Text column */}
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="section-badge mx-auto lg:mx-0 w-fit mb-5"
              >
                <span
                  className="w-2 h-2 rounded-full bg-brand-green animate-pulse flex-shrink-0"
                  aria-hidden="true"
                />
                Greater Noida's , Noida & Delhi Premier Physiotherapy
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.1 }}
                className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6"
              >
                <span className="text-white">Your</span>{' '}
                <span className="text-shimmer">Recovery</span>
                <br className="hidden sm:block" />
                <span className="text-white">Our</span>{' '}
                <span className="text-brand-green">Priority</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.22 }}
                className="text-gray-400 font-serif text-base sm:text-lg leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0"
              >
                Expert Physiotherapy for Orthopedics Condition , Spinal Condition , Neurological Condition , Sports Injuries , Cardiopulmonary Condition , Geriatric & Pediatric Care , Women's Health Physiotherapy , Workplace & Ergonomic Physiotherapy , Oncology Physiotherapy — Personalised for you.
              </motion.p>

              {/* CTA buttons */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.32 }}
                className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8"
              >
                <a
                  href="tel:08766304045"
                  className="btn-brand shadow-gold w-full sm:w-auto min-h-[48px]"
                  aria-label="Call SpinalKraft to book appointment"
                >
                  <Phone size={15} aria-hidden="true" /> Book Appointment
                </a>
                <Link href="/services" className="btn-outline w-full sm:w-auto min-h-[48px]">
                  Explore Services <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </motion.div>

              {/* Social proof avatars */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-3 justify-center lg:justify-start"
              >
                <div className="flex -space-x-2" aria-hidden="true">
                  {AVATAR_COLORS.map((c, i) => (
                    <div
                      key={i}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-ink-900 flex items-center justify-center text-[9px] font-bold text-ink-900 flex-shrink-0"
                      style={{ background: c }}
                    >
                      {AVATAR_INITIALS[i]}
                    </div>
                  ))}
                </div>
                <p className="text-xs sm:text-sm font-sans text-gray-400">
                  <span className="text-brand-gold font-semibold">10000+</span> patients recovered
                </p>
              </motion.div>
            </div>

            {/* Stats grid — 2×2 mobile, 4 columns large if enough space, but keep 2x2 for visual balance if preferred */}
            <div className="grid grid-cols-2 gap-3 sm:gap-5 w-full">
              {STATS.map(({ icon: Icon, value, label, url }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0.85, y: 24 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="stat-card flex flex-col justify-center min-h-[120px] sm:min-h-[140px]"
                >
                  <div
                    className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center"
                    style={{
                      background:
                        'linear-gradient(135deg,rgba(201,168,76,.18),rgba(76,175,80,.18))',
                    }}
                  >
                    <Icon size={18} className="text-brand-gold" aria-hidden="true" />
                  </div>
                  {url ? (
                    <a href={url} target="_blank" rel="noopener noreferrer" className="font-display font-bold text-sm sm:text-base md:text-lg text-white leading-tight hover:text-brand-gold transition-colors">
                      {value}
                    </a>
                  ) : (
                    <p className="font-display font-bold text-sm sm:text-base md:text-lg text-white leading-tight">
                      {value}
                    </p>
                  )}
                  <p className="text-[10px] sm:text-xs font-sans text-gray-500 mt-1 uppercase tracking-wider">{label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="relative z-10 text-center pb-6 text-[9px] sm:text-[10px] tracking-[0.3em] uppercase font-sans text-brand-gold/60 px-4"
          aria-hidden="true"
        >
          — Your Recovery, Our Priority —
        </motion.p>

        {/* Scroll cue */}
        <motion.button
          onClick={() =>
            document.getElementById('services-preview')?.scrollIntoView({ behavior: 'smooth' })
          }
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-gray-500 hover:text-brand-gold transition-colors p-2"
          aria-label="Scroll to services"
        >
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
            <ChevronDown size={20} aria-hidden="true" />
          </motion.div>
        </motion.button>
      </section>

      {/* ════ SERVICES PREVIEW ════ */}
      <section id="services-preview" className="section-py relative" aria-labelledby="services-heading">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 80% 50%,rgba(76,175,80,.05),transparent 60%)',
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <Anim className="text-center mb-12 md:mb-16">
            <div className="section-badge mx-auto w-fit">Our Specialties</div>
            <h2
              id="services-heading"
              className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            >
              <span className="text-white">What We </span>
              <span className="text-brand-green">Treat</span>
            </h2>
            <p className="text-gray-400 font-sans text-base sm:text-lg max-w-2xl mx-auto">
              Comprehensive physiotherapy for faster recovery and lasting relief.
            </p>
          </Anim>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-12">
            {SERVICES.map(({ icon: Icon, title, color, href }, i) => {
              const rgb = color === '#C9A84C' ? '201,168,76' : '76,175,80'
              return (
                <Anim key={title} direction="up" delay={i * 0.07}>
                  <Link
                    href={href}
                    className="glass rounded-xl sm:rounded-2xl p-5 sm:p-7 text-center border border-white/5 hover:border-brand-gold/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold transition-all duration-300 group block h-full"
                    aria-label={`View ${title} service`}
                  >
                    <div
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl mx-auto mb-4 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                      style={{ background: `rgba(${rgb},.12)` }}
                    >
                      <Icon size={24} style={{ color }} aria-hidden="true" />
                    </div>
                    <p className="font-sans font-bold text-xs sm:text-sm text-white group-hover:text-brand-gold transition-colors leading-snug">
                      {title}
                    </p>
                  </Link>
                </Anim>
              )
            })}
          </div>

          <Anim className="text-center">
            <Link href="/services" className="btn-outline w-full sm:w-auto inline-flex min-h-[52px]">
              View All Services <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </Anim>
        </div>
      </section>

      <div className="divider mx-4 sm:mx-6" aria-hidden="true" />

      {/* ════ WHY CHOOSE US ════ */}
      <section className="section-py relative" aria-labelledby="why-heading">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 20% 50%,rgba(201,168,76,.04),transparent 60%)',
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Text */}
            <div className="order-2 lg:order-1">
              <Anim>
                <div className="section-badge w-fit mb-4">Why Choose Us</div>
                <h2
                  id="why-heading"
                  className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6"
                >
                  <span className="text-white">Committed to Your</span>
                  <br />
                  <span className="text-shimmer">Complete Recovery</span>
                </h2>
                <p className="text-gray-400 font-sans text-base sm:text-lg leading-relaxed mb-8">
                  At SpinalKraft, we go beyond symptoms — we find root causes and provide
                  lasting solutions with expertise and care.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 mb-10" role="list">
                  {WHY.map((item, i) => (
                    <Anim key={item} direction="left" delay={i * 0.08}>
                      <li className="flex items-start gap-3">
                        <CheckCircle2
                          size={18}
                          className="text-brand-green flex-shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span className="font-sans text-gray-300 text-sm sm:text-base leading-snug">
                          {item}
                        </span>
                      </li>
                    </Anim>
                  ))}
                </ul>
                <Link href="/about" className="btn-brand shadow-gold w-full sm:w-auto inline-flex min-h-[52px]">
                  Learn More About Us <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </Anim>
            </div>

            {/* Spine visual card */}
            <div className="order-1 lg:order-2">
              <Anim direction="right">
                <div className="relative max-w-xs sm:max-w-sm mx-auto lg:max-w-md">
                  <div className="glass-gold rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden border border-brand-gold/10">
                    <div
                      className="absolute inset-0 opacity-[0.05]"
                      aria-hidden="true"
                      style={{ background: 'linear-gradient(135deg,#C9A84C,#4CAF50)' }}
                    />
                    <div className="relative w-24 sm:w-32 mx-auto mb-8" aria-hidden="true">
                      {Array.from({ length: 14 }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: i * 0.05 }}
                          className="mx-auto mb-[4px] rounded"
                          style={{
                            height: 12,
                            width: i < 3 ? 60 : i < 7 ? 80 : i < 10 ? 65 : 50,
                            background:
                              i % 2 === 0
                                ? 'linear-gradient(90deg,rgba(201,168,76,.85),rgba(201,168,76,.4))'
                                : 'linear-gradient(90deg,rgba(76,175,80,.65),rgba(76,175,80,.35))',
                          }}
                        />
                      ))}
                    </div>
                    <p className="font-display text-xl sm:text-2xl font-bold text-shimmer mb-2">
                      Spinal Wellness
                    </p>
                    <p className="font-sans text-sm text-gray-500 italic">Precision care for your spine</p>
                  </div>

                  <motion.div
                    animate={{ y: [-6, 6, -6] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -top-6 -right-4 sm:-right-8 stat-card px-5 py-4 shadow-xl"
                    aria-hidden="true"
                  >
                    <p className="font-display font-bold text-2xl sm:text-3xl text-brand-gold">5.0★</p>
                    <p className="text-[10px] sm:text-xs text-gray-400 font-sans uppercase font-bold tracking-widest mt-1">Rating</p>
                  </motion.div>

                  <motion.div
                    animate={{ y: [6, -6, 6] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -bottom-6 -left-4 sm:-left-8 stat-card px-5 py-4 shadow-xl"
                    aria-hidden="true"
                  >
                    <p className="font-display font-bold text-2xl sm:text-3xl text-brand-green">10000+</p>
                    <p className="text-[10px] sm:text-xs text-gray-400 font-sans uppercase font-bold tracking-widest mt-1">Patients</p>
                  </motion.div>
                </div>
              </Anim>
            </div>
          </div>
        </div>
      </section>

      <div className="divider mx-4 sm:mx-6" aria-hidden="true" />

      {/* ════ CTA ════ */}
      <section className="section-py" aria-labelledby="cta-heading">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <Anim direction="scale">
            <div className="glass-gold rounded-2xl sm:rounded-3xl p-8 sm:p-12 md:p-16 text-center relative overflow-hidden border border-brand-gold/20 shadow-2xl">
              <div
                className="absolute inset-0 opacity-[0.08]"
                aria-hidden="true"
                style={{ background: 'linear-gradient(135deg,#C9A84C,#4CAF50)' }}
              />
              <div className="relative z-10">
                <h2
                  id="cta-heading"
                  className="font-display text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-4"
                >
                  Ready to Live <span className="text-shimmer">Pain-Free?</span>
                </h2>
                <p className="text-gray-400 font-sans text-base sm:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
                  Take the first step today. Our expert physiotherapists are ready to help you
                  recover and reclaim your life.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <a
                    href="tel:08766304045"
                    className="btn-brand shadow-gold w-full sm:w-auto min-h-[56px] px-8 text-base"
                    aria-label="Call SpinalKraft: 08766304045"
                  >
                    <Phone size={20} aria-hidden="true" /> Call Now: 08766304045
                  </a>
                  <Link href="/contact" className="btn-outline w-full sm:w-auto min-h-[56px] px-8 text-base">
                    Book Online Now
                  </Link>
                </div>
                <p className="mt-8 text-xs sm:text-sm text-gray-500 font-sans uppercase tracking-[0.2em]">
                  Consultation Fee:{' '}
                  <span className="text-brand-gold font-bold">₹500</span> · Open 24/7
                </p>
              </div>
            </div>
          </Anim>
        </div>
      </section>

    </main>
  )
}