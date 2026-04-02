'use client'

export function Team() {
  const team = [
    {
      name: 'Catherine Wells',
      role: 'Founding Broker',
      bio: '20+ years specializing in Eichler and mid-century modern homes across the Peninsula.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80&auto=format',
    },
    {
      name: 'Michael Torres',
      role: 'Senior Agent',
      bio: "Architectural historian turned realtor. Expert in Joseph Eichler's design legacy.",
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&auto=format',
    },
    {
      name: 'Anna Park',
      role: 'Client Experience',
      bio: 'Ensures every client journey is seamless from first tour to closing celebration.',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80&auto=format',
    },
    {
      name: 'James Nakamura',
      role: 'Creative Director',
      bio: 'Produces cinematic property films that bring Eichler homes to life for remote buyers.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80&auto=format',
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
            Passionate experts who live and breathe Eichler architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {team.map((member) => (
            <div key={member.name} className="group text-center">
              <div className="relative overflow-hidden rounded-2xl mb-6 aspect-[3/4]">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover gentle-animation group-hover:scale-105"
                />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-1">
                {member.name}
              </h3>
              <p className="text-sm font-medium tracking-wide uppercase mb-3" style={{ color: '#b8860b' }}>
                {member.role}
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
