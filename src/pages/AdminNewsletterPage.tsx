import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { SEO } from '../components/SEO'

type Row = { id: string; email: string; source: string | null; created_at: string }

function toCsv(rows: Row[]): string {
  const headers = ['created_at', 'email', 'source']
  const esc = (v: unknown) => {
    if (v == null) return ''
    const s = String(v)
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  return [headers.join(','), ...rows.map(r => headers.map(h => esc((r as Record<string, unknown>)[h])).join(','))].join('\n')
}

export default function AdminNewsletterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [session, setSession] = useState<unknown>(null)
  const [rows, setRows] = useState<Row[]>([])
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) return
    setLoading(true)
    supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1000)
      .then(({ data, error }) => {
        setLoading(false)
        if (error) { setErr(error.message); return }
        setRows((data ?? []) as Row[])
      })
  }, [session])

  async function signIn(e: React.FormEvent) {
    e.preventDefault()
    setErr('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setErr(error.message)
  }

  function downloadCsv() {
    const blob = new Blob([toCsv(rows)], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
        <SEO title="Admin · Newsletter" description="Admin newsletter viewer." />
        <form onSubmit={signIn} className="w-full max-w-sm space-y-3 rounded-2xl border border-border p-6 bg-card">
          <h1 className="text-xl font-semibold">Admin Sign In</h1>
          <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-border bg-background p-2" />
          <input type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-border bg-background p-2" />
          <button className="w-full rounded-md bg-primary text-primary-foreground p-2 font-medium">Sign in</button>
          {err && <p className="text-sm text-destructive">{err}</p>}
        </form>
      </div>
    )
  }

  const bySource = rows.reduce<Record<string, number>>((acc, r) => {
    const k = r.source || 'unknown'
    acc[k] = (acc[k] || 0) + 1
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <SEO title="Admin · Newsletter" description="Admin newsletter viewer." />
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Newsletter Subscribers</h1>
          <div className="flex gap-2">
            <button onClick={downloadCsv} className="rounded-md border border-border px-3 py-1.5 text-sm">Export CSV</button>
            <button onClick={() => supabase.auth.signOut()} className="rounded-md border border-border px-3 py-1.5 text-sm">Sign out</button>
          </div>
        </div>
        <div className="mb-4 flex flex-wrap gap-2 text-sm text-muted-foreground">
          <span className="rounded-full border border-border px-3 py-1">Total: {rows.length}</span>
          {Object.entries(bySource).map(([k, v]) => (
            <span key={k} className="rounded-full border border-border px-3 py-1">{k}: {v}</span>
          ))}
        </div>
        {loading && <p>Loading…</p>}
        {err && <p className="text-destructive">{err}</p>}
        {!loading && rows.length === 0 && <p className="text-muted-foreground">No subscribers yet (or you are not an admin).</p>}
        <div className="rounded-xl border border-border bg-card divide-y divide-border">
          {rows.map((r) => (
            <div key={r.id} className="p-3 flex items-center justify-between text-sm">
              <span className="font-mono">{r.email}</span>
              <span className="text-xs text-muted-foreground">{r.source || '—'} · {new Date(r.created_at).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
