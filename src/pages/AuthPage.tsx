'use client'

import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { PageNavbar } from '@/components/PageNavbar'
import { Footer } from '@/components/Footer'
import { SEO } from '@/components/SEO'
import { toast } from 'sonner'
import { z } from 'zod'
import { useAuth } from '@/hooks/useAuth'

const signInSchema = z.object({
  email: z.string().trim().email('Enter a valid email').max(200),
  password: z.string().min(6, 'Password must be at least 6 characters').max(200),
})

const signUpSchema = signInSchema.extend({
  full_name: z.string().trim().min(1, 'Please enter your name').max(120),
  phone: z.string().trim().max(50).optional().or(z.literal('')),
})

export default function AuthPage() {
  const [params] = useSearchParams()
  const initialMode = params.get('mode') === 'signup' ? 'signup' : 'signin'
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode)
  const [form, setForm] = useState({ email: '', password: '', full_name: '', phone: '', newsletter: true })
  const [busy, setBusy] = useState(false)
  const nav = useNavigate()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && user) nav('/account', { replace: true })
  }, [user, loading, nav])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    try {
      if (mode === 'signup') {
        const parsed = signUpSchema.safeParse(form)
        if (!parsed.success) { toast.error(parsed.error.issues[0].message); return }
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/account`,
            data: { full_name: parsed.data.full_name, phone: parsed.data.phone || null },
          },
        })
        if (error) throw error
        // Save newsletter preference after profile is created (trigger runs on signup)
        if (!form.newsletter) {
          // best-effort; will run once session exists
          setTimeout(async () => {
            const { data: { user: u } } = await supabase.auth.getUser()
            if (u) await supabase.from('profiles').update({ newsletter_opt_in: false }).eq('id', u.id)
          }, 800)
        }
        toast.success('Check your email to confirm your account.')
      } else {
        const parsed = signInSchema.safeParse(form)
        if (!parsed.success) { toast.error(parsed.error.issues[0].message); return }
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        })
        if (error) throw error
        toast.success('Welcome back.')
        nav('/account')
      }
    } catch (err: any) {
      toast.error(err?.message ?? 'Something went wrong')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title={`${mode === 'signup' ? 'Create Account' : 'Sign In'} · Nikolaenko Property Group`}
        description="Sign in to save searches, unlock off-market listings, and receive personalized Silicon Valley market updates."
        canonical={`https://luxury.nikolaenkopropertygroup.com/auth`}
      />
      <PageNavbar />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-md">
          <header className="text-center mb-10">
            <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-3 font-medium">
              {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
            </p>
            <h1 className="font-display text-4xl font-bold mb-3">
              {mode === 'signup' ? 'Join the private list' : 'Sign in'}
            </h1>
            <p className="text-muted-foreground text-sm">
              Save searches, unlock off-market inventory, and receive concierge market briefs.
            </p>
          </header>

          <form onSubmit={submit} className="bg-card border border-border rounded-2xl p-8 elevated-shadow space-y-4">
            {mode === 'signup' && (
              <>
                <input required maxLength={120} value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} placeholder="Full name" className="w-full px-3 py-2.5 rounded-md border border-border bg-input-background text-sm" />
                <input type="tel" maxLength={50} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Phone (optional)" className="w-full px-3 py-2.5 rounded-md border border-border bg-input-background text-sm" />
              </>
            )}
            <input required type="email" maxLength={200} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email" className="w-full px-3 py-2.5 rounded-md border border-border bg-input-background text-sm" />
            <input required type="password" minLength={6} maxLength={200} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Password" className="w-full px-3 py-2.5 rounded-md border border-border bg-input-background text-sm" />

            {mode === 'signup' && (
              <label className="flex items-start gap-2 text-xs text-muted-foreground">
                <input type="checkbox" checked={form.newsletter} onChange={e => setForm({ ...form, newsletter: e.target.checked })} className="mt-0.5" />
                <span>Send me curated Silicon Valley market briefs and new-listing alerts. Unsubscribe any time.</span>
              </label>
            )}

            <button type="submit" disabled={busy}
              className="w-full py-3 rounded-md bg-foreground text-primary-foreground text-sm uppercase tracking-[0.2em] hover:opacity-90 gentle-animation disabled:opacity-50">
              {busy ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Sign in'}
            </button>

            <div className="text-center text-xs text-muted-foreground pt-2">
              {mode === 'signup' ? (
                <>Already have an account?{' '}
                  <button type="button" onClick={() => setMode('signin')} className="underline text-foreground">Sign in</button>
                </>
              ) : (
                <>New here?{' '}
                  <button type="button" onClick={() => setMode('signup')} className="underline text-foreground">Create an account</button>
                </>
              )}
            </div>
          </form>

          <p className="text-center text-[11px] text-muted-foreground mt-6 leading-snug">
            By continuing you agree to our terms and privacy policy. We never sell your data.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
