'use client'

import { useState } from 'react'
import chrisAsset from '@/assets/chris-nikolaenko.jpg.asset.json'
import realtor1 from '@/assets/realtor-cn-1.jpg'
import realtor2 from '@/assets/realtor-cn-2.jpg'
import realtor3 from '@/assets/realtor-cn-3.jpg'
import realtor4 from '@/assets/realtor-priya.jpg'

type Role = 'All' | 'Listing Advisor' | 'Buyer Advisor'

export function Team() {
  const [filter, setFilter] = useState<Role>('All')

  const team = [
    { name: 'Lillian Chen', role: 'Listing Advisor' as const, image: realtor1 },
    { name: 'David Liu', role: 'Listing Advisor' as const, image: realtor2 },
    { name: 'Vivian Wang', role: 'Buyer Advisor' as const, image: realtor3 },
    { name: 'Priya Patel', role: 'Buyer Advisor' as const, image: realtor4 },
  ]

  const filtered = filter === 'All' ? team : team.filter((m) => m.role === filter)
  const filters: Role[] = ['All', 'Listing Advisor', 'Buyer Advisor']

  return (
    <div className="relative py-28 bg-secondary/30">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        {/* Founding advisor */}
        <div className="text-center mb-16">
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4 font-medium">
            Founding Advisor
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-10 text-foreground">
            Meet Chris Nikolaenko
          </h2>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center text-left">
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
            <div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
                Chris Nikolaenko
              </h3>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: '#b8860b' }}>
                Senior Listing Agent · Buyer's Agent
              </p>
              <p className="text-foreground/85 leading-relaxed mb-4">
                Chris leads Nikolaenko Estates, personally representing sellers and buyers across
                Palo Alto, Atherton, Menlo Park, Los Altos Hills, Woodside, and the greater Bay Area.
              </p>
              <p className="text-foreground/75 leading-relaxed">
                His practice blends deep Silicon Valley market fluency with a global buyer network,
                concierge-level marketing, and quiet access to off-market inventory.
              </p>
            </div>
          </div>
        </div>

        {/* Specialist team */}
        <div className="text-center mb-12">
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4 font-medium">
            Our Specialists
          </p>
          <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6 text-foreground">
            The Full Team
          </h3>

          <div className="inline-flex items-center gap-1 rounded-full border border-border bg-background p-1">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 text-xs font-medium tracking-wide uppercase rounded-full transition-colors ${
                  filter === f
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {filtered.map((member) => (
            <div key={member.name} className="group text-center">
              <div className="relative overflow-hidden rounded-xl mb-3 aspect-[3/4] w-24 mx-auto">
                <img
                  src={member.image}
                  alt={`${member.name}, ${member.role}`}
                  width={192}
                  height={256}
                  loading="lazy"
                  className="w-full h-full object-cover gentle-animation group-hover:scale-105"
                />
              </div>
              <h3 className="font-display text-sm font-bold text-foreground mb-1">
                {member.name}
              </h3>
              <p className="text-[10px] font-medium tracking-wide uppercase" style={{ color: '#b8860b' }}>
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
