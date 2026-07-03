'use client'

import { useNavigate, useLocation } from 'react-router-dom'
import { Instagram, Youtube, Linkedin, Mail, Phone, MapPin, MessageCircle } from 'lucide-react'

export function Footer() {
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'
  const year = new Date().getFullYear()

  return (
    <footer className="relative pt-20 pb-10 bg-foreground text-primary-foreground">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        {/* Top grid */}
        <div className="grid grid-cols-12 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-12 md:col-span-4">
            <div className="font-display text-2xl tracking-[0.15em] mb-4">
              NIKOLAENKO ESTATES
            </div>
            <p className="text-primary-foreground/60 leading-relaxed mb-6 max-w-sm">
              Luxury real estate across Silicon Valley's most prestigious neighborhoods —
              cinematic marketing, deep local expertise, and a personal approach from first
              showing to closing day.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/60 hover:text-primary-foreground gentle-animation"><Instagram className="w-5 h-5" /></a>
              <a href="https://youtube.com" aria-label="YouTube" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/60 hover:text-primary-foreground gentle-animation"><Youtube className="w-5 h-5" /></a>
              <a href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/60 hover:text-primary-foreground gentle-animation"><Linkedin className="w-5 h-5" /></a>
              <a href="mailto:hello@nikolaenkoestates.com" aria-label="Email" className="text-primary-foreground/60 hover:text-primary-foreground gentle-animation"><Mail className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Navigate */}
          <div className="col-span-6 md:col-span-2">
            <h4 className="font-semibold text-xs tracking-[0.2em] uppercase mb-4">Explore</h4>
            <div className="flex flex-col space-y-3">
              {isHome ? (
                <>
                  <a href="#properties" className="text-primary-foreground/60 hover:text-primary-foreground gentle-animation text-sm">Properties</a>
                  <a href="#video-tour" className="text-primary-foreground/60 hover:text-primary-foreground gentle-animation text-sm">Video Tours</a>
                  <a href="#services" className="text-primary-foreground/60 hover:text-primary-foreground gentle-animation text-sm">Services</a>
                </>
              ) : (
                <button onClick={() => navigate('/')} className="text-primary-foreground/60 hover:text-primary-foreground gentle-animation text-sm text-left">Home</button>
              )}
              <button onClick={() => navigate('/buyers')} className="text-primary-foreground/60 hover:text-primary-foreground gentle-animation text-sm text-left">Buyers</button>
              <button onClick={() => navigate('/sellers')} className="text-primary-foreground/60 hover:text-primary-foreground gentle-animation text-sm text-left">Sellers</button>
              {isHome && <a href="#contact" className="text-primary-foreground/60 hover:text-primary-foreground gentle-animation text-sm">Contact</a>}
            </div>
          </div>

          {/* Legal */}
          <div className="col-span-6 md:col-span-2">
            <h4 className="font-semibold text-xs tracking-[0.2em] uppercase mb-4">Legal</h4>
            <div className="flex flex-col space-y-3">
              <button onClick={() => navigate('/privacy')} className="text-primary-foreground/60 hover:text-primary-foreground gentle-animation text-sm text-left">Privacy Policy</button>
              <button onClick={() => navigate('/terms')} className="text-primary-foreground/60 hover:text-primary-foreground gentle-animation text-sm text-left">Terms of Use</button>
              <button onClick={() => navigate('/accessibility')} className="text-primary-foreground/60 hover:text-primary-foreground gentle-animation text-sm text-left">Accessibility</button>
              <button onClick={() => navigate('/dmca')} className="text-primary-foreground/60 hover:text-primary-foreground gentle-animation text-sm text-left">DMCA Notice</button>
              <button onClick={() => navigate('/fair-housing')} className="text-primary-foreground/60 hover:text-primary-foreground gentle-animation text-sm text-left">Fair Housing</button>
            </div>
          </div>

          {/* Contact */}
          <div className="col-span-12 md:col-span-4">
            <h4 className="font-semibold text-xs tracking-[0.2em] uppercase mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Serving the entire Bay Area<br />Headquartered in Palo Alto, CA</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a href="tel:+16506409777" className="hover:text-primary-foreground gentle-animation">(650) 640-9777</a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4 flex-shrink-0" />
                <a href="https://wa.me/16506409777" target="_blank" rel="noopener noreferrer" className="hover:text-primary-foreground gentle-animation">WhatsApp (650) 640-9777</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href="mailto:hello@nikolaenkoestates.com" className="hover:text-primary-foreground gentle-animation">hello@nikolaenkoestates.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Areas */}
        <div className="border-t border-primary-foreground/10 pt-8 mb-10">
          <h4 className="font-semibold text-xs tracking-[0.2em] uppercase mb-4 text-primary-foreground/80">Areas We Serve</h4>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-primary-foreground/55">
            {['Palo Alto','Atherton','Los Altos Hills','Menlo Park','Woodside','Portola Valley','Hillsborough','Burlingame','Mountain View','Los Altos','Saratoga','Los Gatos','Cupertino','Sunnyvale','Santa Clara','San Jose','Fremont','San Francisco','Tiburon','Mill Valley','Sausalito','Piedmont','Berkeley','Lafayette','Orinda','Walnut Creek','Danville','Pleasanton'].map((n) => (
              <span key={n}>{n}</span>
            ))}
          </div>
        </div>

        {/* Compliance / disclosures */}
        <div className="border-t border-primary-foreground/10 pt-8 mb-8">
          <div className="grid md:grid-cols-[1fr_auto] gap-8 items-start">
            <div className="text-xs text-primary-foreground/50 leading-relaxed space-y-3 max-w-3xl">
              <p>
                <span className="text-primary-foreground/70 font-medium">Equal Housing Opportunity.</span> Nikolaenko Estates is committed to the letter and spirit of U.S. policy for the achievement of equal housing opportunity. We do not discriminate on the basis of race, color, religion, sex, handicap, familial status, national origin, sexual orientation, gender identity, source of income, or any other class protected by federal, state, or local law.
              </p>
              <p>
                Real estate services are provided by licensed agents of Nikolaenko Estates. California DRE License #XXXXXXXX. Each office is independently owned and operated. Information deemed reliable but not guaranteed; buyers should independently verify all material facts. Property information, listings, and market data are obtained from sources believed reliable, including MLSListings Inc., and are subject to change without notice. Nothing herein constitutes legal, tax, or financial advice.
              </p>
              <p>
                By submitting your phone number or contact information, you consent to receive calls, SMS messages, and emails from Nikolaenko Estates regarding real estate services. Message and data rates may apply. Reply <span className="font-mono text-primary-foreground/70">STOP</span> to any SMS to unsubscribe or <span className="font-mono text-primary-foreground/70">HELP</span> for assistance. See our <button onClick={() => navigate('/privacy')} className="underline hover:text-primary-foreground">Privacy Policy</button> for details.
              </p>
            </div>

            {/* Badges */}
            <div className="flex md:flex-col items-center md:items-end gap-4">
              <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-primary-foreground/70 border border-primary-foreground/20 rounded-md px-3 py-2">
                <span className="w-6 h-6 rounded-full border-2 border-primary-foreground/70 flex items-center justify-center font-bold text-xs">≡</span>
                Equal Housing
              </div>
              <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-primary-foreground/70 border border-primary-foreground/20 rounded-md px-3 py-2">
                <span className="font-display font-bold text-sm">R</span>
                REALTOR®
              </div>
              <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-primary-foreground/70 border border-primary-foreground/20 rounded-md px-3 py-2">
                MLS Listings
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-primary-foreground/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="text-xs text-primary-foreground/40">
            © {year} Nikolaenko Estates. All rights reserved. CA DRE #XXXXXXXX.
          </div>
          <div className="text-xs text-primary-foreground/40 tracking-[0.2em] uppercase">
            Bay Area · Peninsula · South Bay · East Bay · SF · Marin
          </div>
        </div>
      </div>
    </footer>
  )
}
