'use client'

import t1 from '../assets/testimonial-1.jpg'
import t2 from '../assets/testimonial-2.jpg'
import t3 from '../assets/testimonial-3.jpg'
import t4 from '../assets/testimonial-4.jpg'

const testimonials = [
  {
    quote:
      "Christopher brings more than standard agent service. He offers insight, market intelligence, and creative problem solving that helped us move forward with a clear plan and strong confidence.",
    author: 'Katrina and Mike Z.',
    image: t1,
    alt: 'Happy couple receiving keys to their new Palo Alto home',
  },
  {
    quote:
      "This was the biggest investment of my life, and Chris brought one-of-a-kind transparency and honesty. He guided me with clear, patient counsel from offer through close.",
    author: 'Cleo V.',
    image: t2,
    alt: 'Luxury home keys and closing documents on a marble kitchen island',
  },
  {
    quote:
      "Going in I thought I knew everything. Chris was a well of knowledge and expertise. Very professional, kind and humble, communicated directly. And saved me time with his personal resources.",
    author: 'Yusef G.',
    image: t3,
    alt: 'Sunlit modern Silicon Valley living room with pool view',
  },
  {
    quote: 'Chris is a very trustworthy agent to work with.',
    author: 'Wei C.',
    image: t4,
    alt: 'Real estate agent shaking hands with a client in a luxury foyer',
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
            Why Clients Trust Us
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {testimonials.map((t) => (
            <figure
              key={t.author}
              className="group rounded-2xl bg-secondary/40 clean-border elevated-shadow overflow-hidden flex flex-col"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={t.image}
                  alt={t.alt}
                  loading="lazy"
                  width={1024}
                  height={640}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(15,14,12,0.55) 100%)' }}
                />
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <blockquote className="text-foreground/90 text-lg leading-relaxed font-display italic flex-1 mb-6">
                  “{t.quote}”
                </blockquote>
                <figcaption
                  className="text-sm font-medium tracking-[0.15em] uppercase"
                  style={{ color: 'var(--accent-gold)' }}
                >
                  — {t.author}
                </figcaption>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
