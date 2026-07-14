import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { SEO } from '../components/SEO'
import { PageNavbar } from '../components/PageNavbar'
import { Footer } from '../components/Footer'

const RESOURCE_META: Record<string, { title: string; blurb: string }> = {
  'join-my-team': {
    title: 'Join My Team',
    blurb: 'We are always open to conversations with driven agents who share our concierge, tech-forward approach. A formal application portal is being finalized.',
  },
  'neighborhood-news': {
    title: 'Neighborhood News',
    blurb: 'Monthly market intelligence for Palo Alto, Atherton, Menlo Park, Los Altos Hills, Woodside, and the wider Bay Area. Sign-up form coming soon.',
  },
  'fsbo-resources': {
    title: 'For Sale By Owner Resource Request',
    blurb: 'Free pricing guides, disclosure checklists, and marketing templates for sellers considering going it alone. Request form arriving shortly.',
  },
  'partners-outreach': {
    title: 'Partners Outreach',
    blurb: 'We collaborate with lenders, designers, stagers, and inspectors across Silicon Valley. Partnership intake will be published soon.',
  },
  'relocation-consultation': {
    title: 'Relocation Consultation',
    blurb: 'Moving to or from Silicon Valley? Book a complimentary relocation consultation. Booking flow launches with our new client portal.',
  },
  'international-buyers': {
    title: 'International Buyers',
    blurb: 'Multilingual advisory, FIRPTA guidance, and remote-showing programs for international purchasers of Bay Area homes. Full landing coming soon.',
  },
}

export default function ResourcesPage() {
  const { slug = '' } = useParams()
  const meta = RESOURCE_META[slug] ?? {
    title: 'Resource',
    blurb: 'This resource is being prepared. Please check back shortly or contact us directly.',
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title={`${meta.title} | Nikolaenko Property Group`} description={meta.blurb} />
      <PageNavbar />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-3xl">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4">Resources</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-6">{meta.title}</h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-10">{meta.blurb}</p>

          <div className="rounded-2xl border border-border bg-card p-8">
            <p className="text-sm text-muted-foreground mb-4">
              <b>Content coming soon.</b> In the meantime, reach us directly:
            </p>
            <ul className="text-sm space-y-2">
              <li>Call or WhatsApp: <a className="underline" href="tel:+16506409777">(650) 640-9777</a></li>
              <li>Email: <a className="underline" href="mailto:info@nikolaenkopropertygroup.com">info@nikolaenkopropertygroup.com</a></li>
              <li><Link to="/" className="underline">Return to homepage</Link></li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
