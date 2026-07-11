'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageNavbar } from '@/components/PageNavbar'
import { Footer } from '@/components/Footer'
import { ChatBot } from '@/components/ChatBot'
import { IDXSearch } from '@/components/IDXSearch'
import { SEO, ORG_JSON_LD, breadcrumbJsonLd } from '@/components/SEO'
import { submitLead } from '@/lib/leads'
import { toast } from 'sonner'

/**
 * IDX-ready properties page. Renders search params for SEO-friendly URLs
 * and captures buyer intent leads while the MLS/IDX provider is being wired.
 */
export default function PropertiesPage() {
  const [params] = useSearchParams()
  const city = params.get('city') ?? ''
  const min = params.get('min_price') ?? ''
  const max = params.get('max_price') ?? ''
  const beds = params.get('beds') ?? ''

  const summary = [
    city || 'All Silicon Valley',
    beds ? `${beds} bed` : null,
    min || max ? `$${min || '0'}–$${max || '∞'}` : null,
  ].filter(Boolean).join(' · ')

  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [tcpaConsent, setTcpaConsent] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (city || min || max || beds) {
      // SEO log — search performed
      console.info('IDX search:', { city, min, max, beds })
    }
  }, [city, min, max, beds])

  const onAlertSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email) { toast.error('Email required'); return }
    if (form.phone && !tcpaConsent) {
      toast.error('Please consent to contact to submit a phone number.')
      return
    }
    setLoading(true)
    try {
      await submitLead({
        lead_type: 'buyer_agreement',
        specialty: 'mls_alert',
        name: form.name,
        email: form.email,
        phone: form.phone,
        payload: {
          city, min_price: min, max_price: max, beds, kind: 'mls_alert',
          tcpa_consent: tcpaConsent,
          tcpa_consent_at: tcpaConsent ? new Date().toISOString() : null,
        },
      })
      toast.success('Alert created — new matching listings will reach your inbox.')
      setForm({ name: '', email: '', phone: '' })
      setTcpaConsent(false)
    } catch {
      toast.error('Could not save your alert. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const title = city
    ? `${city} Homes for Sale · Nikolaenko Property Group`
    : 'Silicon Valley Homes for Sale · MLS Search'
  const description = city
    ? `Browse luxury homes for sale in ${city}. Silicon Valley listings, presented by Nikolaenko Property Group.`
    : 'Explore homes for sale across Palo Alto, Atherton, Menlo Park, Los Altos Hills, Woodside and the rest of Silicon Valley.'

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title={title}
        description={description}
        jsonLd={[ORG_JSON_LD, {
          '@context': 'https://schema.org',
          '@type': 'SearchResultsPage',
          name: title,
          about: city || 'Silicon Valley',
        }, breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Properties', path: '/properties' },
        ])]}
      />
      <PageNavbar />
      <main className="pt-24 pb-20" role="main">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <header className="text-center mb-10">
            <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-3">MLS / IDX Search</p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
              {city ? `Homes for Sale in ${city}` : 'Silicon Valley Homes for Sale'}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Silicon Valley homes for every city — searchable by price, beds, neighborhood, and architecture.
            </p>
          </header>

          <div className="max-w-4xl mx-auto mb-10">
            <IDXSearch />
            {summary && (
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Showing: <span className="text-foreground font-medium">{summary}</span>
              </p>
            )}
          </div>

          <section
            className="max-w-4xl mx-auto bg-card clean-border rounded-2xl p-8 text-center"
            aria-label="MLS feed placeholder"
          >
            <h2 className="font-display text-2xl font-bold mb-3">Connecting you to</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              We're integrating with the MLSListings IDX feed. In the meantime, set a free saved-search alert and we'll
              email you matching properties the moment they hit the market.
            </p>
            <form onSubmit={onAlertSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
              <input
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="px-4 py-2.5 rounded-xl bg-background border border-border text-sm"
              />
              <input
                type="email"
                required
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="px-4 py-2.5 rounded-xl bg-background border border-border text-sm"
              />
              <input
                placeholder="Phone (optional)"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="px-4 py-2.5 rounded-xl bg-background border border-border text-sm"
              />
              <label className="sm:col-span-3 flex items-start gap-2 text-xs text-muted-foreground text-left leading-relaxed cursor-pointer">
                <input
                  type="checkbox"
                  checked={tcpaConsent}
                  onChange={(e) => setTcpaConsent(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-border accent-foreground flex-shrink-0"
                />
                <span>
                  I agree to receive calls, SMS, and emails from Nikolaenko Property Group about matching listings and my search.
                  Msg & data rates may apply. Reply <span className="font-mono">STOP</span> to opt out. Consent is not required to browse listings.
                </span>
              </label>
              <button
                disabled={loading}
                className="sm:col-span-3 bg-foreground text-primary-foreground rounded-xl px-4 py-2.5 text-sm font-medium hover:opacity-90 gentle-animation disabled:opacity-50"
              >
                {loading ? 'Saving…' : 'Create MLS alert'}
              </button>
            </form>
          </section>

          <aside
            className="max-w-4xl mx-auto mt-10 text-xs text-muted-foreground leading-relaxed space-y-2"
            aria-label="MLS / IDX disclaimer"
          >
            <p>
              <span className="font-medium text-foreground">MLS / IDX Disclaimer.</span> Listing information is provided
              in part by the MLSListings Inc. Internet Data Exchange (IDX) program. All data is deemed reliable but is
              not guaranteed accurate by the MLS or Nikolaenko Property Group. Properties displayed may not be all of the
              properties in the MLS database, and properties listed with brokerage firms other than Nikolaenko Property Group
              are marked with the Broker Reciprocity thumbnail logo, with detailed information including the listing
              broker's firm name. Information last updated at time of access; buyers should independently verify all
              material facts. © {new Date().getFullYear()} MLSListings Inc. All rights reserved.
            </p>
            <p>
              Real estate services provided by Nikolaenko Property Group, licensed under the California Department of Real
              Estate (DRE #XXXXXXXX). Equal Housing Opportunity.
            </p>
          </aside>
        </div>
      </main>
      <Footer />
      <ChatBot />
    </div>
  )
}
