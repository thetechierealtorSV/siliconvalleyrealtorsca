import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Hero } from './components/Hero'
import { Portfolio } from './components/Portfolio'
import { VideoTour } from './components/VideoTour'
import { Awards } from './components/Awards'
import { Services } from './components/Services'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { ChatBot } from './components/ChatBot'
import { BuyersSellersPreview } from './components/BuyersSellersPreview'
import { Testimonials } from './components/Testimonials'
import { Team } from './components/Team'
import { SEO, ORG_JSON_LD } from './components/SEO'
import { IDXSearch } from './components/IDXSearch'
import BuyersPage from './pages/BuyersPage'
import SellersPage from './pages/SellersPage'
import PropertiesPage from './pages/PropertiesPage'
import OffMarketPage from './pages/OffMarketPage'
import SavedSearchesPage from './pages/SavedSearchesPage'
import ScrollToTop from './components/ScrollToTop'
import { ThemeToggle } from './components/ThemeToggle'
import { SocialRail } from './components/SocialRail'
import { CoverageMap } from './components/CoverageMap'
import { AccessibilityMenu } from './components/AccessibilityMenu'
import { SiteGuide } from './components/SiteGuide'
import { YouTubeTours } from './components/YouTubeTours'

function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Silicon Valley Realtors · Luxury Homes"
        description="Luxury real estate across Silicon Valley — Palo Alto, Atherton, Menlo Park, Los Altos Hills, Woodside and beyond. Live MLS search, buyer representation, seller concierge."
        jsonLd={ORG_JSON_LD}
      />
      <main id="main-content" className="relative" role="main" tabIndex={-1}>
        <section id="hero" aria-label="Hero">
          <Hero />
        </section>
        <section id="buyers-sellers-preview" aria-label="Buyers and Sellers">
          <BuyersSellersPreview />
        </section>
        <section id="mls-search" aria-label="MLS property search" className="bg-secondary/30 py-16">
          <div className="container mx-auto px-6 sm:px-8 lg:px-12">
            <div className="max-w-4xl mx-auto text-center mb-8">
              <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-3">MLS Search</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3">Find your Silicon Valley home</h2>
              <p className="text-muted-foreground">Live listings across every Silicon Valley city.</p>
            </div>
            <div className="max-w-4xl mx-auto"><IDXSearch /></div>
          </div>
        </section>
        <section id="youtube-tours-section" aria-label="YouTube home tours">
          <YouTubeTours />
        </section>
        <section id="video-tour-section" aria-label="Video tours">
          <VideoTour />
        </section>
        <section id="properties-section" aria-label="Featured properties">
          <Portfolio />
        </section>
        <section id="services-section" aria-label="Services">
          <Services />
        </section>
        <section id="why-us-section" aria-label="Why choose us">
          <Awards />
        </section>
        <section id="coverage-section" aria-label="Coverage area">
          <CoverageMap />
        </section>
        <section id="team-section" aria-label="Our team">
          <Team />
        </section>
        <section id="testimonials-section" aria-label="Client testimonials">
          <Testimonials />
        </section>
        <section id="contact-section" aria-label="Contact">
          <Contact />
        </section>
      </main>
      <Footer />
      <ChatBot />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ThemeToggle />
      <SocialRail />
      <AccessibilityMenu />
      <SiteGuide />
      <Toaster position="top-center" richColors closeButton />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/properties" element={<PropertiesPage />} />
        <Route path="/off-market" element={<OffMarketPage />} />
        <Route path="/saved-searches" element={<SavedSearchesPage />} />
        <Route path="/buyers" element={<BuyersPage />} />
        <Route path="/sellers" element={<SellersPage />} />
      </Routes>
    </BrowserRouter>
  )
}
