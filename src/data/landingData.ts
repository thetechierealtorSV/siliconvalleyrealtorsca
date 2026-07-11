// Auto-authored SEO/AEO landing page data for Nikolaenko Property Group.
// IDX routing targets the main IDX site (nikolaenkopropertygroup.com) using Moxi search
// deep-links with verified property-type codes. UTM params track subdomain-sourced traffic.
// Compliance: no ranking/award/language claims stated as fact; advisory phrasing only.

export interface FaqItem { q: string; a: string }
export interface LandingData {
  slug: string
  h1: string
  metaTitle: string
  metaDescription: string
  intro: string
  aeoQuestion: string
  ctaLabel: string
  idxUrl: string
  body: string[]
  faqs: FaqItem[]
  breadcrumbLabel: string
}

const IDX_HOST = 'https://nikolaenkopropertygroup.com'
const PTYPE = { sfr: '1', condo: '28', town: '9', multi: '7', land: '3' }

function idx(city: string | null, ptypes: string[], extra: Record<string, string> = {}): string {
  const params = new URLSearchParams()
  params.set('status', 'active')
  params.set('pstatus', '1,11')
  if (city) {
    params.set('location_search_field', city + ', CA')
    params.set('ss_description', city + ', CA')
  }
  params.set('ptype', ptypes.join(','))
  params.set('searchType', 'criteria')
  params.set('sort_by', '1')
  Object.entries(extra).forEach(([k, v]) => params.set(k, v))
  // UTM tracking for traffic sourced from the luxury advisory subdomain
  const utm = 'utm_source=luxury_site&utm_medium=referral&utm_campaign=idx_routing'
  return IDX_HOST + '/search/#' + params.toString() + '&' + utm
}

const CITIES = ['Palo Alto','Sunnyvale','Cupertino','Mountain View','Campbell','San Jose','Santa Clara','Los Altos','Los Gatos','Saratoga','Menlo Park','Redwood City','Milpitas']

const ALL_RES = [PTYPE.sfr, PTYPE.condo, PTYPE.town]

function citySlug(c: string): string { return c.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '') + '-homes' }

const cityPages: LandingData[] = CITIES.map((c) => ({
  slug: citySlug(c),
  breadcrumbLabel: c + ' Homes',
  h1: c + ' Homes for Sale',
  metaTitle: c + ' Homes for Sale | Nikolaenko Property Group',
  metaDescription: 'Search ' + c + ' homes for sale and connect with Nikolaenko Property Group for local pricing guidance, school-area insights, and Silicon Valley buyer strategy.',
  aeoQuestion: 'What homes are currently for sale in ' + c + '?',
  intro: 'Explore current ' + c + ' homes for sale, including single-family homes, condos, and townhomes. For buyers comparing neighborhoods, school access, commute patterns, and long-term value, Nikolaenko Property Group provides local guidance before and after the search.',
  ctaLabel: 'Search ' + c + ' Homes',
  idxUrl: idx(c, ALL_RES),
  body: [
    c + ' is one of Silicon Valley\'s most sought-after places to own a home, and inventory moves quickly. Reviewing active listings alongside local pricing context helps buyers act with confidence rather than guesswork.',
    'A ' + c + ' home search typically spans single-family homes, condominiums, and townhomes across a range of price points. Understanding how school boundaries, commute corridors, and neighborhood character affect value is often as important as the list price itself.',
    'Nikolaenko Property Group supports ' + c + ' buyers with pricing intelligence, neighborhood research, offer strategy, and negotiation guidance rooted in the local Silicon Valley market.'
  ],
  faqs: [
    { q: 'What types of homes are for sale in ' + c + '?', a: 'Active ' + c + ' listings generally include single-family homes, condos, and townhomes. The current mix and price range shift with the market, which is why it helps to view live MLS results and discuss pricing context with a local advisor.' },
    { q: 'How do I search current MLS homes in ' + c + '?', a: 'Use the ' + c + ' home search to view active MLS listings, then reach out for guidance on pricing, schools, commute, and offer strategy specific to your goals.' },
    { q: 'Can Nikolaenko Property Group help me evaluate ' + c + ' homes?', a: 'Yes. Buyers receive local guidance on price, school access, commute patterns, and resale considerations to compare ' + c + ' homes intelligently.' }
  ]
}))

const propertyTypePages: LandingData[] = [
  {
    slug: 'silicon-valley-investment-properties',
    breadcrumbLabel: 'Investment Properties',
    h1: 'Silicon Valley Investment Properties for Sale',
    metaTitle: 'Silicon Valley Investment Properties for Sale | Nikolaenko Property Group',
    metaDescription: 'Search Silicon Valley investment and income properties, including multi-family homes. Get buyer strategy, rental-income context, and market guidance from Nikolaenko Property Group.',
    aeoQuestion: 'What investment properties are for sale in Silicon Valley?',
    intro: 'Explore Silicon Valley investment properties, including multi-family homes with rental-income potential. Nikolaenko Property Group helps investors evaluate income potential, financing considerations, and long-term value across the Bay Area.',
    ctaLabel: 'Search Investment Properties',
    idxUrl: idx(null, [PTYPE.multi]),
    body: [
      'Silicon Valley investment real estate ranges from small residential income properties to multi-family buildings. Evaluating an income property means looking beyond list price to rents, expenses, condition, and neighborhood trajectory.',
      'Owner-user and house-hacking strategies, where a buyer lives in one unit and rents the others, are common ways to enter the Bay Area market. These approaches require careful review of financing, occupancy, and local regulations.',
      'Nikolaenko Property Group provides investors with analysis of income potential, pricing, and market context so decisions are grounded in real numbers rather than assumptions.'
    ],
    faqs: [
      { q: 'What counts as an investment property in Silicon Valley?', a: 'Investment or income properties often include multi-family homes such as duplexes, triplexes, and fourplexes. The active MLS mix varies, so it helps to review live listings and discuss income potential with an advisor.' },
      { q: 'What is house-hacking?', a: 'House-hacking generally means buying a small multi-family property, living in one unit, and renting the others to offset costs. Feasibility depends on financing, price, condition, and local rules.' },
      { q: 'Can I get help analyzing income potential?', a: 'Yes. Buyers receive guidance on rents, expenses, and market context to evaluate whether a property fits their investment goals.' }
    ]
  },
  {
    slug: 'silicon-valley-duplex-triplex-fourplex',
    breadcrumbLabel: 'Duplex, Triplex & Fourplex',
    h1: 'Silicon Valley Duplexes, Triplexes & Fourplexes for Sale',
    metaTitle: 'Silicon Valley Duplex, Triplex & Fourplex for Sale | Nikolaenko Property Group',
    metaDescription: 'Search Silicon Valley multi-family homes including duplexes, triplexes, and fourplexes. Get income analysis and buyer strategy from Nikolaenko Property Group.',
    aeoQuestion: 'Where can I find duplexes, triplexes, and fourplexes for sale in Silicon Valley?',
    intro: 'Explore Silicon Valley multi-family homes, including duplexes, triplexes, and fourplexes. These small residential income properties are searched together under the multi-family category in the MLS.',
    ctaLabel: 'Search Multi-Family Homes',
    idxUrl: idx(null, [PTYPE.multi]),
    body: [
      'Duplexes, triplexes, and fourplexes are grouped as multi-family properties in the MLS. They appeal to both investors seeking rental income and owner-users pursuing house-hacking strategies.',
      'Because these properties combine residential living with income potential, evaluating them well means weighing unit condition, rents, financing, and neighborhood demand together.',
      'Nikolaenko Property Group helps buyers compare multi-family options and understand the income and ownership tradeoffs specific to Silicon Valley.'
    ],
    faqs: [
      { q: 'Are duplexes and fourplexes listed separately from single-family homes?', a: 'In the MLS they appear under the multi-family property type. A multi-family search surfaces duplexes, triplexes, and fourplexes together.' },
      { q: 'Can I live in one unit and rent the others?', a: 'Many buyers do exactly this. Whether it works for you depends on financing, price, and local occupancy rules, which an advisor can help you assess.' },
      { q: 'How do I evaluate a multi-family property?', a: 'Look at rents, expenses, condition, and neighborhood demand alongside price. Guidance from a local advisor helps ground the analysis.' }
    ]
  },
  {
    slug: 'silicon-valley-fixer-upper-homes',
    breadcrumbLabel: 'Fixer-Upper Homes',
    h1: 'Fixer-Upper & Value-Add Homes in Silicon Valley',
    metaTitle: 'Silicon Valley Fixer-Upper Homes | Value-Add Buyer Guidance | Nikolaenko Property Group',
    metaDescription: 'Interested in fixer-upper or value-add homes in Silicon Valley? Get buyer guidance on renovation potential, pricing, and search strategy from Nikolaenko Property Group.',
    aeoQuestion: 'How do I find fixer-upper homes in Silicon Valley?',
    intro: 'Fixer-upper and value-add homes can offer opportunity for buyers willing to renovate. Because condition is not a formal MLS property type, finding them well takes local guidance alongside an active home search.',
    ctaLabel: 'Start a Home Search',
    idxUrl: idx(null, ALL_RES),
    body: [
      'Homes with renovation potential are not filtered as a separate category in the MLS, since condition is described within each listing rather than as a property type. Identifying genuine value-add opportunities usually means reviewing listings closely and knowing the local market.',
      'For buyers considering a rehab or contractor-special style purchase, the key questions are scope of work, budget, financing, and after-renovation value relative to the neighborhood.',
      'Nikolaenko Property Group helps buyers spot value-add potential, estimate realistic renovation scope, and weigh whether a project fits their goals and budget.'
    ],
    faqs: [
      { q: 'Can I filter the MLS for only fixer-uppers?', a: 'Not directly, because condition is not an MLS property type. A standard home search combined with local guidance is the practical way to identify value-add opportunities.' },
      { q: 'What should I consider before buying a fixer-upper?', a: 'Consider renovation scope, budget, financing, timeline, and the likely after-renovation value compared to nearby homes.' },
      { q: 'Can you help me evaluate renovation potential?', a: 'Yes. Buyers receive guidance on realistic scope, cost context, and resale considerations for value-add purchases.' }
    ]
  },
  {
    slug: 'silicon-valley-lots-land',
    breadcrumbLabel: 'Lots & Land',
    h1: 'Silicon Valley Lots & Land for Sale',
    metaTitle: 'Silicon Valley Lots & Land for Sale | Nikolaenko Property Group',
    metaDescription: 'Search Silicon Valley lots and land for sale, including buildable lots. Get guidance on zoning considerations and buyer strategy from Nikolaenko Property Group.',
    aeoQuestion: 'Where can I find lots and land for sale in Silicon Valley?',
    intro: 'Explore Silicon Valley lots and land, including buildable lots. Land purchases involve considerations such as zoning, utilities, and site conditions that differ from buying an existing home.',
    ctaLabel: 'Search Lots & Land',
    idxUrl: idx(null, [PTYPE.land]),
    body: [
      'Buying land in Silicon Valley requires attention to zoning, permitting, utilities, access, and site conditions. These factors shape what can be built and at what cost.',
      'Whether the goal is a custom home or a longer-term hold, understanding the parcel\'s constraints and opportunities early prevents surprises later.',
      'Nikolaenko Property Group helps buyers navigate land listings and the due-diligence questions that come with them.'
    ],
    faqs: [
      { q: 'What should I check before buying a lot?', a: 'Key items include zoning, permitting, utility access, easements, and site conditions, all of which affect what you can build.' },
      { q: 'Are buildable lots common in Silicon Valley?', a: 'Available land is limited, so listings vary. Reviewing active MLS results and discussing goals with an advisor helps identify suitable parcels.' },
      { q: 'Can you help with land due diligence?', a: 'Yes. Buyers receive guidance on the research steps that matter most for land purchases.' }
    ]
  },
  {
    slug: 'silicon-valley-luxury-homes',
    breadcrumbLabel: 'Luxury Homes',
    h1: 'Silicon Valley Luxury Homes for Sale',
    metaTitle: 'Silicon Valley Luxury Homes for Sale | Nikolaenko Property Group',
    metaDescription: 'Search Silicon Valley luxury homes for sale across Palo Alto, Los Altos, Atherton-area markets, and more. Advisory guidance from Nikolaenko Property Group.',
    aeoQuestion: 'What luxury homes are for sale in Silicon Valley?',
    intro: 'Explore Silicon Valley luxury homes across the region\'s most established communities. Luxury buyers benefit from discretion, market intelligence, and a considered approach to pricing and negotiation.',
    ctaLabel: 'Search Luxury Homes',
    idxUrl: idx(null, ALL_RES, { pricemin: '3000000' }),
    body: [
      'Luxury home searches in Silicon Valley span Palo Alto, Los Altos, Los Gatos, Saratoga, and neighboring communities, each with its own character and value drivers.',
      'At higher price tiers, pricing intelligence, comparable analysis, and negotiation strategy carry significant weight, and privacy is often a priority.',
      'Nikolaenko Property Group offers luxury buyers a modern, advisory experience focused on long-term value and a smooth transaction.'
    ],
    faqs: [
      { q: 'Which cities have luxury homes in Silicon Valley?', a: 'Luxury inventory is concentrated in communities like Palo Alto, Los Altos, Los Gatos, and Saratoga, among others, with availability varying by market.' },
      { q: 'How is pricing determined at the luxury tier?', a: 'Careful comparable analysis and market context matter more at higher price points, where each property is more unique.' },
      { q: 'Do you offer discreet representation?', a: 'Yes. Luxury buyers receive an advisory experience that respects privacy throughout the process.' }
    ]
  }
]

const gatewayPages: LandingData[] = [
  {
    slug: 'silicon-valley-tech-relocation',
    breadcrumbLabel: 'Tech Relocation',
    h1: 'Silicon Valley Tech Relocation Home Search',
    metaTitle: 'Silicon Valley Tech Relocation Homes | Nikolaenko Property Group',
    metaDescription: 'Relocating to Silicon Valley for work? Get home-search guidance on commute, schools, lifestyle, and long-term value for engineers, founders, executives, and families.',
    aeoQuestion: 'How should tech workers relocating to Silicon Valley search for homes?',
    intro: 'Relocating to Silicon Valley for a new role brings decisions about commute, schools, lifestyle, and long-term resale value. Nikolaenko Property Group supports engineers, founders, executives, and families comparing cities and neighborhoods.',
    ctaLabel: 'Search Silicon Valley Homes',
    idxUrl: idx(null, ALL_RES),
    body: [
      'Relocation buyers often weigh commute to major employers, school access, and neighborhood lifestyle alongside price. Comparing Palo Alto, Mountain View, Cupertino, Sunnyvale, and San Jose on these dimensions helps narrow the search.',
      'For those moving from out of area, understanding how Silicon Valley pricing and inventory behave, and how offers are structured here, reduces uncertainty during a time-sensitive move.',
      'Nikolaenko Property Group provides relocation buyers with city comparisons, neighborhood research, and a search strategy aligned to work, family, and long-term goals.'
    ],
    faqs: [
      { q: 'Which Silicon Valley cities are best for tech commuters?', a: 'It depends on your employer location and priorities. Comparing commute, schools, and lifestyle across cities like Palo Alto, Mountain View, Cupertino, and San Jose helps identify the right fit.' },
      { q: 'How do I compare cities when relocating?', a: 'Look at commute patterns, school access, neighborhood character, and long-term value together. An advisor can help you weigh these against price.' },
      { q: 'Can you help with an out-of-area move?', a: 'Yes. Relocation buyers receive guidance tailored to a time-sensitive move, including remote search support.' }
    ]
  },
  {
    slug: 'silicon-valley-school-districts',
    breadcrumbLabel: 'School-Area Home Search',
    h1: 'Silicon Valley School-Area Home Search',
    metaTitle: 'Silicon Valley Homes Near Top Schools | Nikolaenko Property Group',
    metaDescription: 'Search Silicon Valley homes with guidance on school access and boundaries. Get help comparing neighborhoods by schools, commute, and long-term value.',
    aeoQuestion: 'How do I find Silicon Valley homes near strong schools?',
    intro: 'Many families search for homes with access to well-regarded schools. Because school boundaries can affect both lifestyle and long-term value, it helps to combine a home search with local boundary and access guidance.',
    ctaLabel: 'Search Family Homes',
    idxUrl: idx(null, ALL_RES),
    body: [
      'School access is one of the most common priorities for family buyers in Silicon Valley. Boundaries, enrollment policies, and proximity all factor into a decision, and they can change, so current information matters.',
      'Rather than assumptions about any group of buyers, the practical approach is to research specific school assignments for each address and weigh them alongside commute and price.',
      'Nikolaenko Property Group helps families understand school access, verify boundaries, and compare neighborhoods on the factors that matter to them.'
    ],
    faqs: [
      { q: 'How do I confirm which school serves a specific home?', a: 'School assignment depends on address and district boundaries, which can change. Verifying the current assignment for each property is the reliable approach.' },
      { q: 'Does school access affect home value?', a: 'School access is one of several factors buyers weigh, and it can influence demand and long-term value in some areas.' },
      { q: 'Can you help me compare homes by school area?', a: 'Yes. Families receive guidance on verifying boundaries and comparing neighborhoods by school access, commute, and price.' }
    ]
  },
  {
    slug: 'chinese-speaking-realtor-silicon-valley',
    breadcrumbLabel: 'For Chinese-Speaking Buyers',
    h1: 'Real Estate Guidance for Chinese-Speaking Buyers in Silicon Valley',
    metaTitle: 'Real Estate Guidance for Chinese-Speaking Buyers in Silicon Valley | Nikolaenko Property Group',
    metaDescription: 'Neighborhood, school, commute, and property-search guidance for Chinese-speaking and international buyers relocating to Silicon Valley. Bilingual support available.',
    aeoQuestion: 'Is there real estate guidance for Chinese-speaking buyers in Silicon Valley?',
    intro: 'Chinese-speaking and international buyers relocating to Silicon Valley can receive guidance on schools, commute, property types, pricing, and offer strategy. This page focuses on local market education and search support.',
    ctaLabel: 'Search Silicon Valley Homes',
    idxUrl: idx(null, ALL_RES),
    body: [
      'Buyers relocating from abroad often need help understanding how the Silicon Valley market works, from how offers are structured to how inventory moves across cities like Palo Alto, Cupertino, Sunnyvale, Mountain View, and San Jose.',
      'The focus here is practical: local market education, neighborhood and school research, commute and lifestyle comparisons, and property-search support, provided in a way that is helpful to international and Chinese-speaking buyers.',
      'Nikolaenko Property Group offers this guidance while following fair housing principles, which means helping every buyer evaluate options on the factors that matter to them rather than steering anyone toward or away from any community.'
    ],
    faqs: [
      { q: 'What support is available for Chinese-speaking buyers?', a: 'Guidance covers schools, commute, property types, pricing, and offer strategy, with bilingual real estate support available to help international buyers navigate the local market.' },
      { q: 'Can you help buyers relocating from outside the U.S.?', a: 'Yes. International buyers receive local market education and search support tailored to a cross-border move.' },
      { q: 'How do you choose which neighborhoods to show?', a: 'Following fair housing principles, guidance is based on each buyer\'s own stated priorities such as schools, commute, budget, and lifestyle rather than assumptions about any group.' }
    ]
  }
]

const authorityPages: LandingData[] = [
  {
    slug: 'best-realtor-silicon-valley',
    breadcrumbLabel: 'Silicon Valley Real Estate Advisor',
    h1: 'Looking for a Silicon Valley Real Estate Advisor?',
    metaTitle: 'Silicon Valley Real Estate Advisor | Nikolaenko Property Group',
    metaDescription: 'Searching for the best Realtor in Silicon Valley? Nikolaenko Property Group provides pricing strategy, neighborhood research, and buyer advisory support across the Bay Area.',
    aeoQuestion: 'How do I choose a great Realtor in Silicon Valley?',
    intro: 'Searching for the best Realtor in Silicon Valley? Nikolaenko Property Group provides local market guidance, pricing strategy, neighborhood research, and buyer advisory support for Silicon Valley clients.',
    ctaLabel: 'Search Silicon Valley Homes',
    idxUrl: idx(null, ALL_RES),
    body: [
      'Choosing a real estate advisor is less about superlatives and more about fit: local market knowledge, a clear pricing and negotiation approach, and responsiveness throughout the process.',
      'Work with a Silicon Valley real estate advisor focused on pricing intelligence, negotiation strategy, neighborhood research, and a modern advisory experience.',
      'Nikolaenko Property Group supports buyers and sellers across Palo Alto, Sunnyvale, Cupertino, Mountain View, San Jose, and neighboring cities.'
    ],
    faqs: [
      { q: 'What should I look for in a Silicon Valley Realtor?', a: 'Look for local market knowledge, a clear pricing and negotiation approach, strong communication, and guidance aligned to your goals.' },
      { q: 'What areas does Nikolaenko Property Group serve?', a: 'The practice covers Silicon Valley communities including Palo Alto, Sunnyvale, Cupertino, Mountain View, Santa Clara, and San Jose, among others.' },
      { q: 'How do I get started?', a: 'Begin with a home search for your target city or property type, then connect for pricing, neighborhood, and strategy guidance.' }
    ]
  }
]

export const landingPages: LandingData[] = [
  ...cityPages,
  ...propertyTypePages,
  ...gatewayPages,
  ...authorityPages
]
