'use client'

import paloAltoInterior from '@/assets/palo-alto-luxury-interior.mp4.asset.json'
import walkthroughOriginal from '@/assets/luxury-walkthrough-original.mp4.asset.json'
import interiorOriginal from '@/assets/luxury-interior-walkthrough-original.mp4.asset.json'
import craftsman from '@/assets/palo-alto-craftsman-walkthrough.mp4.asset.json'
import eichler from '@/assets/palo-alto-eichler-walkthrough.mp4.asset.json'
import primarySuite from '@/assets/palo-alto-primary-suite-walkthrough.mp4.asset.json'
import colonial from '@/assets/palo-alto-colonial-walkthrough.mp4.asset.json'

const extraTours = [
  {
    src: craftsman.url,
    title: 'Palo Alto Craftsman · Main Level',
    blurb: 'Entry foyer through the living room and into a bright shaker-style kitchen — a realistic Palo Alto main-floor flow.',
    aria: 'Walkthrough of a Palo Alto craftsman home main level',
  },
  {
    src: eichler.url,
    title: 'Eichler Mid-Century · Open Plan',
    blurb: 'Floor-to-ceiling glass, post-and-beam ceilings, and an open living-dining flow opening to the backyard.',
    aria: 'Walkthrough of a Palo Alto Eichler-style mid-century modern home',
  },
  {
    src: primarySuite.url,
    title: 'Primary Suite · Bedroom & Spa Bath',
    blurb: 'A serene primary bedroom into a spa-style ensuite with double vanity and freestanding tub.',
    aria: 'Walkthrough of a primary bedroom suite',
  },
  {
    src: colonial.url,
    title: 'Two-Story Colonial · Foyer to Kitchen',
    blurb: 'Classic Palo Alto colonial — foyer staircase, formal living room, family room, and chef\u2019s kitchen with breakfast nook.',
    aria: 'Walkthrough of a two-story Palo Alto colonial home',
  },
]

export function VideoTour() {
  return (
    <section id="video-tour" className="relative py-28 bg-secondary/30">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-16">
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4 font-medium">
            Cinematic Experience
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-foreground">
            Video Walkthroughs
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Experience properties through cinematic video tours — immersive walkthroughs that capture light, space, and atmosphere before you ever step foot inside.
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-16">
          {/* Interior & Aerial · Original Cut */}
          <div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2 text-center">
              Interior & Aerial · Original Cut
            </h3>
            <p className="text-muted-foreground text-center mb-6 max-w-xl mx-auto">
              The original interior and drone aerial edit — kept alongside the refreshed version.
            </p>
            <div className="rounded-2xl overflow-hidden elevated-shadow clean-border">
              <video src={interiorOriginal.url} controls muted loop playsInline preload="metadata" className="w-full aspect-video object-cover" aria-label="Interior and aerial cinematic walkthrough" />
            </div>
          </div>

          {/* Estate Showcase · Original Cut */}
          <div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2 text-center">
              Estate Showcase · Original Cut
            </h3>
            <p className="text-muted-foreground text-center mb-6 max-w-xl mx-auto">
              Our original cinematic exterior walkthrough — preserved for clients who loved the first edit.
            </p>
            <div className="rounded-2xl overflow-hidden elevated-shadow clean-border">
              <video src={walkthroughOriginal.url} controls muted loop playsInline preload="metadata" className="w-full aspect-video object-cover" aria-label="Estate exterior cinematic walkthrough" />
            </div>
          </div>

          {/* Palo Alto Sped-Up Interior */}
          <div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2 text-center">
              Palo Alto Estate · Sped-Up Interior
            </h3>
            <p className="text-muted-foreground text-center mb-6 max-w-xl mx-auto">
              A hyperlapse glide through an ultra-luxury Palo Alto residence — chef's kitchen, primary suite, wine cellar, and designer finishes throughout.
            </p>
            <div className="rounded-2xl overflow-hidden elevated-shadow clean-border">
              <video
                src={paloAltoInterior.url}
                controls
                muted
                loop
                playsInline
                preload="metadata"
                className="w-full aspect-video object-cover"
                aria-label="Sped-up interior walkthrough of a Palo Alto luxury home"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          {extraTours.map((t) => (
            <div key={t.title}>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2 text-center">{t.title}</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-xl mx-auto">{t.blurb}</p>
              <div className="rounded-2xl overflow-hidden elevated-shadow clean-border">
                <video src={t.src} controls muted loop playsInline preload="metadata" className="w-full aspect-video object-cover" aria-label={t.aria} />
              </div>
            </div>
          ))}

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div>
              <div className="font-display text-2xl font-bold text-foreground mb-1">4K Quality</div>
              <p className="text-muted-foreground text-sm">Ultra-high definition cinematic production</p>
            </div>
            <div>
              <div className="font-display text-2xl font-bold text-foreground mb-1">Studio-Crafted</div>
              <p className="text-muted-foreground text-sm">Professional architectural visualization</p>
            </div>
            <div>
              <div className="font-display text-2xl font-bold text-foreground mb-1">360° Views</div>
              <p className="text-muted-foreground text-sm">Complete property exploration</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
