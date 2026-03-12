import type { Metadata } from 'next'
import PageHeroWrapper from './PageHeroWrapper'
import ContactClient from './ContactClient'

export const metadata: Metadata = {
  title: 'Contact & Book Appointment — SpinalKraft Greater Noida',
  description:
    'Book a physiotherapy appointment at SpinalKraft Clinic, Greater Noida Sector 4. Call +91 81283 70332 or fill the online form. Open 7AM–11:30PM daily. ₹500 consultation fee.',
  alternates: { canonical: 'https://spinalkraft.in/contact' },
  openGraph: {
    title: 'Book Appointment | SpinalKraft Physiotherapy Greater Noida',
    description: 'Visit SpinalKraft at Greater Noida Sector 4. Open 7AM–11:30PM. ₹500 consultation. Call +91 81283 70332.',
    url: 'https://spinalkraft.in/contact',
  },
  keywords: ['book physiotherapy Greater Noida', 'SpinalKraft appointment', 'physiotherapy clinic Sector 4'],
}

export default function ContactPage() {
  return (
    <>
      <PageHeroWrapper
        badge="Get In Touch"
        title={<><span className="text-white">Book Your </span><span className="text-shimmer">Appointment</span></>}
        subtitle="Take the first step towards a pain-free life. Visit us, call or fill in the form — our team will get back to you promptly."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
        accentColor="gold"
        sceneName="contact"
      />
      <ContactClient />
    </>
  )
}
