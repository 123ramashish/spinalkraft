'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { ReactNode } from 'react'

interface Crumb { label: string; href?: string }
interface Props {
  badge: string
  title: ReactNode
  subtitle: string
  breadcrumbs: Crumb[]
  accentColor?: 'gold' | 'green'
  /** Optional Three.js scene rendered behind the text */
  scene?: ReactNode
}

export default function PageHero({ badge, title, subtitle, breadcrumbs, accentColor = 'gold', scene }: Props) {
  const glowColor = accentColor === 'gold' ? 'rgba(201,168,76,0.12)' : 'rgba(76,175,80,0.12)'

  return (
    <section
      className="relative pt-24 sm:pt-32 md:pt-40 pb-12 md:pb-24 overflow-hidden min-h-[40vh] md:min-h-[45vh] flex flex-col justify-center"
    >
      {/* Three.js scene layer */}
      {scene && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          {scene}
          {/* Overlay to darken and blend the scene */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(3,10,16,0.6) 0%, rgba(3,10,16,0.85) 60%, rgba(3,10,16,0.95) 100%)' }} />
        </div>
      )}

      {/* No scene: static gradient */}
      {!scene && (
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${glowColor}, transparent 65%)` }} />
      )}

      {/* Decorative blobs */}
      <div className="absolute -top-24 -right-24 w-64 h-64 md:w-96 md:h-96 rounded-full opacity-[0.05] pointer-events-none blur-3xl"
        style={{ background: accentColor === 'gold' ? '#C9A84C' : '#4CAF50' }} />
      <div className="absolute -bottom-12 -left-12 w-40 h-40 md:w-64 md:h-64 rounded-full opacity-[0.03] pointer-events-none blur-3xl"
        style={{ background: accentColor === 'gold' ? '#4CAF50' : '#C9A84C' }} />

      <div className="container-fluid relative z-10 text-center">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-1.5 sm:gap-2 mb-6 flex-wrap opacity-60">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5 sm:gap-2">
              {i > 0 && <ChevronRight size={10} className="text-gray-500" />}
              {crumb.href ? (
                <Link href={crumb.href} className="text-[10px] sm:text-xs font-sans font-bold uppercase tracking-widest text-gray-400 hover:text-brand-gold transition-colors duration-300">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-[10px] sm:text-xs font-sans font-bold uppercase tracking-widest text-brand-gold">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>

        {/* Badge */}
        <motion.div 
          initial={{ opacity:0, y:14 }} 
          animate={{ opacity:1, y:0 }} 
          transition={{ duration:0.5 }}
          className="section-badge mx-auto w-fit mb-4"
        >
          <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse flex-shrink-0 shadow-glow-sm" />
          {badge}
        </motion.div>

        {/* Title */}
        <motion.h1 
          initial={{ opacity:0, y:22 }} 
          animate={{ opacity:1, y:0 }} 
          transition={{ duration:0.65, delay:0.1 }}
          className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 tracking-tight"
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity:0, y:16 }} 
          animate={{ opacity:1, y:0 }} 
          transition={{ duration:0.65, delay:0.22 }}
          className="text-gray-400 font-sans text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed px-4 opacity-90"
        >
          {subtitle}
        </motion.p>

        {/* Accent line */}
        <motion.div 
          initial={{ scaleX:0 }} 
          animate={{ scaleX:1 }} 
          transition={{ duration:0.8, delay:0.4 }}
          className="mt-10 mx-auto w-16 md:w-24 h-[3px] rounded-full shadow-glow-sm"
          style={{ background:'linear-gradient(90deg, #C9A84C, #4CAF50)' }}
        />
      </div>
    </section>
  )
}
