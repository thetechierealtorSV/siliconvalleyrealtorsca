'use client'

import { useEffect, useState, useRef } from 'react'
import { Globe } from 'lucide-react'

declare global {
  interface Window {
    googleTranslateElementInit?: () => void
    google?: any
  }
}

const INCLUDED = 'en,zh-CN,zh-TW,es,ko,ja,hi,vi,ru,fr,de,pt'

export function GoogleTranslate() {
  const [open, setOpen] = useState(false)
  const mounted = useRef(false)

  useEffect(() => {
    if (mounted.current) return
    mounted.current = true

    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: INCLUDED,
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          'google_translate_element'
        )
      }
    }

    if (!document.getElementById('google-translate-script')) {
      const s = document.createElement('script')
      s.id = 'google-translate-script'
      s.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
      s.async = true
      document.body.appendChild(s)
    }
  }, [])

  return (
    <div className="fixed bottom-6 left-6 z-[120]">
      <button
        onClick={() => setOpen(v => !v)}
        aria-label="Choose language / \u9009\u62e9\u8bed\u8a00"
        className="flex items-center gap-2 rounded-full bg-foreground text-primary-foreground px-4 py-3 shadow-lg hover:opacity-90 gentle-animation cursor-pointer"
      >
        <Globe className="w-4 h-4" />
        <span className="text-xs font-medium tracking-wide">Language / \u8bed\u8a00</span>
      </button>
      <div
        className={
          'mt-2 rounded-lg bg-[#faf8f5] border border-[#e0d9cf] shadow-xl p-3 ' +
          (open ? 'block' : 'hidden')
        }
      >
        <div id="google_translate_element" />
        <p className="mt-2 text-[10px] text-muted-foreground max-w-[220px] leading-snug">
          Translations are provided by Google Translate for convenience and may not be exact.
        </p>
      </div>
    </div>
  )
}

export default GoogleTranslate
