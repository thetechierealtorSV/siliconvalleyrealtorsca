import { PageNavbar } from '@/components/PageNavbar'
import { Footer } from '@/components/Footer'
import { ChatBot } from '@/components/ChatBot'
import { SEO, breadcrumbJsonLd } from '@/components/SEO'
import { Link } from 'react-router-dom'
import type { LandingData } from '@/data/landingData'
import { landingPages } from '@/data/landingData'

const SITE_URL = 'https://luxury.nikolaenkopropertygroup.com'

export default function LandingPage({ data }: { data: LandingData }) {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: data.breadcrumbLabel, path: '/' + data.slug },
  ])

  const relatedCities = landingPages.filter((p) => p.slug.endsWith('-homes') && p.slug !== data.slug).slice(0, 12)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title={data.metaTitle}
        description={data.metaDescription}
        canonical={SITE_URL + '/' + data.slug}
        jsonLd={[faqJsonLd, breadcrumb]}
      />
      <PageNavbar />

      <main className="max-w-4xl mx-auto px-5 pt-28 pb-16">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{data.breadcrumbLabel}</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-semibold mb-4">{data.h1}</h1>
        <p className="text-lg text-muted-foreground mb-8">{data.intro}</p>

        <a
          href={data.idxUrl}
          className="inline-block px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition"
        >
          {data.ctaLabel}
        </a>

        <section className="prose prose-invert max-w-none mt-10 space-y-5">
          {data.body.map((para, i) => (
            <p key={i} className="text-base leading-relaxed text-foreground/90">{para}</p>
          ))}
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-5">{data.aeoQuestion}</h2>
          <div className="space-y-5">
            {data.faqs.map((f, i) => (
              <div key={i} className="border-b border-border pb-4">
                <h3 className="font-medium text-lg mb-1">{f.q}</h3>
                <p className="text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 flex flex-wrap gap-4 items-center">
          <a
            href={data.idxUrl}
            className="inline-block px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition"
          >
            {data.ctaLabel}
          </a>
          <Link
            to="/explorer"
            className="inline-block px-6 py-3 rounded-lg border border-border font-semibold hover:bg-muted/40 transition"
          >
            Try the Sun &amp; Property Explorer
          </Link>
        </section>

        <section className="mt-14">
          <h2 className="text-xl font-semibold mb-4">Explore Silicon Valley by City</h2>
          <div className="flex flex-wrap gap-3">
            {relatedCities.map((c) => (
              <Link key={c.slug} to={'/' + c.slug} className="text-sm px-3 py-1.5 rounded-full border border-border hover:bg-muted/40 transition">
                {c.breadcrumbLabel}
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
      <ChatBot />
    </div>
  )
}
