'use client'

import { Search, Video, Brain, Globe, Shield, Cpu } from 'lucide-react'

export function Services() {
  const services = [
    {
      icon: Brain,
      title: 'Consultative Approach',
      description: 'Decision science and behavioral insights applied to every stage of your home search — helping you buy with clarity and confidence.',
    },
    {
      icon: Cpu,
      title: 'Intelligent Property Matching',
      description: 'Our platform learns your preferences and surfaces properties that align with your lifestyle, not just your checklist.',
    },
    {
      icon: Video,
      title: 'Cinematic Tours',
      description: 'Professionally produced video walkthroughs that capture the light, flow, and soul of each property — experience homes remotely in stunning detail.',
    },
    {
      icon: Search,
      title: 'Off-Market Access',
      description: 'Deep Silicon Valley network unlocking properties before they hit the market — pocket listings, pre-market deals, and exclusive opportunities.',
    },
    {
      icon: Globe,
      title: 'Global Buyer Network',
      description: 'Connected to international buyers and investors seeking Silicon Valley luxury — maximizing exposure for sellers and opportunity for buyers.',
    },
    {
      icon: Shield,
      title: 'End-to-End Transaction',
      description: 'Full-service support from discovery to close — inspections, negotiations, escrow coordination, and post-purchase concierge.',
    },
  ]

  return (
    <section id="services" className="relative py-28 bg-background">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-16">
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4 font-medium">
            Technology + Expertise
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-foreground">
            The Modern Advantage
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Where cutting-edge tools meet deep local expertise — a new standard for luxury real estate in Silicon Valley.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service) => (
            <div
              key={service.title}
              className="group bg-card clean-border rounded-2xl p-8 gentle-animation hover:elevated-shadow hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-6 group-hover:bg-foreground group-hover:text-primary-foreground gentle-animation">
                <service.icon className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
