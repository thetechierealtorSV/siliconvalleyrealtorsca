'use client'

import realtor1 from '@/assets/realtor-cn-1.jpg'
import realtor2 from '@/assets/realtor-cn-2.jpg'
import realtor3 from '@/assets/realtor-cn-3.jpg'
import realtor4 from '@/assets/realtor-cn-4.jpg'

export function Team() {
  const team = [
    {
      name: 'Lillian Chen',
      role: 'Senior Listing Agent',
      bio: 'Bilingual Mandarin & English specialist guiding Peninsula sellers through luxury listings.',
      image: realtor1,
    },
    {
      name: 'David Liu',
      role: 'Managing Broker',
      bio: 'Two decades brokering Silicon Valley estates with deep ties to the global Chinese community.',
      image: realtor2,
    },
    {
      name: 'Vivian Wang',
      role: 'Buyer Advisor',
      bio: 'Concierge-level buyer representation across Palo Alto, Atherton, and Los Altos Hills.',
      image: realtor3,
    },
    {
      name: 'Kevin Zhao',
      role: 'Investment Specialist',
      bio: 'Advises overseas investors on luxury acquisitions, 1031 exchanges, and portfolio strategy.',
      image: realtor4,
    },
  ]

  return (
    <div className="relative py-28 bg-secondary/30">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-16">
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4 font-medium">
            Our Specialists
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-foreground">
            Meet the Team
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Bilingual Silicon Valley experts serving local and international clients with discretion.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {team.map((member) => (
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
              <p className="text-[10px] font-medium tracking-wide uppercase mb-2" style={{ color: '#b8860b' }}>
                {member.role}
              </p>
              <p className="text-muted-foreground text-xs leading-relaxed">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
