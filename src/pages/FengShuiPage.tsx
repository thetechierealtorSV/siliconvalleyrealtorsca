import { SEO } from '../components/SEO'

export default function FengShuiPage() {
  return (
    <div style={{ minHeight: '100vh', width: '100%', background: '#0b1226' }}>
      <SEO
        title="Feng Shui IQ - Property Harmony Analyzer"
        description="Analyze any property using authentic Chinese Bagua Compass-school Feng Shui and Indian Vastu Shastra directional traditions. Get a Harmony Score with plain-language guidance."
      />
      <iframe
        src="/feng-shui/index.html"
        title="Feng Shui IQ - Property Harmony Analyzer"
        style={{ width: '100%', height: '100vh', border: 'none', display: 'block' }}
      />
    </div>
  )
}
