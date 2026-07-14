import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import { SEO } from '../components/SEO'

export default function FengShuiPage() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', width: '100%', background: '#0b1226' }}>
      <SEO
        title="Feng Shui IQ, Property Harmony Analyzer"
        description="Analyze any property using authentic Chinese Bagua Compass-school Feng Shui and Indian Vastu Shastra directional traditions. Get a Harmony Score with plain-language guidance."
      />
      <Link
        to="/"
        aria-label="Back to homepage"
        style={{
          position: 'fixed', top: 16, left: 16, zIndex: 300,
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '10px 14px', borderRadius: 999,
          background: 'rgba(15,23,42,0.85)', color: '#fde68a',
          border: '1px solid rgba(251,191,36,0.4)', textDecoration: 'none',
          fontSize: 13, fontWeight: 600, backdropFilter: 'blur(6px)',
        }}
      >
        <Home size={16} /> Home
      </Link>
      <iframe
        src="/feng-shui/index.html"
        title="Feng Shui IQ, Property Harmony Analyzer"
        style={{ width: '100%', height: '100vh', border: 'none', display: 'block' }}
      />
    </div>
  )
}
