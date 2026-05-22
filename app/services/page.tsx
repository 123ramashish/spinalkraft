import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

// ─── SEO Metadata (Server Component) ─────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Physiotherapy Services — Spinal, Sports, Neurological & Orthopedic | SpinalKraft',
}

// ─── Lazy-load client bundle so metadata stays server-side ────────────────────

const ServicesPageClient = dynamic(() => import('./ServicePageClient'), { ssr: false })

export default function ServicesPage() {
  return <ServicesPageClient />
}