import type { Metadata } from 'next'
import HomeClient from './HomeClient'

export const metadata: Metadata = {
  title: 'SpinalKraft Physiotherapy Clinic | Greater Noida Sector 4',
  description:
    'SpinalKraft – expert physiotherapy in Greater Noida Sector 4. Treatment for back pain, neck pain, sciatica, sports injuries, neurological conditions. Open 7AM–11:30PM. ₹500 consultation.',
  alternates: { canonical: 'https://spinalkraft.in' },
  openGraph: {
    title: 'SpinalKraft Physiotherapy Clinic | Greater Noida',
    description: 'Professional physiotherapy. 4.9★ rated. Open 7AM–11:30PM. ₹500 consultation.',
    url: 'https://spinalkraft.in',
  },
}

export default function HomePage() {
  return <HomeClient />
}
