import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

// ─── SEO Metadata (Server Component) ─────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Contact & Book Appointment — SpinalKraft Physiotherapy Greater Noida',
  description:
    'Book a physiotherapy appointment at SpinalKraft Clinic, Greater Noida Sector 4. Call +91 81283 70332 or fill the online form. Open 7AM–11:30PM daily. ₹500 consultation fee.',
  alternates: { canonical: 'https://spinalkraft.in/contact' },
  keywords: [
    'book physiotherapy Greater Noida', 'SpinalKraft appointment',
    'physiotherapy clinic Sector 4', 'back pain treatment Greater Noida',
    'physiotherapy near me Greater Noida', 'SpinalKraft contact',
  ],
  openGraph: {
    title: 'Book Appointment | SpinalKraft Physiotherapy Greater Noida',
    description:
      'Visit SpinalKraft at Greater Noida Sector 4. Open 7AM–11:30PM, 7 days. ₹500 consultation. Call +91 81283 70332.',
    url: 'https://spinalkraft.in/contact',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Book Appointment | SpinalKraft Physiotherapy',
    description: 'Greater Noida Sector 4 · Open 7AM–11:30PM · ₹500 consultation · +91 81283 70332',
  },
}

// ─── Lazy-load client bundle so metadata stays server-side ────────────────────

const ContactPageClient = dynamic(() => import('./ContactPageClient'), { ssr: false })

export default function ContactPage() {
  return <ContactPageClient />
}