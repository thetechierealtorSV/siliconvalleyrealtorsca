'use client'

import { Zap, Network, Target, Clock } from 'lucide-react'

export function Awards() {
  const stats = [
    { value: 'AI-Powered', label: 'Property Matching' },
    { value: '100+', label: 'Off-Market Connections' },
    { value: '24/7', label: 'AI Availability' },
    { value: '$500M+', label: 'Market Coverage' },
  ]

  const pillars = [
    {
      icon: Target,
      title: 'Precision',
      description: 'Every recommendation backed by data — market analytics, neighborhood insights, and predictive pricing models that eliminate guesswork.',
    },
    {
      icon: Network,
      title: 'Network',
      description: 'Deep relationships across Palo Alto, Atherton, and the broader Peninsula. Access to off-market listings, pocket deals, and pre-market opportunities.',
    },
    {
      icon: Zap,
      title: 'Technology',
      description: 'AI-driven search, cinematic video tours, and intelligent lead nurturing — tools that give you a competitive edge in the fastest-moving market on earth.',
    },
    {
      icon: Clock,
      title: 'Dedication',
      description: 'Responsive, available, and relentless. Our AI assistant works 24/7, and our human expertise ensures every detail receives personal attention.',
    },
  ]

  return (
    <section id="why-us" className="relative py-28 bg-foreground text-primary-foreground">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        {/* Stats */}
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

        {/* Pillars */}
        <div className="text-center mb-12">
          <p className="text-sm tracking-[0.3em] uppercase text-primary-foreground/50 mb-4 font-medium">
            Our Commitment
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-6">
            Why Silicon Valley Trusts Us
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
