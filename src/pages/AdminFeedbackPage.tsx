import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { SEO } from '../components/SEO'

type FeedbackRow = {
  id: string
  created_at: string
  liked: string[] | null
  liked_notes: string | null
  improve_notes: string | null
  rating: number | null
  contact_opt_in: boolean
  name: string | null
  email: string | null
  attachment_url: string | null
  page_url: string | null
  user_agent: string | null
}

function toCsv(rows: FeedbackRow[]): string {
  const headers = [
    'created_at', 'rating', 'liked', 'liked_notes', 'improve_notes',
    'contact_opt_in', 'name', 'email', 'page_url', 'attachment_url', 'user_agent',
  ]
  const esc = (v: unknown) => {
    if (v == null) return ''
    const s = Array.isArray(v) ? v.join('|') : String(v)
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const lines = [headers.join(',')]
  for (const r of rows) {
    lines.push(headers.map((h) => esc((r as Record<string, unknown>)[h])).join(','))
  }
  return lines.join('\n')
}

export default function AdminFeedbackPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [session, setSession] = useState<unknown>(null)
  const [rows, setRows] = useState<FeedbackRow[]>([])
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
      .from('site_feedback')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500)
      .then(({ data, error }) => {
        setLoading(false)
        if (error) { setErr(error.message); return }
        setRows((data ?? []) as FeedbackRow[])
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
    a.download = `site-feedback-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
        <SEO title="Admin · Feedback" description="Admin feedback viewer." />
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

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <SEO title="Admin · Feedback" description="Admin feedback viewer." />
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Site Feedback</h1>
          <div className="flex gap-2">
            <button onClick={downloadCsv} className="rounded-md border border-border px-3 py-1.5 text-sm">Export CSV</button>
            <button onClick={() => supabase.auth.signOut()} className="rounded-md border border-border px-3 py-1.5 text-sm">Sign out</button>
          </div>
        </div>
        {loading && <p>Loading…</p>}
        {err && <p className="text-destructive">{err}</p>}
        {!loading && rows.length === 0 && <p className="text-muted-foreground">No feedback yet (or you are not an admin).</p>}
        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r.id} className="rounded-xl border border-border p-4 bg-card">
              <div className="flex flex-wrap justify-between text-sm text-muted-foreground gap-2">
                <span>{new Date(r.created_at).toLocaleString()}</span>
                <span>{r.rating ? '★'.repeat(r.rating) : ', '}</span>
              </div>
              {r.liked && r.liked.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {r.liked.map((l) => <span key={l} className="text-xs rounded-full border border-border px-2 py-0.5">{l}</span>)}
                </div>
              )}
              {r.liked_notes && <p className="mt-2 text-sm"><b>Liked:</b> {r.liked_notes}</p>}
              {r.improve_notes && <p className="mt-1 text-sm"><b>Improve:</b> {r.improve_notes}</p>}
              {r.contact_opt_in && (
                <p className="mt-2 text-sm"><b>Contact:</b> {r.name} · {r.email}</p>
              )}
              {r.page_url && <p className="mt-1 text-xs text-muted-foreground">From: {r.page_url}</p>}
              {r.attachment_url && <p className="mt-1 text-xs">Screenshot: <code>{r.attachment_url}</code></p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
