'use client'

export function Footer() {
  return (
    <footer className="relative py-16 bg-foreground text-primary-foreground">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-12 gap-12 mb-12">
          <div className="col-span-12 md:col-span-5">
            <div className="font-display text-2xl tracking-wider mb-4">
              EICHLER ESTATES
            </div>
            <p className="text-primary-foreground/60 leading-relaxed mb-6 max-w-sm">
              Silicon Valley's premier specialists in Eichler and mid-century modern homes. 
              Connecting discerning buyers with architectural masterpieces since 2010.
            </p>
          </div>

          <div className="col-span-6 md:col-span-3">
            <h4 className="font-semibold text-sm tracking-wide uppercase mb-4">Navigate</h4>
            <div className="flex flex-col space-y-3">
              <a href="#properties" className="text-primary-foreground/60 hover:text-primary-foreground gentle-animation text-sm">Properties</a>
              <a href="#process" className="text-primary-foreground/60 hover:text-primary-foreground gentle-animation text-sm">Process</a>
              <a href="#services" className="text-primary-foreground/60 hover:text-primary-foreground gentle-animation text-sm">Services</a>
              <a href="#team" className="text-primary-foreground/60 hover:text-primary-foreground gentle-animation text-sm">Team</a>
              <a href="#contact" className="text-primary-foreground/60 hover:text-primary-foreground gentle-animation text-sm">Contact</a>
            </div>
          </div>

          <div className="col-span-6 md:col-span-4">
            <h4 className="font-semibold text-sm tracking-wide uppercase mb-4">Neighborhoods</h4>
            <div className="grid grid-cols-2 gap-3">
              {['Palo Alto', 'Sunnyvale', 'Mountain View', 'San Jose', 'San Mateo', 'San Rafael'].map((n) => (
                <span key={n} className="text-primary-foreground/60 text-sm">{n}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-primary-foreground/40 mb-4 md:mb-0">
              © 2025 Eichler Estates. All rights reserved. DRE #01234567
            </div>
            <div className="text-sm text-primary-foreground/40">
              Silicon Valley, California
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
