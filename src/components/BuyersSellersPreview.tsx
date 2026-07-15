'use client'

import { motion } from 'framer-motion'
import { Home, Building, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import buyersImg from '@/assets/buyers-lifestyle.jpg'
import sellersImg from '@/assets/sellers-lifestyle.jpg'

export function BuyersSellersPreview() {
  const navigate = useNavigate()

  const cards = [
    {
      img: buyersImg,
      icon: Home,
      title: 'Buyers',
      copy: "Buyer representation agreements, pre-approval connections, property search tools, and access to our trusted network of loan officers.",
      cta: 'Explore Buyer Resources',
      to: '/buyers',
      tint: 'var(--accent-gold)',
    },
    {
      img: sellersImg,
      icon: Building,
      title: 'Sellers',
      copy: "Listing preparation, concierge services, home toolkit with staging guides, valuation tools, and trusted vendor referrals, all à la carte.",
      cta: 'Explore Seller Resources',
      to: '/sellers',
      tint: 'var(--accent-sage)',
    },
  ] as const

  return (
    <div className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-3">Your Journey Starts Here</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            Buying or Selling?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
            Whether you're searching for your dream home or preparing to list, we have the tools, expertise, and network to guide every step.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {cards.map((c, i) => {
            const Icon = c.icon
            return (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, x: i === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                onClick={() => navigate(c.to)}
                className="bg-card rounded-2xl overflow-hidden clean-border subtle-shadow hover:elevated-shadow gentle-animation cursor-pointer group flex flex-col"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={c.img}
                    alt={`${c.title} at Nikolaenko Estates`}
                    loading="lazy" decoding="async"
                    width={1024}
                    height={768}
                    className="w-full h-full object-cover group-hover:scale-105 gentle-animation"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                </div>
                <div className="p-8">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                    style={{ background: `color-mix(in oklab, ${c.tint} 12%, transparent)` }}
                  >
                    <Icon className="w-7 h-7" style={{ color: c.tint }} />
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-3 text-foreground">{c.title}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{c.copy}</p>
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground group-hover:gap-3 gentle-animation">
                    {c.cta} <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
