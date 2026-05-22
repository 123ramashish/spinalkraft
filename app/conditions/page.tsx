import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

// ─── SEO Metadata (Server Component) ─────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Conditions We Treat — Back Pain, Sciatica, Sports Injuries & More | SpinalKraft',
}

// ─── Lazy-load the client bundle so metadata remains server-side ──────────────

const ConditionsClient = dynamic(() => import('./ConditionClient'), { ssr: false })

export default function ConditionsPage() {
  return <ConditionsClient />
}