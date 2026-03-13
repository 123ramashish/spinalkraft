import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ScrollProgress from '@/components/ScrollProgress'

export const metadata: Metadata = {
  metadataBase: new URL('https://spinalkraft.in'),
  title: {
    default: 'SpinalKraft Physiotherapy Clinic | Greater Noida',
    template: '%s | SpinalKraft Physiotherapy Clinic',
  },
  description: 'SpinalKraft Physiotherapy Clinic in Greater Noida Sector 4 — expert treatment for back pain, neck pain, sports injuries, neurological conditions. 4.9★ rated. Open 7AM–11:30PM daily.',
  keywords: ['physiotherapy Greater Noida', 'physiotherapy clinic Sector 4', 'back pain treatment', 'SpinalKraft'],
  authors: [{ name: 'SpinalKraft Physiotherapy Clinic' }],
  openGraph: {
    type: 'website', locale: 'en_IN', url: 'https://spinalkraft.in',
    siteName: 'SpinalKraft Physiotherapy Clinic',
    title: 'SpinalKraft Physiotherapy Clinic | Greater Noida',
    description: 'Professional physiotherapy in Greater Noida. 4.9★ from 180+ patients.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'SpinalKraft Physiotherapy Clinic', images: ['/og-image.jpg'] },
  robots: { index: true, follow: true },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MedicalBusiness',
  name: 'SpinalKraft Physiotherapy Clinic',
  url: 'https://spinalkraft.in',
  telephone: '+918128370332',
  priceRange: '₹500',
  address: { '@type': 'PostalAddress', streetAddress: 'Sector 4, near Char Murti', addressLocality: 'Greater Noida', addressRegion: 'Uttar Pradesh', addressCountry: 'IN' },
  openingHoursSpecification: { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'], opens: '07:00', closes: '23:30' },
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '180' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;0,900;1,400;1,700&family=Nunito:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="icon" href="./components/images/logo.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="grain antialiased">
        <ScrollProgress />
        <Navbar />
        {children}
        <Footer />

        {/* Floating CTA — safe area aware on mobile */}
        <a
          href="tel:+918128370332"
          aria-label="Call SpinalKraft for appointment"
          className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-1.5 font-sans font-bold text-xs sm:text-sm text-ink-900 px-4 py-3 rounded-full shadow-gold"
          style={{
            background: 'linear-gradient(135deg, #C9A84C, #E8C96A, #4CAF50)',
            paddingBottom: 'max(12px, env(safe-area-inset-bottom, 12px))',
          }}
        >
          📞 <span className="hidden sm:inline">Book Now</span><span className="sm:hidden">Call</span>
        </a>
      </body>
    </html>
  )
}
