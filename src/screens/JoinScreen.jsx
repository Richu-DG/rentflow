import { useState } from 'react'
import { supabase } from '../lib/supabase'

const T = {
  bg: '#0A0A0F', surface: '#13131A', surfaceAlt: '#1C1C26', border: '#2A2A38',
  accent: '#00E5A0', accentDim: '#00E5A022', accentGlow: '#00E5A044',
  tp: '#F0F0F8', ts: '#8888AA', tm: '#44445A', overdue: '#FF4D6A',
}

const CheckIc = () => <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>

export default function JoinScreen({ session, onJoined }) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [found, setFound] = useState(null) // unit preview before confirm

  const searchUnit = async () => {
    if (!code.trim()) return
    setLoading(true)
    setError('')

    const { data: unit, error: err } = await supabase
      .from('units')
      .select('*, buildings(name, location, due_day)')
      .eq('invite_code', code.trim().toUpperCase())
      .single()

    if (err || !unit) {
      setError('Code not found. Check the code and try again.')
      setLoading(false)
      return
    }

    if (unit.tenant_id && unit.tenant_id !== session.user.id) {
      setError('This unit already has a tenant assigned.')
      setLoading(false)
      return
    }

    setFound(unit)
    setLoading(false)
  }

  const confirmJoin = async () => {
    setLoading(true)
    setError('')

    const { error } = await supabase
      .from('units')
      .update({ tenant_id: session.user.id })
      .eq('id', found.id)

    if (error) { setError(error.message); setLoading(false); return }
    onJoined()
  }

  // Unit preview / confirm step
  if (found) return (
    <div style={{ minHeight: '100vh', background: `radial-gradient(ellipse at 50% 0%, ${T.accentGlow} 0%, ${T.bg} 60%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: T.tp, letterSpacing: -0.5 }}>
            Rent<span style={{ color: T.accent }}>Flow</span>
          </div>
        </div>

        <div style={{ background: T.surface, borderRadius: 24, border: `1px solid ${T.accent}44`, padding: 24, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <div style={{ width: 64, height: 64, borderRadius: 20, background: T.accentDim, border: `1px solid ${T.accent}44`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckIc />
            </div>
          </div>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: T.ts, marginBottom: 4 }}>Unit found!</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: T.tp }}>{found.name}</div>
            <div style={{ fontSize: 15, color: T.accent, fontWeight: 600, marginTop: 4 }}>{found.buildings?.name}</div>
            <div style={{ fontSize: 13, color: T.ts, marginTop: 2 }}>{found.buildings?.location}</div>
          </div>
          {[['Monthly Rent', `KES ${found.rent.toLocaleString()}`], ['Invite Code', found.invite_code]].map(([l, v]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 13, color: T.ts }}>{l}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.tp }}>{v}</div>
            </div>
          ))}
        </div>

        {error && <div style={{ background: '#FF4D6A22', border: '1px solid #FF4D6A44', borderRadius: 12, padding: '12px 16px', color: T.overdue, fontSize: 13, marginBottom: 12 }}>{error}</div>}

        <button onClick={confirmJoin} disabled={loading}
          style={{ width: '100%', background: loading ? T.border : T.accent, color: T.bg, border: 'none', borderRadius: 16, padding: 15, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: 10 }}>
          {loading ? 'Joining...' : '✓ Confirm — This is my unit'}
        </button>
        <button onClick={() => { setFound(null); setError('') }}
          style={{ width: '100%', background: 'transparent', color: T.ts, border: `1px solid ${T.border}`, borderRadius: 16, padding: 15, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
          Wrong unit — go back
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: `radial-gradient(ellipse at 50% 0%, ${T.accentGlow} 0%, ${T.bg} 60%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: T.tp, letterSpacing: -0.5 }}>
            Rent<span style={{ color: T.accent }}>Flow</span>
          </div>
        </div>

        <div style={{ fontSize: 24, fontWeight: 800, color: T.tp, marginBottom: 8 }}>Join Your Unit</div>
        <div style={{ fontSize: 15, color: T.ts, lineHeight: 1.6, marginBottom: 32 }}>
          Your landlord will share a code with you. Enter it below to link to your unit.
        </div>

        {error && <div style={{ background: '#FF4D6A22', border: '1px solid #FF4D6A44', borderRadius: 12, padding: '12px 16px', color: T.overdue, fontSize: 13, marginBottom: 16 }}>{error}</div>}

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: T.ts, marginBottom: 6, fontWeight: 600 }}>Invite Code</div>
          <input
            placeholder="e.g. AB12CD34"
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            style={{ width: '100%', background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 14, padding: '16px', color: T.accent, fontSize: 22, fontWeight: 800, letterSpacing: 6, outline: 'none', boxSizing: 'border-box', textAlign: 'center', fontFamily: 'monospace' }}
          />
        </div>

        <button onClick={searchUnit} disabled={loading || !code.trim()}
          style={{ width: '100%', background: loading || !code.trim() ? T.border : T.accent, color: T.bg, border: 'none', borderRadius: 16, padding: 15, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
          {loading ? 'Searching...' : 'Find My Unit →'}
        </button>
      </div>
    </div>
  )
}
