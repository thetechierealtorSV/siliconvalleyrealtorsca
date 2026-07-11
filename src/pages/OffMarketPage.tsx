'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { PageNavbar } from '@/components/PageNavbar'
import { Footer } from '@/components/Footer'
import { SEO, breadcrumbJsonLd } from '@/components/SEO'
import { Lock, Bed, Bath, Maximize, MapPin, Check } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'

type Listing = {
  id: string
  neighborhood: string
  price_band: string
  beds: number | null
  baths: number | null
  sqft: number | null
  teaser_summary: string
  hero_image_url: string | null
}

const unlockSchema = z.object({
  name: z.string().trim().min(1, 'Name required').max(120),
  email: z.string().trim().email('Valid email required').max(200),
  phone: z.string().trim().max(50).optional().or(z.literal('')),
})

export default function OffMarketPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [unlocked, setUnlocked] = useState<Set<string>>(new Set())

  useEffect(() => {
    const saved = sessionStorage.getItem('offmarket_unlocked')
    if (saved) setUnlocked(new Set(JSON.parse(saved)))
    ;(async () => {
      const { data, error } = await supabase
        .from('offmarket_listings')
        .select('id, neighborhood, price_band, beds, baths, sqft, teaser_summary, hero_image_url')
        .eq('status', 'active')
        .order('display_order', { ascending: true })
      if (error) console.error(error)
      setListings(data ?? [])
      setLoading(false)
    })()
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Off-Market Listings · Nikolaenko Property Group"
        description="Private, pre-MLS, and pocket listings across Palo Alto, Atherton, Menlo Park, Woodside, Los Altos Hills and the Bay Area. Unlock full details with a quick email."
        canonical="https://luxury.nikolaenkopropertygroup.com/off-market"
        jsonLd={{
          '@context': 'https://schema.org',
          '@graph': [
            breadcrumbJsonLd([
              { name: 'Home', path: '/' },
              { name: 'Off-Market', path: '/off-market' },
            ]),
            {
              '@type': 'ItemList',
              name: 'Off-Market & Pocket Listings',
              numberOfItems: listings.length,
              itemListElement: listings.map((l, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                item: {
                  '@type': 'Residence',
                  name: `Off-market residence in ${l.neighborhood}`,
                  description: l.teaser_summary,
                  address: { '@type': 'PostalAddress', addressLocality: l.neighborhood, addressRegion: 'CA' },
                  numberOfRooms: l.beds ?? undefined,
                  floorSize: l.sqft ? { '@type': 'QuantitativeValue', value: l.sqft, unitCode: 'FTK' } : undefined,
                },
              })),
            },
          ],
        }}
      />
      <PageNavbar />

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <header className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4 font-medium">Private Inventory</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">Off-Market & Pocket Listings</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              A discreet selection of pre-MLS, pocket, and quietly-marketed estates across Silicon Valley.
              These don't appear on Zillow or Redfin. Unlock full address, agent notes, and showing access.
            </p>
          </header>

          {loading ? (
            <div className="text-center text-muted-foreground py-16">Loading private inventory…</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {listings.map((l) => (
                <ListingCard
                  key={l.id}
                  listing={l}
                  unlocked={unlocked.has(l.id)}
                  onUnlock={(id) => {
                    const next = new Set(unlocked); next.add(id)
                    setUnlocked(next)
                    sessionStorage.setItem('offmarket_unlocked', JSON.stringify([...next]))
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

function ListingCard({ listing, unlocked, onUnlock }: { listing: Listing; unlocked: boolean; onUnlock: (id: string) => void }) {
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [details, setDetails] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const parsed = unlockSchema.safeParse(form)
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message)
      return
    }
    setSubmitting(true)
    try {
      const normalizedEmail = parsed.data.email.trim().toLowerCase()
      const { error: unlockErr } = await supabase.from('offmarket_unlocks').insert({
        listing_id: listing.id,
        email: normalizedEmail,
        name: parsed.data.name,
        phone: parsed.data.phone || null,
        source_page: '/off-market',
      })
      if (unlockErr) throw unlockErr

      // Server-side gated retrieval of hidden details (verifies unlock row by email)
      const { data: hiddenData, error: rpcErr } = await supabase.functions.invoke('get-offmarket-details', {
        body: { listing_id: listing.id, email: normalizedEmail },
      })
      if (rpcErr) throw rpcErr
      setDetails((hiddenData?.hidden_details as string | null) ?? 'Details will be emailed to you shortly.')

      // Also drop a lead so it flows through normal lead routing + SMS welcome
      await supabase.from('leads').insert({
        lead_type: 'buyer_agreement',
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        priority: 'hot',
        status: 'new',
        source_page: '/off-market',
        payload: { listing_id: listing.id, neighborhood: listing.neighborhood, captured_by: 'offmarket_unlock' },
      })

      onUnlock(listing.id)
      toast.success('Unlocked. An agent will follow up shortly.')
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden elevated-shadow flex flex-col">
      <div className="relative aspect-[16/10] bg-secondary overflow-hidden">
        {listing.hero_image_url ? (
          <img src={listing.hero_image_url} alt={listing.neighborhood} loading="lazy" className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
            <Lock className="w-10 h-10 text-muted-foreground/50" />
          </div>
        )}
        <div className="absolute top-3 left-3 text-[10px] tracking-[0.2em] uppercase bg-foreground text-primary-foreground px-3 py-1.5 rounded-md">
          Off-Market
        </div>
        <div className="absolute top-3 right-3 text-xs bg-background/90 text-foreground px-3 py-1.5 rounded-md font-medium">
          {listing.price_band}
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
          <MapPin className="w-4 h-4" />
          {listing.neighborhood}
        </div>
        <p className="text-foreground/85 leading-relaxed mb-4 flex-1">{listing.teaser_summary}</p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-5">
          {listing.beds != null && <span className="flex items-center gap-1.5"><Bed className="w-4 h-4" />{listing.beds} bd</span>}
          {listing.baths != null && <span className="flex items-center gap-1.5"><Bath className="w-4 h-4" />{listing.baths} ba</span>}
          {listing.sqft != null && <span className="flex items-center gap-1.5"><Maximize className="w-4 h-4" />{listing.sqft.toLocaleString()} sf</span>}
        </div>

        {unlocked ? (
          <div className="rounded-xl bg-secondary/60 border border-border p-4">
            <div className="flex items-center gap-2 text-sm font-medium mb-2 text-foreground">
              <Check className="w-4 h-4" /> Unlocked
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">{details ?? 'An agent will follow up shortly with full address, showing access, and seller notes.'}</p>
          </div>
        ) : showForm ? (
          <form onSubmit={submit} className="space-y-2">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Full name"
              maxLength={120}
              className="w-full px-3 py-2 rounded-md border border-border bg-input-background text-sm"
              required
            />
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email"
              maxLength={200}
              className="w-full px-3 py-2 rounded-md border border-border bg-input-background text-sm"
              required
            />
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Phone (optional, for SMS updates)"
              maxLength={50}
              className="w-full px-3 py-2 rounded-md border border-border bg-input-background text-sm"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-md bg-foreground text-primary-foreground text-sm uppercase tracking-[0.15em] hover:opacity-90 gentle-animation disabled:opacity-50"
            >
              {submitting ? 'Unlocking…' : 'Unlock details'}
            </button>
            <p className="text-[10px] text-muted-foreground leading-snug pt-1">
              By unlocking, you agree to be contacted about this listing. Reply STOP to any SMS to opt out.
            </p>
          </form>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-2.5 rounded-md border border-foreground text-foreground text-sm uppercase tracking-[0.15em] hover:bg-foreground hover:text-primary-foreground gentle-animation flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" /> Unlock full details
          </button>
        )}
      </div>
    </div>
  )
}
