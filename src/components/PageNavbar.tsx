'use client'

import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function PageNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [isMobileMenuOpen])

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/buyers', label: 'Buyers' },
    { href: '/sellers', label: 'Sellers' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 w-full z-[110]">
      <div className="w-full px-6 sm:px-8 lg:px-12 py-4 bg-[#faf8f5]/90 backdrop-blur-xl border-b border-[#e0d9cf]">
        <div className="flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex flex-col cursor-pointer"
            onClick={() => navigate('/')}
          >
            <span className="font-display text-xl tracking-wider leading-tight text-foreground">
              SILICON VALLEY REALTORS
            </span>
          </motion.div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => (
              <button
                key={link.href}
                onClick={() => navigate(link.href)}
                className="font-medium gentle-animation hover:scale-105 text-sm tracking-wide uppercase text-foreground hover:text-muted-foreground cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/#contact')}
              className="hidden sm:block font-medium px-6 py-3 rounded-md gentle-animation cursor-pointer text-sm tracking-wide bg-foreground text-primary-foreground hover:opacity-90"
            >
              Contact Us
            </motion.button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-3 rounded-full gentle-animation cursor-pointer hover:bg-muted text-foreground"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-md z-[80] cursor-pointer"
          onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isMobileMenuOpen ? '0%' : '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="md:hidden fixed top-0 right-0 h-full w-72 max-w-[85vw] bg-background/95 backdrop-blur-xl border-l border-border z-[90]"
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-end p-4">
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-3 rounded-full hover:bg-muted text-foreground gentle-animation cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-col px-6 pb-6 space-y-2">
            {navLinks.map(link => (
              <button
                key={link.href}
                onClick={() => { navigate(link.href); setIsMobileMenuOpen(false) }}
                className="px-4 py-3 hover:bg-muted rounded-lg gentle-animation font-medium text-lg uppercase tracking-wide text-left cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </nav>
  )
}
