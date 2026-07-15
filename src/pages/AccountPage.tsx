'use client'

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { PageNavbar } from '@/components/PageNavbar'
import { Footer } from '@/components/Footer'
import { SEO } from '@/components/SEO'
import { toast } from 'sonner'
import { LogOut, Bell, Home } from 'lucide-react'

type Profile = {
  id: string
  email: string | null
  full_name: string | null
  phone: string | null
  newsletter_opt_in: boolean
}

export default function AccountPage() {
  const { user, loading, signOut } = useAuth()
  const nav = useNavigate()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [searches, setSearches] = useState<any[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!loading && !user) nav('/auth', { replace: true })
  }, [user, loading, nav])

  useEffect(() => {
    if (!user) return
    ;(async () => {
      const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
      if (p) setProfile(p as Profile)
      const { data: s } = await supabase.from('saved_searches').select('*').eq('email', user.email!).order('created_at', { ascending: false })
      setSearches(s ?? [])
    })()
  }, [user])

  async function save() {
    if (!profile || !user) return
    setSaving(true)
    const { error } = await supabase.from('profiles').update({
      full_name: profile.full_name,
      phone: profile.phone,
      newsletter_opt_in: profile.newsletter_opt_in,
    }).eq('id', user.id)
    setSaving(false)
    if (error) { toast.error('Could not save'); return }
    toast.success('Profile updated')
  }

  if (loading || !user) return null

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title="My Account · Nikolaenko Property Group" description="Manage your saved searches, newsletter, and profile." canonical="https://luxury.nikolaenkopropertygroup.com/account" />
      <PageNavbar />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-3xl">
          <header className="flex items-start justify-between mb-10">
            <div>
              <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-2">My Account</p>
              <h1 className="font-display text-4xl font-bold">{profile?.full_name || user.email}</h1>
              <p className="text-muted-foreground text-sm mt-1">{user.email}</p>
            </div>
            <button onClick={async () => { await signOut(); nav('/') }}
              className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] px-4 py-2 rounded-md border border-border hover:bg-muted gentle-animation">
              <LogOut className="w-3.5 h-3.5" /> Sign out
            </button>
          </header>

          {profile && (
            <section className="bg-card border border-border rounded-2xl p-8 elevated-shadow mb-8">
              <h2 className="font-display text-xl mb-5">Profile</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                <input value={profile.full_name ?? ''} onChange={e => setProfile({ ...profile, full_name: e.target.value })} placeholder="Full name" className="px-3 py-2.5 rounded-md border border-border bg-input-background text-sm" />
                <input value={profile.phone ?? ''} onChange={e => setProfile({ ...profile, phone: e.target.value })} placeholder="Phone" className="px-3 py-2.5 rounded-md border border-border bg-input-background text-sm" />
              </div>
              <label className="flex items-center gap-2 text-sm mt-4">
                <input type="checkbox" checked={profile.newsletter_opt_in} onChange={e => setProfile({ ...profile, newsletter_opt_in: e.target.checked })} />
                <Bell className="w-3.5 h-3.5" /> Receive market briefs and new-listing alerts
              </label>
              <button onClick={save} disabled={saving} className="mt-5 px-6 py-2.5 rounded-md bg-foreground text-primary-foreground text-xs uppercase tracking-[0.2em] hover:opacity-90 disabled:opacity-50">
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </section>
          )}

          <section className="bg-card border border-border rounded-2xl p-8 elevated-shadow">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl flex items-center gap-2"><Home className="w-4 h-4" /> Saved searches</h2>
              <button onClick={() => nav('/saved-searches')} className="text-xs uppercase tracking-[0.15em] underline">New search</button>
            </div>
            {searches.length === 0 ? (
              <p className="text-sm text-muted-foreground">You haven't saved any searches yet.</p>
            ) : (
              <ul className="divide-y divide-border">
                {searches.map(s => (
                  <li key={s.id} className="py-4">
                    <div className="font-medium text-sm">{s.label || 'Untitled search'}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {(s.filters?.neighborhoods ?? []).join(', ') || 'All areas'} · {s.frequency}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
