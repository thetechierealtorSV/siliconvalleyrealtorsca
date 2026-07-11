'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Users, CheckCircle, DollarSign, Home, Send, Download, Phone } from 'lucide-react'
import { PageNavbar } from '@/components/PageNavbar'
import { Footer } from '@/components/Footer'
import { ChatBot } from '@/components/ChatBot'
import { SEO, ORG_JSON_LD, breadcrumbJsonLd } from '@/components/SEO'
import { submitLead } from '@/lib/leads'
import { toast } from 'sonner'

const loanOfficers = [
  { name: 'Contact for Referral', specialty: 'Conventional & Jumbo Loans', phone: 'Request via form' },
  { name: 'Contact for Referral', specialty: 'FHA & VA Specialist', phone: 'Request via form' },
  { name: 'Contact for Referral', specialty: 'Investment Property Financing', phone: 'Request via form' },
]

export default function BuyersPage() {
  const [activeTab, setActiveTab] = useState<'agreement' | 'preapproval' | 'loannetwork'>('agreement')
  const [agreementForm, setAgreementForm] = useState({
    buyerName: '', buyerEmail: '', buyerPhone: '', propertyTypes: '',
    budgetRange: '', preferredAreas: '', timeframe: '', preApproved: '',
    additionalNotes: '', agreeToTerms: false,
  })
  const [preapprovalForm, setPreapprovalForm] = useState({
    name: '', email: '', phone: '', annualIncome: '', employmentStatus: '',
    creditScoreRange: '', downPaymentAmount: '', desiredLoanAmount: '',
    propertyType: '', firstTimeBuyer: '',
  })

  const handleAgreementSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreementForm.agreeToTerms) {
      toast.error('Please agree to the terms to proceed.')
      return
    }
    try {
      await submitLead({
        lead_type: 'buyer_agreement',
        name: agreementForm.buyerName,
        email: agreementForm.buyerEmail,
        phone: agreementForm.buyerPhone,
        payload: agreementForm,
      })
      toast.success('Buyer representation agreement submitted! We\'ll be in touch within 24 hours.')
      setAgreementForm({ buyerName: '', buyerEmail: '', buyerPhone: '', propertyTypes: '', budgetRange: '', preferredAreas: '', timeframe: '', preApproved: '', additionalNotes: '', agreeToTerms: false })
    } catch {
      toast.error('Submission failed. Please try again.')
    }
  }

  const handlePreapprovalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await submitLead({
        lead_type: 'pre_approval',
        name: preapprovalForm.name,
        email: preapprovalForm.email,
        phone: preapprovalForm.phone,
        payload: preapprovalForm,
      })
      toast.success('Pre-approval inquiry submitted! A loan specialist will contact you shortly.')
      setPreapprovalForm({ name: '', email: '', phone: '', annualIncome: '', employmentStatus: '', creditScoreRange: '', downPaymentAmount: '', desiredLoanAmount: '', propertyType: '', firstTimeBuyer: '' })
    } catch {
      toast.error('Submission failed. Please try again.')
    }
  }

  const tabs = [
    { id: 'agreement' as const, label: 'Buyer Agreement', icon: FileText },
    { id: 'preapproval' as const, label: 'Pre-Approval', icon: DollarSign },
    { id: 'loannetwork' as const, label: 'Loan Officers', icon: Users },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Buyer Representation · Nikolaenko Property Group"
        description="Buyer representation agreement, lender pre-approval, and a vetted loan officer network for Silicon Valley homebuyers."
        jsonLd={[ORG_JSON_LD, breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Buyers', path: '/buyers' },
        ])]}
      />
      <PageNavbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-3">For Buyers</p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Your Home Search Starts Here
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Complete your buyer representation, get pre-approved, and connect with our trusted network of lending professionals.
            </p>
          </motion.div>

          {/* Tabs */}
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

          {/* Agreement Tab */}
          {activeTab === 'agreement' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
              <div className="bg-card rounded-2xl clean-border p-8">
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="w-6 h-6" style={{ color: 'var(--accent-gold)' }} />
                  <h2 className="font-display text-2xl font-bold">Buyer Representation Agreement</h2>
                </div>
                <p className="text-muted-foreground mb-2">
                  Complete this form to begin your formal buyer representation with Nikolaenko Property Group. 
                  By submitting, you're taking the first step toward dedicated, exclusive representation.
                </p>
                <div className="flex gap-3 mb-8">
                  <a href="#" className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-muted-foreground gentle-animation">
                    <Download className="w-4 h-4" /> Download PDF Agreement
                  </a>
                </div>

                <form onSubmit={handleAgreementSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Full Name *</label>
                      <input required type="text" value={agreementForm.buyerName} onChange={e => setAgreementForm(p => ({...p, buyerName: e.target.value}))}
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm" placeholder="Your full legal name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Email *</label>
                      <input required type="email" value={agreementForm.buyerEmail} onChange={e => setAgreementForm(p => ({...p, buyerEmail: e.target.value}))}
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm" placeholder="you@email.com" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Phone *</label>
                      <input required type="tel" value={agreementForm.buyerPhone} onChange={e => setAgreementForm(p => ({...p, buyerPhone: e.target.value}))}
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm" placeholder="(555) 123-4567" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Budget Range *</label>
                      <select required value={agreementForm.budgetRange} onChange={e => setAgreementForm(p => ({...p, budgetRange: e.target.value}))}
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm">
                        <option value="">Select range</option>
                        <option value="under-1m">Under $1M</option>
                        <option value="1m-2m">$1M – $2M</option>
                        <option value="2m-5m">$2M – $5M</option>
                        <option value="5m-10m">$5M – $10M</option>
                        <option value="10m+">$10M+</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Property Types of Interest</label>
                      <input type="text" value={agreementForm.propertyTypes} onChange={e => setAgreementForm(p => ({...p, propertyTypes: e.target.value}))}
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm" placeholder="e.g., Eichler, Modern, Mediterranean" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Preferred Areas</label>
                      <input type="text" value={agreementForm.preferredAreas} onChange={e => setAgreementForm(p => ({...p, preferredAreas: e.target.value}))}
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm" placeholder="e.g., Palo Alto, Atherton, Los Gatos" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Timeframe</label>
                      <select value={agreementForm.timeframe} onChange={e => setAgreementForm(p => ({...p, timeframe: e.target.value}))}
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm">
                        <option value="">When are you looking to buy?</option>
                        <option value="asap">As soon as possible</option>
                        <option value="1-3months">1–3 months</option>
                        <option value="3-6months">3–6 months</option>
                        <option value="6-12months">6–12 months</option>
                        <option value="just-exploring">Just exploring</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Pre-Approved?</label>
                      <select value={agreementForm.preApproved} onChange={e => setAgreementForm(p => ({...p, preApproved: e.target.value}))}
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm">
                        <option value="">Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                        <option value="in-progress">In progress</option>
                        <option value="cash">Cash buyer</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Additional Notes</label>
                    <textarea rows={3} value={agreementForm.additionalNotes} onChange={e => setAgreementForm(p => ({...p, additionalNotes: e.target.value}))}
                      className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm resize-none"
                      placeholder="Anything else we should know about your search?" />
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={agreementForm.agreeToTerms} onChange={e => setAgreementForm(p => ({...p, agreeToTerms: e.target.checked}))}
                      className="mt-1 w-4 h-4 rounded border-border" />
                    <span className="text-sm text-muted-foreground">
                      I agree to enter into a buyer representation agreement with Nikolaenko Property Group. 
                      I understand this establishes an exclusive working relationship for my property search.
                    </span>
                  </label>
                  <button type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-foreground text-primary-foreground font-medium px-8 py-3 rounded-xl hover:opacity-90 gentle-animation cursor-pointer text-sm">
                    <Send className="w-4 h-4" /> Submit Agreement
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {/* Pre-Approval Tab */}
          {activeTab === 'preapproval' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
              <div className="bg-card rounded-2xl clean-border p-8">
                <div className="flex items-center gap-3 mb-6">
                  <DollarSign className="w-6 h-6" style={{ color: 'var(--accent-gold)' }} />
                  <h2 className="font-display text-2xl font-bold">Get Pre-Approved</h2>
                </div>
                <p className="text-muted-foreground mb-8">
                  Strengthen your offer with a pre-approval. Fill out the basics below and we'll connect you with a qualified lending professional from our network.
                </p>
                <form onSubmit={handlePreapprovalSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Full Name *</label>
                      <input required type="text" value={preapprovalForm.name} onChange={e => setPreapprovalForm(p => ({...p, name: e.target.value}))}
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Email *</label>
                      <input required type="email" value={preapprovalForm.email} onChange={e => setPreapprovalForm(p => ({...p, email: e.target.value}))}
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm" placeholder="you@email.com" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Phone *</label>
                      <input required type="tel" value={preapprovalForm.phone} onChange={e => setPreapprovalForm(p => ({...p, phone: e.target.value}))}
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm" placeholder="(555) 123-4567" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Employment Status</label>
                      <select value={preapprovalForm.employmentStatus} onChange={e => setPreapprovalForm(p => ({...p, employmentStatus: e.target.value}))}
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm">
                        <option value="">Select</option>
                        <option value="employed">Employed (W-2)</option>
                        <option value="self-employed">Self-Employed</option>
                        <option value="retired">Retired</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Annual Income Range</label>
                      <select value={preapprovalForm.annualIncome} onChange={e => setPreapprovalForm(p => ({...p, annualIncome: e.target.value}))}
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm">
                        <option value="">Select range</option>
                        <option value="100k-250k">$100K – $250K</option>
                        <option value="250k-500k">$250K – $500K</option>
                        <option value="500k-1m">$500K – $1M</option>
                        <option value="1m+">$1M+</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Credit Score Range</label>
                      <select value={preapprovalForm.creditScoreRange} onChange={e => setPreapprovalForm(p => ({...p, creditScoreRange: e.target.value}))}
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm">
                        <option value="">Select</option>
                        <option value="800+">800+</option>
                        <option value="740-799">740–799</option>
                        <option value="670-739">670–739</option>
                        <option value="below-670">Below 670</option>
                        <option value="unsure">Not sure</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Down Payment Available</label>
                      <input type="text" value={preapprovalForm.downPaymentAmount} onChange={e => setPreapprovalForm(p => ({...p, downPaymentAmount: e.target.value}))}
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm" placeholder="e.g., $500,000" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Desired Loan Amount</label>
                      <input type="text" value={preapprovalForm.desiredLoanAmount} onChange={e => setPreapprovalForm(p => ({...p, desiredLoanAmount: e.target.value}))}
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm" placeholder="e.g., $1,500,000" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Property Type</label>
                      <select value={preapprovalForm.propertyType} onChange={e => setPreapprovalForm(p => ({...p, propertyType: e.target.value}))}
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm">
                        <option value="">Select</option>
                        <option value="single-family">Single-Family Home</option>
                        <option value="condo">Condo / Townhome</option>
                        <option value="multi-family">Multi-Family</option>
                        <option value="investment">Investment Property</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">First-Time Buyer?</label>
                      <select value={preapprovalForm.firstTimeBuyer} onChange={e => setPreapprovalForm(p => ({...p, firstTimeBuyer: e.target.value}))}
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm">
                        <option value="">Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-foreground text-primary-foreground font-medium px-8 py-3 rounded-xl hover:opacity-90 gentle-animation cursor-pointer text-sm">
                    <Send className="w-4 h-4" /> Submit Pre-Approval Inquiry
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {/* Loan Officers Tab */}
          {activeTab === 'loannetwork' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
              <div className="bg-card rounded-2xl clean-border p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Users className="w-6 h-6" style={{ color: 'var(--accent-gold)' }} />
                  <h2 className="font-display text-2xl font-bold">Our Trusted Loan Officers</h2>
                </div>
                <p className="text-muted-foreground mb-8">
                  We've built relationships with top lending professionals across Silicon Valley. 
                  Whether you need a conventional loan, jumbo financing, or specialized programs — we'll match you with the right partner.
                </p>
                <div className="space-y-4">
                  {loanOfficers.map((officer, i) => (
                    <div key={i} className="flex items-center justify-between p-5 rounded-xl bg-secondary/50 clean-border">
                      <div>
                        <h3 className="font-medium text-foreground">{officer.name}</h3>
                        <p className="text-sm text-muted-foreground">{officer.specialty}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        {officer.phone}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 p-6 rounded-xl bg-accent-gold/5 border border-accent-gold/20">
                  <p className="text-sm text-foreground font-medium mb-2">Need a personal recommendation?</p>
                  <p className="text-sm text-muted-foreground">
                    Fill out the pre-approval form or use our chat concierge — we'll match you with the best loan officer for your specific situation.
                  </p>
                </div>
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
