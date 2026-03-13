'use client'

import { useScroll, useSpring, motion } from 'framer-motion'

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  return (
    <motion.div
      style={{ scaleX, transformOrigin: 'left' }}
      className="fixed top-0 inset-x-0 h-[3px] z-[100]"
      aria-hidden
      role="progressbar"
    >
      <div className="h-full bg-brand-gradient" />
    </motion.div>
  )
}
