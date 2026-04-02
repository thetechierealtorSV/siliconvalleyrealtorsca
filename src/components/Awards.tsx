'use client'

export function Awards() {
  const stats = [
    { value: '$2.4B+', label: 'Total Sales Volume' },
    { value: '340+', label: 'Eichler Homes Sold' },
    { value: '98%', label: 'Client Satisfaction' },
    { value: '15+', label: 'Years of Expertise' },
  ]

  const testimonials = [
    {
      quote: "They understood Eichler architecture better than any agent we spoke with. Found us the perfect atrium home in Palo Alto.",
      author: "Sarah & Mark T.",
      location: "Greenmeadow, Palo Alto"
    },
    {
      quote: "The video tour they produced of our listing was cinematic. It sold in 3 days, $200K over asking.",
      author: "David Chen",
      location: "Fairhills, Mountain View"
    },
    {
      quote: "From first call to closing, the process was seamless. They truly specialize in these architectural gems.",
      author: "Lisa & James K.",
      location: "Mackay Park, San Mateo"
    }
  ]

  return (
    <section id="awards" className="relative py-28 bg-foreground text-primary-foreground">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-4xl sm:text-5xl font-bold mb-2" style={{ color: '#b8860b' }}>
                {stat.value}
              </div>
              <div className="text-primary-foreground/60 text-sm tracking-wide uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="text-center mb-12">
          <p className="text-sm tracking-[0.3em] uppercase text-primary-foreground/50 mb-4 font-medium">
            Client Stories
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-6">
            What Our Clients Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <p className="text-primary-foreground/80 leading-relaxed mb-6 italic text-lg">
                "{t.quote}"
              </p>
              <div>
                <div className="font-semibold text-primary-foreground">{t.author}</div>
                <div className="text-primary-foreground/50 text-sm">{t.location}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
