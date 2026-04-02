'use client'

import walkthroughVideo from '@/assets/luxury-walkthrough.mp4.asset.json'

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

        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl overflow-hidden elevated-shadow clean-border">
            <video
              src={walkthroughVideo.url}
              controls
              autoPlay
              muted
              loop
              playsInline
              className="w-full aspect-video object-cover"
              poster=""
            >
              Your browser does not support the video tag.
            </video>
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
