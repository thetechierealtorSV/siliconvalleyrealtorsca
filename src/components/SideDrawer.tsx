'use client'

/**
 * SideDrawer — unified collapsible side panel that consolidates:
 *  - Theme toggle (light / dark)
 *  - Accessibility preferences (font size, contrast, motion, cursor, links)
 *  - Site guide / quick tips
 *  - Resources menu (Join My Team, Neighborhood News, FSBO, Partners,
 *    Relocation Consultation, International Buyers)
 *  - Feedback link
 *
 * A single compact edge tab (bottom-left) is the only control visible at
 * rest so the viewport stays uncluttered. Clicking it slides open a panel
 * with tabbed sections.
 */

import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Menu, X, Sun, Moon, Accessibility, HelpCircle, MessageSquare,
  BookOpen, Minus, Plus, RotateCcw, ChevronRight, Globe,
} from 'lucide-react'

type Theme = 'light' | 'dark'
type Tab = 'main' | 'a11y' | 'resources' | 'guide' | 'language'

type A11yState = {
  fontScale: number
  highContrast: boolean
  reducedMotion: boolean
  underlineLinks: boolean
  largeCursor: boolean
}

const A11Y_DEFAULT: A11yState = {
  fontScale: 1, highContrast: false, reducedMotion: false,
  underlineLinks: false, largeCursor: false,
}
const A11Y_KEY = 'svr-a11y-prefs'

function applyA11y(s: A11yState) {
  const r = document.documentElement
  r.style.setProperty('--a11y-font-scale', String(s.fontScale))
  r.classList.toggle('a11y-high-contrast', s.highContrast)
  r.classList.toggle('a11y-reduced-motion', s.reducedMotion)
  r.classList.toggle('a11y-underline-links', s.underlineLinks)
  r.classList.toggle('a11y-large-cursor', s.largeCursor)
}

const RESOURCES = [
  { label: 'Join My Team', to: '/resources/join-my-team' },
  { label: 'Neighborhood News', to: '/resources/neighborhood-news' },
  { label: 'For Sale By Owner Resource Request', to: '/resources/fsbo-resources' },
  { label: 'Partners Outreach', to: '/resources/partners-outreach' },
  { label: 'Relocation Consultation', to: '/resources/relocation-consultation' },
  { label: 'International Buyers', to: '/resources/international-buyers' },
]

export function SideDrawer() {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<Tab>('main')
  const [theme, setTheme] = useState<Theme>('dark')
  const [a11y, setA11y] = useState<A11yState>(A11Y_DEFAULT)

  useEffect(() => {
    const stored = (typeof window !== 'undefined' && localStorage.getItem('theme')) as Theme | null
    const t: Theme = stored === 'light' ? 'light' : 'dark'
    setTheme(t)
    document.documentElement.classList.toggle('dark', t === 'dark')
    try {
      const raw = localStorage.getItem(A11Y_KEY)
      if (raw) {
        const parsed = { ...A11Y_DEFAULT, ...JSON.parse(raw) }
        setA11y(parsed); applyA11y(parsed)
      }
    } catch {/* noop */}
  }, [])

  const setThemeSafe = (t: Theme) => {
    setTheme(t)
    document.documentElement.classList.toggle('dark', t === 'dark')
    try { localStorage.setItem('theme', t) } catch {/* noop */}
  }

  const updateA11y = (patch: Partial<A11yState>) => {
    const next = { ...a11y, ...patch }
    setA11y(next); applyA11y(next)
    try { localStorage.setItem(A11Y_KEY, JSON.stringify(next)) } catch {/* noop */}
  }
  const resetA11y = () => {
    setA11y(A11Y_DEFAULT); applyA11y(A11Y_DEFAULT)
    try { localStorage.removeItem(A11Y_KEY) } catch {/* noop */}
  }

  return (
    <>
      {/* Single compact launcher */}
      <button
        type="button"
        onClick={() => { setOpen(true); setTab('main') }}
        aria-label="Open site menu"
        aria-expanded={open}
        className="fixed left-3 bottom-3 z-[150] flex items-center gap-2 px-3 py-2.5 rounded-full bg-foreground text-background shadow-lg border border-border hover:opacity-90 transition"
      >
        <Menu className="w-4 h-4" aria-hidden="true" />
        <span className="text-xs font-medium tracking-wide">Menu</span>
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-[190] bg-foreground/40 backdrop-blur-[2px]"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer panel */}
      <aside
        role="dialog"
        aria-label="Site menu"
        aria-hidden={!open}
        className={
          'fixed top-0 left-0 h-full w-[320px] max-w-[85vw] z-[200] bg-card text-card-foreground border-r border-border shadow-2xl transition-transform duration-300 ' +
          (open ? 'translate-x-0' : '-translate-x-full')
        }
      >
        <header className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="font-display text-lg font-semibold">Site Menu</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="p-2 rounded-full hover:bg-muted"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </header>

        <div className="overflow-y-auto h-[calc(100%-3.25rem)]">
          {tab === 'main' && (
            <nav className="p-3 flex flex-col gap-1">
              <button className="drawer-row" onClick={() => setThemeSafe(theme === 'dark' ? 'light' : 'dark')}>
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
              </button>
              <button className="drawer-row" onClick={() => setTab('a11y')}>
                <Accessibility className="w-4 h-4" /><span>Accessibility</span><ChevronRight className="w-4 h-4 ml-auto opacity-60" />
              </button>
              <button className="drawer-row" onClick={() => setTab('guide')}>
                <HelpCircle className="w-4 h-4" /><span>Site guide & tips</span><ChevronRight className="w-4 h-4 ml-auto opacity-60" />
              </button>
              <button className="drawer-row" onClick={() => setTab('resources')}>
                <BookOpen className="w-4 h-4" /><span>Resources</span><ChevronRight className="w-4 h-4 ml-auto opacity-60" />
              </button>
              <a className="drawer-row" href="/feedback/" target="_blank" rel="noopener">
                <MessageSquare className="w-4 h-4" /><span>Share feedback</span>
              </a>

              <div className="mt-4 border-t border-border pt-3 px-2">
                <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2">Quick links</p>
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/" onClick={() => setOpen(false)} className="drawer-chip">Home</Link>
                  <Link to="/properties" onClick={() => setOpen(false)} className="drawer-chip">Properties</Link>
                  <Link to="/buyers" onClick={() => setOpen(false)} className="drawer-chip">Buyers</Link>
                  <Link to="/sellers" onClick={() => setOpen(false)} className="drawer-chip">Sellers</Link>
                  <Link to="/sun-exposure" onClick={() => setOpen(false)} className="drawer-chip">SunPath IQ</Link>
                  <Link to="/feng-shui" onClick={() => setOpen(false)} className="drawer-chip">Feng Shui IQ</Link>
                </div>
              </div>
            </nav>
          )}

          {tab === 'a11y' && (
            <div className="p-4">
              <button onClick={() => setTab('main')} className="text-xs text-muted-foreground mb-3">‹ Back</button>
              <h3 className="font-display text-base font-semibold mb-4">Accessibility</h3>

              <div className="mb-4">
                <label className="text-xs font-medium text-muted-foreground">Text size</label>
                <div className="flex items-center gap-2 mt-2">
                  <button className="p-2 rounded-full border border-border" onClick={() => updateA11y({ fontScale: Math.max(0.8, +(a11y.fontScale - 0.1).toFixed(2)) })} aria-label="Decrease text size"><Minus className="w-4 h-4" /></button>
                  <span className="text-sm tabular-nums w-16 text-center">{Math.round(a11y.fontScale * 100)}%</span>
                  <button className="p-2 rounded-full border border-border" onClick={() => updateA11y({ fontScale: Math.min(1.5, +(a11y.fontScale + 0.1).toFixed(2)) })} aria-label="Increase text size"><Plus className="w-4 h-4" /></button>
                </div>
              </div>

              {[
                ['highContrast', 'High contrast'],
                ['reducedMotion', 'Reduce motion'],
                ['underlineLinks', 'Underline links'],
                ['largeCursor', 'Large cursor'],
              ].map(([key, label]) => (
                <label key={key} className="flex items-center justify-between py-2 text-sm">
                  <span>{label}</span>
                  <input
                    type="checkbox"
                    checked={Boolean((a11y as any)[key])}
                    onChange={(e) => updateA11y({ [key]: e.target.checked } as any)}
                    className="w-4 h-4 accent-current"
                  />
                </label>
              ))}

              <button onClick={resetA11y} className="mt-4 inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground">
                <RotateCcw className="w-3.5 h-3.5" /> Reset defaults
              </button>
            </div>
          )}

          {tab === 'guide' && (
            <div className="p-4">
              <button onClick={() => setTab('main')} className="text-xs text-muted-foreground mb-3">‹ Back</button>
              <h3 className="font-display text-base font-semibold mb-3">Getting around</h3>
              <ul className="space-y-3 text-sm">
                <li><b>MLS Search:</b> live listings by city, price, and beds.</li>
                <li><b>Off-market listings:</b> private inventory, verify email to unlock.</li>
                <li><b>SunPath IQ:</b> daylight scoring and 3D shadow simulator for any address.</li>
                <li><b>Feng Shui IQ:</b> Bagua and Vastu directional analysis with a Harmony Score.</li>
                <li><b>Call or WhatsApp:</b> (650) 640-9777 for the fastest reply.</li>
              </ul>
            </div>
          )}

          {tab === 'resources' && (
            <div className="p-4">
              <button onClick={() => setTab('main')} className="text-xs text-muted-foreground mb-3">‹ Back</button>
              <h3 className="font-display text-base font-semibold mb-3">Resources</h3>
              <ul className="flex flex-col gap-1">
                {RESOURCES.map((r) => (
                  <li key={r.to}>
                    <Link
                      to={r.to}
                      onClick={() => setOpen(false)}
                      className="drawer-row"
                    >
                      <span>{r.label}</span>
                      <ChevronRight className="w-4 h-4 ml-auto opacity-60" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </aside>

      <style>{`
        .drawer-row { display:flex; align-items:center; gap:0.6rem; padding:0.6rem 0.75rem; border-radius:0.5rem; font-size:0.875rem; color:inherit; text-align:left; }
        .drawer-row:hover { background: hsl(var(--muted)); }
        .drawer-chip { padding:0.4rem 0.6rem; border-radius:0.5rem; border:1px solid hsl(var(--border)); font-size:0.75rem; text-align:center; }
        .drawer-chip:hover { background: hsl(var(--muted)); }
      `}</style>
    </>
  )
}

export default SideDrawer
