import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Target, Eye, Users, Award, Heart, Zap, Phone, ArrowRight, ChevronRight } from 'lucide-react'
import { ReactNode } from 'react'

// ─── Metadata (Server) ────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'About Us — Trusted Physiotherapy Clinic Greater Noida',
  description:
    'Learn about SpinalKraft Physiotherapy Clinic — our mission to restore movement, relieve pain, and improve lives in Greater Noida Sector 4.',
  alternates: { canonical: 'https://spinalkraft.in/about' },
  openGraph: {
    title: 'About SpinalKraft Physiotherapy Clinic | Greater Noida',
    description: '4.9★ from 180+ patients. Expert physiotherapists. Open 7 days.',
    url: 'https://spinalkraft.in/about',
  },
}

// ─── Client components (inlined, loaded dynamically so metadata stays valid) ──

const AboutClient = dynamic(() => import('./AboutClient'), { ssr: false })

// ─── Page (Server Component) ──────────────────────────────────────────────────

export default function AboutPage() {
  return <AboutClient />
}