'use client'

import { Home, Video, Search, Camera, FileText, Shield } from 'lucide-react'

export function Services() {
  const services = [
    {
      icon: Search,
      title: 'Property Search',
      description: 'Access our curated database of on-market and exclusive off-market Eichler listings across Silicon Valley.',
    },
    {
      icon: Video,
      title: 'Cinematic Tours',
      description: 'AI-produced video walkthroughs that capture the light, flow, and soul of each mid-century modern home.',
    },
    {
      icon: Home,
      title: 'Eichler Expertise',
      description: 'Deep knowledge of post-and-beam construction, radiant flooring, and atrium designs unique to Eichler homes.',
    },
    {
      icon: Camera,
      title: 'Architectural Photography',
      description: 'Professional imagery that highlights the clean lines, glass walls, and indoor-outdoor living of each property.',
    },
    {
      icon: FileText,
      title: 'Market Analysis',
      description: 'Comprehensive neighborhood reports with pricing trends, school ratings, and comparable sales data.',
    },
    {
      icon: Shield,
      title: 'Transaction Management',
      description: 'Full-service support from offer to close, including inspections, repairs, and escrow coordination.',
    },
  ]

  return (
    <section id="services" className="relative py-28 bg-background">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-16">
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4 font-medium">
            What We Offer
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-foreground">
            Full-Service Luxury
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Every aspect of your Eichler home search, purchase, or sale — handled with precision and care.
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
