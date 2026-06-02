'use client'

import { motion } from 'framer-motion'

// Approximate Bay Area pins on a 600x600 SVG canvas (stylized — not geographically exact)
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
            From the Peninsula to the East Bay, San Francisco to the South Bay — deep coverage across every corridor that matters.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-12 items-center max-w-6xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden border border-border bg-card aspect-[1/1] elevated-shadow">
            <svg viewBox="0 0 600 600" className="w-full h-full" role="img" aria-label="Stylized Bay Area coverage map">
              <defs>
                <radialGradient id="pinGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="hsl(var(--accent-gold))" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="hsl(var(--accent-gold))" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="landGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--muted))" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0.7" />
                </linearGradient>
                <linearGradient id="bayGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--accent-blue))" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="hsl(var(--accent-blue))" stopOpacity="0.15" />
                </linearGradient>
              </defs>

              {/* Subtle background */}
              <rect width="600" height="600" fill="hsl(var(--background))" />

              {/* Land mass (stylized peninsula + east bay) */}
              <path
                d="M80 80 L 200 60 L 240 140 L 230 220 L 280 280 L 320 360 L 380 440 L 480 470 L 540 540 L 540 580 L 60 580 L 60 200 Z"
                fill="url(#landGrad)"
                stroke="hsl(var(--border))"
                strokeWidth="1.5"
              />

              {/* Bay (water) */}
              <path
                d="M240 140 L 280 200 L 270 280 L 320 360 L 380 440 L 480 470 L 500 460 L 460 400 L 360 320 L 320 240 L 290 160 Z"
                fill="url(#bayGrad)"
                stroke="hsl(var(--accent-blue))"
                strokeWidth="1"
                opacity="0.9"
              />

              {/* Dashed corridor (101 / 280 idea) */}
              <path
                d="M150 200 C 220 260, 280 320, 340 380 S 430 460, 470 480"
                fill="none"
                stroke="hsl(var(--accent-gold))"
                strokeWidth="1.5"
                strokeDasharray="5 7"
                opacity="0.7"
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
                    r={5}
                    fill="hsl(var(--accent-gold))"
                    stroke="hsl(var(--background))"
                    strokeWidth="1.5"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, type: 'spring', stiffness: 220 }}
                  />
                  <text
                    x={c.x + 11}
                    y={c.y + 4}
                    fontSize="11"
                    fill="hsl(var(--foreground))"
                    style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
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
