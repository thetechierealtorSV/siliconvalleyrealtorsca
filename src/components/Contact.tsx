'use client'

import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'

export function Contact() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({ title: 'Please fill in all required fields', variant: 'destructive' })
      return
    }
    setIsSubmitting(true)
    setTimeout(() => {
      toast({ title: 'Inquiry received!', description: "We'll contact you within 24 hours to schedule your tour." })
      setFormData({ name: '', email: '', phone: '', message: '' })
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <section id="contact" className="relative py-28 bg-background">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {/* Left: Copy */}
          <div>
            <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4 font-medium">
              Get in Touch
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold leading-tight mb-6 text-foreground">
              Start Your Eichler Journey
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10">
              Whether you're searching for your dream mid-century modern home or looking to sell, 
              our specialists are ready to guide you every step of the way.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#b8860b' }} />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Private Showings</h4>
                  <p className="text-muted-foreground text-sm">Schedule exclusive tours of our latest listings</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#6b7c5e' }} />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Market Insights</h4>
                  <p className="text-muted-foreground text-sm">Get a complimentary Eichler market analysis for your area</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#c4704b' }} />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Selling Your Eichler</h4>
                  <p className="text-muted-foreground text-sm">Learn how our cinematic marketing maximizes your sale price</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div>
            <div className="bg-card clean-border rounded-2xl overflow-hidden elevated-shadow">
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">Name *</label>
                  <input
                    id="name"
                    type="text"
                    maxLength={100}
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
                    placeholder="Your name"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">Email *</label>
                    <input
                      id="email"
                      type="email"
                      maxLength={255}
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">Phone</label>
                    <input
                      id="phone"
                      type="tel"
                      maxLength={20}
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">Message *</label>
                  <textarea
                    id="message"
                    rows={4}
                    maxLength={1000}
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all resize-none"
                    placeholder="Tell us about your ideal Eichler home..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-foreground text-primary-foreground font-medium text-base hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Send Inquiry'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
