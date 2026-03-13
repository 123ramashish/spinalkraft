import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

// ─── SEO Metadata (Server Component) ─────────────────────────────────────────

export const metadata: Metadata = {
  title: 'SpinalKraft Physiotherapy Clinic | Greater Noida Sector 4',
  description:
    'SpinalKraft — expert physiotherapy in Greater Noida Sector 4. Treatment for back pain, neck pain, sciatica, sports injuries, neurological conditions and more. Open 7AM–11:30PM, 7 days. ₹500 consultation.',
  alternates: { canonical: 'https://spinalkraft.in' },
  keywords: [
    'physiotherapy Greater Noida', 'best physiotherapy clinic Greater Noida',
    'back pain treatment Sector 4', 'sciatica physiotherapy', 'sports injury rehab Greater Noida',
    'SpinalKraft physiotherapy', 'home physiotherapy Greater Noida',
  ],
  openGraph: {
    title: 'SpinalKraft Physiotherapy Clinic | Greater Noida',
    description: 'Professional physiotherapy in Greater Noida. 4.9★ rated from 180+ patients. Open 7AM–11:30PM. ₹500 consultation.',
    url: 'https://spinalkraft.in',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SpinalKraft Physiotherapy | Greater Noida',
    description: 'Expert physiotherapy for back pain, sciatica, sports injuries & more. ₹500 consultation. Open daily 7AM–11:30PM.',
  },
}

const HomeClient = dynamic(() => import('./HomeClient'), { ssr: false })

export default function HomePage() {
  return <HomeClient />
}