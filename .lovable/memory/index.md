# Project Memory

## Core
Silicon Valley Realtors by The Nikolaenko Group — luxury real estate site serving all of Silicon Valley.
Playfair Display headings, Inter body. Warm cream palette, gold accents.
Nav: Properties → Video Tours → Buyers → Sellers → Services → Contact.
No team section or customer reviews. Focus on services, technology, network, dedication.
Multi-page app: Home (/), Properties (/properties), Buyers (/buyers), Sellers (/sellers).
All forms route through src/lib/leads.ts → public.leads table with lead_type segmentation.

## Memories
- [Brand identity](mem://brand/identity) — Company name, color palette, typography, positioning
- [Navigation order](mem://ui/navigation-order) — Strict nav ordering
- [Contact section](mem://features/contact-section) — Contact form + WhatsApp/Instagram/AI voicemail channels
- [Buyers page](mem://features/buyers-page) — Buyer agreement form, pre-approval intake, loan officer network
- [Sellers page](mem://features/sellers-page) — Listing intake, à la carte concierge program, home toolkit with checklist/valuation/vendor referrals
- [Chatbot](mem://features/chatbot) — Luxury concierge + sales qualifier, neuroscience-informed lead capture
- [Lead routing](mem://features/lead-routing) — Segmented leads table with auto hot/warm priority, RLS admin-only reads
- [SEO + IDX](mem://features/seo-idx) — SEO component injects title/desc/JSON-LD; IDXSearch + /properties page IDX-ready
