import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import { SEO } from '../components/SEO'

export default function SunExposurePage() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', width: '100%', background: '#0b1226' }}>
      <SEO
        title="SunPath IQ, Daylight and Sun Path Analyzer"
        description="Original sun path and Daylight Score tool for Nikolaenko Property Group listings. Explore sunrise, solar noon, sunset, and facade sun exposure in true solar time."
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
        src="/sun-exposure/index.html"
        title="SunPath IQ, Daylight and Sun Path Analyzer"
        style={{ width: '100%', height: '100vh', border: 'none', display: 'block' }}
        allow="geolocation"
      />
    </div>
  )
}
