import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

export function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const value = email.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      toast.error('Please enter a valid email address.')
      return
    }
    setLoading(true)
    const { error } = await supabase.from('newsletter_subscribers').insert({ email: value, source: 'blog' })
    setLoading(false)
    if (error && !/duplicate|unique/i.test(error.message)) {
      toast.error('Could not subscribe. Please try again.')
      return
    }
    toast.success('You\'re on the list. Watch for our next market brief.')
    setEmail('')
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-8 md:p-10 text-center">
      <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">Newsletter</p>
      <h3 className="font-display text-2xl md:text-3xl font-semibold mb-2">Monthly Silicon Valley market briefs</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-lg mx-auto">
        Off-market previews, price-trend snapshots, and Feng Shui + sunlight notes on new listings. No spam. Unsubscribe anytime.
      </p>
      <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="flex-1 px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          aria-label="Email address"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition disabled:opacity-60"
        >
          {loading ? 'Subscribing…' : 'Subscribe'}
        </button>
      </form>
    </div>
  )
}
