import type { Metadata } from 'next'
import PageHeroWrapper from './PageHeroWrapper'
import Anim from '@/components/Anim'
import Link from 'next/link'
import { Bone, Activity, Brain, Dumbbell, Zap, HeartPulse, Home, Phone, CheckCircle2, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Physiotherapy Services — Spinal, Sports, Neurological, Orthopedic',
  description: 'SpinalKraft offers spinal physiotherapy, sports injury rehab, neurological therapy, orthopedic treatment, pain management, post-surgery rehab and home physiotherapy in Greater Noida.',
  alternates: { canonical: 'https://spinalkraft.in/services' },
  openGraph: {
    title: 'Physiotherapy Services | SpinalKraft Greater Noida',
    description: '7 specialist services: spinal, sports, neuro, ortho, pain management. ₹500 consultation.',
    url: 'https://spinalkraft.in/services',
  },
}

interface Service {
  id: string
  icon: any
  title: string
  tagline: string
  color: '#C9A84C' | '#4CAF50'
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
    desc: 'Proper rehabilitation determines your surgical outcome. Our post-operative protocols minimize complications and achieve full functional recovery.',
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

export default function ServicesPage() {
  return (
    <>
      <PageHeroWrapper
        badge="What We Offer"
        title={<><span className="text-white">Our </span><span className="text-brand-green">Services</span></>}
        subtitle="Seven specialist physiotherapy services — personalized to your condition, delivered with expertise and care."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Services' }]}
        accentColor="green"
        sceneName="services"
      />

      <main>
        {/* ── Quick-nav: horizontal scroll on mobile ── */}
        <div className="sticky top-[56px] sm:top-[64px] z-30 glass border-b border-white/5 py-3" aria-label="Service navigation">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <nav className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5" aria-label="Jump to service">
              {SERVICES.map(({ id, title, icon: Icon, color }) => (
                <a key={id} href={`#${id}`}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full glass border border-white/5 text-[11px] sm:text-xs font-sans font-semibold whitespace-nowrap hover:border-brand-gold/40 transition-all duration-200 flex-shrink-0 min-h-[36px]"
                  style={{ color }}>
                  <Icon size={12} style={{ color }} />{title}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* ── Service cards ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20 space-y-16 md:space-y-24">
          {SERVICES.map((svc, i) => {
            const { id, icon: Icon, title, tagline, color, desc, conditions, benefits, technique } = svc
            const isEven = i % 2 === 0
            return (
              <section key={id} id={id} className="scroll-mt-36" aria-labelledby={`${id}-heading`}>
                <div className={`grid lg:grid-cols-2 gap-8 md:gap-12 items-start ${!isEven ? 'lg:flex-row-reverse' : ''}`}>

                  {/* Visual panel */}
                  <Anim direction={isEven ? 'left' : 'right'}>
                    <div className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border relative overflow-hidden"
                      style={{ borderColor: `${color}28` }}>
                      <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 pointer-events-none opacity-[0.06]"
                        style={{ background: `radial-gradient(circle, ${color}, transparent)`, transform: 'translate(30%,-30%)' }} />
                      <div className="relative z-10">
                        <div className="w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-xl sm:rounded-2xl mb-5 flex items-center justify-center"
                          style={{ background: `rgba(${color === '#C9A84C' ? '201,168,76' : '76,175,80'},.14)` }}>
                          <Icon size={28} style={{ color }} />
                        </div>
                        <span className="section-badge" style={{ color, borderColor: `${color}30`, background: `rgba(${color === '#C9A84C' ? '201,168,76' : '76,175,80'},.07)` }}>
                          {tagline}
                        </span>
                        <h2 id={`${id}-heading`} className="font-display text-2xl sm:text-3xl font-bold text-white my-3">{title}</h2>
                        <p className="font-sans text-gray-400 text-sm sm:text-base leading-relaxed mb-5">{desc}</p>
                        {technique && (
                          <div className="glass rounded-xl p-3.5 sm:p-4 border border-white/5">
                            <p className="text-xs font-sans font-bold uppercase tracking-widest mb-1" style={{ color }}>Techniques Used</p>
                            <p className="text-sm font-sans text-gray-400">{technique}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Anim>

                  {/* Info panel */}
                  <div className="space-y-4 sm:space-y-5">
                    <Anim direction={isEven ? 'right' : 'left'}>
                      <div className="glass rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-white/5">
                        <h3 className="font-display text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
                          <span className="w-1.5 h-5 rounded-full flex-shrink-0" style={{ background: color }} />
                          Conditions We Treat
                        </h3>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3" role="list">
                          {conditions.map(c => (
                            <li key={c} className="flex items-center gap-2 text-sm font-sans text-gray-300">
                              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Anim>

                    <Anim direction={isEven ? 'right' : 'left'} delay={0.1}>
                      <div className="glass rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-white/5">
                        <h3 className="font-display text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
                          <span className="w-1.5 h-5 rounded-full flex-shrink-0" style={{ background: color === '#C9A84C' ? '#4CAF50' : '#C9A84C' }} />
                          Key Benefits
                        </h3>
                        <ul className="space-y-2.5" role="list">
                          {benefits.map(b => (
                            <li key={b} className="flex items-center gap-2.5">
                              <CheckCircle2 size={15} style={{ color }} className="flex-shrink-0" />
                              <span className="font-sans text-gray-300 text-sm">{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Anim>

                    <Anim direction={isEven ? 'right' : 'left'} delay={0.18}>
                      <a href="tel:+918128370332" className="btn-brand w-full justify-center block text-center shadow-gold">
                        <Phone size={14} /> Book {title} — ₹500
                      </a>
                    </Anim>
                  </div>
                </div>

                {i < SERVICES.length - 1 && <div className="divider mt-16 md:mt-24" />}
              </section>
            )
          })}
        </div>

        {/* ── CTA ── */}
        <section className="pb-14 md:pb-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <Anim direction="scale">
              <div className="glass-gold rounded-2xl sm:rounded-3xl p-7 sm:p-10 text-center border border-brand-gold/15 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.06]" style={{ background: 'linear-gradient(135deg,#C9A84C,#4CAF50)' }} />
                <div className="relative z-10">
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">Not Sure Which Service?</h2>
                  <p className="text-gray-400 font-sans text-sm sm:text-base mb-6 sm:mb-8">
                    Our physiotherapists will assess your condition and recommend the best treatment plan.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <a href="tel:+918128370332" className="btn-brand shadow-gold w-full sm:w-auto">
                      <Phone size={15} /> Call for Consultation
                    </a>
                    <Link href="/contact" className="btn-outline w-full sm:w-auto">
                      Book Online <ArrowRight size={14} />
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
