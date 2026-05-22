import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

// ─── SEO Metadata (Server Component) ─────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Contact & Book Appointment — SpinalKraft Physiotherapy Greater Noida',
}

// ─── Lazy-load client bundle so metadata stays server-side ────────────────────

const ContactPageClient = dynamic(() => import('./ContactPageClient'), { ssr: false })

export default function ContactPage() {
  return <ContactPageClient />
}