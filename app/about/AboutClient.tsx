'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion, Variants, MotionProps } from 'framer-motion'
import { ChevronRight, Target, Eye, Users, Award, Heart, Zap, Phone, ArrowRight } from 'lucide-react'
import { ReactNode } from 'react'
import Image from 'next/image'
import logo from '../../components/images/logo.png'

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
        style={{ background: accentColor === 'gold' ? '#C9A84C' : '#4CAF50' }} />
      <div
        className="absolute -bottom-12 -left-12 w-40 h-40 md:w-64 md:h-64 rounded-full opacity-[0.03] pointer-events-none"
        style={{ background: accentColor === 'gold' ? '#4CAF50' : '#C9A84C' }} />

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
  { icon: Award, title: 'Professional',     desc: "PhD/MPT/BPT qualified Doctor's with years of specialized clinical experience.",              color: '#4CAF50' },
  { icon: Heart, title: 'Compassionate',    desc: 'We treat every patient with empathy and genuine care — healing requires both.',            color: '#C9A84C' },
  { icon: Zap,   title: 'Advanced Methods', desc: 'Evidence-based modern physiotherapy for faster, more durable recovery outcomes.',          color: '#4CAF50' },
]

const MILESTONES = [
  { value: '10000+',   label: 'Patients Treated',   color: '#C9A84C' },
  { value: '5.0★',   label: 'Avg. Rating',         color: '#4CAF50' },
  { value: '100+',    label: 'Conditions Managed',  color: '#C9A84C' },
  { value: '24*7', label: 'Weekly Availability', color: '#4CAF50' },
  { value: '₹500',   label: 'Consultation Fee',    color: '#C9A84C' },
  { value: '24h',   label: 'Daily Open Hours',    color: '#4CAF50' },
]

const TRAITS = [
  "Certified Physiotherapists Doctor's (PhD / MPT / BPT)",
  'Specialized in Orthopedic & Spinal Conditions',
  'Trained in Neurological Rehabilitation',
  'Sports Injury Management Experts',
  'Ongoing CPD & Advanced Training',
  'Patient-first approach in every session',
]

const BARS = [
  { label: 'Pain Reduction',       pct: 95 },
  { label: 'Mobility Improvement', pct: 92 },
  { label: 'Patient Satisfaction', pct: 98 },
  { label: 'Return to Activity',   pct: 95 },
]

// ─────────────────────────────────────────────────────────────────────────────
// 5. Default export — full About page
// ─────────────────────────────────────────────────────────────────────────────

export default function AboutClient() {
  return (
    <>
      <PageHero
        badge="About SpinalKraft"
        title={<><span className="text-white">Who </span><span className="text-shimmer">We Are</span></>}
        subtitle="Spinalkraft Physiotherapy Clinic — A centre dedicated to restoring movement, relieving pain, and improving quality of life through advanced and personalised physiotherapy care. With a patient-first approach and evidence-based treatment methods, we strive to help every individual regain strength, confidence, and independence in their daily life."
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
        <section className="section-py" aria-labelledby="mission-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

              {/* Visual */}
              <Anim direction="left" className="order-2 lg:order-1">
                <div className="relative max-w-xs sm:max-w-sm mx-auto lg:max-w-none">
                  <div className="glass-gold rounded-3xl p-10 sm:p-12 text-center relative overflow-hidden border border-brand-gold/10">
                    <div className="absolute inset-0 opacity-[0.05]" style={{ background: 'linear-gradient(135deg,#C9A84C,#4CAF50)' }} />

               
                    <div className="relative w-24 sm:w-32 mx-auto mb-8">
                      {Array.from({ length: 14 }).map((_, i) => (
                        <div
                          key={i}
                          className="mx-auto mb-[4px] rounded"
                          style={{
                            height: 12,
                            width: i < 3 ? 60 : i < 7 ? 80 : i < 10 ? 65 : 50,
                            background:
                              i % 2 === 0
                                ? 'linear-gradient(90deg,rgba(201,168,76,.75),rgba(201,168,76,.3))'
                                : 'linear-gradient(90deg,rgba(76,175,80,.55),rgba(76,175,80,.25))',
                          }}
                        />
                      ))}
                    </div>
                    <p className="font-display text-xl sm:text-2xl font-bold text-shimmer mb-2">SpinalKraft</p>
                    <p className="font-sans text-sm text-gray-500 italic uppercase tracking-widest">Your Recovery, Our Priority</p>
                  </div>
                  <div className="absolute -top-4 -right-2 sm:-right-6 stat-card shadow-xl">
                    <p className="font-display font-bold text-xl sm:text-2xl text-brand-gold leading-none">5.0★</p>
                    <p className="text-[9px] sm:text-[10px] text-gray-500 font-sans uppercase font-bold tracking-widest mt-1">Rating</p>
                  </div>
                  <div className="absolute -bottom-4 -left-2 sm:-left-6 stat-card shadow-xl">
                    <p className="font-display font-bold text-xl sm:text-2xl text-brand-green leading-none">10000+</p>
                    <p className="text-[9px] sm:text-[10px] font-sans text-gray-500 uppercase font-bold tracking-widest mt-1">Treated</p>
                  </div>
                </div>
              </Anim>

              {/* Text */}
              <div className="order-1 lg:order-2 space-y-8 sm:space-y-10">
                <Anim direction="right">
                  <div className="section-badge w-fit mb-4">Our Story</div>
                  <h2 id="mission-heading" className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
                    Dedicated to Your <span className="text-brand-green underline decoration-brand-green/20 underline-offset-8">Wellbeing</span>
                  </h2>
                  <p className="text-gray-400 font-sans text-base sm:text-lg leading-relaxed mt-6">
                    SpinalKraft was founded to make expert, evidence-based physiotherapy accessible in Greater Noida , Noida & Delhi. We treat root causes — not just symptoms.
                  </p>
                </Anim>

                <div className="space-y-4 sm:space-y-6">
                  {[
                    {
                      icon: Target, title: 'Our Mission', color: '#C9A84C',
                      desc: 'Spinalkraft Physiotherapy Clinic was founded with a passion for healing and restoring better movement in people’s lives. We combine expert physiotherapy care with a personalised approach to help every patient recover with confidence, our focus is always on long-term wellness and quality care. At Spinalkraft, every recovery journey is guided with compassion, professionalism, and dedication.',
                    },
                    {
                      icon: Eye, title: 'Our Vision', color: '#4CAF50',
                      desc: 'To become the most trusted physiotherapy clinic in Greater Noida, Noida & Delhi, recognized for clinical excellence and compassionate care.',
                    },
                  ].map(({ icon: Icon, title, color, desc }, i) => (
                    <Anim key={title} direction="right" delay={0.1 + i * 0.12}>
                      <div className="glass rounded-2xl p-6 sm:p-8 border border-white/5 hover:border-brand-gold/20 transition-all duration-500 group">
                        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                          <div
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex-shrink-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
                            style={{ background: `rgba(${color === '#C9A84C' ? '201,168,76' : '76,175,80'},.12)` }}
                          >
                            <Icon size={24} style={{ color }} />
                          </div>
                          <div>
                            <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-2">{title}</h3>
                            <p className="font-sans text-gray-400 text-sm sm:text-base leading-relaxed">{desc}</p>
                          </div>
                        </div>
                      </div>
                    </Anim>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="divider mx-4 sm:mx-6" />

        {/* ── Milestones ── */}
        <section className="section-py relative overflow-hidden" aria-labelledby="milestones-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <Anim className="text-center mb-12 md:mb-16">
              <div className="section-badge mx-auto w-fit mb-4">By The Numbers</div>
              <h2 id="milestones-heading" className="font-display text-3xl sm:text-4xl md:text-5xl font-bold">
                <span className="text-white">Our </span><span className="text-shimmer">Milestones</span>
              </h2>
            </Anim>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
              {MILESTONES.map(({ value, label, color }, i) => (
                <Anim key={label} direction="up" delay={i * 0.08}>
                  <div className="glass rounded-2xl p-5 sm:p-7 text-center border border-white/5 hover:border-brand-gold/20 transition-all duration-300 group h-full flex flex-col justify-center">
                    <p className="font-display font-black text-2xl sm:text-3xl md:text-4xl mb-2 group-hover:scale-110 transition-transform duration-300 leading-none" style={{ color }}>
                      {value}
                    </p>
                    <p className="text-[10px] sm:text-xs font-sans text-gray-500 uppercase font-bold tracking-widest leading-tight">{label}</p>
                  </div>
                </Anim>
              ))}
            </div>
          </div>
        </section>

        <div className="divider mx-4 sm:mx-6" />

        {/* ── Values ── */}
        <section className="section-py relative" aria-labelledby="values-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <Anim className="text-center mb-12 md:mb-16">
              <div className="section-badge mx-auto w-fit mb-4">What Drives Us</div>
              <h2 id="values-heading" className="font-display text-3xl sm:text-4xl md:text-5xl font-bold">
                <span className="text-white">Our Core </span><span className="text-brand-green">Values</span>
              </h2>
            </Anim>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {VALUES.map(({ icon: Icon, title, desc, color }, i) => (
                <Anim key={title} direction="up" delay={i * 0.1}>
                  <div className="glass rounded-3xl p-8 sm:p-10 border border-white/5 hover:border-brand-gold/20 transition-all duration-500 group text-center h-full flex flex-col items-center">
                    <div
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg"
                      style={{ background: `rgba(${color === '#C9A84C' ? '201,168,76' : '76,175,80'},.14)` }}
                    >
                      <Icon size={28} style={{ color }} />
                    </div>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-4 group-hover:text-brand-gold transition-colors duration-300">{title}</h3>
                    <p className="font-sans text-sm sm:text-base text-gray-400 leading-relaxed">{desc}</p>
                  </div>
                </Anim>
              ))}
            </div>
          </div>
        </section>

        <div className="divider mx-4 sm:mx-6" />

        {/* ── Team Expertise ── */}
        <section className="section-py relative" aria-labelledby="team-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              <div className="space-y-8">
                <Anim direction="left">
                  <div className="section-badge w-fit mb-4">Our Expertise</div>
                  <h2 id="team-heading" className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
                    Skilled, <span className="text-brand-gold underline decoration-brand-gold/20 underline-offset-8">Certified</span> Doctor's
                  </h2>
                  <p className="text-gray-400 font-sans text-base sm:text-lg leading-relaxed mt-6">
                    Our team holds PhD/MPT/BPT degrees with years of specialized clinical experience across Orthopedic , Spinal , Neurological , Sports Injury , Geriatric & Pediatric physiotherapy along with Advance Oncology rehabilitation.
                  </p>
                </Anim>
                
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-y-4 gap-x-6" role="list">
                  {TRAITS.map((t, i) => (
                    <Anim key={t} direction="left" delay={i * 0.07}>
                      <li className="flex items-start gap-4 group">
                        <span className="w-2 h-2 rounded-full flex-shrink-0 mt-2 transition-transform duration-300 group-hover:scale-150 shadow-glow-sm" style={{ background: i % 2 === 0 ? '#C9A84C' : '#4CAF50' }} />
                        <span className="font-sans text-gray-300 text-sm sm:text-base leading-snug">{t}</span>
                      </li>
                    </Anim>
                  ))}
                </ul>
                <Anim direction="up" delay={0.4}>
                  <Link href="/contact" className="btn-brand shadow-gold w-full sm:w-auto inline-flex min-h-[56px] px-8 text-base">
                    Meet Us in Clinic <ArrowRight size={20} className="ml-2" />
                  </Link>
                </Anim>
              </div>

              <Anim direction="right">
                <div className="glass-green rounded-3xl p-8 sm:p-12 border border-brand-green/15 mt-8 lg:mt-0 shadow-2xl">
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-8">Why Patients Choose Us</h3>
                  <div className="space-y-6 sm:space-y-8">
                    {BARS.map(({ label, pct }, i) => (
                      <Anim key={label} direction="fade" delay={i * 0.1}>
                        <div className="group">
                          <div className="flex justify-between mb-2">
                            <span className="font-sans text-sm text-gray-300 font-semibold group-hover:text-white transition-colors">{label}</span>
                            <span className="font-sans font-bold text-sm text-base text-brand-gold">{pct}%</span>
                          </div>
                          <div className="h-3 rounded-full bg-white/5 overflow-hidden border border-white/5">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${pct}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                              className="h-full rounded-full shadow-glow-sm"
                              style={{
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
                  <div className="mt-12 pt-8 border-t border-white/10 text-center">
                    <p className="font-display text-5xl sm:text-6xl font-black text-shimmer leading-none">5.0★</p>
                    <p className="font-sans text-xs sm:text-sm text-gray-500 mt-3 uppercase font-bold tracking-[0.2em]">Based on 10000+ patient reviews</p>
                  </div>
                </div>
              </Anim>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="section-py px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <Anim direction="scale">
              <div className="glass-gold rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden border border-brand-gold/15 shadow-2xl">
                <div className="absolute inset-0 opacity-[0.08]" style={{ background: 'linear-gradient(135deg,#C9A84C,#4CAF50)' }} />
                <div className="relative z-10">
                  <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
                    Start Your <span className="text-shimmer">Recovery Journey</span>
                  </h2>
                  <p className="text-gray-400 font-sans text-base sm:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
                    Book a ₹500 consultation and let our experts create your personalized treatment plan.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <a href="tel:08766304045" className="btn-brand shadow-gold w-full sm:w-auto min-h-[56px] px-8 text-base">
                      <Phone size={20} className="mr-2" /> Call Now: 08766304045
                    </a>
                    <Link href="/services" className="btn-outline w-full sm:w-auto min-h-[56px] px-8 text-base transition-all duration-300">
                      Explore Our Services
                    </Link>
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
