'use client'

import paloAltoInterior from '@/assets/palo-alto-luxury-interior.mp4.asset.json'
import walkthroughOriginal from '@/assets/luxury-walkthrough-original.mp4.asset.json'
import interiorOriginal from '@/assets/luxury-interior-walkthrough-original.mp4.asset.json'
import livingroomPanin from '@/assets/pa-livingroom-panin.mp4.asset.json'
import kitchenPanin from '@/assets/pa-kitchen-panin.mp4.asset.json'
import livingToBackyard from '@/assets/pa-livingroom-to-backyard.mp4.asset.json'
import backyardPan from '@/assets/pa-backyard-pan.mp4.asset.json'
import shippingContainerHome from '@/assets/pa-shipping-container-home.mp4.asset.json'
import concreteModernHome from '@/assets/pa-concrete-modern-home.mp4.asset.json'
import luxuryKitchenJapanese from '@/assets/luxury-kitchen-japanese-bamboo.mp4.asset.json'
import luxuryKitchenSteampunk from '@/assets/luxury-kitchen-steampunk-industrial.mp4.asset.json'

const extraTours = [
  {
    src: livingroomPanin.url,
    title: 'Living Room · Slow Pan-In',
    blurb: 'A cinematic glide into a Palo Alto living room — light sectional, oak floors, garden views through the picture window.',
    aria: 'Slow pan into a Palo Alto living room',
  },
  {
    src: kitchenPanin.url,
    title: 'Chef\u2019s Kitchen · Slow Pan-In',
    blurb: 'Marble island, pendant lighting, and shaker cabinetry — a steady pan into the heart of the home.',
    aria: 'Slow pan into a Palo Alto chef\u2019s kitchen',
  },
  {
    src: livingToBackyard.url,
    title: 'Living Room to Backyard',
    blurb: 'From the great room through open sliding doors out to the pool, patio, and mature oaks beyond.',
    aria: 'Pan from living room through sliding doors into the backyard',
  },
  {
    src: backyardPan.url,
    title: 'Backyard · Pool & Patio',
    blurb: 'A slow sideways drift across the rear yard — rectangular pool, flagstone patio, and the home\u2019s glass-walled façade.',
    aria: 'Slow pan across a Palo Alto luxury backyard',
  },
  {
    src: shippingContainerHome.url,
    title: 'Bonus · Shipping Container Home',
    blurb: 'A modern Palo Alto residence built from stacked Corten steel containers — cantilevered upper level and floor-to-ceiling glass.',
    aria: 'Exterior pan of a modern shipping container home',
  },
  {
    src: luxuryKitchenJapanese.url,
    title: 'Luxury Kitchen · Japanese Bamboo',
    blurb: 'A slow pan across a serene modern kitchen — light Japanese bamboo cabinets, vibrant green backsplash, stainless steel appliances, and a white granite waterfall island bathed in natural light.',
    aria: 'Slow pan across a luxury modern kitchen with Japanese bamboo cabinets and green backsplash',
  },
  {
    src: luxuryKitchenSteampunk.url,
    title: 'Luxury Kitchen · Industrial Steampunk',
    blurb: 'A slow pan across a bold industrial kitchen — polished concrete floors, matte black steel cabinetry, oil-rubbed bronze pendant lights, and raw exposed beams with high-end finishes.',
    aria: 'Slow pan across a luxury industrial kitchen with concrete floors and bronze pendant lights',
  },
  {
    src: concreteModernHome.url,
    title: 'Bonus · Concrete Modern',
    blurb: 'A long, low rectangular volume in board-formed concrete — glass walls, flat roof, and minimalist landscaping.',
    aria: 'Exterior pan of a rectangular concrete modern home',
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
