'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion, Variants, MotionProps } from 'framer-motion'
import { ChevronRight, Phone, ArrowRight } from 'lucide-react'
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
  const glowColor = accentColor === 'gold' ? 'rgba(201,168,76,0.10)' : 'rgba(76,175,80,0.10)'

  return (
    <section
      className="relative pt-28 sm:pt-32 md:pt-40 pb-16 md:pb-24 overflow-hidden min-h-[38vh] flex flex-col justify-center"
      aria-label="Page header"
    >
      {/* Three.js scene layer */}
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
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${glowColor}, transparent 65%)`,
          }}
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
        {/* Breadcrumb — SEO & a11y */}
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
                <span className="text-xs sm:text-sm font-sans text-brand-gold font-semibold" aria-current="page">
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
// 3. ConditionsScene  (dynamically imported — was @/components/ConditionsScene)
// ─────────────────────────────────────────────────────────────────────────────

const ConditionsScene = dynamic(() => import('@/components/ConditionsScene'), { ssr: false })

// ─────────────────────────────────────────────────────────────────────────────
// 4. Page data
// ─────────────────────────────────────────────────────────────────────────────

interface Condition {
  name: string
  emoji: string
  tagline: string
  color: string
  symptoms: string[]
  causes: string[]
  treatment: string
  duration: string
}

const CONDITIONS: Condition[] = [
  {
    name: 'Back Pain', emoji: '🦴', tagline: 'Acute & chronic back conditions', color: '#C9A84C',
    symptoms: ['Dull or sharp lower back ache', 'Pain worse with sitting', 'Morning stiffness', 'Radiating to buttocks'],
    causes: ['Poor posture', 'Disc degeneration', 'Muscle strain', 'Sedentary lifestyle'],
    treatment: 'Manual therapy, spinal mobilization, core stabilization, posture correction',
    duration: '4–8 weeks',
  },
  {
    name: 'Neck Pain', emoji: '🔄', tagline: 'Cervical spine & postural disorders', color: '#4CAF50',
    symptoms: ['Stiffness & limited rotation', 'Headaches from neck', 'Arm referred pain', 'Pins & needles in hands'],
    causes: ['Prolonged screen use', 'Poor ergonomics', 'Disc degeneration', 'Whiplash'],
    treatment: 'Cervical mobilization, traction, deep neck flexor training',
    duration: '3–6 weeks',
  },
  {
    name: 'Sciatica', emoji: '⚡', tagline: 'Sciatic nerve pain down the leg', color: '#C9A84C',
    symptoms: ['Sharp burning leg pain', 'Numbness in leg/foot', 'Pain worse sitting', 'Leg weakness'],
    causes: ['Herniated disc', 'Piriformis syndrome', 'Spinal stenosis', 'Spondylolisthesis'],
    treatment: 'Neural mobilization, McKenzie exercises, traction, core stability',
    duration: '6–12 weeks',
  },
  {
    name: 'Frozen Shoulder', emoji: '🤲', tagline: 'Adhesive capsulitis & stiffness', color: '#4CAF50',
    symptoms: ['Progressive stiffness', 'Night pain', 'Inability to raise arm', 'Difficulty with tasks'],
    causes: ['Shoulder immobilization', 'Diabetes', 'Post-injury', 'Idiopathic'],
    treatment: 'Glenohumeral mobilization, stretching, pendulum exercises, electrotherapy',
    duration: '3–6 months',
  },
  {
    name: 'Knee Pain', emoji: '🦵', tagline: 'Joint pain & knee dysfunction', color: '#C9A84C',
    symptoms: ['Pain during weight-bearing', 'Swelling around knee', 'Clicking or locking', 'Stair weakness'],
    causes: ['Osteoarthritis', 'Ligament injuries', 'Patellofemoral syndrome', 'Meniscus tears'],
    treatment: 'Quadriceps strengthening, joint mobilization, McConnell taping',
    duration: '4–10 weeks',
  },
  {
    name: 'Slip Disc', emoji: '💫', tagline: 'Herniated disc & nerve compression', color: '#4CAF50',
    symptoms: ['Radiating arm/leg pain', 'Muscle weakness', 'Altered sensation', 'Pain with coughing'],
    causes: ['Disc degeneration', 'Heavy lifting', 'Repetitive bending', 'Age-related changes'],
    treatment: 'McKenzie technique, neural mobilization, lumbar stabilization, traction',
    duration: '6–12 weeks',
  },
  {
    name: 'Sports Injuries', emoji: '⚽', tagline: 'Athletic trauma & overuse injuries', color: '#C9A84C',
    symptoms: ['Acute pain after injury', 'Swelling & bruising', 'Reduced range of motion', 'Instability'],
    causes: ['Direct trauma', 'Overuse & overtraining', 'Inadequate warm-up', 'Biomechanical imbalances'],
    treatment: 'RICE protocol, sports taping, rehab exercises, return-to-sport programme',
    duration: '2–16 weeks',
  },
  {
    name: 'Paralysis Rehab', emoji: '🧠', tagline: 'Stroke & neurological recovery', color: '#4CAF50',
    symptoms: ['Muscle weakness/paralysis', 'Loss of coordination', 'Spasticity', 'Gait difficulty'],
    causes: ['Stroke', 'Spinal cord injury', 'Brain injury', 'Neurological disease'],
    treatment: 'Bobath technique, PNF, functional electrical stimulation, gait retraining',
    duration: 'Ongoing — gains in 3–6 months',
  },
  {
    name: 'Arthritis', emoji: '🔩', tagline: 'Joint inflammation & degeneration', color: '#C9A84C',
    symptoms: ['Joint pain & tenderness', 'Morning stiffness', 'Reduced mobility', 'Warmth & swelling'],
    causes: ['Age-related wear', 'Autoimmune (RA)', 'Previous injuries', 'Obesity'],
    treatment: 'Hydrotherapy, gentle mobilization, strengthening, activity modification',
    duration: 'Long-term management',
  },
  {
    name: 'Muscle Strain', emoji: '💪', tagline: 'Soft tissue injuries & sprains', color: '#4CAF50',
    symptoms: ['Muscle soreness', 'Swelling & bruising', 'Limited function', 'Weakness'],
    causes: ['Overstretching', 'Heavy lifting', 'Sudden movement', 'Chronic overuse'],
    treatment: 'Soft tissue massage, ultrasound therapy, progressive strengthening',
    duration: '1–6 weeks',
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// 5. Helper: slug
// ─────────────────────────────────────────────────────────────────────────────

const toSlug = (name: string) => name.toLowerCase().replace(/\s+/g, '-')

// ─────────────────────────────────────────────────────────────────────────────
// 6. Inline condition card colour helpers
// ─────────────────────────────────────────────────────────────────────────────

function rgbFrom(hex: string) {
  return hex === '#C9A84C' ? '201,168,76' : '76,175,80'
}

function altColor(color: string) {
  return color === '#C9A84C' ? '#4CAF50' : '#C9A84C'
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. Reusable info sub-card
// ─────────────────────────────────────────────────────────────────────────────

interface InfoCardProps {
  title: string
  accentColor: string
  children: ReactNode
}

function InfoCard({ title, accentColor, children }: InfoCardProps) {
  return (
    <div className="glass rounded-xl p-4 sm:p-5 border border-white/5 h-full">
      <h4
        className="font-sans font-bold text-[10px] sm:text-xs uppercase tracking-wider mb-2.5 sm:mb-3"
        style={{ color: accentColor }}
      >
        {title}
      </h4>
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. Default export — full Conditions page
// ─────────────────────────────────────────────────────────────────────────────

export default function ConditionsClient() {
  return (
    <>
      {/* ── Hero ── */}
      <PageHero
        badge="We Can Help"
        title={
          <>
            <span className="text-white">Conditions </span>
            <span className="text-shimmer">We Treat</span>
          </>
        }
        subtitle="Our expert physiotherapists diagnose and treat a wide range of musculoskeletal, neurological and sports-related conditions."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Conditions' }]}
        accentColor="gold"
        scene={<ConditionsScene />}
      />

      <main id="main-content">

        {/* ── Overview quick-nav grid ── */}
        <section className="py-12 md:py-20" aria-labelledby="conditions-grid-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">

            <Anim className="text-center mb-8 md:mb-12">
              <h2
                id="conditions-grid-heading"
                className="font-display text-2xl sm:text-3xl md:text-4xl font-bold"
              >
                <span className="text-white">All </span>
                <span className="text-brand-green">Conditions</span>
              </h2>
              <p className="text-gray-400 font-sans mt-2 text-sm sm:text-base max-w-xl mx-auto">
                Tap any condition to jump to detailed info, symptoms, causes and our treatment approach.
              </p>
            </Anim>

            {/* Responsive quick-nav — 2 cols mobile → 3 sm → 4 md → 5 lg */}
            <nav aria-label="Jump to condition" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 mb-12 md:mb-16">
              {CONDITIONS.map(({ name, emoji, color }, i) => (
                <Anim key={name} direction="up" delay={i * 0.05}>
                  <a
                    href={`#${toSlug(name)}`}
                    className="glass rounded-xl sm:rounded-2xl p-3.5 sm:p-5 text-center border border-white/5 hover:border-brand-gold/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold transition-all duration-300 group block"
                    aria-label={`Jump to ${name}`}
                  >
                    <span
                      className="text-2xl sm:text-3xl mb-2 sm:mb-3 block group-hover:scale-110 transition-transform duration-300"
                      aria-hidden="true"
                    >
                      {emoji}
                    </span>
                    <p className="font-sans font-semibold text-xs sm:text-sm text-white group-hover:text-brand-gold transition-colors leading-tight">
                      {name}
                    </p>
                  </a>
                </Anim>
              ))}
            </nav>
          </div>
        </section>

        <div className="divider mx-4 sm:mx-6" />

        {/* ── Condition detail cards ── */}
        <section className="py-12 md:py-20" aria-label="Condition details">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10 sm:space-y-14">
            {CONDITIONS.map((cond, i) => {
              const { name, emoji, tagline, color, symptoms, causes, treatment, duration } = cond
              const slug    = toSlug(name)
              const altCol  = altColor(color)
              const rgb     = rgbFrom(color)
              const altRgb  = rgbFrom(altCol)

              return (
                <article
                  key={name}
                  id={slug}
                  className="scroll-mt-28 sm:scroll-mt-36"
                  aria-labelledby={`${slug}-heading`}
                >
                  <Anim direction={i % 2 === 0 ? 'left' : 'right'}>
                    <div
                      className="glass rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-10 border relative overflow-hidden"
                      style={{ borderColor: `${color}22` }}
                    >
                      {/* Corner glow */}
                      <div
                        className="absolute top-0 right-0 w-40 h-40 sm:w-64 sm:h-64 pointer-events-none opacity-[0.04]"
                        aria-hidden="true"
                        style={{
                          background: `radial-gradient(circle, ${color}, transparent)`,
                          transform: 'translate(30%,-30%)',
                        }}
                      />

                      <div className="relative z-10">
                        {/* ── Card header ── */}
                        <div className="flex items-start gap-3 sm:gap-5 mb-5 sm:mb-6">
                          <span
                            className="text-3xl sm:text-4xl md:text-5xl flex-shrink-0 leading-none"
                            aria-hidden="true"
                          >
                            {emoji}
                          </span>
                          <div>
                            <span
                              className="section-badge inline-block mb-1"
                              style={{
                                color,
                                borderColor: `${color}28`,
                                background: `rgba(${rgb},.07)`,
                              }}
                            >
                              {tagline}
                            </span>
                            <h3
                              id={`${slug}-heading`}
                              className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-white"
                            >
                              {name}
                            </h3>
                          </div>
                        </div>

                        {/* ── Info grid: 1-col mobile → 2-col sm → 4-col xl ── */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">

                          {/* Symptoms */}
                          <InfoCard title="Common Symptoms" accentColor={color}>
                            <ul className="space-y-1.5" role="list">
                              {symptoms.map(item => (
                                <li key={item} className="flex items-start gap-2 text-xs sm:text-sm font-sans text-gray-400">
                                  <span
                                    className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                                    aria-hidden="true"
                                    style={{ background: color }}
                                  />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </InfoCard>

                          {/* Causes */}
                          <InfoCard title="Typical Causes" accentColor={altCol}>
                            <ul className="space-y-1.5" role="list">
                              {causes.map(item => (
                                <li key={item} className="flex items-start gap-2 text-xs sm:text-sm font-sans text-gray-400">
                                  <span
                                    className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                                    aria-hidden="true"
                                    style={{ background: altCol }}
                                  />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </InfoCard>

                          {/* Treatment */}
                          <InfoCard title="Our Treatment" accentColor={color}>
                            <p className="text-xs sm:text-sm font-sans text-gray-400 leading-relaxed">{treatment}</p>
                          </InfoCard>

                          {/* Timeline + CTA */}
                          <div className="glass rounded-xl p-4 sm:p-5 border border-white/5 flex flex-col justify-between gap-4 sm:gap-5">
                            <div>
                              <h4 className="font-sans font-bold text-[10px] sm:text-xs uppercase tracking-wider mb-2.5 text-gray-500">
                                Recovery Timeline
                              </h4>
                              <p className="font-display font-semibold text-sm sm:text-base text-white">{duration}</p>
                            </div>
                            <a
                              href="tel:+918128370332"
                              className="btn-brand text-xs sm:text-sm py-2.5 px-4 justify-center w-full text-center"
                              style={{
                                background: `linear-gradient(135deg, ${color}, ${altCol})`,
                              }}
                              aria-label={`Book consultation for ${name}`}
                            >
                              <Phone size={12} aria-hidden="true" /> Book Consult
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Anim>
                </article>
              )
            })}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="pb-14 md:pb-24" aria-label="Contact call to action">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <Anim direction="scale">
              <div className="glass-gold rounded-2xl sm:rounded-3xl p-7 sm:p-10 md:p-14 text-center border border-brand-gold/15 relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-[0.06]"
                  aria-hidden="true"
                  style={{ background: 'linear-gradient(135deg,#C9A84C,#4CAF50)' }}
                />
                <div className="relative z-10">
                  <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
                    Don't See Your Condition?
                  </h2>
                  <p className="text-gray-400 font-sans text-sm sm:text-base  mb-6 sm:mb-8 max-w-xl mx-auto">
                    We treat many conditions. Contact us — our physiotherapists will assess and create a personalised plan.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <a
                      href="tel:+918128370332"
                      className="btn-brand shadow-gold w-full sm:w-auto"
                      aria-label="Call SpinalKraft"
                    >
                      <Phone size={15} aria-hidden="true" /> +91-8766304045
                    </a>
                    <Link href="/contact" className="btn-outline w-full sm:w-auto">
                      Book Online <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                  </div>
                  <p className="mt-4 text-xs sm:text-sm text-gray-500 font-sans">
                    Consultation: <span className="text-brand-gold font-semibold">₹500</span>
                  </p>
                </div>
              </div>
            </Anim>
          </div>
        </section>

      </main>
    </>
  )
}