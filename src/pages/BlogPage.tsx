import { Link } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { PageNavbar } from '@/components/PageNavbar'
import { Footer } from '@/components/Footer'
import { posts } from '@/data/blog'
import { NewsletterSignup } from '@/components/NewsletterSignup'

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Silicon Valley Real Estate Journal — Nikolaenko Property Group"
        description="Market briefs, Feng Shui buyer guides, and sunlight-analysis insights for Palo Alto, Atherton, Los Altos Hills, and the broader Silicon Valley luxury market."
      />
      <PageNavbar />
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-5xl">
          <header className="mb-12 text-center">
            <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-3">Journal</p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">Silicon Valley Real Estate Journal</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">Market briefs, buyer playbooks, and Feng Shui + sunlight guides — written by the Nikolaenko team.</p>
          </header>

          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {posts.map((p) => (
              <Link key={p.slug} to={`/journal/${p.slug}`} className="group block rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/50 transition">
                <div className="aspect-[16/9] bg-muted overflow-hidden">
                  <img src={p.cover} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" decoding="async" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                    <time dateTime={p.date}>{new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</time>
                    <span>·</span>
                    <span>{p.readMin} min read</span>
                  </div>
                  <h2 className="font-display text-xl font-semibold mb-2 group-hover:text-primary transition">{p.title}</h2>
                  <p className="text-sm text-muted-foreground">{p.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>

          <NewsletterSignup />
        </div>
      </main>
      <Footer />
    </div>
  )
}
