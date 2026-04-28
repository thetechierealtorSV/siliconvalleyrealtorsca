'use client'

const testimonials = [
  {
    quote:
      "Christopher brings more than standard agent service. He offers insight, market intelligence, and creative problem solving that helped us move forward with a clear plan and strong confidence.",
    author: 'Katrina and Mike Z.',
  },
  {
    quote:
      "This was the biggest investment of my life. And Chris brought one-of-a-kind transparency and honesty. He guided me with clear consult.",
    author: 'Cleo V.',
  },
  {
    quote:
      "Going in I thought I knew everything. Chris was a well of knowledge and expertise. Very professional, kind and humble, communicated directly. And saved me time with his personal resources.",
    author: 'Yusef G.',
  },
  {
    quote: 'Chris is a very trustworthy agent to work with.',
    author: 'Wei C.',
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="relative py-28 bg-background">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-16">
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4 font-medium">
            Client Voices
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-foreground">
            Testimonials
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {testimonials.map((t) => (
            <figure
              key={t.author}
              className="rounded-2xl bg-secondary/40 clean-border p-8 elevated-shadow flex flex-col"
            >
              <blockquote className="text-foreground/90 text-lg leading-relaxed font-display italic mb-6 flex-1">
                “{t.quote}”
              </blockquote>
              <figcaption
                className="text-sm font-medium tracking-[0.15em] uppercase"
                style={{ color: '#b8860b' }}
              >
                — {t.author}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
