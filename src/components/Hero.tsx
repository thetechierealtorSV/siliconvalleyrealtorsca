'use client'

import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import heroImage from '@/assets/hero-luxury.jpg'
import shippingContainerHome from '@/assets/pa-shipping-container-home.mp4.asset.json'

export function Hero() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isMobileMenuOpen])

  useEffect(() => {
    const handleScroll = () => { if (isMobileMenuOpen) setIsMobileMenuOpen(false) }
    if (isMobileMenuOpen) window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMobileMenuOpen])

  const navLinks = [
    { href: '#properties', label: 'Properties', route: false },
    { href: '#video-tour', label: 'Video Tours', route: false },
    { href: '/buyers', label: 'Buyers', route: true },
    { href: '/sellers', label: 'Sellers', route: true },
    { href: '#services', label: 'Services', route: false },
    { href: '#contact', label: 'Contact', route: false },
  ]

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Cinematic video background with image fallback */}
      <video
        autoPlay
        muted
        loop
        playsInline
        poster={heroImage}
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      >
        <source src={shippingContainerHome.url} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="fixed top-0 left-0 right-0 w-full z-[110]"
      >
        <div className={`w-full px-6 sm:px-8 lg:px-12 py-4 transition-all duration-300 ease-out ${
          isScrolled 
            ? 'bg-background/90 backdrop-blur-xl border-b border-border' 
            : 'bg-transparent'
        }`}>
          <div className="flex items-center justify-between">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex flex-col cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <span className={`font-display text-xl tracking-[0.2em] leading-tight ${isScrolled ? 'text-foreground' : 'text-white'}`}>
                SILICON VALLEY REALTORS
              </span>
            </motion.div>

            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map(link => (
                link.route ? (
                  <button
                    key={link.href}
                    onClick={() => navigate(link.href)}
                    className={`font-medium gentle-animation hover:scale-105 text-[11px] tracking-[0.25em] uppercase cursor-pointer ${
                      isScrolled ? 'text-foreground hover:text-muted-foreground' : 'text-white hover:text-white/80'
                    }`}
                  >
                    {link.label}
                  </button>
                ) : (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`font-medium gentle-animation hover:scale-105 text-[11px] tracking-[0.25em] uppercase ${
                      isScrolled ? 'text-foreground hover:text-muted-foreground' : 'text-white hover:text-white/80'
                    }`}
                  >
                    {link.label}
                  </a>
                )
              ))}
            </div>

            <div className="flex items-center space-x-3 relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className={`hidden sm:block font-medium px-6 py-3 rounded-md gentle-animation cursor-pointer text-sm tracking-wide ${
                  isScrolled 
                    ? 'bg-foreground text-primary-foreground hover:opacity-90' 
                    : 'bg-white text-black hover:bg-white/90'
                }`}
              >
                Get Started
              </motion.button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={isMobileMenuOpen}
                className={`md:hidden p-3 rounded-full gentle-animation cursor-pointer z-[120] relative ${
                  isScrolled ? 'hover:bg-muted text-foreground' : 'glass-effect text-white hover:bg-white/20'
                }`}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-md z-[80] cursor-pointer"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isMobileMenuOpen ? '0%' : '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="md:hidden fixed top-0 right-0 h-full w-72 max-w-[85vw] bg-background/95 backdrop-blur-xl border-l border-border z-[90]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-end p-4">
            <button onClick={() => setIsMobileMenuOpen(false)} aria-label="Close navigation menu" className="p-3 rounded-full hover:bg-muted text-foreground gentle-animation cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-col px-6 pb-6 h-full">
            <div className="flex flex-col space-y-2 text-foreground">
              {navLinks.map(link => (
                link.route ? (
                  <button
                    key={link.href}
                    onClick={() => { navigate(link.href); setIsMobileMenuOpen(false) }}
                    className="px-4 py-3 hover:bg-muted rounded-lg gentle-animation font-medium text-lg uppercase tracking-wide text-left cursor-pointer"
                  >
                    {link.label}
                  </button>
                ) : (
                  <a
                    key={link.href}
                    href={link.href}
                    className="px-4 py-3 hover:bg-muted rounded-lg gentle-animation font-medium text-lg uppercase tracking-wide"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                )
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                setIsMobileMenuOpen(false)
              }}
              className="bg-foreground text-primary-foreground font-medium px-6 py-3 rounded-lg hover:opacity-90 gentle-animation mt-8 cursor-pointer"
            >
              Get Started
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Hero Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="absolute bottom-16 left-6 sm:left-8 lg:left-12 z-40"
      >
        <div className="max-w-3xl">
          <p className="text-white/70 text-sm tracking-[0.3em] uppercase mb-4 font-medium">
            Serving Silicon Valley
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold leading-[1.05] text-white mb-6">
            <span className="block">Luxury Living,</span>
            <span className="block text-white/80">Expertly Curated</span>
          </h1>
          <p className="text-white/70 text-lg max-w-xl leading-relaxed mb-8">
            Personalized property search, cinematic video tours, and a dedicated team that understands what home means to you — this is real estate, reimagined.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-black font-medium px-8 py-4 rounded-md hover:bg-white/90 gentle-animation cursor-pointer text-sm tracking-wide uppercase"
          >
            Explore Properties
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
