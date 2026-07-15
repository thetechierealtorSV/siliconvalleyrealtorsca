'use client'

import { useState } from 'react'
import { MapPin, Bed, Bath, Maximize } from 'lucide-react'
import luxuryPaloAlto1 from '@/assets/luxury-paloalto-1.jpg'
import luxuryAtherton1 from '@/assets/luxury-atherton-1.jpg'
import luxuryEichler1 from '@/assets/luxury-eichler-1.jpg'
import luxuryInterior1 from '@/assets/luxury-interior-1.jpg'
import luxuryPaloAlto2 from '@/assets/luxury-paloalto-2.jpg'
import luxuryAtherton2 from '@/assets/luxury-atherton-2.jpg'
import heroLuxuryCityView from '@/assets/hero-luxury.jpg'

const properties = [
  {
    id: 1,
    title: 'Modern Hilltop Estate',
    address: 'Palo Alto Hills',
    price: '$12,500,000',
    beds: 6,
    baths: 7,
    sqft: '8,200',
    image: luxuryPaloAlto1,
    tag: 'New Listing',
  },
  {
    id: 2,
    title: 'Mediterranean Grand Estate',
    address: 'Atherton',
    price: '$18,900,000',
    beds: 7,
    baths: 9,
    sqft: '12,400',
    image: luxuryAtherton1,
    tag: 'Featured',
  },
  {
    id: 3,
    title: 'Eichler Atrium Classic',
    address: 'Palo Alto',
    price: '$3,250,000',
    beds: 4,
    baths: 3,
    sqft: '2,180',
    image: luxuryEichler1,
    tag: 'Eichler',
  },
  {
    id: 4,
    title: 'Contemporary Open-Plan',
    address: 'Los Altos Hills',
    price: '$9,750,000',
    beds: 5,
    baths: 6,
    sqft: '6,800',
    image: luxuryInterior1,
    tag: 'Price Reduced',
  },
  {
    id: 5,
    title: 'Cantilevered Infinity Home',
    address: 'Saratoga',
    price: '$15,200,000',
    beds: 5,
    baths: 6,
    sqft: '7,500',
    image: luxuryPaloAlto2,
    tag: 'Just Listed',
  },
  {
    id: 6,
    title: 'Resort-Style Retreat',
    address: 'Los Gatos',
    price: '$22,000,000',
    beds: 8,
    baths: 10,
    sqft: '14,200',
    image: luxuryAtherton2,
    tag: 'Premium',
  },
  {
    id: 7,
    title: 'Skyline View Villa',
    address: 'Palo Alto Hills',
    price: '$16,800,000',
    beds: 6,
    baths: 7,
    sqft: '9,100',
    image: heroLuxuryCityView,
    tag: 'Signature',
  },
]

export function Portfolio() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return (
    <section id="properties" className="relative py-28 bg-background">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-16">
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4 font-medium">
            Curated Collection
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-foreground">
            Featured Properties
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            From iconic mid-century homes to sprawling estates, handpicked luxury across Silicon Valley's most coveted neighborhoods.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => {
            const cityHash = property.address.replace(/\s+/g, '-')
            const searchHref = `https://www.nikolaenkopropertygroup.com/search/#!/city:${cityHash}`
            return (
              <a
                key={property.id}
                href={searchHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View active listings near ${property.address}`}
                className="group bg-card rounded-2xl overflow-hidden clean-border elevated-shadow gentle-animation hover:shadow-lg cursor-pointer block"
                onMouseEnter={() => setHoveredId(property.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img
                    src={property.image}
                    alt={property.title}
                    loading="lazy" decoding="async"
                    width={1280}
                    height={960}
                    className="w-full h-full object-cover gentle-animation group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-foreground text-xs font-semibold px-3 py-1.5 rounded-full tracking-wide">
                      {property.tag}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <span className="bg-foreground/80 backdrop-blur-sm text-white text-lg font-bold px-4 py-2 rounded-lg">
                      {property.price}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">
                    {property.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-4">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{property.address}</span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground border-t border-border pt-4">
                    <div className="flex items-center gap-1.5"><Bed className="w-4 h-4" /><span>{property.beds} Beds</span></div>
                    <div className="flex items-center gap-1.5"><Bath className="w-4 h-4" /><span>{property.baths} Baths</span></div>
                    <div className="flex items-center gap-1.5"><Maximize className="w-4 h-4" /><span>{property.sqft} sqft</span></div>
                  </div>
                  <div className="mt-4 text-xs font-semibold tracking-wide uppercase text-muted-foreground group-hover:text-foreground">
                    View active listings →
                  </div>
                </div>
              </a>
            )
          })}
        </div>
        <p className="text-center text-xs text-muted-foreground mt-6">
          Property cards open live listings on nikolaenkopropertygroup.com.
        </p>
      </div>
    </section>
  )
}
