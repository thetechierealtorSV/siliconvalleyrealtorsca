'use client'

import { useNavigate, useLocation } from 'react-router-dom'

export function Footer() {
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'
  return (
    <footer className="relative py-16 bg-foreground text-primary-foreground">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-12 gap-12 mb-12">
          <div className="col-span-12 md:col-span-5">
            <div className="font-display text-2xl tracking-wider mb-1">
              SILICON VALLEY REALTORS
            </div>
            <div className="text-primary-foreground/40 text-xs tracking-[0.15em] uppercase mb-4">
              By The Nikolaenko Group
            </div>
            <p className="text-primary-foreground/60 leading-relaxed mb-6 max-w-sm">
              Luxury real estate across Silicon Valley's most prestigious neighborhoods. 
              Cinematic tours, expert guidance, and a personal approach — from first showing to closing day.
            </p>
          </div>

          <div className="col-span-6 md:col-span-3">
            <h4 className="font-semibold text-sm tracking-wide uppercase mb-4">Navigate</h4>
            <div className="flex flex-col space-y-3">
              {isHome ? (
                <>
                  <a href="#properties" className="text-primary-foreground/60 hover:text-primary-foreground gentle-animation text-sm">Properties</a>
                  <a href="#video-tour" className="text-primary-foreground/60 hover:text-primary-foreground gentle-animation text-sm">Video Tours</a>
                </>
              ) : (
                <button onClick={() => navigate('/')} className="text-primary-foreground/60 hover:text-primary-foreground gentle-animation text-sm text-left cursor-pointer">Home</button>
              )}
              <button onClick={() => navigate('/buyers')} className="text-primary-foreground/60 hover:text-primary-foreground gentle-animation text-sm text-left cursor-pointer">Buyers</button>
              <button onClick={() => navigate('/sellers')} className="text-primary-foreground/60 hover:text-primary-foreground gentle-animation text-sm text-left cursor-pointer">Sellers</button>
              {isHome && <a href="#services" className="text-primary-foreground/60 hover:text-primary-foreground gentle-animation text-sm">Services</a>}
              {isHome && <a href="#contact" className="text-primary-foreground/60 hover:text-primary-foreground gentle-animation text-sm">Contact</a>}
            </div>
          </div>

          <div className="col-span-6 md:col-span-4">
            <h4 className="font-semibold text-sm tracking-wide uppercase mb-4">Areas We Serve</h4>
            <div className="grid grid-cols-2 gap-3">
              {['Palo Alto', 'Atherton', 'Los Altos Hills', 'Menlo Park', 'Woodside', 'Portola Valley', 'Hillsborough', 'Burlingame', 'Mountain View', 'Los Altos', 'Saratoga', 'Los Gatos', 'Cupertino', 'Sunnyvale', 'Santa Clara', 'San Jose', 'Fremont', 'San Francisco', 'Tiburon', 'Mill Valley', 'Sausalito', 'Piedmont', 'Berkeley', 'Lafayette', 'Orinda', 'Walnut Creek', 'Danville', 'Pleasanton'].map((n) => (
                <span key={n} className="text-primary-foreground/60 text-sm">{n}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-primary-foreground/40 mb-4 md:mb-0">
              © 2025 Silicon Valley Realtors · The Nikolaenko Group. All rights reserved.
            </div>
            <div className="text-sm text-primary-foreground/40">
              Serving Silicon Valley · DRE# 02076232
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
