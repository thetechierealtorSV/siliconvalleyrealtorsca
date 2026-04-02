'use client'

import { Zap, Network, Target, Clock } from 'lucide-react'

export function Awards() {
  const stats = [
    { value: 'Personalized', label: 'Property Matching' },
    { value: '100+', label: 'Off-Market Connections' },
    { value: '24/7', label: 'Availability' },
    { value: '$500M+', label: 'Market Coverage' },
  ]

  const pillars = [
    {
      icon: Target,
      title: 'Precision',
      description: 'Every recommendation backed by deep market knowledge — neighborhood insights, pricing trends, and local expertise that eliminate guesswork.',
    },
    {
      icon: Network,
      title: 'Network',
      description: 'Relationships across Silicon Valley\'s most coveted neighborhoods. Access to off-market listings, pocket deals, and pre-market opportunities you won\'t find online.',
    },
    {
      icon: Zap,
      title: 'Technology',
      description: 'Cinematic video tours, intelligent property search, and modern tools that give you a competitive edge in the fastest-moving market on earth.',
    },
    {
      icon: Clock,
      title: 'Dedication',
      description: 'Responsive, available, and relentless. Our team provides around-the-clock support, and every detail receives personal attention from start to close.',
    },
  ]

  return (
    <section id="why-us" className="relative py-28 bg-foreground text-primary-foreground">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-3xl sm:text-4xl font-bold mb-2" style={{ color: '#b8860b' }}>
                {stat.value}
              </div>
              <div className="text-primary-foreground/60 text-sm tracking-wide uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mb-12">
          <p className="text-sm tracking-[0.3em] uppercase text-primary-foreground/50 mb-4 font-medium">
            Our Commitment
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-6">
            Why Clients Trust Us
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {pillars.map((p) => (
            <div key={p.title} className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-5">
                <p.icon className="w-6 h-6" style={{ color: '#b8860b' }} />
              </div>
              <h3 className="font-display text-2xl font-bold mb-3">{p.title}</h3>
              <p className="text-primary-foreground/70 leading-relaxed">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
