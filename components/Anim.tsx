'use client'

import { motion, Variants, MotionProps } from 'framer-motion'
import { ReactNode } from 'react'

type Direction = 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade'

interface Props extends Omit<MotionProps, 'variants'> {
  children: ReactNode
  direction?: Direction
  delay?: number
  duration?: number
  className?: string
  once?: boolean
  amount?: number
}

const variantMap: Record<Direction, Variants> = {
  up:    { hidden: { opacity: 0, y: 40  }, visible: { opacity: 1, y: 0  } },
  down:  { hidden: { opacity: 0, y: -40 }, visible: { opacity: 1, y: 0  } },
  left:  { hidden: { opacity: 0, x: 60  }, visible: { opacity: 1, x: 0  } },
  right: { hidden: { opacity: 0, x: -60 }, visible: { opacity: 1, x: 0  } },
  scale: { hidden: { opacity: 0, scale: 0.85 }, visible: { opacity: 1, scale: 1 } },
  fade:  { hidden: { opacity: 0 },             visible: { opacity: 1       } },
}

export default function Anim({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.65,
  className,
  once = true,
  amount = 0.15,
  ...rest
}: Props) {
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
