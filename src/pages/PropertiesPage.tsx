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
    setLoading(true)
    try {
      await submitLead({
        lead_type: 'buyer_agreement',
        specialty: 'mls_alert',
        name: form.name,
        email: form.email,
        phone: form.phone,
        payload: { city, min_price: min, max_price: max, beds, kind: 'mls_alert' },
      })
      toast.success('Alert created — new matching listings will reach your inbox.')
      setForm({ name: '', email: '', phone: '' })
    } catch {
      toast.error('Could not save your alert. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const title = city
    ? `${city} Homes for Sale · Silicon Valley Realtors`
    : 'Silicon Valley Homes for Sale · MLS Search'
  const description = city
    ? `Browse luxury homes for sale in ${city}. Live MLS listings curated by Silicon Valley Realtors.`
    : 'Search live MLS listings across Palo Alto, Atherton, Menlo Park, Los Altos Hills, Woodside and the rest of Silicon Valley.'

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
              Live MLS data for every Silicon Valley city — searchable by price, beds, neighborhood, and architecture.
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
            <h2 className="font-display text-2xl font-bold mb-3">Live MLS feed connecting</h2>
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
              <button
                disabled={loading}
                className="sm:col-span-3 bg-foreground text-primary-foreground rounded-xl px-4 py-2.5 text-sm font-medium hover:opacity-90 gentle-animation disabled:opacity-50"
              >
                {loading ? 'Saving…' : 'Create MLS alert'}
              </button>
            </form>
          </section>
        </div>
      </main>
      <Footer />
      <ChatBot />
    </div>
  )
}
