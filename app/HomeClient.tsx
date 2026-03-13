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
// 2. Three.js Hero Scene (was @/components/HeroScene)
// ─────────────────────────────────────────────────────────────────────────────

const HeroScene = dynamic(() => import('@/components/HeroScene'), { ssr: false })

// ─────────────────────────────────────────────────────────────────────────────
// 3. Page data
// ─────────────────────────────────────────────────────────────────────────────

const STATS = [
  { icon: Star,   value: '4.9★',    label: '180+ Reviews'  },
  { icon: Clock,  value: '16h/day', label: 'Open Daily'    },
  { icon: MapPin, value: 'Sector 4',label: 'Greater Noida' },
  { icon: Phone,  value: '₹500',    label: 'Consultation'  },
] as const

const SERVICES = [
  { icon: Bone,       title: 'Spinal Therapy',  color: '#C9A84C', href: '/services#spinal'      },
  { icon: Activity,   title: 'Sports Injury',   color: '#4CAF50', href: '/services#sports'      },
  { icon: Brain,      title: 'Neurological',    color: '#C9A84C', href: '/services#neuro'       },
  { icon: Dumbbell,   title: 'Orthopedic',      color: '#4CAF50', href: '/services#ortho'       },
  { icon: Zap,        title: 'Pain Management', color: '#C9A84C', href: '/services#pain'        },
  { icon: HeartPulse, title: 'Post-Surgery',    color: '#4CAF50', href: '/services#postsurgery' },
  { icon: Home,       title: 'Home Physio',     color: '#C9A84C', href: '/services#home'        },
] as const

const WHY = [
  'Experienced & certified physiotherapists',
  'Personalised treatment plans',
  'Modern therapy equipment',
  'Fast pain relief techniques',
  'Affordable ₹500 consultation',
  'Open 7 days, 7AM – 11:30PM',
] as const

const AVATAR_COLORS = ['#C9A84C', '#4CAF50', '#A8872F', '#388E3C', '#E8C96A'] as const
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
        {/* Three.js body-parts background */}
        <HeroScene />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-ink-950/90 via-ink-900/80 to-ink-900/70 pointer-events-none" aria-hidden="true" />
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(76,175,80,0.07), transparent 65%)' }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

            {/* Text column */}
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="section-badge mx-auto lg:mx-0 w-fit mb-5"
              >
                <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse flex-shrink-0" aria-hidden="true" />
                Greater Noida's Premier Physiotherapy
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.1 }}
                className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.08] mb-5"
              >
                <span className="text-white">Restore</span>{' '}
                <span className="text-shimmer">Movement.</span>
                <br />
                <span className="text-white">Relieve</span>{' '}
                <span className="text-brand-green">Pain.</span>
                <br />
                <span className="text-white/85 text-2xl sm:text-3xl md:text-4xl font-semibold italic">
                  Reclaim Your Life.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.22 }}
                className="text-gray-400 font-sans text-base sm:text-lg leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0"
              >
                Expert physiotherapy for spinal disorders, sports injuries, neurological conditions and chronic pain — personalised to you.
              </motion.p>

              {/* CTA buttons */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.32 }}
                className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-6"
              >
                <a
                  href="tel:+918128370332"
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
                  <span className="text-brand-gold font-semibold">180+</span> patients recovered
                </p>
              </motion.div>
            </div>

            {/* Stats grid — 2×2 */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-xs sm:max-w-sm mx-auto lg:max-w-none w-full">
              {STATS.map(({ icon: Icon, value, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0.85, y: 24 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="stat-card"
                >
                  <div
                    className="w-9 h-9 rounded-xl mx-auto mb-2.5 flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg,rgba(201,168,76,.18),rgba(76,175,80,.18))' }}
                  >
                    <Icon size={16} className="text-brand-gold" aria-hidden="true" />
                  </div>
                  <p className="font-display font-bold text-base sm:text-lg text-white leading-tight">{value}</p>
                  <p className="text-[11px] font-sans text-gray-500 mt-0.5">{label}</p>
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
          className="relative z-10 text-center pb-4 text-[10px] tracking-[0.25em] uppercase font-sans text-brand-gold/60 px-4"
          aria-hidden="true"
        >
          — Your Recovery, Our Priority —
        </motion.p>

        {/* Scroll cue */}
        <motion.button
          onClick={() => document.getElementById('services-preview')?.scrollIntoView({ behavior: 'smooth' })}
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
      <section id="services-preview" className="py-16 md:py-24 relative" aria-labelledby="services-heading">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 80% 50%,rgba(76,175,80,.05),transparent 60%)' }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <Anim className="text-center mb-10 md:mb-14">
            <div className="section-badge mx-auto w-fit">Our Specialties</div>
            <h2
              id="services-heading"
              className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-3"
            >
              <span className="text-white">What We </span>
              <span className="text-brand-green">Treat</span>
            </h2>
            <p className="text-gray-400 font-sans text-base sm:text-lg max-w-xl mx-auto">
              Comprehensive physiotherapy for faster recovery and lasting relief.
            </p>
          </Anim>

          {/* 2-col mobile → 3-col sm → 4-col lg */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 mb-10">
            {SERVICES.map(({ icon: Icon, title, color, href }, i) => {
              const rgb = color === '#C9A84C' ? '201,168,76' : '76,175,80'
              return (
                <Anim key={title} direction="up" delay={i * 0.07}>
                  <Link
                    href={href}
                    className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center border border-white/5 hover:border-brand-gold/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold transition-all duration-300 group block h-full"
                    aria-label={`View ${title} service`}
                  >
                    <div
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl mx-auto mb-2.5 sm:mb-3 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                      style={{ background: `rgba(${rgb},.12)` }}
                    >
                      <Icon size={18} style={{ color }} aria-hidden="true" />
                    </div>
                    <p className="font-sans font-semibold text-xs sm:text-sm text-white group-hover:text-brand-gold transition-colors leading-tight">
                      {title}
                    </p>
                  </Link>
                </Anim>
              )
            })}
          </div>

          <Anim className="text-center">
            <Link href="/services" className="btn-outline w-full sm:w-auto inline-flex min-h-[48px]">
              View All Services <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </Anim>
        </div>
      </section>

      <div className="divider mx-4 sm:mx-6" aria-hidden="true" />

      {/* ════ WHY CHOOSE US ════ */}
      <section className="py-16 md:py-24 relative" aria-labelledby="why-heading">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 20% 50%,rgba(201,168,76,.04),transparent 60%)' }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Text */}
            <div>
              <Anim>
                <div className="section-badge w-fit mb-3">Why Choose Us</div>
                <h2
                  id="why-heading"
                  className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4 sm:mb-6"
                >
                  <span className="text-white">Committed to Your</span><br />
                  <span className="text-shimmer">Complete Recovery</span>
                </h2>
                <p className="text-gray-400 font-sans text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
                  At SpinalKraft, we go beyond symptoms — we find root causes and provide lasting solutions with expertise and care.
                </p>
                <ul className="space-y-2.5 sm:space-y-3 mb-8 sm:mb-10" role="list">
                  {WHY.map((item, i) => (
                    <Anim key={item} direction="left" delay={i * 0.08}>
                      <li className="flex items-center gap-3">
                        <CheckCircle2 size={16} className="text-brand-green flex-shrink-0" aria-hidden="true" />
                        <span className="font-sans text-gray-300 text-sm sm:text-base">{item}</span>
                      </li>
                    </Anim>
                  ))}
                </ul>
                <Link href="/about" className="btn-brand shadow-gold w-full sm:w-auto inline-flex min-h-[48px]">
                  Learn More <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </Anim>
            </div>

            {/* Spine visual card */}
            <Anim direction="right">
              <div className="relative max-w-xs sm:max-w-sm mx-auto lg:max-w-none">
                <div className="glass-gold rounded-2xl sm:rounded-3xl p-8 sm:p-10 text-center relative overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-[0.05]"
                    aria-hidden="true"
                    style={{ background: 'linear-gradient(135deg,#C9A84C,#4CAF50)' }}
                  />
                  {/* Animated vertebrae bars */}
                  <div className="relative w-20 sm:w-24 mx-auto mb-5" aria-hidden="true">
                    {Array.from({ length: 14 }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                        className="mx-auto mb-[3px] rounded"
                        style={{
                          height: 10,
                          width: i < 3 ? 50 : i < 7 ? 62 : i < 10 ? 52 : 40,
                          background:
                            i % 2 === 0
                              ? 'linear-gradient(90deg,rgba(201,168,76,.75),rgba(201,168,76,.3))'
                              : 'linear-gradient(90deg,rgba(76,175,80,.55),rgba(76,175,80,.25))',
                        }}
                      />
                    ))}
                  </div>
                  <p className="font-display text-lg sm:text-xl font-semibold text-shimmer mb-1">Spinal Wellness</p>
                  <p className="font-sans text-sm text-gray-500">Precision care for your spine</p>
                </div>

                {/* Floating stat badges */}
                <motion.div
                  animate={{ y: [-4, 5, -4] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-4 -right-2 sm:-right-5 stat-card"
                  aria-hidden="true"
                >
                  <p className="font-display font-bold text-xl sm:text-2xl text-brand-gold">4.9★</p>
                  <p className="text-[10px] sm:text-xs text-gray-400 font-sans">Rating</p>
                </motion.div>

                <motion.div
                  animate={{ y: [5, -4, 5] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -bottom-4 -left-2 sm:-left-5 stat-card"
                  aria-hidden="true"
                >
                  <p className="font-display font-bold text-xl sm:text-2xl text-brand-green">180+</p>
                  <p className="text-[10px] sm:text-xs text-gray-400 font-sans">Patients</p>
                </motion.div>
              </div>
            </Anim>
          </div>
        </div>
      </section>

      <div className="divider mx-4 sm:mx-6" aria-hidden="true" />

      {/* ════ CTA ════ */}
      <section className="py-14 md:py-20" aria-labelledby="cta-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Anim direction="scale">
            <div className="glass-gold rounded-2xl sm:rounded-3xl p-7 sm:p-10 md:p-14 text-center relative overflow-hidden border border-brand-gold/15">
              <div
                className="absolute inset-0 opacity-[0.06]"
                aria-hidden="true"
                style={{ background: 'linear-gradient(135deg,#C9A84C,#4CAF50)' }}
              />
              <div className="relative z-10">
                <h2
                  id="cta-heading"
                  className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3"
                >
                  Ready to Live <span className="text-shimmer">Pain-Free?</span>
                </h2>
                <p className="text-gray-400 font-sans text-sm sm:text-base sm:text-lg mb-6 sm:mb-8 max-w-xl mx-auto">
                  Take the first step today. Our expert physiotherapists are ready to help you recover and reclaim your life.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="tel:+918128370332"
                    className="btn-brand shadow-gold w-full sm:w-auto min-h-[48px]"
                    aria-label="Call SpinalKraft: +91 81283 70332"
                  >
                    <Phone size={15} aria-hidden="true" /> Call: +91 81283 70332
                  </a>
                  <Link href="/contact" className="btn-outline w-full sm:w-auto min-h-[48px]">
                    Book Online
                  </Link>
                </div>
                <p className="mt-4 text-xs sm:text-sm text-gray-500 font-sans">
                  Consultation: <span className="text-brand-gold font-semibold">₹500</span> · Open 7 days a week
                </p>
              </div>
            </div>
          </Anim>
        </div>
      </section>

    </main>
  )
}