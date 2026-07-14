'use client'

import { useState } from 'react'
import { Search, MapPin, Bed, DollarSign } from 'lucide-react'

const cities = [
  'Palo Alto', 'Atherton', 'Los Altos Hills', 'Los Altos', 'Menlo Park', 'Woodside',
  'Portola Valley', 'Hillsborough', 'Burlingame', 'San Carlos', 'Belmont', 'Redwood City',
  'San Mateo', 'Foster City', 'Half Moon Bay',
  'Mountain View', 'Sunnyvale', 'Cupertino', 'Saratoga', 'Los Gatos', 'Monte Sereno',
  'Campbell', 'Santa Clara', 'San Jose', 'Willow Glen', 'Almaden Valley',
  'Milpitas', 'Fremont', 'Newark', 'Union City',
  'San Francisco', 'Pacifica', 'Daly City',
  'Oakland', 'Piedmont', 'Berkeley', 'Alameda', 'Lafayette', 'Orinda', 'Moraga',
  'Walnut Creek', 'Danville', 'Alamo', 'Blackhawk', 'Pleasanton', 'Livermore', 'Dublin',
  'Tiburon', 'Belvedere', 'Sausalito', 'Mill Valley', 'Larkspur', 'Ross', 'Kentfield',
]

const priceTiers = [
  { value: '', label: 'Any' },
  { value: '500000', label: '$500K' },
  { value: '750000', label: '$750K' },
  { value: '1000000', label: '$1M' },
  { value: '1500000', label: '$1.5M' },
  { value: '2000000', label: '$2M' },
  { value: '3000000', label: '$3M' },
  { value: '5000000', label: '$5M' },
  { value: '7500000', label: '$7.5M' },
  { value: '10000000', label: '$10M' },
  { value: '15000000', label: '$15M' },
  { value: '20000000', label: '$20M+' },
]

const PARENT_SEARCH = 'https://www.nikolaenkopropertygroup.com/search/'

/**
 * IDX search that hands off directly to the parent Moxi Works search on
 * nikolaenkopropertygroup.com. City + price + beds are appended as a Moxi
 * hash-route filter (#!/city:X/min-price:N/max-price:N/beds:N/).
 */
export function IDXSearch() {
  const [city, setCity] = useState('')
  const [cityText, setCityText] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [minPriceText, setMinPriceText] = useState('')
  const [maxPriceText, setMaxPriceText] = useState('')
  const [beds, setBeds] = useState('')
  const [bedsText, setBedsText] = useState('')

  const stripNum = (s: string) => s.replace(/[^\d]/g, '')

  const buildMoxiUrl = () => {
    const finalCity = (cityText.trim() || city).trim()
    const finalMin = stripNum(minPriceText) || minPrice
    const finalMax = stripNum(maxPriceText) || maxPrice
    const finalBeds = stripNum(bedsText) || beds
    const parts: string[] = []
    if (finalCity) parts.push('city:' + finalCity.replace(/\s+/g, '-'))
    if (finalMin) parts.push('min-price:' + finalMin)
    if (finalMax) parts.push('max-price:' + finalMax)
    if (finalBeds) parts.push('min-beds:' + finalBeds.replace('+', ''))
    const hash = parts.length ? '#!/' + parts.join('/') : '#!/defaultsearch:true'
    return PARENT_SEARCH + hash
  }

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault()
    window.open(buildMoxiUrl(), '_blank', 'noopener,noreferrer')
  }

  return (
    <form
      onSubmit={onSearch}
      className="bg-card clean-border elevated-shadow rounded-2xl p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-6 gap-3"
      aria-label="Silicon Valley MLS property search"
    >
      <label className="sm:col-span-2 flex items-center gap-2 px-3 py-2 rounded-xl bg-background border border-border">
        <MapPin className="w-4 h-4 text-muted-foreground" aria-hidden />
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="flex-1 bg-background text-sm text-foreground focus:outline-none"
          aria-label="City"
        >
          <option value="" className="bg-background text-foreground">Any Silicon Valley city</option>
          {cities.map((c) => (
            <option key={c} value={c} className="bg-background text-foreground">{c}</option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-background border border-border">
        <DollarSign className="w-4 h-4 text-muted-foreground" aria-hidden />
        <select
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="flex-1 bg-background text-sm text-foreground focus:outline-none"
          aria-label="Minimum price"
        >
          {priceTiers.map((p) => (
            <option key={'min-' + p.value} value={p.value} className="bg-background text-foreground">
              {p.value ? 'Min ' + p.label : 'Min price'}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-background border border-border">
        <DollarSign className="w-4 h-4 text-muted-foreground" aria-hidden />
        <select
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="flex-1 bg-background text-sm text-foreground focus:outline-none"
          aria-label="Maximum price"
        >
          {priceTiers.map((p) => (
            <option key={'max-' + p.value} value={p.value} className="bg-background text-foreground">
              {p.value ? 'Max ' + p.label : 'Max price'}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-background border border-border">
        <Bed className="w-4 h-4 text-muted-foreground" aria-hidden />
        <select
          value={beds}
          onChange={(e) => setBeds(e.target.value)}
          className="flex-1 bg-background text-sm text-foreground focus:outline-none"
          aria-label="Minimum bedrooms"
        >
          <option value="" className="bg-background text-foreground">Any beds</option>
          {['2', '3', '4', '5', '6'].map((n) => (
            <option key={n} value={n} className="bg-background text-foreground">{n}+ beds</option>
          ))}
        </select>
      </label>

      {/* Manual text inputs, override dropdowns when filled */}
      <input
        type="text"
        value={cityText}
        onChange={(e) => setCityText(e.target.value)}
        placeholder="Or type city"
        aria-label="City (text input)"
        className="sm:col-span-2 px-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30"
      />
      <input
        type="text"
        inputMode="numeric"
        value={minPriceText}
        onChange={(e) => setMinPriceText(e.target.value)}
        placeholder="Min $ (e.g. 1500000)"
        aria-label="Minimum price (text input)"
        className="px-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30"
      />
      <input
        type="text"
        inputMode="numeric"
        value={maxPriceText}
        onChange={(e) => setMaxPriceText(e.target.value)}
        placeholder="Max $ (e.g. 5000000)"
        aria-label="Maximum price (text input)"
        className="px-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30"
      />
      <input
        type="text"
        inputMode="numeric"
        value={bedsText}
        onChange={(e) => setBedsText(e.target.value)}
        placeholder="Min beds"
        aria-label="Minimum beds (text input)"
        className="px-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30"
      />

      <button
        type="submit"
        className="sm:col-span-6 bg-foreground text-primary-foreground rounded-xl px-4 py-2.5 text-sm font-medium hover:opacity-90 gentle-animation flex items-center justify-center gap-2"
      >
        <Search className="w-4 h-4" /> Search MLS
      </button>

      <p className="sm:col-span-6 text-[11px] text-muted-foreground text-center">
        Typed values override the dropdowns. Opens live listings on nikolaenkopropertygroup.com.
      </p>
    </form>
  )
}
