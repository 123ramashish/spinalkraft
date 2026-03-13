'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion, Variants, MotionProps } from 'framer-motion'
import { ChevronRight, Target, Eye, Users, Award, Heart, Zap, Phone, ArrowRight } from 'lucide-react'
import { ReactNode } from 'react'

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
  const glowColor  = accentColor === 'gold' ? 'rgba(201,168,76,0.10)' : 'rgba(76,175,80,0.10)'

  return (
    <section className="relative pt-28 sm:pt-32 md:pt-40 pb-16 md:pb-24 overflow-hidden min-h-[38vh] flex flex-col justify-center">

      {/* Three.js scene layer */}
      {scene && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          {scene}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, rgba(5,10,14,0.55), rgba(5,10,14,0.70) 60%, rgba(5,10,14,0.92) 100%)' }}
          />
        </div>
      )}

      {/* Static gradient when no scene */}
      {!scene && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${glowColor}, transparent 65%)` }}
        />
      )}

      {/* Decorative blobs */}
      <div
        className="absolute -top-24 -right-24 w-64 h-64 md:w-96 md:h-96 rounded-full opacity-[0.04] pointer-events-none"
        style={{ background: accentColor === 'gold' ? '#C9A84C' : '#4CAF50' }}
      />
      <div
        className="absolute -bottom-12 -left-12 w-40 h-40 md:w-64 md:h-64 rounded-full opacity-[0.03] pointer-events-none"
        style={{ background: accentColor === 'gold' ? '#4CAF50' : '#C9A84C' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center w-full">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-1 sm:gap-1.5 mb-5 flex-wrap">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1 sm:gap-1.5">
              {i > 0 && <ChevronRight size={12} className="text-gray-600" />}
              {crumb.href ? (
                <Link href={crumb.href} className="text-xs sm:text-sm font-sans text-gray-500 hover:text-brand-gold transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-xs sm:text-sm font-sans text-brand-gold font-semibold">{crumb.label}</span>
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
          <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse flex-shrink-0" />
          {badge}
        </motion.div>

        {/* Title */}
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
          style={{ background: 'linear-gradient(90deg, #C9A84C, #4CAF50)' }}
        />
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. SpineScene  (was dynamically imported inside PageHeroWrapper)
// ─────────────────────────────────────────────────────────────────────────────

const SpineScene = dynamic(() => import('@/components/SpineScene'), { ssr: false })

// ─────────────────────────────────────────────────────────────────────────────
// 4. Page data
// ─────────────────────────────────────────────────────────────────────────────

const VALUES = [
  { icon: Users, title: 'Patient-Centered', desc: 'Every treatment plan is tailored to your individual needs, goals and lifestyle.',          color: '#C9A84C' },
  { icon: Award, title: 'Professional',     desc: 'BPT/MPT qualified therapists with years of specialized clinical experience.',              color: '#4CAF50' },
  { icon: Heart, title: 'Compassionate',    desc: 'We treat every patient with empathy and genuine care — healing requires both.',            color: '#C9A84C' },
  { icon: Zap,   title: 'Advanced Methods', desc: 'Evidence-based modern physiotherapy for faster, more durable recovery outcomes.',          color: '#4CAF50' },
]

const MILESTONES = [
  { value: '180+',   label: 'Patients Treated',   color: '#C9A84C' },
  { value: '4.9★',   label: 'Avg. Rating',         color: '#4CAF50' },
  { value: '10+',    label: 'Conditions Managed',  color: '#C9A84C' },
  { value: '7 Days', label: 'Weekly Availability', color: '#4CAF50' },
  { value: '₹500',   label: 'Consultation Fee',    color: '#C9A84C' },
  { value: '16h+',   label: 'Daily Open Hours',    color: '#4CAF50' },
]

const TRAITS = [
  'Certified Physiotherapists (BPT / MPT)',
  'Specialized in Spinal & Orthopedic Conditions',
  'Trained in Neurological Rehabilitation',
  'Sports Injury Management Experts',
  'Ongoing CPD & Advanced Training',
  'Patient-first approach in every session',
]

const BARS = [
  { label: 'Pain Reduction',       pct: 95 },
  { label: 'Mobility Improvement', pct: 92 },
  { label: 'Patient Satisfaction', pct: 98 },
  { label: 'Return to Activity',   pct: 88 },
]

// ─────────────────────────────────────────────────────────────────────────────
// 5. Default export — full About page
// ─────────────────────────────────────────────────────────────────────────────

export default function AboutClient() {
  return (
    <>
      {/* ── Hero (PageHeroWrapper + PageHero inlined) ── */}
      <PageHero
        badge="About SpinalKraft"
        title={<><span className="text-white">Who </span><span className="text-shimmer">We Are</span></>}
        subtitle="A trusted physiotherapy centre dedicated to helping patients recover from pain, injury and mobility issues — with evidence-based care and genuine compassion."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'About' }]}
        accentColor="gold"
        scene={
          <div style={{ position: 'absolute', inset: 0 }}>
            <SpineScene height="100%" />
          </div>
        }
      />

      <main>
        {/* ── Mission & Vision ── */}
        <section className="py-14 md:py-24" aria-labelledby="mission-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

              {/* Visual */}
              <Anim direction="left">
                <div className="relative max-w-xs sm:max-w-sm mx-auto lg:max-w-none">
                  <div className="glass-gold rounded-2xl sm:rounded-3xl p-8 sm:p-10 text-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.05]" style={{ background: 'linear-gradient(135deg,#C9A84C,#4CAF50)' }} />
                    <div className="relative w-20 sm:w-28 mx-auto mb-5">
                      {Array.from({ length: 14 }).map((_, i) => (
                        <div
                          key={i}
                          className="mx-auto mb-[3px] rounded"
                          style={{
                            height: 10,
                            width: i < 3 ? 52 : i < 7 ? 66 : i < 10 ? 54 : 42,
                            background:
                              i % 2 === 0
                                ? 'linear-gradient(90deg,rgba(201,168,76,.75),rgba(201,168,76,.3))'
                                : 'linear-gradient(90deg,rgba(76,175,80,.55),rgba(76,175,80,.25))',
                          }}
                        />
                      ))}
                    </div>
                    <p className="font-display text-xl sm:text-2xl font-bold text-shimmer mb-1">SpinalKraft</p>
                    <p className="font-sans text-sm text-gray-500 italic">Your Recovery, Our Priority</p>
                  </div>
                  <div className="absolute -top-3 sm:-top-4 -right-1 sm:-right-4 stat-card">
                    <p className="font-display font-bold text-xl sm:text-2xl text-brand-gold">4.9★</p>
                    <p className="text-[10px] sm:text-xs font-sans text-gray-400">Rating</p>
                  </div>
                  <div className="absolute -bottom-3 sm:-bottom-4 -left-1 sm:-left-4 stat-card">
                    <p className="font-display font-bold text-xl sm:text-2xl text-brand-green">180+</p>
                    <p className="text-[10px] sm:text-xs font-sans text-gray-400">Treated</p>
                  </div>
                </div>
              </Anim>

              {/* Text */}
              <div className="mt-6 lg:mt-0 space-y-5 sm:space-y-7">
                <Anim direction="right">
                  <div className="section-badge w-fit">Our Story</div>
                  <h2 id="mission-heading" className="font-display text-3xl sm:text-4xl font-bold text-white mb-3 mt-1">
                    Dedicated to Your <span className="text-brand-green">Wellbeing</span>
                  </h2>
                  <p className="text-gray-400 font-sans text-base sm:text-lg leading-relaxed">
                    SpinalKraft was founded to make expert, evidence-based physiotherapy accessible in Greater Noida. We treat root causes — not just symptoms.
                  </p>
                </Anim>

                {[
                  {
                    icon: Target, title: 'Our Mission', color: '#C9A84C',
                    desc: 'To deliver high-quality physiotherapy care that helps patients recover faster, move better and live pain-free lives through personalized treatment.',
                  },
                  {
                    icon: Eye, title: 'Our Vision', color: '#4CAF50',
                    desc: 'To become the most trusted physiotherapy clinic in Greater Noida, recognized for clinical excellence and compassionate care.',
                  },
                ].map(({ icon: Icon, title, color, desc }, i) => (
                  <Anim key={title} direction="right" delay={0.1 + i * 0.12}>
                    <div className="glass rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-white/5 hover:border-brand-gold/20 transition-all duration-300">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex-shrink-0 flex items-center justify-center"
                          style={{ background: `rgba(${color === '#C9A84C' ? '201,168,76' : '76,175,80'},.12)` }}
                        >
                          <Icon size={20} style={{ color }} />
                        </div>
                        <div>
                          <h3 className="font-display text-lg sm:text-xl font-bold text-white mb-1.5">{title}</h3>
                          <p className="font-sans text-gray-400 text-sm sm:text-base leading-relaxed">{desc}</p>
                        </div>
                      </div>
                    </div>
                  </Anim>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="divider mx-4 sm:mx-6" />

        {/* ── Milestones ── */}
        <section className="py-14 md:py-24" aria-labelledby="milestones-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <Anim className="text-center mb-10 md:mb-14">
              <div className="section-badge mx-auto w-fit">By The Numbers</div>
              <h2 id="milestones-heading" className="font-display text-3xl sm:text-4xl md:text-5xl font-bold">
                <span className="text-white">Our </span><span className="text-shimmer">Milestones</span>
              </h2>
            </Anim>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
              {MILESTONES.map(({ value, label, color }, i) => (
                <Anim key={label} direction="up" delay={i * 0.08}>
                  <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center border border-white/5 hover:border-brand-gold/20 transition-all duration-300 group">
                    <p className="font-display font-black text-2xl sm:text-3xl mb-1 group-hover:scale-105 transition-transform duration-300" style={{ color }}>
                      {value}
                    </p>
                    <p className="text-[11px] sm:text-xs font-sans text-gray-500">{label}</p>
                  </div>
                </Anim>
              ))}
            </div>
          </div>
        </section>

        <div className="divider mx-4 sm:mx-6" />

        {/* ── Values ── */}
        <section className="py-14 md:py-24" aria-labelledby="values-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <Anim className="text-center mb-10 md:mb-14">
              <div className="section-badge mx-auto w-fit">What Drives Us</div>
              <h2 id="values-heading" className="font-display text-3xl sm:text-4xl md:text-5xl font-bold">
                <span className="text-white">Our Core </span><span className="text-brand-green">Values</span>
              </h2>
            </Anim>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
              {VALUES.map(({ icon: Icon, title, desc, color }, i) => (
                <Anim key={title} direction="up" delay={i * 0.1}>
                  <div className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-7 border border-white/5 hover:border-brand-gold/20 transition-all duration-300 group text-center h-full">
                    <div
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                      style={{ background: `rgba(${color === '#C9A84C' ? '201,168,76' : '76,175,80'},.14)` }}
                    >
                      <Icon size={22} style={{ color }} />
                    </div>
                    <h3 className="font-display text-base sm:text-lg font-bold text-white mb-2">{title}</h3>
                    <p className="font-sans text-sm text-gray-400 leading-relaxed">{desc}</p>
                  </div>
                </Anim>
              ))}
            </div>
          </div>
        </section>

        <div className="divider mx-4 sm:mx-6" />

        {/* ── Team Expertise ── */}
        <section className="py-14 md:py-24" aria-labelledby="team-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
              <Anim direction="left">
                <div className="section-badge w-fit">Our Expertise</div>
                <h2 id="team-heading" className="font-display text-3xl sm:text-4xl font-bold text-white mt-2 mb-4 sm:mb-6">
                  Skilled, <span className="text-brand-gold">Certified</span> Therapists
                </h2>
                <p className="text-gray-400 font-sans text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
                  Our team holds BPT/MPT degrees with years of specialized clinical experience across spinal, neurological, sports and orthopedic physiotherapy.
                </p>
                <ul className="space-y-2.5 sm:space-y-3 mb-7 sm:mb-8" role="list">
                  {TRAITS.map((t, i) => (
                    <Anim key={t} direction="left" delay={i * 0.07}>
                      <li className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: i % 2 === 0 ? '#C9A84C' : '#4CAF50' }} />
                        <span className="font-sans text-gray-300 text-sm sm:text-base">{t}</span>
                      </li>
                    </Anim>
                  ))}
                </ul>
                <Link href="/contact" className="btn-brand shadow-gold w-full sm:w-auto inline-flex">
                  Meet Us in Clinic <ArrowRight size={15} />
                </Link>
              </Anim>

              <Anim direction="right">
                <div className="glass-green rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-brand-green/15 mt-6 lg:mt-0">
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-5 sm:mb-6">Why Patients Choose Us</h3>
                  <div className="space-y-4 sm:space-y-5">
                    {BARS.map(({ label, pct }, i) => (
                      <Anim key={label} direction="fade" delay={i * 0.1}>
                        <div>
                          <div className="flex justify-between mb-1.5">
                            <span className="font-sans text-sm text-gray-300">{label}</span>
                            <span className="font-sans font-bold text-sm text-brand-gold">{pct}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${pct}%`,
                                background: i % 2 === 0
                                  ? 'linear-gradient(90deg,#C9A84C,#E8C96A)'
                                  : 'linear-gradient(90deg,#388E3C,#4CAF50)',
                              }}
                            />
                          </div>
                        </div>
                      </Anim>
                    ))}
                  </div>
                  <div className="mt-7 pt-5 border-t border-white/5 text-center">
                    <p className="font-display text-4xl sm:text-5xl font-black text-shimmer">4.9★</p>
                    <p className="font-sans text-xs sm:text-sm text-gray-400 mt-1">From 180+ Patient Reviews</p>
                  </div>
                </div>
              </Anim>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="pb-14 md:pb-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <Anim direction="scale">
              <div className="glass-gold rounded-2xl sm:rounded-3xl p-7 sm:p-10 text-center relative overflow-hidden border border-brand-gold/15">
                <div className="absolute inset-0 opacity-[0.06]" style={{ background: 'linear-gradient(135deg,#C9A84C,#4CAF50)' }} />
                <div className="relative z-10">
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
                    Start Your <span className="text-shimmer">Recovery Journey</span>
                  </h2>
                  <p className="text-gray-400 font-sans text-sm sm:text-base mb-6 sm:mb-8 max-w-md mx-auto">
                    Book a ₹500 consultation and let our experts create your personalized treatment plan.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <a href="tel:+918128370332" className="btn-brand shadow-gold w-full sm:w-auto">
                      <Phone size={15} /> Call Now
                    </a>
                    <Link href="/services" className="btn-outline w-full sm:w-auto">Our Services</Link>
                  </div>
                </div>
              </div>
            </Anim>
          </div>
        </section>
      </main>
    </>
  )
}