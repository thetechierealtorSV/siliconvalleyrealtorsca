'use client'

import walkthroughVideo from '@/assets/luxury-walkthrough.mp4.asset.json'
import interiorVideo from '@/assets/luxury-interior-walkthrough.mp4.asset.json'
import paloAltoInterior from '@/assets/palo-alto-luxury-interior.mp4.asset.json'
import walkthroughOriginal from '@/assets/luxury-walkthrough-original.mp4.asset.json'
import interiorOriginal from '@/assets/luxury-interior-walkthrough-original.mp4.asset.json'
import paloAltoOriginal from '@/assets/palo-alto-luxury-interior-original.mp4.asset.json'

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
          {/* Video 1 — Exterior / Aerial */}
          <div>
            <div className="rounded-2xl overflow-hidden elevated-shadow clean-border">
              <video
                src={walkthroughVideo.url}
                controls
                autoPlay
                muted
                loop
                playsInline
                className="w-full aspect-video object-cover"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          {/* Video 2 — Interior & Drone */}
          <div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2 text-center">
              Interior & Aerial Tour
            </h3>
            <p className="text-muted-foreground text-center mb-6 max-w-xl mx-auto">
              Drone aerials descend into designer interiors — marble finishes, panoramic views, and open-concept living at its finest.
            </p>
            <div className="rounded-2xl overflow-hidden elevated-shadow clean-border">
              <video
                src={interiorVideo.url}
                controls
                autoPlay
                muted
                loop
                playsInline
                className="w-full aspect-video object-cover"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          {/* Video 3 — Palo Alto Sped-Up Interior */}
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
                autoPlay
                muted
                loop
                playsInline
                className="w-full aspect-video object-cover"
                aria-label="Sped-up interior walkthrough of a Palo Alto luxury home"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          {/* Original AI-generated companion videos */}
          <div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2 text-center">
              Estate Showcase · Original Cut
            </h3>
            <p className="text-muted-foreground text-center mb-6 max-w-xl mx-auto">
              Our original cinematic exterior walkthrough — preserved for clients who loved the first edit.
            </p>
            <div className="rounded-2xl overflow-hidden elevated-shadow clean-border">
              <video src={walkthroughOriginal.url} controls muted loop playsInline className="w-full aspect-video object-cover" />
            </div>
          </div>

          <div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2 text-center">
              Interior & Aerial · Original Cut
            </h3>
            <p className="text-muted-foreground text-center mb-6 max-w-xl mx-auto">
              The original interior and drone aerial edit — kept alongside the refreshed version.
            </p>
            <div className="rounded-2xl overflow-hidden elevated-shadow clean-border">
              <video src={interiorOriginal.url} controls muted loop playsInline className="w-full aspect-video object-cover" />
            </div>
          </div>

          <div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2 text-center">
              Palo Alto Estate · Original Cut
            </h3>
            <p className="text-muted-foreground text-center mb-6 max-w-xl mx-auto">
              The original Palo Alto sped-up interior — preserved as a companion to the new edit.
            </p>
            <div className="rounded-2xl overflow-hidden elevated-shadow clean-border">
              <video src={paloAltoOriginal.url} controls muted loop playsInline className="w-full aspect-video object-cover" />
            </div>
          </div>

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
