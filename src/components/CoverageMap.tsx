'use client'

import { motion } from 'framer-motion'

// Approximate Bay Area pins on an 800x600 canvas (visual only)
const cities = [
  { name: 'San Francisco', x: 140, y: 160 },
  { name: 'Marin', x: 110, y: 95 },
  { name: 'Berkeley', x: 250, y: 175 },
  { name: 'Oakland', x: 245, y: 215 },
  { name: 'Palo Alto', x: 305, y: 320 },
  { name: 'Atherton', x: 290, y: 345 },
  { name: 'Menlo Park', x: 295, y: 335 },
  { name: 'Woodside', x: 260, y: 355 },
  { name: 'Los Altos Hills', x: 335, y: 360 },
  { name: 'Mountain View', x: 350, y: 380 },
  { name: 'Sunnyvale', x: 380, y: 405 },
  { name: 'Cupertino', x: 365, y: 430 },
  { name: 'Saratoga', x: 380, y: 460 },
  { name: 'Los Gatos', x: 410, y: 475 },
  { name: 'San Jose', x: 440, y: 445 },
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
            From the Peninsula to the East Bay, San Francisco to the South Bay — deep coverage across every corridor that matters.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-12 items-center max-w-6xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden clean-border bg-secondary/40 aspect-[4/3]">
            <svg viewBox="0 0 600 600" className="w-full h-full">
              {/* Bay outline */}
              <defs>
                <radialGradient id="pinGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="hsl(var(--accent-gold, 36 89% 36%))" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="hsl(var(--accent-gold, 36 89% 36%))" stopOpacity="0" />
                </radialGradient>
              </defs>
              {/* Stylized bay shape */}
              <path
                d="M180 60 C 150 120, 170 200, 220 240 C 240 270, 230 320, 260 340 C 290 360, 300 420, 340 460 C 380 500, 440 520, 470 510 L 510 540 L 540 580 L 200 580 L 100 400 L 80 200 Z"
                fill="hsl(var(--muted))"
                stroke="hsl(var(--border))"
                strokeWidth="1"
                opacity="0.6"
              />
              <path
                d="M230 180 C 270 220, 280 280, 310 320 C 340 360, 360 400, 400 430"
                fill="none"
                stroke="hsl(var(--accent-blue))"
                strokeWidth="2"
                strokeDasharray="4 6"
                opacity="0.5"
              />

              {cities.map((c, i) => (
                <g key={c.name}>
                  <motion.circle
                    cx={c.x}
                    cy={c.y}
                    r={18}
                    fill="url(#pinGlow)"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                  />
                  <motion.circle
                    cx={c.x}
                    cy={c.y}
                    r={4}
                    fill="hsl(var(--foreground))"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, type: 'spring', stiffness: 220 }}
                  />
                  <text
                    x={c.x + 10}
                    y={c.y + 4}
                    fontSize="11"
                    fill="hsl(var(--foreground))"
                    className="font-medium"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {c.name}
                  </text>
                </g>
              ))}
            </svg>
          </div>

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
