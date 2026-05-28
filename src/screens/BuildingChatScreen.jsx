import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

const T = {
  bg: '#0A0A0F', surface: '#13131A', surfaceAlt: '#1C1C26', border: '#2A2A38',
  accent: '#00E5A0', accentDim: '#00E5A022', accentGlow: '#00E5A044',
  tp: '#F0F0F8', ts: '#8888AA', tm: '#44445A', overdue: '#FF4D6A',
}

const BackIc = () => <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={T.tp} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
const SendIc = () => <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={T.bg} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" /></svg>

const COLORS = ['#00E5A0', '#4D9EFF', '#FFB800', '#FF6B9D', '#A78BFA', '#FB923C']
const nameColor = (name) => COLORS[name?.charCodeAt(0) % COLORS.length] || COLORS[0]

const Avatar = ({ name, size = 32 }) => (
  <div style={{
    width: size, height: size, borderRadius: size / 2, flexShrink: 0,
    background: nameColor(name) + '33', border: `1.5px solid ${nameColor(name)}55`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: size * 0.4, fontWeight: 800, color: nameColor(name),
  }}>
    {name?.charAt(0).toUpperCase()}
  </div>
)

export default function BuildingChatScreen({ building, profile, onBack }) {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [memberCount, setMemberCount] = useState(0)
  const bottomRef = useRef(null)

  useEffect(() => {
    fetchMessages()
    fetchMemberCount()

    const channel = supabase
      .channel(`building_chat:${building.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'building_messages',
        filter: `building_id=eq.${building.id}`,
      }, payload => {
        setMessages(prev => [...prev, payload.new])
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [building.id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('building_messages')
      .select('*')
      .eq('building_id', building.id)
      .order('created_at', { ascending: true })
    setMessages(data || [])
  }

  const fetchMemberCount = async () => {
    const { count } = await supabase
      .from('units')
      .select('*', { count: 'exact', head: true })
      .eq('building_id', building.id)
      .not('tenant_id', 'is', null)
    setMemberCount((count || 0) + 1) // +1 for landlord
  }

  const send = async () => {
    if (!text.trim() || sending) return
    setSending(true)
    const body = text.trim()
    setText('')
    await supabase.from('building_messages').insert({
      building_id: building.id,
      sender_id: profile.id,
      sender_name: profile.full_name,
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

  const showSenderLabel = (i) => {
    if (i === 0) return true
    return messages[i].sender_id !== messages[i - 1].sender_id
  }

  const showTime = (i) => {
    if (i === 0) return true
    return new Date(messages[i].created_at) - new Date(messages[i - 1].created_at) > 5 * 60 * 1000
  }

  return (
    <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', flexDirection: 'column', fontFamily: "'DM Sans', sans-serif" }}>

      {/* Header */}
      <div style={{ padding: '20px 24px 16px', background: `linear-gradient(180deg,${T.accentGlow} 0%,transparent 100%)`, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div onClick={onBack} style={{ width: 40, height: 40, background: T.surface, borderRadius: 12, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <BackIc />
          </div>
          <div style={{ width: 40, height: 40, background: T.accentDim, borderRadius: 12, border: `1px solid ${T.accent}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
            🏢
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: T.tp }}>{building.name}</div>
            <div style={{ fontSize: 12, color: T.ts }}>{memberCount} member{memberCount !== 1 ? 's' : ''}</div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: T.tp, marginBottom: 6 }}>Building Chat</div>
            <div style={{ fontSize: 13, color: T.ts, lineHeight: 1.6 }}>
              Everyone in {building.name} can chat here — announcements, maintenance notices, community updates.
            </div>
          </div>
        )}

        {messages.map((m, i) => {
          const isMine = m.sender_id === profile.id
          return (
            <div key={m.id}>
              {showTime(i) && (
                <div style={{ textAlign: 'center', fontSize: 11, color: T.tm, margin: '12px 0 6px' }}>
                  {formatTime(m.created_at)}
                </div>
              )}
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', justifyContent: isMine ? 'flex-end' : 'flex-start', marginTop: showSenderLabel(i) && !isMine ? 8 : 2 }}>
                {!isMine && showSenderLabel(i) && <Avatar name={m.sender_name} />}
                {!isMine && !showSenderLabel(i) && <div style={{ width: 32 }} />}
                <div style={{ maxWidth: '72%' }}>
                  {!isMine && showSenderLabel(i) && (
                    <div style={{ fontSize: 11, fontWeight: 700, color: nameColor(m.sender_name), marginBottom: 3, marginLeft: 4 }}>
                      {m.sender_name}
                    </div>
                  )}
                  <div style={{
                    padding: '10px 14px',
                    borderRadius: isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: isMine ? T.accent : T.surface,
                    border: isMine ? 'none' : `1px solid ${T.border}`,
                    color: isMine ? T.bg : T.tp,
                    fontSize: 14, lineHeight: 1.5,
                  }}>
                    {m.body}
                  </div>
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
            placeholder="Message the building..."
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
              justifyContent: 'center', cursor: text.trim() ? 'pointer' : 'default',
              flexShrink: 0, transition: 'background 0.2s',
            }}>
            <SendIc />
          </button>
        </div>
      </div>
    </div>
  )
}
