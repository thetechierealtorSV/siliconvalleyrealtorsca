import { useParams, Link, Navigate } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { PageNavbar } from '@/components/PageNavbar'
import { Footer } from '@/components/Footer'
import { getPost } from '@/data/blog'
import { NewsletterSignup } from '@/components/NewsletterSignup'

function renderMarkdown(md: string) {
  // Minimal markdown: headings, lists, bold, paragraphs
  const lines = md.split('\n')
  const out: string[] = []
  let inList = false
  const flushList = () => { if (inList) { out.push('</ul>'); inList = false } }
  const inline = (s: string) => s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  for (const raw of lines) {
    const line = raw.trim()
    if (!line) { flushList(); continue }
    if (line.startsWith('### ')) { flushList(); out.push(`<h3>${inline(line.slice(4))}</h3>`); continue }
    if (line.startsWith('## ')) { flushList(); out.push(`<h2>${inline(line.slice(3))}</h2>`); continue }
    if (/^[-*]\s+/.test(line)) {
      if (!inList) { out.push('<ul>'); inList = true }
      out.push(`<li>${inline(line.replace(/^[-*]\s+/, ''))}</li>`)
      continue
    }
    if (/^\d+\.\s+/.test(line)) {
      if (!inList) { out.push('<ol>'); inList = true }
      out.push(`<li>${inline(line.replace(/^\d+\.\s+/, ''))}</li>`)
      continue
    }
    flushList()
    out.push(`<p>${inline(line)}</p>`)
  }
  flushList()
  return out.join('\n')
}

export default function BlogPostPage() {
  const { slug } = useParams()
  const post = slug ? getPost(slug) : undefined
  if (!post) return <Navigate to="/journal" replace />

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title={`${post.title} — Nikolaenko Property Group`}
        description={post.excerpt}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          datePublished: post.date,
          description: post.excerpt,
          author: { '@type': 'Organization', name: 'Nikolaenko Property Group' },
        }}
      />
      <PageNavbar />
      <main className="pt-28 pb-20">
        <article className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-3xl">
          <Link to="/journal" className="text-sm text-muted-foreground hover:text-primary">← Journal</Link>
          <header className="my-8">
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
              <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time>
              <span>·</span>
              <span>{post.readMin} min read</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">{post.title}</h1>
            <p className="text-lg text-muted-foreground">{post.excerpt}</p>
          </header>
          <div
            className="prose prose-invert prose-headings:font-display max-w-none [&>h2]:text-2xl [&>h2]:mt-8 [&>h2]:mb-3 [&>h3]:text-xl [&>h3]:mt-6 [&>h3]:mb-2 [&>p]:my-4 [&>p]:leading-relaxed [&>ul]:my-4 [&>ul]:pl-6 [&>ul]:list-disc [&>ol]:my-4 [&>ol]:pl-6 [&>ol]:list-decimal [&>li]:my-1"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }}
          />
          <div className="mt-16">
            <NewsletterSignup />
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}
