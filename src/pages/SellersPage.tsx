'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Building, Star, Wrench, Send, CheckCircle, Sparkles, ClipboardList, Palette, Hammer, TreePine, Camera, BarChart3, Users } from 'lucide-react'
import { PageNavbar } from '@/components/PageNavbar'
import { Footer } from '@/components/Footer'
import { ChatBot } from '@/components/ChatBot'
import { SEO, ORG_JSON_LD, breadcrumbJsonLd } from '@/components/SEO'
import { submitLead } from '@/lib/leads'
import { toast } from 'sonner'

const conciergeServices = [
  { icon: Palette, title: 'Interior Staging', description: 'Professional staging to showcase your home\'s full potential. Furniture, art, and styling tailored to your property.' },
  { icon: Hammer, title: 'Pre-Sale Repairs', description: 'Coordinate necessary repairs — plumbing, electrical, roofing, and cosmetic fixes — before listing.' },
  { icon: TreePine, title: 'Landscaping & Curb Appeal', description: 'Transform your exterior with professional landscaping, power washing, and curb appeal enhancements.' },
  { icon: Camera, title: 'Photography & Video', description: 'Cinematic photography, drone footage, and virtual tour production to market your home at the highest level.' },
  { icon: BarChart3, title: 'Market Analysis (CMA)', description: 'Comprehensive comparative market analysis to price your home accurately and competitively.' },
  { icon: Users, title: 'Open House & Marketing', description: 'Full marketing plan including MLS listing, social media, targeted ads, broker tours, and open houses.' },
]

const toolkitItems = [
  { title: 'Pre-Listing Checklist', items: ['Declutter & depersonalize each room', 'Deep clean — carpets, windows, grout', 'Touch up paint — neutral tones preferred', 'Fix leaky faucets, squeaky doors, running toilets', 'Replace burnt-out bulbs, upgrade to warm LED', 'Clean or replace HVAC filters', 'Organize closets — buyers will open them', 'Store excess furniture to maximize space'] },
  { title: 'Timeline — What to Expect', items: ['Week 1–2: Home assessment & repair plan', 'Week 2–3: Repairs, staging, photography', 'Week 3–4: MLS listing goes live', 'Week 4–5: Open houses & showings', 'Week 5–8: Offers, negotiation, inspections', 'Week 8–10: Escrow, appraisal, closing'] },
  { title: 'Documents You\'ll Need', items: ['Property title & deed', 'Mortgage payoff statement', 'Property tax records (last 2 years)', 'HOA documents (if applicable)', 'Disclosure forms (TDS, SPQ, NHD)', 'Permit records for any renovations', 'Utility bills (last 12 months)', 'Home warranty information'] },
]

export default function SellersPage() {
  const [activeTab, setActiveTab] = useState<'listing' | 'concierge' | 'toolkit'>('listing')
  const [listingForm, setListingForm] = useState({
    ownerName: '', email: '', phone: '', propertyAddress: '', propertyType: '',
    bedrooms: '', bathrooms: '', squareFeet: '', yearBuilt: '', lotSize: '',
    recentUpgrades: '', reasonForSelling: '', desiredTimeline: '', priceExpectation: '',
    currentMortgage: '', selectedServices: [] as string[],
  })
  const [valuationForm, setValuationForm] = useState({
    name: '', email: '', phone: '', address: '', notes: '',
  })

  const toggleService = (service: string) => {
    setListingForm(p => ({
      ...p,
      selectedServices: p.selectedServices.includes(service)
        ? p.selectedServices.filter(s => s !== service)
        : [...p.selectedServices, service],
    }))
  }

  const handleListingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const hasConcierge = listingForm.selectedServices.length > 0
      await submitLead({
        lead_type: 'seller_listing',
        specialty: hasConcierge ? 'concierge' : undefined,
        name: listingForm.ownerName,
        email: listingForm.email,
        phone: listingForm.phone,
        payload: listingForm,
      })
      toast.success('Listing information submitted! We\'ll contact you within 24 hours to schedule a home visit.')
      setListingForm({ ownerName: '', email: '', phone: '', propertyAddress: '', propertyType: '', bedrooms: '', bathrooms: '', squareFeet: '', yearBuilt: '', lotSize: '', recentUpgrades: '', reasonForSelling: '', desiredTimeline: '', priceExpectation: '', currentMortgage: '', selectedServices: [] })
    } catch {
      toast.error('Submission failed. Please try again.')
    }
  }

  const handleValuationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await submitLead({
        lead_type: 'valuation',
        name: valuationForm.name,
        email: valuationForm.email,
        phone: valuationForm.phone,
        payload: valuationForm,
      })
      toast.success('Valuation request submitted! We\'ll prepare a market analysis for your property.')
      setValuationForm({ name: '', email: '', phone: '', address: '', notes: '' })
    } catch {
      toast.error('Submission failed. Please try again.')
    }
  }

  const tabs = [
    { id: 'listing' as const, label: 'List Your Home', icon: Building },
    { id: 'concierge' as const, label: 'Concierge Program', icon: Star },
    { id: 'toolkit' as const, label: 'Home Toolkit', icon: Wrench },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Sell Your Home · Nikolaenko Estates"
        description="List your Silicon Valley home with concierge staging, repairs, photography, marketing, and a full home seller toolkit."
        jsonLd={[ORG_JSON_LD, breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Sellers', path: '/sellers' },
        ])]}
      />
      <PageNavbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-3">For Sellers</p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Sell with Confidence
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From preparation to closing — our concierge program, home toolkit, and expert team ensure your property achieves maximum value.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium gentle-animation cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-foreground text-primary-foreground'
                    : 'bg-card clean-border text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}>
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
          </div>

          {/* Listing Tab */}
          {activeTab === 'listing' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
              <div className="bg-card rounded-2xl clean-border p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Building className="w-6 h-6" style={{ color: 'var(--accent-sage)' }} />
                  <h2 className="font-display text-2xl font-bold">Tell Us About Your Property</h2>
                </div>
                <p className="text-muted-foreground mb-8">
                  Share the details of your home and we'll create a tailored selling strategy to maximize your return.
                </p>
                <form onSubmit={handleListingSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Owner Name *</label>
                      <input required type="text" value={listingForm.ownerName} onChange={e => setListingForm(p => ({...p, ownerName: e.target.value}))}
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Email *</label>
                      <input required type="email" value={listingForm.email} onChange={e => setListingForm(p => ({...p, email: e.target.value}))}
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm" placeholder="you@email.com" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Phone *</label>
                      <input required type="tel" value={listingForm.phone} onChange={e => setListingForm(p => ({...p, phone: e.target.value}))}
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm" placeholder="(555) 123-4567" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Property Address *</label>
                      <input required type="text" value={listingForm.propertyAddress} onChange={e => setListingForm(p => ({...p, propertyAddress: e.target.value}))}
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm" placeholder="123 Main St, Palo Alto" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Property Type</label>
                      <select value={listingForm.propertyType} onChange={e => setListingForm(p => ({...p, propertyType: e.target.value}))}
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm">
                        <option value="">Select</option>
                        <option value="single-family">Single-Family</option>
                        <option value="condo">Condo</option>
                        <option value="townhome">Townhome</option>
                        <option value="multi-family">Multi-Family</option>
                        <option value="land">Land</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Bedrooms</label>
                      <input type="number" value={listingForm.bedrooms} onChange={e => setListingForm(p => ({...p, bedrooms: e.target.value}))}
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm" placeholder="4" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Bathrooms</label>
                      <input type="number" step="0.5" value={listingForm.bathrooms} onChange={e => setListingForm(p => ({...p, bathrooms: e.target.value}))}
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm" placeholder="3" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Sq Ft</label>
                      <input type="text" value={listingForm.squareFeet} onChange={e => setListingForm(p => ({...p, squareFeet: e.target.value}))}
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm" placeholder="2,500" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Year Built</label>
                      <input type="text" value={listingForm.yearBuilt} onChange={e => setListingForm(p => ({...p, yearBuilt: e.target.value}))}
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm" placeholder="e.g., 1965" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Lot Size</label>
                      <input type="text" value={listingForm.lotSize} onChange={e => setListingForm(p => ({...p, lotSize: e.target.value}))}
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm" placeholder="e.g., 8,000 sq ft" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Recent Upgrades / Renovations</label>
                    <textarea rows={2} value={listingForm.recentUpgrades} onChange={e => setListingForm(p => ({...p, recentUpgrades: e.target.value}))}
                      className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm resize-none"
                      placeholder="Kitchen remodel 2023, new roof 2022, etc." />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Reason for Selling</label>
                      <select value={listingForm.reasonForSelling} onChange={e => setListingForm(p => ({...p, reasonForSelling: e.target.value}))}
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm">
                        <option value="">Select</option>
                        <option value="upsizing">Upsizing</option>
                        <option value="downsizing">Downsizing</option>
                        <option value="relocating">Relocating</option>
                        <option value="investment">Investment property</option>
                        <option value="estate">Estate / Probate</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Desired Timeline</label>
                      <select value={listingForm.desiredTimeline} onChange={e => setListingForm(p => ({...p, desiredTimeline: e.target.value}))}
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm">
                        <option value="">Select</option>
                        <option value="asap">As soon as possible</option>
                        <option value="1-2months">1–2 months</option>
                        <option value="3-6months">3–6 months</option>
                        <option value="flexible">Flexible</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Price Expectation</label>
                      <input type="text" value={listingForm.priceExpectation} onChange={e => setListingForm(p => ({...p, priceExpectation: e.target.value}))}
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm" placeholder="e.g., $2,800,000" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Current Mortgage Balance</label>
                      <input type="text" value={listingForm.currentMortgage} onChange={e => setListingForm(p => ({...p, currentMortgage: e.target.value}))}
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm" placeholder="e.g., $800,000 (optional)" />
                    </div>
                  </div>

                  {/* Concierge Services Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-3">Interested in Concierge Services? (Select all that apply)</label>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {conciergeServices.map(s => (
                        <button key={s.title} type="button" onClick={() => toggleService(s.title)}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-left gentle-animation cursor-pointer ${
                            listingForm.selectedServices.includes(s.title)
                              ? 'bg-foreground text-primary-foreground'
                              : 'bg-secondary/50 text-foreground hover:bg-secondary clean-border'
                          }`}>
                          <CheckCircle className={`w-4 h-4 flex-shrink-0 ${listingForm.selectedServices.includes(s.title) ? 'opacity-100' : 'opacity-30'}`} />
                          {s.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-foreground text-primary-foreground font-medium px-8 py-3 rounded-xl hover:opacity-90 gentle-animation cursor-pointer text-sm">
                    <Send className="w-4 h-4" /> Submit Listing Inquiry
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {/* Concierge Tab */}
          {activeTab === 'concierge' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-gold/10 mb-4">
                  <Sparkles className="w-4 h-4" style={{ color: 'var(--accent-gold)' }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--accent-gold)' }}>À La Carte Services</span>
                </div>
                <h2 className="font-display text-3xl font-bold mb-3">Concierge Program</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Choose the services you need — no packages, no bundles. Pay only for what adds value to your sale. 
                  Every service is designed to maximize your home's appeal and final selling price.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {conciergeServices.map((service, i) => (
                  <motion.div key={service.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-card rounded-2xl clean-border p-6 hover:elevated-shadow gentle-animation"
                  >
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4">
                      <service.icon className="w-6 h-6 text-foreground" />
                    </div>
                    <h3 className="font-display text-lg font-bold mb-2">{service.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-10 text-center">
                <p className="text-muted-foreground mb-4">Ready to get started? Tell us about your property and select your services.</p>
                <button onClick={() => setActiveTab('listing')}
                  className="inline-flex items-center gap-2 bg-foreground text-primary-foreground font-medium px-8 py-3 rounded-xl hover:opacity-90 gentle-animation cursor-pointer text-sm">
                  <ClipboardList className="w-4 h-4" /> Start Your Listing
                </button>
              </div>
            </motion.div>
          )}

          {/* Toolkit Tab */}
          {activeTab === 'toolkit' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="font-display text-3xl font-bold mb-3">Seller's Home Toolkit</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Everything you need to prepare your home for market — checklists, timelines, and the documents you'll want ready.
                </p>
              </div>

              <div className="grid lg:grid-cols-3 gap-6 mb-12">
                {toolkitItems.map((section, i) => (
                  <motion.div key={section.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-card rounded-2xl clean-border p-6"
                  >
                    <h3 className="font-display text-lg font-bold mb-4">{section.title}</h3>
                    <ul className="space-y-2.5">
                      {section.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent-sage)' }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>

              {/* Home Valuation Request */}
              <div className="bg-card rounded-2xl clean-border p-8">
                <div className="flex items-center gap-3 mb-6">
                  <BarChart3 className="w-6 h-6" style={{ color: 'var(--accent-gold)' }} />
                  <h2 className="font-display text-2xl font-bold">Request a Home Valuation</h2>
                </div>
                <p className="text-muted-foreground mb-6">
                  Get a complimentary comparative market analysis (CMA) for your property. We'll research recent sales, 
                  current listings, and market trends to estimate your home's value.
                </p>
                <form onSubmit={handleValuationSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input required type="text" value={valuationForm.name} onChange={e => setValuationForm(p => ({...p, name: e.target.value}))}
                      className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm" placeholder="Your Name *" />
                    <input required type="email" value={valuationForm.email} onChange={e => setValuationForm(p => ({...p, email: e.target.value}))}
                      className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm" placeholder="Email *" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input required type="tel" value={valuationForm.phone} onChange={e => setValuationForm(p => ({...p, phone: e.target.value}))}
                      className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm" placeholder="Phone *" />
                    <input required type="text" value={valuationForm.address} onChange={e => setValuationForm(p => ({...p, address: e.target.value}))}
                      className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm" placeholder="Property Address *" />
                  </div>
                  <textarea rows={2} value={valuationForm.notes} onChange={e => setValuationForm(p => ({...p, notes: e.target.value}))}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm resize-none"
                    placeholder="Any details about your property? (optional)" />
                  <button type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-foreground text-primary-foreground font-medium px-8 py-3 rounded-xl hover:opacity-90 gentle-animation cursor-pointer text-sm">
                    <Send className="w-4 h-4" /> Request Valuation
                  </button>
                </form>
              </div>

              {/* Vendor Referrals */}
              <div className="mt-8 bg-secondary/30 rounded-2xl p-8">
                <h3 className="font-display text-xl font-bold mb-4">Trusted Vendor Network</h3>
                <p className="text-muted-foreground mb-6">
                  Need a contractor, stager, painter, or landscaper? We've vetted the best professionals in Silicon Valley.
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {['General Contractors', 'Home Stagers', 'Painters & Finishers', 'Landscapers', 'Roofers', 'Electricians', 'Plumbers', 'House Cleaners'].map(vendor => (
                    <div key={vendor} className="flex items-center gap-2 px-4 py-3 bg-card rounded-xl clean-border text-sm">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent-sage)' }} />
                      {vendor}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Contact us or use the chat concierge to get a personalized referral for your specific needs.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
      <ChatBot />
    </div>
  )
}
