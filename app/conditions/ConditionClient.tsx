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
    treatment: 'Advance Electrotherapy combined with Manual therapy, along with spinal mobilization, core stabilization, posture correction',
    duration: '1 – 6 Weeks',
  },
  {
    name: 'Neck Pain', emoji: '🔄', tagline: 'Cervical spine & postural disorders', color: '#4CAF50',
    symptoms: ['Stiffness & limited rotation', 'Headaches from neck', 'Arm referred pain', 'Pins & needles in hands'],
    causes: ['Prolonged screen use', 'Poor ergonomics', 'Disc degeneration', 'Whiplash'],
    treatment: 'Advance Electrotherapy combined with Manual therapy, along with Cervical mobilization, traction, deep neck flexor training',
    duration: '1 – 6 Weeks',
  },
  {
    name: 'Sciatica', emoji: '⚡', tagline: 'Sciatic nerve pain down the leg', color: '#C9A84C',
    symptoms: ['Sharp burning leg pain', 'Numbness in leg/foot', 'Pain worse sitting', 'Leg weakness'],
    causes: ['Herniated disc', 'Piriformis syndrome', 'Spinal stenosis', 'Spondylolisthesis'],
    treatment: 'Advance Electrotherapy combined with Manual therapy, along with Neural mobilization, McKenzie exercises, traction, core stability',
    duration: '1 – 6 Weeks',
  },
  {
    name: 'Frozen Shoulder', emoji: '🤲', tagline: 'Adhesive capsulitis & stiffness', color: '#4CAF50',
    symptoms: ['Progressive stiffness', 'Night pain', 'Inability to raise arm', 'Difficulty with tasks'],
    causes: ['Shoulder immobilization', 'Diabetes', 'Post-injury', 'Idiopathic'],
    treatment: 'Advance Electrotherapy combined with Manual therapy, along with Glenohumeral mobilization, stretching,strengthening , pendulum exercises',
    duration: '1 – 6 Weeks',
  },
  {
    name: 'Knee Pain', emoji: '🦵', tagline: 'Joint pain & knee dysfunction', color: '#C9A84C',
    symptoms: ['Pain during weight-bearing', 'Swelling around knee', 'Clicking or locking', 'Stair weakness'],
    causes: ['Osteoarthritis', 'Ligament injuries', 'Patellofemoral syndrome', 'Meniscus tears'],
    treatment: 'Advance Electrotherapy combined with Manual therapy, along with Quadriceps strengthening, joint mobilization, McConnell taping',
    duration: '1 – 6 Weeks',
  },
  {
    name: 'Slip Disc', emoji: '💫', tagline: 'Herniated disc & nerve compression', color: '#4CAF50',
    symptoms: ['Radiating arm/leg pain', 'Muscle weakness', 'Altered sensation', 'Pain with coughing'],
    causes: ['Disc degeneration', 'Heavy lifting', 'Repetitive bending', 'Age-related changes'],
    treatment: ' Advance Electrotherapy combined with Manual therapy, along with McKenzie technique, neural mobilization, lumbar stabilization, traction',
    duration: '1 – 6 Weeks',
  },
  {
    name: 'Sports Injuries', emoji: '⚽', tagline: 'Athletic trauma & overuse injuries', color: '#C9A84C',
    symptoms: ['Acute pain after injury', 'Swelling & bruising', 'Reduced range of motion', 'Instability'],
    causes: ['Direct trauma', 'Overuse & overtraining', 'Inadequate warm-up', 'Biomechanical imbalances'],
    treatment: 'Advance Electrotherapy combined with Manual therapy, along with RICE protocol, cupping , IASTM , sports taping, rehab exercises, return-to-sport programme',
    duration: '1 – 6 Weeks',
  },
  {
    name: 'Paralysis Rehab', emoji: '🧠', tagline: 'Stroke & neurological recovery', color: '#4CAF50',
    symptoms: ['Muscle weakness/paralysis', 'Loss of coordination', 'Spasticity', 'Gait difficulty'],
    causes: ['Stroke', 'Spinal cord injury', 'Brain injury', 'Neurological disease'],
    treatment: 'Advance Electrotherapy combined with Manual therapy, along with Bobath technique, PNF, functional electrical stimulation, gait retraining',
    duration: 'Ongoing — gains in 1 – 6 Weeks',
  },
  {
    name: 'Arthritis', emoji: '🔩', tagline: 'Joint inflammation & degeneration', color: '#C9A84C',
    symptoms: ['Joint pain & tenderness', 'Morning stiffness', 'Reduced mobility', 'Warmth & swelling'],
    causes: ['Age-related wear', 'Autoimmune (RA)', 'Previous injuries', 'Obesity'],
    treatment: 'Advance Electrotherapy combined with Manual therapy, along with Hydrotherapy, gentle mobilization, strengthening, activity modification',
    duration: 'Long-term management',
  },
  {
    name: 'Muscle Strain', emoji: '💪', tagline: 'Soft tissue injuries & sprains', color: '#4CAF50',
    symptoms: ['Muscle soreness', 'Swelling & bruising', 'Limited function', 'Weakness'],
    causes: ['Overstretching', 'Heavy lifting', 'Sudden movement', 'Chronic overuse'],
    treatment: 'Advance Electrotherapy combined with Manual therapy, along with Soft tissue massage, ultrasound therapy, progressive strengthening',
    duration: '1 – 6 weeks',
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
    <div className="glass rounded-xl p-5 border border-white/5 h-full transition-all duration-300 hover:border-white/10 group/sub">
      <h4
        className="font-sans font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-3.5"
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
        badge="Expert Care"
        title={
          <>
            <span className="text-white">Conditions </span>
            <span className="text-shimmer">We Treat</span>
          </>
        }
        subtitle="Expert Physiotherapy for Orthopedics Condition , Spinal Condition , Neurological Condition , Sports Injuries , Cardiopulmonary Condition , Geriatric & Pediatric Care , Women's Health Physiotherapy , Workplace & Ergonomic Physiotherapy , Oncology Physiotherapy — Personalised for you.

"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Conditions' }]}
        accentColor="gold"
        scene={<ConditionsScene />}
      />

      <main id="main-content">

        {/* ── Overview quick-nav grid ── */}
        <section className="section-py relative" aria-labelledby="conditions-grid-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">

            <Anim className="text-center mb-12">
              <h2
                id="conditions-grid-heading"
                className="font-display text-3xl sm:text-4xl md:text-5xl font-bold"
              >
                <span className="text-white">All </span>
                <span className="text-brand-green underline decoration-brand-green/20 underline-offset-8">Conditions</span>
              </h2>
              <p className="text-gray-400 font-sans mt-6 text-base sm:text-lg max-w-2xl mx-auto">
                Select a condition below to see typical symptoms, causes and how we can help you recover.
              </p>
            </Anim>

            {/* Responsive quick-nav — 2 cols mobile → 3 sm → 4 md → 5 lg */}
            <nav aria-label="Jump to condition" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5">
              {CONDITIONS.map(({ name, emoji, color }, i) => (
                <Anim key={name} direction="up" delay={i * 0.05}>
                  <a
                    href={`#${toSlug(name)}`}
                    className="glass rounded-2xl p-5 text-center border border-white/5 hover:border-brand-gold/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold transition-all duration-300 group block h-full flex flex-col justify-center"
                    aria-label={`Jump to ${name}`}
                  >
                    <span
                      className="text-3xl sm:text-4xl mb-4 block group-hover:scale-125 transition-transform duration-500"
                      aria-hidden="true"
                    >
                      {emoji}
                    </span>
                    <p className="font-sans font-bold text-xs sm:text-sm text-white group-hover:text-brand-gold transition-colors leading-tight">
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
        <section className="section-py relative" aria-label="Condition details">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12 sm:space-y-20">
            {CONDITIONS.map((cond, i) => {
              const { name, emoji, tagline, color, symptoms, causes, treatment, duration } = cond
              const slug    = toSlug(name)
              const altCol  = altColor(color)
              const rgb     = rgbFrom(color)

              return (
                <article
                  key={name}
                  id={slug}
                  className="scroll-mt-32 sm:scroll-mt-40"
                  aria-labelledby={`${slug}-heading`}
                >
                  <Anim direction={i % 2 === 0 ? 'left' : 'right'}>
                    <div
                      className="glass rounded-3xl p-6 sm:p-10 md:p-12 border relative overflow-hidden shadow-2xl"
                      style={{ borderColor: `${color}18` }}
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
                        <div className="flex flex-col sm:flex-row items-start gap-5 sm:gap-8 mb-10">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 glass rounded-2xl flex items-center justify-center text-4xl sm:text-5xl shadow-lg border border-white/5 shrink-0" aria-hidden="true">
                            {emoji}
                          </div>
                          <div className="space-y-2">
                            <span
                              className="section-badge inline-flex"
                              style={{
                                color,
                                borderColor: `${color}30`,
                                background: `rgba(${rgb},.08)`,
                              }}
                            >
                              {tagline}
                            </span>
                            <h3
                              id={`${slug}-heading`}
                              className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight"
                            >
                              {name}
                            </h3>
                          </div>
                        </div>

                        {/* ── Info grid ── */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

                          {/* Symptoms */}
                          <InfoCard title="Common Symptoms" accentColor={color}>
                            <ul className="space-y-3" role="list">
                              {symptoms.map(item => (
                                <li key={item} className="flex items-start gap-3 text-sm sm:text-base font-sans text-gray-400 leading-snug">
                                  <span
                                    className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2 transition-transform duration-300 group-hover/sub:scale-150 shadow-glow-sm"
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
                            <ul className="space-y-3" role="list">
                              {causes.map(item => (
                                <li key={item} className="flex items-start gap-3 text-sm sm:text-base font-sans text-gray-400 leading-snug">
                                  <span
                                    className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2 transition-transform duration-300 group-hover/sub:scale-150 shadow-glow-sm"
                                    aria-hidden="true"
                                    style={{ background: altCol }}
                                  />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </InfoCard>

                          {/* Approach & Timeline */}
                          <div className="flex flex-col gap-4 sm:gap-6 lg:col-span-1 md:col-span-2 lg:col-span-1">
                             <div className="glass rounded-xl p-6 border border-white/5 space-y-4">
                               <h4 className="font-sans font-bold text-[10px] sm:text-xs uppercase tracking-widest text-brand-gold">Our Approach</h4>
                               <p className="text-sm sm:text-base font-sans text-gray-300 leading-relaxed italic">{treatment}</p>
                             </div>
                             
                             <div className="glass rounded-xl p-6 border border-white/5 flex flex-col justify-between items-center sm:flex-row md:flex-col lg:flex-row gap-6">
                                <div className="text-center sm:text-left">
                                  <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-1">Expected Recovery</p>
                                  <p className="font-display font-bold text-lg sm:text-xl text-white">{duration}</p>
                                </div>
                                <a
                                  href="tel:08766304045"
                                  className="btn-brand w-full sm:w-auto md:w-full lg:w-auto px-6 py-3 text-sm shadow-gold"
                                  style={{
                                    background: `linear-gradient(135deg, ${color}, ${altCol})`,
                                  }}
                                >
                                  <Phone size={16} className="mr-2" /> Book Now
                                </a>
                             </div>
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
        <section className="section-py relative px-4 sm:px-6" aria-label="Contact call to action">
          <div className="max-w-4xl mx-auto">
            <Anim direction="scale">
              <div className="glass-gold rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden border border-brand-gold/15 shadow-2xl">
                <div
                  className="absolute inset-0 opacity-[0.08]"
                  aria-hidden="true"
                  style={{ background: 'linear-gradient(135deg,#C9A84C,#4CAF50)' }}
                />
                <div className="relative z-10">
                  <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                    Don't See Your <span className="text-shimmer">Condition?</span>
                  </h2>
                  <p className="text-gray-400 font-sans text-base sm:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
                    We treat many conditions beyond this list. Contact us today — our physiotherapists will perform a complete assessment.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <a
                      href="tel:08766304045"
                      className="btn-brand shadow-gold w-full sm:w-auto min-h-[56px] px-8 text-base"
                    >
                      <Phone size={20} className="mr-2" /> Call 08766304045
                    </a>
                    <Link href="/contact" className="btn-outline w-full sm:w-auto min-h-[56px] px-8 text-base">
                      Book Online Form <ArrowRight size={18} className="ml-2" />
                    </Link>
                  </div>
                  <p className="mt-8 text-xs sm:text-sm text-gray-500 font-sans uppercase tracking-[0.2em]">
                    Consultation Fee: <span className="text-brand-gold font-bold">₹500</span> · Open 24/7
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
