'use client'

import { PageNavbar } from '@/components/PageNavbar'
import { Footer } from '@/components/Footer'
import { ChatBot } from '@/components/ChatBot'
import { SEO, breadcrumbJsonLd } from '@/components/SEO'
import chrisPhoto from '@/assets/chris-nikolaenko.jpg.asset.json'
import { Phone, Mail, MessageCircle, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const SITE_URL = 'https://nikolaenkoestates.com'

const AGENT_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  '@id': `${SITE_URL}/about/chris#agent`,
  name: 'Chris Nikolaenko',
  jobTitle: 'Senior Listing Agent · Buyer\u2019s Agent',
  image: `${SITE_URL}/og-image.jpg`,
  url: `${SITE_URL}/about/chris`,
  telephone: '+1-650-640-9777',
  email: 'hello@nikolaenkoestates.com',
  worksFor: {
    '@type': 'RealEstateAgent',
    name: 'Nikolaenko Estates',
    url: SITE_URL,
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Palo Alto',
    addressRegion: 'CA',
    addressCountry: 'US',
  },
  areaServed: [
    'Palo Alto', 'Atherton', 'Los Altos Hills', 'Menlo Park', 'Woodside',
    'Portola Valley', 'Saratoga', 'Los Gatos', 'Cupertino', 'Mountain View',
    'Sunnyvale', 'San Francisco', 'Tiburon', 'Mill Valley',
  ],
  knowsAbout: [
    'Luxury Real Estate', 'Cinematic Listing Marketing', 'Off-Market Transactions',
    'Buyer Representation', 'Silicon Valley Relocation', '1031 Exchange',
  ],
  knowsLanguage: ['English'],
}

export default function AboutPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="About Chris Nikolaenko · Silicon Valley Luxury Agent"
        description="Meet Chris Nikolaenko — senior listing agent and buyer's agent at Nikolaenko Estates, representing luxury real estate across Palo Alto, Atherton, Menlo Park, and the greater Bay Area."
        canonical={`${SITE_URL}/about/chris`}
        image={chrisPhoto}
        jsonLd={[AGENT_JSON_LD, breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about/chris' },
        ])]}
      />
      <PageNavbar />
      <main className="pt-24 pb-20" role="main">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_1.2fr] gap-14 max-w-6xl mx-auto items-start">
            <div className="lg:sticky lg:top-28">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden elevated-shadow">
                <img
                  src={chrisPhoto}
                  alt="Chris Nikolaenko, Senior Listing Agent at Nikolaenko Estates"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
              <div className="mt-6 space-y-3 text-sm">
                <a href="tel:+16506409777" className="flex items-center gap-3 text-foreground hover:text-muted-foreground gentle-animation">
                  <Phone className="w-4 h-4" /> (650) 640-9777
                </a>
                <a href="https://wa.me/16506409777" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-foreground hover:text-muted-foreground gentle-animation">
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
                <a href="mailto:hello@nikolaenkoestates.com" className="flex items-center gap-3 text-foreground hover:text-muted-foreground gentle-animation">
                  <Mail className="w-4 h-4" /> hello@nikolaenkoestates.com
                </a>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="w-4 h-4" /> Palo Alto · Serving the Bay Area
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-[#b8860b] mb-4">Founder · Senior Listing Agent</p>
              <h1 className="font-display text-4xl sm:text-5xl font-bold mb-6 leading-tight">
                Chris Nikolaenko
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Chris founded Nikolaenko Estates to bring a more thoughtful, cinematic, and
                technology-driven approach to Silicon Valley luxury real estate. He personally
                represents sellers and buyers across Palo Alto, Atherton, Menlo Park,
                Los Altos Hills, Woodside, and the greater Bay Area.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed mb-6">
                Every listing is treated as a story worth telling — with drone cinematography,
                twilight photography, custom video tours, and a marketing plan built around the
                exact buyer pool for each home. On the buyer side, Chris pairs deep local
                inventory knowledge with an off-market network that surfaces homes long before
                they hit the MLS.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed mb-10">
                Whether you're relocating to the Peninsula, selling a legacy family estate,
                or exploring a discreet off-market opportunity, Chris and the Nikolaenko
                Estates team handle the entire transaction with discretion, precision, and
                a personal cadence you'll feel from the first call.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {[
                  { label: 'Specialties', value: 'Luxury Listings · Buyer Representation · Off-Market' },
                  { label: 'Coverage', value: 'Peninsula · South Bay · East Bay · SF · Marin' },
                  { label: 'Languages', value: 'English' },
                  { label: 'License', value: 'CA DRE #XXXXXXXX' },
                ].map((item) => (
                  <div key={item.label} className="bg-card clean-border rounded-xl p-4">
                    <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-1">{item.label}</p>
                    <p className="text-sm text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate('/#contact')}
                  className="bg-foreground text-primary-foreground rounded-xl px-6 py-3 text-sm font-medium hover:opacity-90 gentle-animation"
                >
                  Work with Chris
                </button>
                <button
                  onClick={() => navigate('/off-market')}
                  className="border border-border rounded-xl px-6 py-3 text-sm font-medium hover:bg-muted gentle-animation"
                >
                  See off-market listings
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ChatBot />
    </div>
  )
}
