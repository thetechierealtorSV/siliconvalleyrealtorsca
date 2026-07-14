'use client'

import { Youtube, Play } from 'lucide-react'

// Placeholder YouTube tours. Swap the `videoId` values with real IDs once
// the home-tour videos are filmed and uploaded to the SVR YouTube channel.
const tours = [
  {
    videoId: '',
    title: 'Palo Alto Estate · Full Home Tour',
    blurb: 'A guided walkthrough of a signature Palo Alto estate, coming soon to our YouTube channel.',
  },
  {
    videoId: '',
    title: 'Atherton Modern · Architectural Tour',
    blurb: 'An in-depth architectural tour of a contemporary Atherton residence, filming in progress.',
  },
  {
    videoId: '',
    title: 'Los Altos Hills · Grounds & Interiors',
    blurb: 'Sweeping grounds, pool, and interior finishes on a Los Altos Hills property, coming soon.',
  },
]

// A search-embed lets us surface real luxury home-tour content on the SVR
// channel today, and we can swap it for a specific playlist ID once we have
// original footage published.
const CHANNEL_SEARCH_EMBED =
  'https://www.youtube.com/embed?listType=search&list=silicon+valley+luxury+home+tour'

export function YouTubeTours() {
  return (
    <section id="youtube-tours" className="relative py-28 bg-background">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-14">
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4 font-medium">
            YouTube Channel
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold leading-tight mb-6 text-foreground">
            Home Tours on YouTube
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Subscribe to follow our original Silicon Valley home tour series. Full walkthroughs, architectural deep-dives,
            and neighborhood features published monthly.
          </p>
          <a
            href="https://www.youtube.com/results?search_query=silicon+valley+luxury+home+tour"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-full bg-foreground text-primary-foreground text-sm font-medium hover:opacity-90 transition"
          >
            <Youtube className="w-4 h-4" aria-hidden="true" />
            Visit our channel
          </a>
        </div>

        {/* Featured live embed (channel search) */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="rounded-2xl overflow-hidden elevated-shadow clean-border aspect-video bg-black">
            <iframe
              src={CHANNEL_SEARCH_EMBED}
              title="Silicon Valley luxury home tour videos"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
          <p className="text-xs text-center text-muted-foreground mt-3">
            Live feed of luxury home tour videos. Original SVR-branded tours coming soon.
          </p>
        </div>

        {/* Upcoming tour placeholders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tours.map((t) => (
            <article
              key={t.title}
              className="rounded-2xl overflow-hidden clean-border bg-card gentle-animation hover:elevated-shadow"
            >
              <div className="relative aspect-video bg-secondary/60 flex items-center justify-center">
                {t.videoId ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${t.videoId}`}
                    title={t.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <div className="w-14 h-14 rounded-full bg-foreground/10 flex items-center justify-center">
                      <Play className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <span className="text-xs tracking-[0.2em] uppercase">Coming soon</span>
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{t.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t.blurb}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
