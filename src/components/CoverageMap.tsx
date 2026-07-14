'use client'

import { motion } from 'framer-motion'
import landmarksImg from '@/assets/bay-area-landmarks.jpg'


// Approximate Bay Area pins on a 600x600 SVG canvas (stylized, not geographically exact)
const cities = [
  { name: 'San Francisco', x: 150, y: 170 },
  { name: 'Marin', x: 120, y: 100 },
  { name: 'Berkeley', x: 255, y: 180 },
  { name: 'Oakland', x: 250, y: 220 },
  { name: 'Palo Alto', x: 305, y: 320 },
  { name: 'Atherton', x: 285, y: 345 },
  { name: 'Menlo Park', x: 300, y: 335 },
  { name: 'Woodside', x: 255, y: 358 },
  { name: 'Los Altos Hills', x: 340, y: 360 },
  { name: 'Mountain View', x: 355, y: 385 },
  { name: 'Sunnyvale', x: 385, y: 410 },
  { name: 'Cupertino', x: 365, y: 435 },
  { name: 'Saratoga', x: 380, y: 465 },
  { name: 'Los Gatos', x: 415, y: 480 },
  { name: 'San Jose', x: 445, y: 450 },
]

export function CoverageMap() {
  return (
    <section id="coverage" aria-label="Coverage area" className="relative py-28 bg-background overflow-hidden">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-14">
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4 font-medium">
            Where We Work
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold leading-tight mb-4 text-foreground">
            Silicon Valley & the Bay Area
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From the Peninsula to the East Bay, San Francisco to the South Bay, deep coverage across every corridor that matters.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-12 items-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative rounded-2xl overflow-hidden border border-border bg-card elevated-shadow"
          >
            <img
              src={landmarksImg}
              alt="Bay Area landmarks collage, Golden Gate Bridge, Palace of Fine Arts, Salesforce Tower, Chase Center, Stanford University, Levi's Stadium, and Apple Park"
              width={1920}
              height={912}
              loading="lazy"
              className="w-full h-auto object-cover block"
            />
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 via-black/25 to-transparent">
              <p className="text-[10px] tracking-[0.28em] uppercase text-white/85 font-medium">
                Golden Gate · Palace of Fine Arts · Salesforce Tower · Chase Center · Stanford · Levi's Stadium · Apple Park
              </p>
            </div>
          </motion.div>

          <div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-8">
              {cities.map(c => (
                <div key={c.name} className="flex items-center gap-2 text-sm text-foreground/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-gold inline-block" />
                  {c.name}
                </div>
              ))}
            </div>
            <a
              href="#contact"
              className="inline-block px-7 py-3 rounded-md bg-foreground text-primary-foreground text-sm tracking-wide uppercase hover:opacity-90 gentle-animation"
            >
              Ask about your area
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
