import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

const T = {
  bg: '#0A0A0F', surface: '#13131A', surfaceAlt: '#1C1C26', border: '#2A2A38',
  accent: '#00E5A0', accentDim: '#00E5A022', accentGlow: '#00E5A044',
  tp: '#F0F0F8', ts: '#8888AA', tm: '#44445A',
}

const BackIc = () => <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={T.tp} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
const SendIc = () => <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={T.bg} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" /></svg>

export default function MessagesScreen({ unit, building, profile, onBack }) {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [otherName, setOtherName] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    fetchMessages()
    fetchOtherName()

    const channel = supabase
      .channel(`messages:${unit.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `unit_id=eq.${unit.id}`,
      }, payload => {
        setMessages(prev => [...prev, payload.new])
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [unit.id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('unit_id', unit.id)
      .order('created_at', { ascending: true })
    setMessages(data || [])

    // Mark unread messages as read
    const unread = (data || []).filter(m => m.sender_id !== profile.id && !m.read_at)
    if (unread.length > 0) {
      await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .in('id', unread.map(m => m.id))
    }
  }

  const fetchOtherName = async () => {
    const otherId = profile.role === 'tenant' ? building.landlord_id : unit.tenant_id
    if (!otherId) return
    const { data } = await supabase.from('profiles').select('full_name').eq('id', otherId).single()
    if (data) setOtherName(data.full_name)
  }

  const send = async () => {
    if (!text.trim() || sending) return
    setSending(true)
    const body = text.trim()
    setText('')
    await supabase.from('messages').insert({
      unit_id: unit.id,
      sender_id: profile.id,
      body,
    })
    setSending(false)
  }

  const formatTime = (ts) => {
    const d = new Date(ts)
    const now = new Date()
    const isToday = d.toDateString() === now.toDateString()
    if (isToday) return d.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })
    return d.toLocaleDateString('en-KE', { day: 'numeric', month: 'short' }) + ' ' +
      d.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', flexDirection: 'column', fontFamily: "'DM Sans', sans-serif" }}>

      {/* Header */}
      <div style={{ padding: '20px 24px 16px', background: `linear-gradient(180deg,${T.accentGlow} 0%,transparent 100%)`, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div onClick={onBack} style={{ width: 40, height: 40, background: T.surface, borderRadius: 12, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <BackIc />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: T.tp }}>{otherName || (profile.role === 'tenant' ? 'Landlord' : 'Tenant')}</div>
            <div style={{ fontSize: 12, color: T.ts }}>{building.name} · {unit.name}</div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: T.ts, fontSize: 14 }}>
            No messages yet. Send a message to get started.
          </div>
        )}
        {messages.map((m, i) => {
          const isMine = m.sender_id === profile.id
          const showTime = i === 0 || i === messages.length - 1 ||
            new Date(m.created_at) - new Date(messages[i - 1].created_at) > 5 * 60 * 1000
          return (
            <div key={m.id}>
              {showTime && (
                <div style={{ textAlign: 'center', fontSize: 11, color: T.tm, margin: '8px 0 4px' }}>
                  {formatTime(m.created_at)}
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '75%', padding: '10px 14px', borderRadius: isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: isMine ? T.accent : T.surface,
                  border: isMine ? 'none' : `1px solid ${T.border}`,
                  color: isMine ? T.bg : T.tp,
                  fontSize: 14, lineHeight: 1.5,
                }}>
                  {m.body}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '12px 16px 32px', background: T.surface, borderTop: `1px solid ${T.border}`, flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <textarea
            placeholder="Type a message..."
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
            rows={1}
            style={{
              flex: 1, background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 16,
              padding: '12px 16px', color: T.tp, fontSize: 14, outline: 'none', resize: 'none',
              fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5,
            }}
          />
          <button onClick={send} disabled={!text.trim() || sending}
            style={{
              width: 44, height: 44, background: text.trim() ? T.accent : T.border,
              border: 'none', borderRadius: 14, display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: text.trim() ? 'pointer' : 'default', flexShrink: 0,
              transition: 'background 0.2s',
            }}>
            <SendIc />
          </button>
        </div>
      </div>
    </div>
  )
}
