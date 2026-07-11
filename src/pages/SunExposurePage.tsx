import { SEO } from '../components/SEO'

export default function SunExposurePage() {
  return (
    <div style={{ minHeight: '100vh', width: '100%', background: '#0b1226' }}>
      <SEO
        title="SunPath IQ - Daylight and Sun Path Analyzer"
        description="Original sun path and Daylight Score tool for Nikolaenko Property Group listings. Explore sunrise, solar noon, sunset, and facade sun exposure in true solar time."
      />
      <iframe
        src="/sun-exposure/index.html"
        title="SunPath IQ - Daylight and Sun Path Analyzer"
        style={{ width: '100%', height: '100vh', border: 'none', display: 'block' }}
        allow="geolocation"
      />
    </div>
  )
}
