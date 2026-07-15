export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  date: string
  readMin: number
  cover: string
  tags: string[]
  body: string // markdown
}

export const posts: BlogPost[] = [
  {
    slug: 'atherton-menlo-park-luxury-outlook-2026',
    title: 'Atherton & Menlo Park Luxury Outlook — Late 2026',
    excerpt: 'Ultra-luxury absorption, off-market share, and what $10M+ buyers are actually asking for this cycle.',
    date: '2026-07-14',
    readMin: 7,
    cover: '/og-image.jpg',
    tags: ['Market Brief', 'Atherton', 'Menlo Park'],
    body: `## The headline\n\nAtherton's $10M+ tier is trading **~38% off-market** this year — the highest share we've tracked. Menlo Park's West of Alameda micro-market is compressing DOM to under two weeks on turnkey product.\n\n### What buyers are asking for\n- **Single-level primary suites** on estate lots\n- **Detached ADU / guest houses** for multi-gen living\n- **True 4-car garages** with EV infrastructure already trenched\n- **Wellness wings** — sauna, cold plunge, gym — built-in, not retrofit\n\n### What sellers should prep\nCinematic media (drone + dusk + walkthrough) is now table stakes at this price band. Pre-inspection, pre-appraisal, and a clean disclosure package shorten negotiation cycles measurably.\n\n### Where we see risk\nRate path remains the swing factor. Estate buyers are less rate-sensitive, but jumbo-financed move-up buyers in the $4-8M band are pausing on any 25bp+ upward surprise.`,
  },
  {
    slug: 'palo-alto-market-brief-q3-2026',
    title: 'Palo Alto Market Brief — Q3 2026',
    excerpt: 'Median SFR pricing, inventory turns, and which micro-neighborhoods are outperforming this quarter.',
    date: '2026-07-01',
    readMin: 6,
    cover: '/og-image.jpg',
    tags: ['Market Brief', 'Palo Alto'],
    body: `## Snapshot\n\nPalo Alto SFR inventory tightened again this quarter, with median sale price up **4.2% YoY** and days-on-market compressing to **13 days**.\n\n### Where demand is concentrated\n- **Old Palo Alto** — bidding on turnkey remodels\n- **Community Center** — school-driven demand\n- **Crescent Park** — larger lots trading at a premium\n\n### What to watch\nRate volatility remains the largest single variable. Sellers pricing at-market are still receiving multiple offers when marketing is cinematic and staged.`,
  },
  {
    slug: 'feng-shui-checklist-for-buyers',
    title: 'A Practical Feng Shui Checklist for Bay Area Buyers',
    excerpt: 'The five directional principles we screen every listing against before recommending a showing.',
    date: '2026-06-18',
    readMin: 5,
    cover: '/og-image.jpg',
    tags: ['Feng Shui', 'Buyers'],
    body: `Traditional Compass-school Feng Shui and Vastu Shastra overlap on a few core screens:\n\n1. **Entry alignment** — front door should not directly face the back door (energy escape).\n2. **Command position** — primary bedroom should see the door without being in line with it.\n3. **Ishanya (NE)** — keep this corner clean and light for study/focus energy.\n4. **Brahmasthan (center)** — avoid heavy fixtures or plumbing in the geometric center.\n5. **Sha chi checks** — sharp roof lines, T-intersections, and utility poles aimed at the door.\n\nOur free Feng Shui IQ tool automates a first pass on any address.`,
  },
  {
    slug: 'sunlight-and-value-what-daylight-score-means',
    title: 'Sunlight & Value — What a Daylight Score Actually Means',
    excerpt: 'Why solar orientation quietly drives resale and how we simulate it before an offer.',
    date: '2026-05-30',
    readMin: 4,
    cover: '/og-image.jpg',
    tags: ['SunPath', 'Buyers'],
    body: `Daylight is one of the most under-priced variables in a home purchase. SunPath IQ uses **NOAA solar-position formulas** to model the sun's arc for any latitude/longitude on any day of the year, then scores how much direct light the primary living spaces receive.\n\nA south-facing rear yard in Palo Alto, for instance, typically nets **2-3 additional hours** of winter sun versus a north-facing counterpart on the same block — measurable in both mood and utility bills.`,
  },
]

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug)
}
