import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

// ─── SEO Metadata (Server Component) ─────────────────────────────────────────

export const metadata: Metadata = {
  title: 'SpinalKraft Physiotherapy Clinic | Greater Noida Sector 4',
}

const HomeClient = dynamic(() => import('./HomeClient'), { ssr: false })

export default function HomePage() {
  return <HomeClient />
}