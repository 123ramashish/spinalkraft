'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ReactNode } from 'react'
import { motion, Variants, MotionProps } from 'framer-motion'
import {
  ChevronRight,
  Bone, Activity, Brain, Dumbbell, Zap, HeartPulse, Home,
  Phone, CheckCircle2, ArrowRight,
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
// 3. ServicesScene  (was @/components/ServicesScene)
// ─────────────────────────────────────────────────────────────────────────────

const ServicesScene = dynamic(() => import('@/components/ServicesScene'), { ssr: false })

// ─────────────────────────────────────────────────────────────────────────────
// 4. Page data
// ─────────────────────────────────────────────────────────────────────────────

type AccentColor = '#C9A84C' | '#4CAF50'

interface Service {
  id: string
  icon: React.ElementType
  title: string
  tagline: string
  color: AccentColor
  desc: string
  conditions: string[]
  benefits: string[]
  technique?: string
}

const SERVICES: Service[] = [
  {
    id: 'spinal', icon: Bone, title: 'Spinal Physiotherapy', tagline: 'Specialized care for your spine', color: '#C9A84C',
    desc: 'Comprehensive treatment for the full range of spinal conditions. We restore alignment, improve flexibility and build core strength for long-term spinal health.',
    conditions: ['Slip Disc', 'Sciatica', 'Cervical Spondylosis', 'Lower Back Pain', 'Scoliosis', 'Postural Disorders'],
    benefits: ['Reduces nerve compression pain', 'Restores spinal alignment', 'Improves posture & flexibility', 'Prevents recurrence'],
    technique: 'Manual therapy, traction, McKenzie technique, core stabilization',
  },
  {
    id: 'sports', icon: Activity, title: 'Sports Injury Rehab', tagline: 'Back to peak performance', color: '#4CAF50',
    desc: 'Whether a professional athlete or weekend warrior, our sports rehabilitation heals your injury, restores full function and returns you to activity safely.',
    conditions: ['Muscle Strains', 'Ligament Tears', 'Rotator Cuff', 'Knee & Ankle Injuries', 'Stress Fractures', 'Tennis Elbow'],
    benefits: ['Faster return to sport', 'Sport-specific conditioning', 'Injury prevention', 'Performance enhancement'],
    technique: 'Sports massage, kinesio taping, strength & conditioning, proprioceptive training',
  },
  {
    id: 'neuro', icon: Brain, title: 'Neurological Therapy', tagline: 'Rebuilding neural pathways', color: '#C9A84C',
    desc: 'Targeted neurological rehabilitation for disorders of the brain, spinal cord and nerves — helping patients regain movement, independence and quality of life.',
    conditions: ['Stroke & Hemiplegia', "Parkinson's Disease", 'Multiple Sclerosis', 'Spinal Cord Injury', 'Nerve Injuries', 'Brain Injury'],
    benefits: ['Improved mobility & coordination', 'Reduced spasticity', 'Enhanced daily function', 'Greater independence'],
    technique: 'Bobath technique, PNF, balance retraining, gait training',
  },
  {
    id: 'ortho', icon: Dumbbell, title: 'Orthopedic Therapy', tagline: 'Bone & joint restoration', color: '#4CAF50',
    desc: 'Expert care for bones, joints, muscles and soft tissues — addressing both acute injuries and chronic musculoskeletal conditions.',
    conditions: ['Osteoarthritis', 'Frozen Shoulder', 'Knee Pain', 'Hip Pain', 'Plantar Fasciitis', 'Carpal Tunnel'],
    benefits: ['Reduced joint pain', 'Improved range of motion', 'Stronger supporting muscles', 'Delayed joint degeneration'],
    technique: 'Joint mobilization, dry needling, therapeutic exercises, hot/cold therapy',
  },
  {
    id: 'pain', icon: Zap, title: 'Pain Management', tagline: 'Long-lasting chronic pain relief', color: '#C9A84C',
    desc: 'Multimodal pain management using advanced techniques to interrupt pain cycles, restore function and help you reclaim an active life.',
    conditions: ['Chronic Back Pain', 'Fibromyalgia', 'Myofascial Pain', 'Chronic Neck Pain', 'Headaches', 'CRPS'],
    benefits: ['Significant pain reduction', 'Improved sleep quality', 'Restored daily function', 'Reduced medication'],
    technique: 'TENS, ultrasound therapy, manual therapy, pain neuroeducation',
  },
  {
    id: 'postsurgery', icon: HeartPulse, title: 'Post-Surgery Rehab', tagline: 'Accelerate surgical recovery', color: '#4CAF50',
    desc: 'Proper rehabilitation determines your surgical outcome. Our post-operative protocols minimise complications and achieve full functional recovery.',
    conditions: ['Knee Replacement', 'Hip Replacement', 'Shoulder Surgery', 'Spine Surgery', 'ACL Repair', 'Rotator Cuff Repair'],
    benefits: ['Faster healing', 'Scar tissue prevention', 'Earlier return to function', 'Fewer complications'],
    technique: 'Progressive loading, scar management, functional rehabilitation',
  },
  {
    id: 'home', icon: Home, title: 'Home Physiotherapy', tagline: 'Expert care at your doorstep', color: '#C9A84C',
    desc: 'Professional physiotherapy delivered at home for those who cannot visit the clinic. Same quality care, maximum convenience.',
    conditions: ['Elderly Mobility', 'Post-Discharge Care', 'Severe Disability', 'Post-Surgical Recovery', 'Neurological Conditions', 'Palliative Care'],
    benefits: ['No travel required', 'Familiar environment', 'Family involvement', 'Flexible scheduling'],
    technique: 'All core physiotherapy modalities adapted for home use',
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// 5. Colour helpers
// ─────────────────────────────────────────────────────────────────────────────

const rgb = (c: AccentColor) => c === '#C9A84C' ? '201,168,76' : '76,175,80'
const alt = (c: AccentColor): AccentColor => c === '#C9A84C' ? '#4CAF50' : '#C9A84C'

// ─────────────────────────────────────────────────────────────────────────────
// 6. Default export — full Services page
// ─────────────────────────────────────────────────────────────────────────────

export default function ServicesPageClient() {
  return (
    <>
      {/* ── Hero ── */}
      <PageHero
        badge="What We Offer"
        title={<><span className="text-white">Our </span><span className="text-brand-green">Services</span></>}
        subtitle="Seven specialist physiotherapy services — personalised to your condition, delivered with expertise and care."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Services' }]}
        accentColor="green"
        scene={<ServicesScene />}
      />

      <main id="main-content">

        {/* ── Sticky quick-nav: horizontal scroll on mobile ── */}
        <div
          className="sticky top-[56px] sm:top-[64px] z-30 glass border-b border-white/5 py-2.5 sm:py-3"
          aria-label="Service navigation"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <nav
              className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5"
              aria-label="Jump to service"
            >
              {SERVICES.map(({ id, title, icon: Icon, color }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full glass border border-white/5 text-[11px] sm:text-xs font-sans font-semibold whitespace-nowrap hover:border-brand-gold/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold transition-all duration-200 flex-shrink-0 min-h-[36px]"
                  style={{ color }}
                  aria-label={`Jump to ${title}`}
                >
                  <Icon size={12} style={{ color }} aria-hidden="true" />
                  {title}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* ── Service sections ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20 space-y-16 md:space-y-24">
          {SERVICES.map((svc, i) => {
            const { id, icon: Icon, title, tagline, color, desc, conditions, benefits, technique } = svc
            const isEven  = i % 2 === 0
            const colorRgb = rgb(color)
            const altColor = alt(color)

            return (
              <section
                key={id}
                id={id}
                className="scroll-mt-28 sm:scroll-mt-36"
                aria-labelledby={`${id}-heading`}
              >
                {/* 1-col mobile → 2-col lg, alternating visual side */}
                <div
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start ${
                    !isEven ? 'lg:grid-flow-dense' : ''
                  }`}
                >

                  {/* ── Visual panel ── */}
                  <Anim
                    direction={isEven ? 'left' : 'right'}
                    className={!isEven ? 'lg:col-start-2' : ''}
                  >
                    <div
                      className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border relative overflow-hidden h-full"
                      style={{ borderColor: `${color}28` }}
                    >
                      {/* Corner glow */}
                      <div
                        className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 pointer-events-none opacity-[0.06]"
                        aria-hidden="true"
                        style={{
                          background: `radial-gradient(circle, ${color}, transparent)`,
                          transform: 'translate(30%,-30%)',
                        }}
                      />

                      <div className="relative z-10">
                        {/* Icon */}
                        <div
                          className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl mb-5 flex items-center justify-center"
                          style={{ background: `rgba(${colorRgb},.14)` }}
                        >
                          <Icon size={28} style={{ color }} aria-hidden="true" />
                        </div>

                        {/* Badge */}
                        <span
                          className="section-badge inline-block mb-2"
                          style={{
                            color,
                            borderColor: `${color}30`,
                            background: `rgba(${colorRgb},.07)`,
                          }}
                        >
                          {tagline}
                        </span>

                        {/* Heading */}
                        <h2
                          id={`${id}-heading`}
                          className="font-display text-2xl sm:text-3xl font-bold text-white my-3"
                        >
                          {title}
                        </h2>

                        {/* Description */}
                        <p className="font-sans text-gray-400 text-sm sm:text-base leading-relaxed mb-5">
                          {desc}
                        </p>

                        {/* Technique pill */}
                        {technique && (
                          <div className="glass rounded-xl p-3.5 sm:p-4 border border-white/5">
                            <p
                              className="text-[10px] sm:text-xs font-sans font-bold uppercase tracking-widest mb-1.5"
                              style={{ color }}
                            >
                              Techniques Used
                            </p>
                            <p className="text-xs sm:text-sm font-sans text-gray-400 leading-relaxed">
                              {technique}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Anim>

                  {/* ── Info panel ── */}
                  <div
                    className={`space-y-4 sm:space-y-5 ${!isEven ? 'lg:col-start-1 lg:row-start-1' : ''}`}
                  >
                    {/* Conditions */}
                    <Anim direction={isEven ? 'right' : 'left'}>
                      <div className="glass rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-white/5">
                        <h3 className="font-display text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
                          <span
                            className="w-1.5 h-5 rounded-full flex-shrink-0"
                            aria-hidden="true"
                            style={{ background: color }}
                          />
                          Conditions We Treat
                        </h3>
                        <ul
                          className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-2 sm:gap-3"
                          role="list"
                        >
                          {conditions.map(c => (
                            <li key={c} className="flex items-center gap-2 text-xs sm:text-sm font-sans text-gray-300">
                              <span
                                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                aria-hidden="true"
                                style={{ background: color }}
                              />
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Anim>

                    {/* Benefits */}
                    <Anim direction={isEven ? 'right' : 'left'} delay={0.1}>
                      <div className="glass rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-white/5">
                        <h3 className="font-display text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
                          <span
                            className="w-1.5 h-5 rounded-full flex-shrink-0"
                            aria-hidden="true"
                            style={{ background: altColor }}
                          />
                          Key Benefits
                        </h3>
                        <ul className="space-y-2.5" role="list">
                          {benefits.map(b => (
                            <li key={b} className="flex items-center gap-2.5">
                              <CheckCircle2 size={15} style={{ color }} className="flex-shrink-0" aria-hidden="true" />
                              <span className="font-sans text-gray-300 text-xs sm:text-sm">{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Anim>

                    {/* CTA */}
                    <Anim direction={isEven ? 'right' : 'left'} delay={0.18}>
                      <a
                        href="tel:+918128370332"
                        className="btn-brand w-full justify-center block text-center shadow-gold min-h-[48px] text-sm sm:text-base"
                        aria-label={`Book ${title} consultation — ₹500`}
                      >
                        <Phone size={14} aria-hidden="true" /> Book {title} — ₹500
                      </a>
                    </Anim>
                  </div>
                </div>

                {/* Divider between cards */}
                {i < SERVICES.length - 1 && (
                  <div className="divider mt-16 md:mt-24" aria-hidden="true" />
                )}
              </section>
            )
          })}
        </div>

        {/* ── CTA banner ── */}
        <section className="pb-14 md:pb-24" aria-label="Call to action">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <Anim direction="scale">
              <div className="glass-gold rounded-2xl sm:rounded-3xl p-7 sm:p-10 text-center border border-brand-gold/15 relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-[0.06]"
                  aria-hidden="true"
                  style={{ background: 'linear-gradient(135deg,#C9A84C,#4CAF50)' }}
                />
                <div className="relative z-10">
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
                    Not Sure Which Service?
                  </h2>
                  <p className="text-gray-400 font-sans text-sm sm:text-base mb-6 sm:mb-8 max-w-md mx-auto">
                    Our physiotherapists will assess your condition and recommend the best treatment plan.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <a
                      href="tel:+918128370332"
                      className="btn-brand shadow-gold w-full sm:w-auto"
                      aria-label="Call SpinalKraft for consultation"
                    >
                      <Phone size={15} aria-hidden="true" /> Call for Consultation
                    </a>
                    <Link href="/contact" className="btn-outline w-full sm:w-auto">
                      Book Online <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>
            </Anim>
          </div>
        </section>

        {/* ── JSON-LD: Service list for rich results ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'MedicalBusiness',
              name: 'SpinalKraft Physiotherapy Clinic',
              url: 'https://spinalkraft.in',
              telephone: '+918128370332',
              priceRange: '₹500',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Sector 4',
                addressLocality: 'Greater Noida',
                addressRegion: 'Uttar Pradesh',
                addressCountry: 'IN',
              },
              hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'Physiotherapy Services',
                itemListElement: SERVICES.map((s, i) => ({
                  '@type': 'Offer',
                  position: i + 1,
                  name: s.title,
                  description: s.desc,
                  url: `https://spinalkraft.in/services#${s.id}`,
                  price: '500',
                  priceCurrency: 'INR',
                })),
              },
            }),
          }}
        />
      </main>
    </>
  )
}