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
  const glowColor = accentColor === 'gold' ? 'rgba(201,168,76,0.10)' : 'rgba(76,175,80,0.10)'
  const glowColor2 = accentColor === 'gold' ? 'rgba(76,175,80,0.05)' : 'rgba(201,168,76,0.05)'

  return (
    <section
      className="relative pt-28 sm:pt-32 md:pt-40 pb-16 md:pb-24 overflow-hidden min-h-[38vh] flex flex-col justify-center"
    >
      {/* Three.js scene layer */}
      {scene && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          {scene}
          {/* Overlay to darken and blend the scene */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(5,10,14,0.55), rgba(5,10,14,0.70) 60%, rgba(5,10,14,0.92) 100%)' }} />
        </div>
      )}

      {/* No scene: static gradient */}
      {!scene && (
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${glowColor}, transparent 65%)` }} />
      )}

      {/* Decorative blobs */}
      <div className="absolute -top-24 -right-24 w-64 h-64 md:w-96 md:h-96 rounded-full opacity-[0.04] pointer-events-none"
        style={{ background: accentColor === 'gold' ? '#C9A84C' : '#4CAF50' }} />
      <div className="absolute -bottom-12 -left-12 w-40 h-40 md:w-64 md:h-64 rounded-full opacity-[0.03] pointer-events-none"
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
        <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}
          className="section-badge mx-auto w-fit mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse flex-shrink-0" />
          {badge}
        </motion.div>

        {/* Title */}
        <motion.h1 initial={{ opacity:0, y:22 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.65, delay:0.1 }}
          className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 px-2">
          {title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.65, delay:0.22 }}
          className="text-gray-400 font-sans text-base sm:text-lg max-w-2xl mx-auto leading-relaxed px-2">
          {subtitle}
        </motion.p>

        {/* Accent line */}
        <motion.div initial={{ scaleX:0 }} animate={{ scaleX:1 }} transition={{ duration:0.8, delay:0.4 }}
          className="mt-8 mx-auto w-20 h-[3px] rounded-full"
          style={{ background:'linear-gradient(90deg, #C9A84C, #4CAF50)' }}
        />
      </div>
    </section>
  )
}
