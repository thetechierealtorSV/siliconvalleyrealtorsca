import { Hero } from './components/Hero'
import { Portfolio } from './components/Portfolio'
import { About } from './components/About'
import { Awards } from './components/Awards'
import { Services } from './components/Services'
import { Team } from './components/Team'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="relative" role="main">
        <section id="hero" aria-label="Hero section">
          <Hero />
        </section>
        <section id="properties-section" aria-label="Properties section">
          <Portfolio />
        </section>
        <section id="process-section" aria-label="Process section">
          <About />
        </section>
        <section id="awards-section" aria-label="Stats and testimonials">
          <Awards />
        </section>
        <section id="services-section" aria-label="Services section">
          <Services />
        </section>
        <section id="team-section" aria-label="Team section">
          <Team />
        </section>
        <section id="contact-section" aria-label="Contact section">
          <Contact />
        </section>
      </main>
      <Footer />
    </div>
  )
}
