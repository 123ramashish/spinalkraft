import type { Metadata } from 'next'
import PageHeroWrapper from './PageHeroWrapper'
import Anim from '@/components/Anim'
import Link from 'next/link'
import { Phone, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Conditions We Treat — Back Pain, Sciatica, Sports Injuries & More',
  description: 'SpinalKraft treats back pain, neck pain, sciatica, frozen shoulder, knee pain, slip disc, sports injuries, stroke rehab, arthritis and more in Greater Noida.',
  alternates: { canonical: 'https://spinalkraft.in/conditions' },
  openGraph: {
    title: 'Conditions Treated | SpinalKraft Physiotherapy Greater Noida',
    description: '10+ conditions treated: back pain, sciatica, frozen shoulder, sports injuries, paralysis rehab. ₹500 consultation.',
    url: 'https://spinalkraft.in/conditions',
  },
}

interface Condition {
  name: string; emoji: string; tagline: string; color: string
  symptoms: string[]; causes: string[]; treatment: string; duration: string
}

const CONDITIONS: Condition[] = [
  { name: 'Back Pain',              emoji: '🦴', tagline: 'Acute & chronic back conditions',       color: '#C9A84C',
    symptoms: ['Dull or sharp lower back ache','Pain worse with sitting','Morning stiffness','Radiating to buttocks'],
    causes: ['Poor posture','Disc degeneration','Muscle strain','Sedentary lifestyle'],
    treatment: 'Manual therapy, spinal mobilization, core stabilization, posture correction',
    duration: '4–8 weeks' },
  { name: 'Neck Pain',              emoji: '🔄', tagline: 'Cervical spine & postural disorders',   color: '#4CAF50',
    symptoms: ['Stiffness & limited rotation','Headaches from neck','Arm referred pain','Pins & needles in hands'],
    causes: ['Prolonged screen use','Poor ergonomics','Disc degeneration','Whiplash'],
    treatment: 'Cervical mobilization, traction, deep neck flexor training',
    duration: '3–6 weeks' },
  { name: 'Sciatica',               emoji: '⚡', tagline: 'Sciatic nerve pain down the leg',      color: '#C9A84C',
    symptoms: ['Sharp burning leg pain','Numbness in leg/foot','Pain worse sitting','Leg weakness'],
    causes: ['Herniated disc','Piriformis syndrome','Spinal stenosis','Spondylolisthesis'],
    treatment: 'Neural mobilization, McKenzie exercises, traction, core stability',
    duration: '6–12 weeks' },
  { name: 'Frozen Shoulder',        emoji: '🤲', tagline: 'Adhesive capsulitis & stiffness',      color: '#4CAF50',
    symptoms: ['Progressive stiffness','Night pain','Inability to raise arm','Difficulty with tasks'],
    causes: ['Shoulder immobilization','Diabetes','Post-injury','Idiopathic'],
    treatment: 'Glenohumeral mobilization, stretching, pendulum exercises, electrotherapy',
    duration: '3–6 months' },
  { name: 'Knee Pain',              emoji: '🦵', tagline: 'Joint pain & knee dysfunction',        color: '#C9A84C',
    symptoms: ['Pain during weight-bearing','Swelling around knee','Clicking or locking','Stair weakness'],
    causes: ['Osteoarthritis','Ligament injuries','Patellofemoral syndrome','Meniscus tears'],
    treatment: 'Quadriceps strengthening, joint mobilization, McConnell taping',
    duration: '4–10 weeks' },
  { name: 'Slip Disc',              emoji: '💫', tagline: 'Herniated disc & nerve compression',  color: '#4CAF50',
    symptoms: ['Radiating arm/leg pain','Muscle weakness','Altered sensation','Pain with coughing'],
    causes: ['Disc degeneration','Heavy lifting','Repetitive bending','Age-related changes'],
    treatment: 'McKenzie technique, neural mobilization, lumbar stabilization, traction',
    duration: '6–12 weeks' },
  { name: 'Sports Injuries',        emoji: '⚽', tagline: 'Athletic trauma & overuse injuries',  color: '#C9A84C',
    symptoms: ['Acute pain after injury','Swelling & bruising','Reduced range of motion','Instability'],
    causes: ['Direct trauma','Overuse & overtraining','Inadequate warm-up','Biomechanical imbalances'],
    treatment: 'RICE protocol, sports taping, rehab exercises, return-to-sport programme',
    duration: '2–16 weeks' },
  { name: 'Paralysis Rehab',        emoji: '🧠', tagline: 'Stroke & neurological recovery',      color: '#4CAF50',
    symptoms: ['Muscle weakness/paralysis','Loss of coordination','Spasticity','Gait difficulty'],
    causes: ['Stroke','Spinal cord injury','Brain injury','Neurological disease'],
    treatment: 'Bobath technique, PNF, functional electrical stimulation, gait retraining',
    duration: 'Ongoing — gains in 3–6 months' },
  { name: 'Arthritis',              emoji: '🔩', tagline: 'Joint inflammation & degeneration',   color: '#C9A84C',
    symptoms: ['Joint pain & tenderness','Morning stiffness','Reduced mobility','Warmth & swelling'],
    causes: ['Age-related wear','Autoimmune (RA)','Previous injuries','Obesity'],
    treatment: 'Hydrotherapy, gentle mobilization, strengthening, activity modification',
    duration: 'Long-term management' },
  { name: 'Muscle Strain',          emoji: '💪', tagline: 'Soft tissue injuries & sprains',      color: '#4CAF50',
    symptoms: ['Muscle soreness','Swelling & bruising','Limited function','Weakness'],
    causes: ['Overstretching','Heavy lifting','Sudden movement','Chronic overuse'],
    treatment: 'Soft tissue massage, ultrasound therapy, progressive strengthening',
    duration: '1–6 weeks' },
]

export default function ConditionsPage() {
  return (
    <>
      <PageHeroWrapper
        badge="We Can Help"
        title={<><span className="text-white">Conditions </span><span className="text-shimmer">We Treat</span></>}
        subtitle="Our expert physiotherapists diagnose and treat a wide range of musculoskeletal, neurological and sports-related conditions."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Conditions' }]}
        accentColor="gold"
        sceneName="conditions"
      />

      <main>
        {/* ── Overview grid ── */}
        <section className="py-12 md:py-20" aria-labelledby="conditions-grid-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <Anim className="text-center mb-8 md:mb-12">
              <h2 id="conditions-grid-heading" className="font-display text-2xl sm:text-3xl md:text-4xl font-bold">
                <span className="text-white">All </span><span className="text-brand-green">Conditions</span>
              </h2>
              <p className="text-gray-400 font-sans mt-2 text-sm sm:text-base max-w-xl mx-auto">
                Tap any condition to jump to detailed info, symptoms, causes and our treatment approach.
              </p>
            </Anim>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 mb-12 md:mb-16">
              {CONDITIONS.map(({ name, emoji, color }, i) => (
                <Anim key={name} direction="up" delay={i * 0.05}>
                  <a href={`#${name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="glass rounded-xl sm:rounded-2xl p-3.5 sm:p-5 text-center border border-white/5 hover:border-brand-gold/25 transition-all duration-300 group block">
                    <span className="text-2xl sm:text-3xl mb-2 sm:mb-3 block group-hover:scale-110 transition-transform duration-300">{emoji}</span>
                    <p className="font-sans font-semibold text-xs sm:text-sm text-white group-hover:text-brand-gold transition-colors">{name}</p>
                  </a>
                </Anim>
              ))}
            </div>
          </div>
        </section>

        <div className="divider mx-4 sm:mx-6" />

        {/* ── Condition Details ── */}
        <section className="py-12 md:py-20" aria-label="Condition details">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10 sm:space-y-14">
            {CONDITIONS.map((cond, i) => {
              const { name, emoji, tagline, color, symptoms, causes, treatment, duration } = cond
              const slug = name.toLowerCase().replace(/\s+/g, '-')
              return (
                <article key={name} id={slug} className="scroll-mt-36" aria-labelledby={`${slug}-heading`}>
                  <Anim direction={i % 2 === 0 ? 'left' : 'right'}>
                    <div className="glass rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-10 border relative overflow-hidden"
                      style={{ borderColor: `${color}22` }}>
                      <div className="absolute top-0 right-0 w-40 h-40 sm:w-64 sm:h-64 pointer-events-none opacity-[0.04]"
                        style={{ background: `radial-gradient(circle, ${color}, transparent)`, transform: 'translate(30%,-30%)' }} />
                      <div className="relative z-10">
                        {/* Header */}
                        <div className="flex items-start gap-3 sm:gap-5 mb-6">
                          <span className="text-3xl sm:text-4xl md:text-5xl flex-shrink-0 leading-none">{emoji}</span>
                          <div>
                            <span className="section-badge" style={{ color, borderColor: `${color}28`, background: `rgba(${color === '#C9A84C' ? '201,168,76' : '76,175,80'},.07)` }}>
                              {tagline}
                            </span>
                            <h3 id={`${slug}-heading`} className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-white mt-1">{name}</h3>
                          </div>
                        </div>

                        {/* Info grid — stacks to 1-col on mobile, 2-col on sm, 4-col on xl */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                          {[
                            { title: 'Common Symptoms', items: symptoms, dotColor: color },
                            { title: 'Typical Causes',   items: causes,  dotColor: color === '#C9A84C' ? '#4CAF50' : '#C9A84C' },
                          ].map(({ title, items, dotColor }) => (
                            <div key={title} className="glass rounded-xl p-4 border border-white/5">
                              <h4 className="font-sans font-bold text-xs uppercase tracking-wider mb-3" style={{ color: dotColor }}>{title}</h4>
                              <ul className="space-y-1.5" role="list">
                                {items.map(item => (
                                  <li key={item} className="flex items-start gap-2 text-sm font-sans text-gray-400">
                                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: dotColor }} />{item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}

                          <div className="glass rounded-xl p-4 border border-white/5">
                            <h4 className="font-sans font-bold text-xs uppercase tracking-wider mb-3" style={{ color }}>Our Treatment</h4>
                            <p className="text-sm font-sans text-gray-400 leading-relaxed">{treatment}</p>
                          </div>

                          <div className="glass rounded-xl p-4 border border-white/5 flex flex-col justify-between gap-4">
                            <div>
                              <h4 className="font-sans font-bold text-xs uppercase tracking-wider mb-3 text-gray-500">Recovery Timeline</h4>
                              <p className="font-display font-semibold text-base text-white">{duration}</p>
                            </div>
                            <a href="tel:+918128370332"
                              className="btn-brand text-xs sm:text-sm py-2.5 px-4 justify-center w-full text-center"
                              style={{ background: `linear-gradient(135deg, ${color}, ${color === '#C9A84C' ? '#4CAF50' : '#C9A84C'})` }}>
                              <Phone size={12} /> Book Consult
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
        <section className="pb-14 md:pb-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <Anim direction="scale">
              <div className="glass-gold rounded-2xl sm:rounded-3xl p-7 sm:p-10 md:p-14 text-center border border-brand-gold/15 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.06]" style={{ background: 'linear-gradient(135deg,#C9A84C,#4CAF50)' }} />
                <div className="relative z-10">
                  <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
                    Don't See Your Condition?
                  </h2>
                  <p className="text-gray-400 font-sans text-sm sm:text-lg mb-6 sm:mb-8 max-w-xl mx-auto">
                    We treat many conditions. Contact us — our physiotherapists will assess and create a personalized plan.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <a href="tel:+918128370332" className="btn-brand shadow-gold w-full sm:w-auto">
                      <Phone size={15} /> +91 81283 70332
                    </a>
                    <Link href="/contact" className="btn-outline w-full sm:w-auto">
                      Book Online <ArrowRight size={14} />
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
