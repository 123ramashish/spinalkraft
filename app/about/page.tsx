import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Target, Eye, Users, Award, Heart, Zap, Phone, ArrowRight, ChevronRight } from 'lucide-react'
import { ReactNode } from 'react'

// ─── Metadata (Server) ────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'About Us — Trusted Physiotherapy Clinic Greater Noida',
}

// ─── Client components (inlined, loaded dynamically so metadata stays valid) ──

const AboutClient = dynamic(() => import('./AboutClient'), { ssr: false })

// ─── Page (Server Component) ──────────────────────────────────────────────────

export default function AboutPage() {
  return <AboutClient />
}