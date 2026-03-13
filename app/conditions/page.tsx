import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

// ─── SEO Metadata (Server Component) ─────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Conditions We Treat — Back Pain, Sciatica, Sports Injuries & More | SpinalKraft',
  description:
    'SpinalKraft treats back pain, neck pain, sciatica, frozen shoulder, knee pain, slip disc, sports injuries, stroke rehab, arthritis and more in Greater Noida. Book a ₹500 consultation today.',
  alternates: { canonical: 'https://spinalkraft.in/conditions' },
  keywords: [
    'physiotherapy Greater Noida', 'back pain treatment', 'sciatica physiotherapy',
    'frozen shoulder treatment', 'knee pain physiotherapy', 'slip disc treatment',
    'sports injury rehab', 'paralysis rehabilitation', 'arthritis physiotherapy',
    'neck pain treatment Greater Noida',
  ],
  openGraph: {
    title: 'Conditions Treated | SpinalKraft Physiotherapy Greater Noida',
    description:
      '10+ conditions treated: back pain, sciatica, frozen shoulder, sports injuries, paralysis rehab. Expert BPT/MPT therapists. ₹500 consultation.',
    url: 'https://spinalkraft.in/conditions',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Conditions Treated | SpinalKraft Physiotherapy',
    description: '10+ conditions treated in Greater Noida. Book a ₹500 consultation.',
  },
}

// ─── Lazy-load the client bundle so metadata remains server-side ──────────────

const ConditionsClient = dynamic(() => import('./ConditionClient'), { ssr: false })

export default function ConditionsPage() {
  return <ConditionsClient />
}