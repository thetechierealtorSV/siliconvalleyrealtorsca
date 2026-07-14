import { useEffect } from 'react'

/**
 * Mounts the reusable vanilla-JS preferences widget from /shared/preferences-widget.js
 * into a container div. Safe to render multiple times, the script only initializes
 * once and re-renders into whichever mount div exists.
 */
export function PreferencesWidget() {
  useEffect(() => {
    const SRC = '/shared/preferences-widget.js'
    const existing = document.querySelector(`script[src="${SRC}"]`) as HTMLScriptElement | null
    if (existing) {
      // Script already loaded, re-trigger init by dispatching DOMContentLoaded-like manually.
      // The widget attaches only if #nkpg-preferences exists; call init via re-inject fallback.
      const s = document.createElement('script')
      s.src = SRC + '?r=' + Date.now()
      s.async = true
      document.body.appendChild(s)
      return () => { s.remove() }
    }
    const s = document.createElement('script')
    s.src = SRC
    s.async = true
    document.body.appendChild(s)
  }, [])

  return (
    <section aria-label="Preferences" className="py-12">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div id="nkpg-preferences" />
      </div>
    </section>
  )
}
