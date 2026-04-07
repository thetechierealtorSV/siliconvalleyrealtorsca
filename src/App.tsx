import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Hero } from './components/Hero'
import { Portfolio } from './components/Portfolio'
import { VideoTour } from './components/VideoTour'
import { Awards } from './components/Awards'
import { Services } from './components/Services'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { ChatBot } from './components/ChatBot'
import { BuyersSellersPreview } from './components/BuyersSellersPreview'
import BuyersPage from './pages/BuyersPage'
import SellersPage from './pages/SellersPage'

function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="relative" role="main">
        <section id="hero" aria-label="Hero section">
          <Hero />
        </section>
        <section id="properties-section" aria-label="Properties section">
          <Portfolio />
        </section>
        <section id="video-tour-section" aria-label="Video tours section">
          <VideoTour />
        </section>
        <section id="buyers-sellers-preview" aria-label="Buyers and Sellers">
          <BuyersSellersPreview />
        </section>
        <section id="services-section" aria-label="Services section">
          <Services />
        </section>
        <section id="why-us-section" aria-label="Why choose us">
          <Awards />
        </section>
        <section id="contact-section" aria-label="Contact section">
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
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/buyers" element={<BuyersPage />} />
        <Route path="/sellers" element={<SellersPage />} />
      </Routes>
    </BrowserRouter>
  )
}
