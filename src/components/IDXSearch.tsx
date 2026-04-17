'use client'

import { useState } from 'react'
import { Search, MapPin, Bed, DollarSign } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const cities = [
  'Palo Alto', 'Atherton', 'Los Altos Hills', 'Menlo Park', 'Woodside',
  'Saratoga', 'Los Gatos', 'Cupertino', 'Mountain View', 'Sunnyvale',
]

/**
 * IDX-ready property search. Drops cleanly into any MLS/IDX provider
 * (IDX Broker, Showcase IDX, RealGeeks, Constellation) by swapping the
 * navigate target — query params follow standard IDX conventions.
 */
export function IDXSearch() {
  const navigate = useNavigate()
  const [city, setCity] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [beds, setBeds] = useState('')

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (city) params.set('city', city)
    if (minPrice) params.set('min_price', minPrice)
    if (maxPrice) params.set('max_price', maxPrice)
    if (beds) params.set('beds', beds)
    navigate(`/properties?${params.toString()}`)
  }

  return (
    <form
      onSubmit={onSearch}
      className="bg-card clean-border elevated-shadow rounded-2xl p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-5 gap-3"
      aria-label="Silicon Valley MLS property search"
    >
      <label className="sm:col-span-2 flex items-center gap-2 px-3 py-2 rounded-xl bg-background border border-border">
        <MapPin className="w-4 h-4 text-muted-foreground" aria-hidden />
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="flex-1 bg-transparent text-sm text-foreground focus:outline-none"
          aria-label="City"
        >
          <option value="">Any Silicon Valley city</option>
          {cities.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </label>

      <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-background border border-border">
        <DollarSign className="w-4 h-4 text-muted-foreground" aria-hidden />
        <input
          type="number"
          inputMode="numeric"
          placeholder="Min price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="flex-1 bg-transparent text-sm text-foreground focus:outline-none placeholder:text-muted-foreground"
          aria-label="Minimum price"
        />
      </label>

      <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-background border border-border">
        <DollarSign className="w-4 h-4 text-muted-foreground" aria-hidden />
        <input
          type="number"
          inputMode="numeric"
          placeholder="Max price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="flex-1 bg-transparent text-sm text-foreground focus:outline-none placeholder:text-muted-foreground"
          aria-label="Maximum price"
        />
      </label>

      <button
        type="submit"
        className="bg-foreground text-primary-foreground rounded-xl px-4 py-2.5 text-sm font-medium hover:opacity-90 gentle-animation flex items-center justify-center gap-2"
      >
        <Search className="w-4 h-4" /> Search MLS
      </button>

      <div className="sm:col-span-5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Bed className="w-3.5 h-3.5" aria-hidden />
        <span className="mr-1">Beds:</span>
        {['', '2', '3', '4', '5+'].map((n) => (
          <button
            type="button"
            key={n || 'any'}
            onClick={() => setBeds(n)}
            className={`px-2.5 py-1 rounded-full border text-xs gentle-animation ${
              beds === n
                ? 'bg-foreground text-primary-foreground border-foreground'
                : 'border-border hover:border-foreground/40'
            }`}
          >
            {n || 'Any'}
          </button>
        ))}
      </div>
    </form>
  )
}
