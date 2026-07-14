'use client'

import { motion } from 'framer-motion'
import { Home, Building, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function BuyersSellersPreview() {
  const navigate = useNavigate()

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

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            onClick={() => navigate('/buyers')}
            className="bg-card rounded-2xl p-8 clean-border subtle-shadow hover:elevated-shadow gentle-animation cursor-pointer group"
          >
            <div className="w-14 h-14 rounded-xl bg-accent-gold/10 flex items-center justify-center mb-6">
              <Home className="w-7 h-7" style={{ color: 'var(--accent-gold)' }} />
            </div>
            <h3 className="font-display text-2xl font-bold mb-3 text-foreground">Buyers</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Buyer representation agreements, pre-approval connections, property search tools, and access to our trusted network of loan officers.
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground group-hover:gap-3 gentle-animation">
              Explore Buyer Resources <ArrowRight className="w-4 h-4" />
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            onClick={() => navigate('/sellers')}
            className="bg-card rounded-2xl p-8 clean-border subtle-shadow hover:elevated-shadow gentle-animation cursor-pointer group"
          >
            <div className="w-14 h-14 rounded-xl bg-accent-sage/10 flex items-center justify-center mb-6">
              <Building className="w-7 h-7" style={{ color: 'var(--accent-sage)' }} />
            </div>
            <h3 className="font-display text-2xl font-bold mb-3 text-foreground">Sellers</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Listing preparation, concierge services, home toolkit with staging guides, valuation tools, and trusted vendor referrals, all à la carte.
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground group-hover:gap-3 gentle-animation">
              Explore Seller Resources <ArrowRight className="w-4 h-4" />
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
