import { useEffect } from 'react'

interface SEOProps {
  title: string
  description: string
  canonical?: string
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
  image?: string
}

function setMeta(attr: 'name' | 'property', key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

const DEFAULT_OG_IMAGE = 'https://nikolaenkoestates.com/og-image.jpg'

export function SEO({ title, description, canonical, jsonLd, image }: SEOProps) {
  useEffect(() => {
    document.title = title
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:type', 'website')
    setMeta('property', 'og:site_name', 'Nikolaenko Estates')
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:card', 'summary_large_image')

    const url = canonical ?? window.location.href
    setMeta('property', 'og:url', url)
    setLink('canonical', url)

    const ogImage = image ?? DEFAULT_OG_IMAGE
    setMeta('property', 'og:image', ogImage)
    setMeta('name', 'twitter:image', ogImage)

    let script = document.head.querySelector<HTMLScriptElement>('script[data-seo-jsonld="true"]')
    if (jsonLd) {
      if (!script) {
        script = document.createElement('script')
        script.type = 'application/ld+json'
        script.setAttribute('data-seo-jsonld', 'true')
        document.head.appendChild(script)
      }
      script.text = JSON.stringify(jsonLd)
    } else if (script) {
      script.remove()
    }
  }, [title, description, canonical, image, jsonLd])

  return null
}

const SITE_URL = 'https://nikolaenkoestates.com'

export const ORG_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: 'Nikolaenko Estates',
  description:
    'Luxury real estate brokerage serving all of Silicon Valley — Palo Alto, Atherton, Los Altos Hills, Menlo Park, Woodside, Saratoga, Los Gatos, Cupertino, Mountain View, Sunnyvale.',
  areaServed: [
    'Palo Alto', 'Atherton', 'Los Altos Hills', 'Menlo Park', 'Woodside',
    'Saratoga', 'Los Gatos', 'Cupertino', 'Mountain View', 'Sunnyvale',
  ],
  url: SITE_URL,
  knowsAbout: [
    'Luxury Real Estate', 'Eichler Homes', 'Mid-Century Modern',
    'Probate Sales', 'Foreclosure', 'Short Sale', 'VA Loans',
    'Assumable Loans', 'Senior Assisted Living Transitions',
    'Nationwide Relocation', '1031 Exchange',
  ],
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  }
}
