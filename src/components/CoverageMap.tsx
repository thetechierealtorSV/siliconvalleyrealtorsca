'use client'

import { motion } from 'framer-motion'
import landmarksImg from '@/assets/bay-area-landmarks.jpg'

const cities = [
  'San Francisco', 'Marin', 'Berkeley', 'Oakland',
  'Palo Alto', 'Atherton', 'Menlo Park', 'Woodside',
  'Los Altos Hills', 'Mountain View', 'Sunnyvale', 'Cupertino',
  'Saratoga', 'Los Gatos', 'San Jose',
]

export function CoverageMap() {
  return (
    <section id="coverage" aria-label="Coverage area" className="relative bg-background">
      {/* Full-bleed landmark hero */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative w-full overflow-hidden"
      >
        <img
          src={landmarksImg}
          alt="Bay Area landmarks: Golden Gate Bridge, Palace of Fine Arts, Salesforce Tower, Chase Center, Stanford University, Levi's Stadium, and Apple Park"
          width={1920}
          height={720}
          loading="lazy"
          className="w-full h-[70vh] min-h-[520px] max-h-[900px] object-cover block"
          style={{ filter: 'contrast(1.08) saturate(1.15) brightness(1.02)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 text-center">
          <p className="text-[10px] sm:text-xs tracking-[0.28em] uppercase text-white/90 font-medium">
            Where We Work
          </p>
          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-white mt-2 drop-shadow-lg">
            Silicon Valley &amp; the Bay Area
          </h2>
          <p className="mt-3 text-[10px] sm:text-xs tracking-[0.22em] uppercase text-white/80">
            Golden Gate · Palace of Fine Arts · Salesforce Tower · Chase Center · Stanford · Levi's Stadium · Apple Park
          </p>
        </div>
      </motion.div>

      {/* Cities served */}
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-14">
        <p className="text-center text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          From the Peninsula to the East Bay, San Francisco to the South Bay, deep coverage across every corridor that matters.
        </p>
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-6 gap-y-3 mb-8">
          {cities.map(c => (
            <div key={c} className="flex items-center gap-2 text-sm text-foreground/85">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-gold inline-block" />
              {c}
            </div>
          ))}
        </div>
        <div className="text-center">
          <a
            href="#contact"
            className="inline-block px-7 py-3 rounded-md bg-foreground text-primary-foreground text-sm tracking-wide uppercase hover:opacity-90 gentle-animation"
          >
            Ask about your area
          </a>
        </div>
      </div>
    </section>
  )
}
