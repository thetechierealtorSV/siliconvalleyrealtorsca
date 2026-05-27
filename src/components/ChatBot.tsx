'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { MessageCircle, X, Send, Loader2, RotateCcw } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { toast } from 'sonner'
import { Link } from 'react-router-dom'

type Msg = { role: 'user' | 'assistant'; content: string }

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`
const STORAGE_KEY = 'svl_chat_thread_v1'

const STARTERS = [
  { label: "I'm looking to buy", text: "I'm exploring buying in the Bay Area. Where do I start?" },
  { label: "What's my home worth?", text: "I'd like a quick valuation on my home." },
  { label: "Show me Atherton", text: "Tell me what's happening in the Atherton market right now." },
]

async function streamChat({
  messages,
  source_page,
  onDelta,
  onDone,
  onError,
  signal,
}: {
  messages: Msg[]
  source_page: string
  onDelta: (text: string) => void
  onDone: () => void
  onError: (err: string) => void
  signal: AbortSignal
}) {
  const resp = await fetch(CHAT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages, source_page }),
    signal,
  })

  if (!resp.ok) {
    const data = await resp.json().catch(() => ({}))
    onError(data.error || 'Something went wrong. Please try again.')
    return
  }
  if (!resp.body) {
    onError('No response received.')
    return
  }

  const reader = resp.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let done = false

  while (!done) {
    const { done: streamDone, value } = await reader.read()
    if (streamDone) break
    buffer += decoder.decode(value, { stream: true })
    let idx: number
    while ((idx = buffer.indexOf('\n')) !== -1) {
      let line = buffer.slice(0, idx)
      buffer = buffer.slice(idx + 1)
      if (line.endsWith('\r')) line = line.slice(0, -1)
      if (line.startsWith(':') || line.trim() === '') continue
      if (!line.startsWith('data: ')) continue
      const json = line.slice(6).trim()
      if (json === '[DONE]') { done = true; break }
      try {
        const parsed = JSON.parse(json)
        const content = parsed.choices?.[0]?.delta?.content as string | undefined
        if (content) onDelta(content)
      } catch {
        buffer = line + '\n' + buffer
        break
      }
    }
  }
  onDone()
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch { return [] }
  })
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30))) } catch { /* ignore */ }
  }, [messages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isOpen])

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus()
  }, [isOpen])

  const sendText = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return
    const userMsg: Msg = { role: 'user', content: text.trim() }
    setMessages(prev => [...prev, userMsg])
    setIsLoading(true)
    setInput('')

    let assistantSoFar = ''
    const upsert = (chunk: string) => {
      assistantSoFar += chunk
      setMessages(prev => {
        const last = prev[prev.length - 1]
        if (last?.role === 'assistant') {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m))
        }
        return [...prev, { role: 'assistant', content: assistantSoFar }]
      })
    }

    const ctrl = new AbortController()
    abortRef.current = ctrl

    try {
      await streamChat({
        messages: [...messages, userMsg],
        source_page: typeof window !== 'undefined' ? window.location.pathname + window.location.hash : '/chatbot',
        onDelta: upsert,
        onDone: () => setIsLoading(false),
        onError: (err) => {
          toast.error(err)
          setIsLoading(false)
        },
        signal: ctrl.signal,
      })
    } catch (e: any) {
      if (e?.name !== 'AbortError') toast.error('Connection error. Please try again.')
      setIsLoading(false)
    }
  }, [isLoading, messages])

  const reset = () => {
    abortRef.current?.abort()
    setMessages([])
    setInput('')
    setIsLoading(false)
    try { localStorage.removeItem(STORAGE_KEY) } catch { /* ignore */ }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-full bg-foreground text-primary-foreground flex items-center justify-center shadow-lg hover:opacity-90 gentle-animation cursor-pointer"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-[100] w-[calc(100vw-32px)] sm:w-[380px] h-[min(540px,75vh)] bg-card rounded-2xl clean-border elevated-shadow flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-5 py-4 border-b border-border bg-foreground text-primary-foreground rounded-t-2xl flex items-center justify-between">
            <div>
              <div className="font-display text-lg font-bold leading-tight">Silicon Valley Luxe</div>
              <p className="text-primary-foreground/60 text-xs">Your Bay Area property concierge</p>
            </div>
            {messages.length > 0 && (
              <button
                onClick={reset}
                className="opacity-60 hover:opacity-100 transition-opacity p-1.5 rounded-md"
                aria-label="Reset conversation"
                title="Reset conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-sm py-4">
                <p className="font-medium text-foreground mb-1">Welcome 👋</p>
                <p className="text-muted-foreground mb-4">
                  Ask me about neighborhoods, market trends, or pick a starter:
                </p>
                <div className="flex flex-col gap-2">
                  {STARTERS.map((s) => (
                    <button
                      key={s.label}
                      onClick={() => sendText(s.text)}
                      className="text-left text-sm px-3 py-2 rounded-xl bg-secondary hover:bg-secondary/70 clean-border gentle-animation"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-foreground text-primary-foreground rounded-br-md'
                      : 'bg-secondary text-foreground rounded-bl-md'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <div className="prose prose-sm max-w-none [&>p]:m-0 [&>p+p]:mt-2 [&_a]:underline [&_a]:font-medium">
                      <ReactMarkdown
                        components={{
                          a: ({ href, children }) => {
                            if (href && href.startsWith('/')) {
                              return <Link to={href} onClick={() => setIsOpen(false)}>{children}</Link>
                            }
                            return <a href={href} target="_blank" rel="noreferrer">{children}</a>
                          },
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role === 'user' && (
              <div className="flex justify-start">
                <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-2.5">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-border">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                id="chatbot-message-input"
                aria-label="Chat message"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendText(input)}
                placeholder="Ask about Atherton, jumbo loans, listings…"
                maxLength={500}
                className="flex-1 px-4 py-2.5 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm"
              />
              <button
                onClick={() => sendText(input)}
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 rounded-xl bg-foreground text-primary-foreground flex items-center justify-center hover:opacity-90 disabled:opacity-40 gentle-animation cursor-pointer flex-shrink-0"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
