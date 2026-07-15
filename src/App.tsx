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
import AboutPage from './pages/AboutPage'
import ScrollToTop from './components/ScrollToTop'
import { SocialRail } from './components/SocialRail'
import { CoverageMap } from './components/CoverageMap'
import { YouTubeTours } from './components/YouTubeTours'
import SunExposurePage from './pages/SunExposurePage'
import FengShuiPage from './pages/FengShuiPage'
import ExplorerPage from './pages/ExplorerPage'
import AdminFeedbackPage from './pages/AdminFeedbackPage'
import LandingPage from './pages/LandingPage'
import ResourcesPage from './pages/ResourcesPage'
import { landingPages } from './data/landingData'
// GoogleTranslate is now embedded inside SideDrawer's Language tab
import { PreferencesWidget } from './components/PreferencesWidget'
import { SideDrawer } from './components/SideDrawer'
import { ExitIntentPopup } from './components/ExitIntentPopup'
import { AuthProvider } from './hooks/useAuth'
import AuthPage from './pages/AuthPage'
import AccountPage from './pages/AccountPage'

function HomePage() {
  const homeFaqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What areas does Nikolaenko Property Group serve?', acceptedAnswer: { '@type': 'Answer', text: 'Luxury real estate across Silicon Valley: Palo Alto, Cupertino, Los Gatos, Saratoga, Atherton, Menlo Park, Los Altos Hills, Woodside, Mountain View, and Sunnyvale, plus the wider San Francisco Bay Area.' } },
      { '@type': 'Question', name: 'Do you offer Feng Shui and Vastu analysis for listings?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Our free Feng Shui IQ tool evaluates any home using Bagua Compass-school Feng Shui (Li, Kan, Zhen, Xun, Kun, Dui, Qian, Gen) and Vastu Shastra directional principles including Ishanya (NE), Brahmasthan (center), and sha chi (poison arrow) checks.' } },
      { '@type': 'Question', name: 'Can I check a property\u2019s sunlight and facing direction?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. SunPath IQ simulates sun path, shadows, and Daylight Score in true solar time for any address.' } },
      { '@type': 'Question', name: 'How do I search MLS listings in Silicon Valley?', acceptedAnswer: { '@type': 'Answer', text: 'Use the MLS search on the homepage to filter live listings by city, price, and beds across every Silicon Valley city.' } },
    ],
  }
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Nikolaenko Property Group, Luxury Silicon Valley Homes, Feng Shui & Sunlight Analysis"
        description="Luxury Silicon Valley real estate in Palo Alto, Cupertino, Los Gatos, Saratoga, Atherton, and Menlo Park. Live MLS search plus free Feng Shui (Bagua & Vastu Shastra) and sunlight-analysis tools for every home."
        jsonLd={[ORG_JSON_LD, homeFaqJsonLd]}
      />
      <main id="main-content" className="relative" role="main" tabIndex={-1}>
        <section id="hero" aria-label="Hero"><Hero /></section>
        <section id="buyers-sellers-preview" aria-label="Buyers and Sellers"><BuyersSellersPreview /></section>
        <section id="coverage-section" aria-label="Coverage area"><CoverageMap /></section>
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
        <section id="video-tour-section" aria-label="Video tours"><VideoTour /></section>
        <section id="properties-section" aria-label="Featured properties"><Portfolio /></section>
        <section id="services-section" aria-label="Services"><Services /></section>
        <section id="why-us-section" aria-label="Why choose us"><Awards /></section>
        <section id="team-section" aria-label="Our team"><Team /></section>
        <section id="testimonials-section" aria-label="Client testimonials"><Testimonials /></section>
        <section id="contact-section" aria-label="Contact"><Contact /></section>
        <PreferencesWidget />
        <section id="youtube-tours-section" aria-label="YouTube home tours"><YouTubeTours /></section>
      </main>
      <Footer />
      <ChatBot />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        {/* Language lives inside SideDrawer */}
        <SocialRail />
        <SideDrawer />
        <Toaster position="top-center" richColors closeButton />
        <ExitIntentPopup />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/properties" element={<PropertiesPage />} />
          <Route path="/off-market" element={<OffMarketPage />} />
          <Route path="/saved-searches" element={<SavedSearchesPage />} />
          <Route path="/buyers" element={<BuyersPage />} />
          <Route path="/sellers" element={<SellersPage />} />
          <Route path="/about/chris" element={<AboutPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/sun-exposure" element={<SunExposurePage />} />
          <Route path="/feng-shui" element={<FengShuiPage />} />
          <Route path="/explorer" element={<ExplorerPage />} />
          <Route path="/admin/feedback" element={<AdminFeedbackPage />} />
          <Route path="/resources/:slug" element={<ResourcesPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/account" element={<AccountPage />} />
          {landingPages.map((p) => (
            <Route key={p.slug} path={"/" + p.slug} element={<LandingPage data={p} />} />
          ))}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
