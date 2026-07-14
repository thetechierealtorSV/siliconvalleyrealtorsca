'use client'

/**
 * SiteGuide, hybrid on-site guidance.
 *
 * Recommendation over per-button hover tooltips:
 *  - Hover tooltips don't work on touch devices and can crowd the UI.
 *  - Instead we ship (1) a floating "?" Help button that opens a mini guide
 *    with tips organized by section, and (2) a first-visit intro dialog that
 *    highlights the site's main areas. Both are dismissible and remember
 *    preferences in localStorage.
 */

import { useEffect, useState } from 'react'
import { HelpCircle, X, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react'

const SEEN_KEY = 'svr-guide-seen-v1'

type Step = {
  target: string
  title: string
  body: string
}

const STEPS: Step[] = [
  {
    target: '#hero',
    title: 'Welcome to Nikolaenko Property Group',
    body: 'Your concierge for luxury homes across the Peninsula, South Bay, and beyond. This quick tour shows you around, 30 seconds.',
  },
  {
    target: '#mls-search',
    title: 'Search live MLS listings',
    body: 'Filter by city, price, beds, and baths. Results are pulled live from the MLS, click any listing for details.',
  },
  {
    target: '#video-tour-section',
    title: 'Cinematic video walkthroughs',
    body: 'Explore properties before you visit. Every video is captured in 4K by our production team.',
  },
  {
    target: '#youtube-tours',
    title: 'YouTube home tour series',
    body: 'Subscribe to follow our original tour series. New Silicon Valley homes each month.',
  },
  {
    target: '#properties-section',
    title: 'Featured & off-market properties',
    body: 'Signature listings and quiet-market opportunities. Ask about our private off-market network on the Off-Market page.',
  },
  {
    target: '#contact-section',
    title: 'Talk with a real person',
    body: 'Call or WhatsApp us at (650) 640-9777, or send an inquiry. We respond within 24 hours.',
  },
]

const TIPS: { section: string; items: { label: string; hint: string }[] }[] = [
  {
    section: 'Getting around',
    items: [
      { label: 'Top navigation', hint: 'Jump straight to Properties, Video Tours, Services, Why Us, or Contact.' },
      { label: 'Accessibility menu (bottom-left)', hint: 'Adjust text size, contrast, motion, cursor size, and link underlines.' },
      { label: 'Theme toggle', hint: 'Switch between light and dark modes anytime.' },
    ],
  },
  {
    section: 'Finding a home',
    items: [
      { label: 'MLS Search', hint: 'Live results. Combine filters, city + price + beds, for the best matches.' },
      { label: 'Off-market listings', hint: 'Private inventory. Verify your email to unlock addresses and full details.' },
      { label: 'Saved searches', hint: 'Save any search to get email alerts when matching homes hit the market.' },
    ],
  },
  {
    section: 'Getting in touch',
    items: [
      { label: 'Call / WhatsApp', hint: '(650) 640-9777, fastest way to reach us for urgent showings or offers.' },
      { label: 'Contact form', hint: 'Best for detailed briefs. Include neighborhoods and price range for a faster reply.' },
      { label: 'AI chat (bottom-right)', hint: 'Answers common questions about listings, process, and neighborhoods 24/7.' },
    ],
  },
]

export function SiteGuide() {
  const [helpOpen, setHelpOpen] = useState(false)
  const [tourOpen, setTourOpen] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    // Only auto-open the intro tour on the homepage, once ever.
    if (typeof window === 'undefined') return
    if (window.location.pathname !== '/') return
    try {
      if (!localStorage.getItem(SEEN_KEY)) {
        // Delay a moment so the hero has painted first.
        const t = setTimeout(() => setTourOpen(true), 1200)
        return () => clearTimeout(t)
      }
    } catch {/* noop */}
  }, [])

  const closeTour = (markSeen = true) => {
    setTourOpen(false)
    setStep(0)
    if (markSeen) {
      try { localStorage.setItem(SEEN_KEY, '1') } catch {/* noop */}
    }
  }

  // Scroll the current step's target into view for context.
  useEffect(() => {
    if (!tourOpen) return
    const el = document.querySelector(STEPS[step]?.target || '')
    if (el && 'scrollIntoView' in el) {
      (el as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [tourOpen, step])

  return (
    <>
      {/* Floating Help button */}
      <button
        type="button"
        onClick={() => setHelpOpen((o) => !o)}
        aria-label="Open site guide and help"
        aria-expanded={helpOpen}
        aria-controls="site-guide-panel"
        className="fixed left-4 bottom-36 z-[150] flex items-center justify-center w-12 h-12 rounded-full bg-background text-foreground border border-border shadow-lg hover:scale-105 transition-transform focus:outline-none focus:ring-4 focus:ring-ring"
      >
        <HelpCircle className="w-6 h-6" aria-hidden="true" />
      </button>

      {/* Help panel */}
      {helpOpen && (
        <div
          id="site-guide-panel"
          role="dialog"
          aria-label="Site guide"
          className="fixed left-4 bottom-52 z-[150] w-96 max-w-[calc(100vw-2rem)] max-h-[70vh] overflow-y-auto bg-card text-card-foreground border border-border rounded-2xl shadow-2xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              Site Guide
            </h2>
            <button
              type="button"
              onClick={() => setHelpOpen(false)}
              aria-label="Close site guide"
              className="p-2 rounded-full hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            Quick tips on how to get the most out of the site.
          </p>

          <button
            type="button"
            onClick={() => { setHelpOpen(false); setStep(0); setTourOpen(true) }}
            className="w-full mb-4 py-2.5 rounded-lg bg-foreground text-primary-foreground text-sm font-medium hover:opacity-90 transition"
          >
            Start the guided tour
          </button>

          <div className="space-y-4">
            {TIPS.map((group) => (
              <div key={group.section}>
                <h3 className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">{group.section}</h3>
                <ul className="space-y-2">
                  {group.items.map((item) => (
                    <li key={item.label} className="text-sm">
                      <div className="font-medium text-foreground">{item.label}</div>
                      <div className="text-muted-foreground leading-relaxed">{item.hint}</div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Guided tour overlay */}
      {tourOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Site tour"
          className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) closeTour() }}
        >
          <div className="w-full max-w-md bg-card text-card-foreground border border-border rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
                Step {step + 1} of {STEPS.length}
              </span>
              <button
                type="button"
                onClick={() => closeTour()}
                aria-label="Close tour"
                className="p-2 -mr-2 rounded-full hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <h3 className="font-display text-xl font-semibold text-foreground mb-2">{STEPS[step].title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">{STEPS[step].body}</p>

            {/* Progress */}
            <div className="flex gap-1.5 mb-5" aria-hidden="true">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-foreground' : 'bg-muted'}`}
                />
              ))}
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                Back
              </button>

              <button
                type="button"
                onClick={() => closeTour()}
                className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
              >
                Skip tour
              </button>

              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-foreground text-primary-foreground text-sm font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  Next
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => closeTour()}
                  className="px-4 py-2 rounded-lg bg-foreground text-primary-foreground text-sm font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  Got it
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
