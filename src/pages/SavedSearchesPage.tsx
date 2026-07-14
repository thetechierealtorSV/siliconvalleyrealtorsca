'use client'

import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { PageNavbar } from '@/components/PageNavbar'
import { Footer } from '@/components/Footer'
import { SEO, breadcrumbJsonLd } from '@/components/SEO'
import { Bell, MapPin, DollarSign, Mail } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'

const NEIGHBORHOODS = ['Palo Alto','Atherton','Menlo Park','Los Altos Hills','Woodside','Portola Valley','Hillsborough','Burlingame','Mountain View','Los Altos','Saratoga','Los Gatos','Cupertino','Sunnyvale','San Jose','San Francisco','Tiburon','Mill Valley','Piedmont','Berkeley']

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(50).optional().or(z.literal('')),
  label: z.string().trim().max(200).optional().or(z.literal('')),
})

export default function SavedSearchesPage() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', label: '',
    min_price: '', max_price: '',
    min_beds: '', min_baths: '',
    property_type: 'any',
    frequency: 'weekly' as 'daily' | 'weekly' | 'price_drop_only',
    alert_on_price_drop: true,
  })
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  function toggleNeighborhood(n: string) {
    setSelectedNeighborhoods((s) => s.includes(n) ? s.filter((x) => x !== n) : [...s, n])
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const parsed = schema.safeParse(form)
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return }
    setSubmitting(true)
    try {
      const filters = {
        neighborhoods: selectedNeighborhoods,
        min_price: form.min_price ? Number(form.min_price) : null,
        max_price: form.max_price ? Number(form.max_price) : null,
        min_beds: form.min_beds ? Number(form.min_beds) : null,
        min_baths: form.min_baths ? Number(form.min_baths) : null,
        property_type: form.property_type,
      }
      const { error } = await supabase.from('saved_searches').insert({
        email: parsed.data.email,
        name: parsed.data.name,
        phone: parsed.data.phone || null,
        label: parsed.data.label || `${selectedNeighborhoods[0] ?? 'Bay Area'} alerts`,
        filters,
        frequency: form.frequency,
        alert_on_price_drop: form.alert_on_price_drop,
      })
      if (error) throw error

      // Also drop a warm lead
      await supabase.from('leads').insert({
        lead_type: 'buyer_agreement',
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        priority: 'warm',
        status: 'new',
        source_page: '/saved-searches',
        payload: { filters, frequency: form.frequency, captured_by: 'saved_search' },
      })

      setDone(true)
      toast.success('Saved. You\'ll get matching properties straight to your inbox.')
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Saved Searches & Price Alerts · Nikolaenko Property Group"
        description="Get matching Silicon Valley homes and price-drop alerts the moment they hit the market. Free, no login required."
        canonical="https://luxury.nikolaenkopropertygroup.com/saved-searches"
        jsonLd={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Saved Searches', path: '/saved-searches' },
        ])}
      />
      <PageNavbar />

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <header className="text-center max-w-3xl mx-auto mb-14">
            <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4 font-medium">Free Alerts</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">Saved Searches & Price Drops</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Tell us what you're looking for. We'll email matching homes the moment they list, and alert you the second a price drops.
            </p>
          </header>

          {done ? (
            <div className="max-w-xl mx-auto text-center bg-card border border-border rounded-2xl p-10 elevated-shadow">
              <div className="w-14 h-14 rounded-full bg-foreground text-primary-foreground mx-auto mb-5 flex items-center justify-center">
                <Bell className="w-6 h-6" />
              </div>
              <h2 className="font-display text-2xl font-bold mb-3">You're all set.</h2>
              <p className="text-muted-foreground mb-6">Watch your inbox for the first digest. Reply STOP to any SMS to opt out at any time.</p>
              <button onClick={() => setDone(false)} className="text-sm uppercase tracking-[0.15em] underline">Create another</button>
            </div>
          ) : (
          <form onSubmit={submit} className="max-w-3xl mx-auto bg-card border border-border rounded-2xl p-8 sm:p-10 elevated-shadow space-y-7">
            {/* Contact */}
            <div>
              <h3 className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3 flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> Your details</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <input required maxLength={120} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" className="px-3 py-2.5 rounded-md border border-border bg-input-background text-sm" />
                <input required type="email" maxLength={200} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="px-3 py-2.5 rounded-md border border-border bg-input-background text-sm" />
                <input type="tel" maxLength={50} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone (optional, for SMS alerts)" className="px-3 py-2.5 rounded-md border border-border bg-input-background text-sm sm:col-span-2" />
              </div>
            </div>

            {/* Neighborhoods */}
            <div>
              <h3 className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3 flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> Neighborhoods</h3>
              <div className="flex flex-wrap gap-2">
                {NEIGHBORHOODS.map((n) => {
                  const active = selectedNeighborhoods.includes(n)
                  return (
                    <button
                      type="button"
                      key={n}
                      onClick={() => toggleNeighborhood(n)}
                      className={`px-3 py-1.5 rounded-full text-xs border gentle-animation ${active ? 'bg-foreground text-primary-foreground border-foreground' : 'bg-background text-foreground border-border hover:border-foreground'}`}
                    >
                      {n}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Price + beds */}
            <div>
              <h3 className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3 flex items-center gap-2"><DollarSign className="w-3.5 h-3.5" /> Price & size</h3>
              <div className="grid sm:grid-cols-4 gap-3">
                <input type="number" min="0" value={form.min_price} onChange={(e) => setForm({ ...form, min_price: e.target.value })} placeholder="Min price" className="px-3 py-2.5 rounded-md border border-border bg-input-background text-sm" />
                <input type="number" min="0" value={form.max_price} onChange={(e) => setForm({ ...form, max_price: e.target.value })} placeholder="Max price" className="px-3 py-2.5 rounded-md border border-border bg-input-background text-sm" />
                <input type="number" min="0" value={form.min_beds} onChange={(e) => setForm({ ...form, min_beds: e.target.value })} placeholder="Min beds" className="px-3 py-2.5 rounded-md border border-border bg-input-background text-sm" />
                <input type="number" min="0" step="0.5" value={form.min_baths} onChange={(e) => setForm({ ...form, min_baths: e.target.value })} placeholder="Min baths" className="px-3 py-2.5 rounded-md border border-border bg-input-background text-sm" />
              </div>
              <div className="mt-3">
                <select value={form.property_type} onChange={(e) => setForm({ ...form, property_type: e.target.value })} className="w-full px-3 py-2.5 rounded-md border border-border bg-input-background text-sm">
                  <option value="any">Any property type</option>
                  <option value="single_family">Single family</option>
                  <option value="condo">Condo / townhome</option>
                  <option value="estate">Estate / compound</option>
                  <option value="land">Land / lot</option>
                </select>
              </div>
            </div>

            {/* Frequency */}
            <div>
              <h3 className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3 flex items-center gap-2"><Bell className="w-3.5 h-3.5" /> Alert me</h3>
              <div className="grid sm:grid-cols-3 gap-3 mb-3">
                {([
                  ['daily','Daily digest'],
                  ['weekly','Weekly digest'],
                  ['price_drop_only','Price drops only'],
                ] as const).map(([val, label]) => (
                  <label key={val} className={`flex items-center justify-center text-xs uppercase tracking-[0.15em] rounded-md py-2.5 border cursor-pointer gentle-animation ${form.frequency === val ? 'bg-foreground text-primary-foreground border-foreground' : 'bg-background text-foreground border-border hover:border-foreground'}`}>
                    <input type="radio" name="freq" value={val} checked={form.frequency === val} onChange={() => setForm({ ...form, frequency: val })} className="sr-only" />
                    {label}
                  </label>
                ))}
              </div>
              <label className="flex items-center gap-2 text-sm text-foreground/85">
                <input type="checkbox" checked={form.alert_on_price_drop} onChange={(e) => setForm({ ...form, alert_on_price_drop: e.target.checked })} />
                Also alert me on price drops for matching homes
              </label>
            </div>

            <input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Label this search (optional), e.g. 'Atherton 5br'" maxLength={200} className="w-full px-3 py-2.5 rounded-md border border-border bg-input-background text-sm" />

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-md bg-foreground text-primary-foreground text-sm uppercase tracking-[0.2em] hover:opacity-90 gentle-animation disabled:opacity-50"
            >
              {submitting ? 'Saving…' : 'Save search & start alerts'}
            </button>
            <p className="text-[11px] text-muted-foreground leading-snug">
              By saving, you agree to receive matching listings and price-drop alerts via email (and SMS if you provided a phone). Reply STOP to any SMS to opt out, HELP for help. Msg & data rates may apply.
            </p>
          </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
