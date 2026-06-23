'use client'

import { useEffect, useState } from 'react'
import { Accessibility, Minus, Plus, RotateCcw, X } from 'lucide-react'

type A11yState = {
  fontScale: number
  highContrast: boolean
  reducedMotion: boolean
  underlineLinks: boolean
  largeCursor: boolean
}

const DEFAULT: A11yState = {
  fontScale: 1,
  highContrast: false,
  reducedMotion: false,
  underlineLinks: false,
  largeCursor: false,
}

const STORAGE_KEY = 'svr-a11y-prefs'

function apply(state: A11yState) {
  const root = document.documentElement
  root.style.setProperty('--a11y-font-scale', String(state.fontScale))
  root.classList.toggle('a11y-high-contrast', state.highContrast)
  root.classList.toggle('a11y-reduced-motion', state.reducedMotion)
  root.classList.toggle('a11y-underline-links', state.underlineLinks)
  root.classList.toggle('a11y-large-cursor', state.largeCursor)
}

export function AccessibilityMenu() {
  const [open, setOpen] = useState(false)
  const [state, setState] = useState<A11yState>(DEFAULT)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = { ...DEFAULT, ...JSON.parse(raw) }
        setState(parsed)
        apply(parsed)
      }
    } catch {/* noop */}
  }, [])

  const update = (patch: Partial<A11yState>) => {
    const next = { ...state, ...patch }
    setState(next)
    apply(next)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {/* noop */}
  }

  const reset = () => {
    setState(DEFAULT)
    apply(DEFAULT)
    try { localStorage.removeItem(STORAGE_KEY) } catch {/* noop */}
  }

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:px-4 focus:py-2 focus:bg-foreground focus:text-background focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>

      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-label="Open accessibility menu"
        aria-expanded={open}
        aria-controls="a11y-panel"
        className="fixed left-4 bottom-4 z-[150] flex items-center justify-center w-12 h-12 rounded-full bg-foreground text-background shadow-lg hover:scale-105 transition-transform focus:outline-none focus:ring-4 focus:ring-ring"
      >
        <Accessibility className="w-6 h-6" aria-hidden="true" />
      </button>

      {open && (
        <div
          id="a11y-panel"
          role="dialog"
          aria-label="Accessibility options"
          className="fixed left-4 bottom-20 z-[150] w-80 max-w-[calc(100vw-2rem)] bg-card text-card-foreground border border-border rounded-2xl shadow-2xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold">Accessibility</h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close accessibility menu"
              className="p-2 rounded-full hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Text size</span>
                <span className="text-muted-foreground tabular-nums">{Math.round(state.fontScale * 100)}%</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Decrease text size"
                  onClick={() => update({ fontScale: Math.max(0.85, +(state.fontScale - 0.1).toFixed(2)) })}
                  className="flex-1 flex items-center justify-center h-10 rounded-lg border border-border hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <Minus className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="Increase text size"
                  onClick={() => update({ fontScale: Math.min(1.5, +(state.fontScale + 0.1).toFixed(2)) })}
                  className="flex-1 flex items-center justify-center h-10 rounded-lg border border-border hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {([
              ['highContrast', 'High contrast'],
              ['reducedMotion', 'Reduce motion'],
              ['underlineLinks', 'Underline links'],
              ['largeCursor', 'Large cursor'],
            ] as const).map(([key, label]) => (
              <label key={key} className="flex items-center justify-between gap-3 cursor-pointer py-1">
                <span className="font-medium">{label}</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={state[key]}
                  aria-label={label}
                  onClick={() => update({ [key]: !state[key] } as Partial<A11yState>)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring ${state[key] ? 'bg-foreground' : 'bg-muted-foreground/40'}`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-background transition-transform ${state[key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </label>
            ))}

            <button
              type="button"
              onClick={reset}
              className="w-full flex items-center justify-center gap-2 h-10 rounded-lg border border-border hover:bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              Reset to defaults
            </button>
          </div>
        </div>
      )}
    </>
  )
}
