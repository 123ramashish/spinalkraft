import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

// ─── SEO Metadata (Server Component) ─────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Physiotherapy Services — Spinal, Sports, Neurological & Orthopedic | SpinalKraft',
  description:
    'SpinalKraft offers spinal physiotherapy, sports injury rehab, neurological therapy, orthopedic treatment, pain management, post-surgery rehab and home physiotherapy in Greater Noida. Book at ₹500.',
  alternates: { canonical: 'https://spinalkraft.in/services' },
  keywords: [
    'physiotherapy services Greater Noida', 'spinal physiotherapy', 'sports injury rehab',
    'neurological physiotherapy', 'orthopedic therapy', 'pain management physiotherapy',
    'post surgery rehab', 'home physiotherapy Greater Noida', 'SpinalKraft services',
  ],
  openGraph: {
    title: 'Physiotherapy Services | SpinalKraft Greater Noida',
    description:
      '7 specialist services: spinal, sports, neurological, orthopedic, pain management, post-surgery & home physio. ₹500 consultation.',
    url: 'https://spinalkraft.in/services',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Physiotherapy Services | SpinalKraft Greater Noida',
    description:
      'Spinal, sports, neuro, ortho, pain management, post-surgery & home physio. Greater Noida. ₹500 consultation.',
  },
}

// ─── Lazy-load client bundle so metadata stays server-side ────────────────────

const ServicesPageClient = dynamic(() => import('./ServicePageClient'), { ssr: false })

export default function ServicesPage() {
  return <ServicesPageClient />
}