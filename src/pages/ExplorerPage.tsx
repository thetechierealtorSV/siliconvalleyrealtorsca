import { SEO } from '../components/SEO'

export default function ExplorerPage() {
  return (
    <div style={{ minHeight: '100vh', width: '100%', background: '#0b1226' }}>
      <SEO
        title="Sun & Property Explorer | SunPath IQ | Nikolaenko Property Group"
        description="Search any Silicon Valley address to see its sun path, Daylight Score, and 3D shadow simulation in true solar time. A free tool from Nikolaenko Property Group."
      />
      <iframe
        src="/sun-exposure/explorer.html"
        title="Sun & Property Explorer - SunPath IQ"
        style={{ width: '100%', height: '100vh', border: 'none', display: 'block' }}
        allow="geolocation"
      />
    </div>
  )
}
