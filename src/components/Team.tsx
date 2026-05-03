'use client'

import { useState } from 'react'
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
        <div className="text-center mb-12">
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4 font-medium">
            Our Specialists
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-foreground">
            Meet the Team
          </h2>

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
