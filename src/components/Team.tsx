'use client'

import chrisAsset from '@/assets/chris-nikolaenko.jpg.asset.json'

export function Team() {
  return (
    <div className="relative py-28 bg-secondary/30">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-14">
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4 font-medium">
            Your Advisor
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-foreground">
            Meet Chris Nikolaenko
          </h2>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed">
            Direct, senior-level representation for every buyer and seller — no handoffs, no junior agents.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
          <div className="relative overflow-hidden rounded-2xl aspect-[3/4] max-w-sm w-full mx-auto elevated-shadow">
            <img
              src={chrisAsset.url}
              alt="Chris Nikolaenko, Senior Listing Agent and Buyer's Agent at Nikolaenko Estates"
              width={768}
              height={1024}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="text-center md:text-left">
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Chris Nikolaenko
            </h3>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: '#b8860b' }}>
              Senior Listing Agent · Buyer's Agent
            </p>
            <p className="text-foreground/85 leading-relaxed mb-4">
              Chris personally leads every transaction at Nikolaenko Estates, representing both sellers
              and buyers across Palo Alto, Atherton, Menlo Park, Los Altos Hills, Woodside, and the
              greater Bay Area.
            </p>
            <p className="text-foreground/75 leading-relaxed">
              His practice blends deep Silicon Valley market fluency with a global buyer network,
              concierge-level marketing, and quiet access to off-market inventory — the standard
              of service the Peninsula's most discerning clients expect.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
