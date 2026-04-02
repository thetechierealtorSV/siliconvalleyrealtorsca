'use client'

import { useState } from 'react'
import { MapPin, Bed, Bath, Maximize } from 'lucide-react'

const properties = [
  {
    id: 1,
    title: 'Sunlight Atrium Eichler',
    address: 'Greenmeadow, Palo Alto',
    price: '$3,250,000',
    beds: 4,
    baths: 3,
    sqft: '2,180',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80&auto=format',
    tag: 'New Listing',
  },
  {
    id: 2,
    title: 'Glass-Wall Ranch',
    address: 'Fairmeadow, Sunnyvale',
    price: '$2,895,000',
    beds: 3,
    baths: 2,
    sqft: '1,940',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80&auto=format',
    tag: 'Featured',
  },
  {
    id: 3,
    title: 'Courtyard Modern',
    address: 'Eichler Highlands, San Jose',
    price: '$2,475,000',
    beds: 4,
    baths: 2,
    sqft: '2,050',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80&auto=format',
    tag: 'Open House',
  },
  {
    id: 4,
    title: 'Post & Beam Classic',
    address: 'Mackay Park, San Mateo',
    price: '$3,100,000',
    beds: 5,
    baths: 3,
    sqft: '2,420',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80&auto=format',
    tag: 'Reduced',
  },
  {
    id: 5,
    title: 'Radiant-Floor Retreat',
    address: 'Terra Linda, San Rafael',
    price: '$1,985,000',
    beds: 3,
    baths: 2,
    sqft: '1,780',
    image: 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&q=80&auto=format',
    tag: 'Just Listed',
  },
  {
    id: 6,
    title: 'Open-Plan Masterpiece',
    address: 'Fairhills, Mountain View',
    price: '$3,750,000',
    beds: 4,
    baths: 3,
    sqft: '2,600',
    image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80&auto=format',
    tag: 'Premium',
  },
]

export function Portfolio() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return (
    <section id="properties" className="relative py-28 bg-background">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4 font-medium">
            Curated Collection
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-foreground">
            Featured Properties
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Handpicked Eichler homes showcasing the best of mid-century modern architecture across Silicon Valley.
          </p>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <div
              key={property.id}
              className="group bg-card rounded-2xl overflow-hidden clean-border elevated-shadow gentle-animation hover:shadow-lg cursor-pointer"
              onMouseEnter={() => setHoveredId(property.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Image */}
              <div className="relative overflow-hidden aspect-[4/3]">
                <img
                  src={property.image}
                  alt={property.title}
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

              {/* Details */}
              <div className="p-6">
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  {property.title}
                </h3>
                <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-4">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{property.address}</span>
                </div>
                <div className="flex items-center gap-6 text-sm text-muted-foreground border-t border-border pt-4">
                  <div className="flex items-center gap-1.5">
                    <Bed className="w-4 h-4" />
                    <span>{property.beds} Beds</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Bath className="w-4 h-4" />
                    <span>{property.baths} Baths</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Maximize className="w-4 h-4" />
                    <span>{property.sqft} sqft</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
