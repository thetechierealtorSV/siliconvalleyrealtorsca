---
name: SEO + IDX
description: Per-page SEO via src/components/SEO.tsx (sets title, meta, OG, canonical, JSON-LD); IDXSearch component + /properties page are MLS-ready with city/price/beds query params
type: feature
---
- `<SEO title description jsonLd image? canonical?>` — drop into any page, updates document head reactively.
- `ORG_JSON_LD` — RealEstateAgent schema with all Silicon Valley areaServed cities and knowsAbout specialties.
- `<IDXSearch />` — search form (city, min/max price, beds) that navigates to `/properties?...`. Drop-in for any IDX provider (IDX Broker, Showcase, RealGeeks).
- `/properties` page renders search params, captures MLS alert leads, includes city in H1/title for SEO.
- `public/sitemap.xml` lists all city-scoped property URLs; `public/robots.txt` references sitemap.
