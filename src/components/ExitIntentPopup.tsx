'use client'

import { useEffect, useState } from 'react'
import { X, Mail, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { submitLead } from '@/lib/leads'

const STORAGE_KEY = 'npg_exit_popup_seen_v1'
const IDLE_MS = 60_000

/**
 * Last-chance lead capture. Shows on:
 *   1) mouse leaving the top of the viewport (exit intent, desktop), or
 *   2) 60 seconds on-site with no dismissal.
 * Shown at most once per browser (sessionStorage), skipped for known subscribers.
 */
export function ExitIntentPopup() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return
      if (localStorage.getItem('npg_subscribed')) return
    } catch { /* ignore */ }

    let fired = false
    const trigger = () => {
      if (fired) return
      fired = true
      setOpen(true)
      try { sessionStorage.setItem(STORAGE_KEY, '1') } catch { /* ignore */ }
    }

    const onMouseOut = (e: MouseEvent) => {
      if (e.clientY <= 0 && !e.relatedTarget) trigger()
    }

    const idle = window.setTimeout(trigger, IDLE_MS)
    document.addEventListener('mouseout', onMouseOut)
    return () => {
      window.clearTimeout(idle)
      document.removeEventListener('mouseout', onMouseOut)
    }
  }, [])

  const close = () => setOpen(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) { toast.error('Email required'); return }
    setLoading(true)
    try {
      await submitLead({
        lead_type: 'contact',
        specialty: 'mailing_list',
        name,
        email,
        payload: { kind: 'exit_intent_signup', source: 'exit_popup' },
      })
      try { localStorage.setItem('npg_subscribed', '1') } catch { /* ignore */ }
      toast.success("You're on the list, watch for our next off-market drop.")
      close()
    } catch {
      toast.error('Could not sign you up. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-popup-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
      onClick={close}
    >
      <div
        className="relative w-full max-w-lg bg-card clean-border rounded-2xl elevated-shadow p-8 sm:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          aria-label="Close"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-secondary hover:bg-muted flex items-center justify-center gentle-animation"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4" style={{ color: 'var(--accent-gold)' }} />
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground font-medium">Before you go</p>
        </div>

        <h2 id="exit-popup-title" className="font-display text-3xl sm:text-4xl font-bold mb-3">
          Get the off-market list
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          Join our private mailing list for pocket listings, pre-market Silicon Valley homes, and market intel you
          won't see on the MLS. No spam, unsubscribe anytime.
        </p>

        <form onSubmit={onSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-background border border-border text-sm"
          />
          <label className="flex items-center gap-2 px-4 py-3 rounded-xl bg-background border border-border">
            <Mail className="w-4 h-4 text-muted-foreground" aria-hidden />
            <input
              type="email"
              required
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-transparent text-sm focus:outline-none"
            />
          </label>
          <button
            disabled={loading}
            className="w-full bg-foreground text-primary-foreground rounded-xl px-4 py-3 text-sm font-medium hover:opacity-90 gentle-animation disabled:opacity-50"
          >
            {loading ? 'Adding you…' : 'Send me the list'}
          </button>
          <button
            type="button"
            onClick={close}
            className="w-full text-xs text-muted-foreground hover:text-foreground gentle-animation pt-1"
          >
            No thanks, continue browsing
          </button>
        </form>
      </div>
    </div>
  )
}
