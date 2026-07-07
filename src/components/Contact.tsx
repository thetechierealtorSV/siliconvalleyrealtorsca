'use client'

import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { MessageCircle, Instagram, Phone, Mail } from 'lucide-react'
import { submitLead } from '@/lib/leads'

export function Contact() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })
  const [tcpaConsent, setTcpaConsent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({ title: 'Please fill in all required fields', variant: 'destructive' })
      return
    }
    if (formData.phone && !tcpaConsent) {
      toast({ title: 'Please consent to contact to submit a phone number.', variant: 'destructive' })
      return
    }
    setIsSubmitting(true)
    try {
      await submitLead({
        lead_type: 'contact',
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        payload: {
          message: formData.message,
          tcpa_consent: tcpaConsent,
          tcpa_consent_at: tcpaConsent ? new Date().toISOString() : null,
        },
      })
      toast({ title: 'Inquiry received!', description: "We'll contact you within 24 hours." })
      setFormData({ name: '', email: '', phone: '', message: '' })
      setTcpaConsent(false)
    } catch {
      toast({ title: 'Could not send your inquiry. Please try again.', variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactMethods = [
    {
      icon: Phone,
      label: 'Call Us',
      value: '(650) 640-9777',
      color: '#6b7c5e',
      href: 'tel:+16506409777',
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: 'Message (650) 640-9777 on WhatsApp',
      color: '#25D366',
      href: 'https://wa.me/16506409777',
    },
    {
      icon: Instagram,
      label: 'Instagram',
      value: 'Follow us for listings & market insights',
      color: '#E1306C',
      href: '#',
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'hello@nikolaenkoestates.com',
      color: '#b8860b',
      href: 'mailto:hello@nikolaenkoestates.com',
    },
  ]

  return (
    <section id="contact" className="relative py-28 bg-background">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          <div>
            <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4 font-medium">
              Get in Touch
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold leading-tight mb-6 text-foreground">
              Let's Find Your <br />Next Home
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10">
              Whether you're exploring luxury estates, mid-century gems, or modern masterpieces across Silicon Valley — 
              reach out through any channel and our team will connect you with the right resources.
            </p>

            <div className="space-y-4">
              {contactMethods.map((method) => (
                <a
                  key={method.label}
                  href={method.href}
                  target={method.href.startsWith('http') ? '_blank' : undefined}
                  rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-4 p-4 rounded-xl bg-card clean-border gentle-animation hover:elevated-shadow hover:-translate-y-0.5 group"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: method.color + '20' }}
                  >
                    <method.icon className="w-5 h-5" style={{ color: method.color }} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">{method.label}</h4>
                    <p className="text-muted-foreground text-sm">{method.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

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
                    placeholder="Tell us about your ideal Silicon Valley home..."
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
