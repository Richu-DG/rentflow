import { useState } from 'react'
import { supabase } from '../lib/supabase'

const T = {
  bg: '#0A0A0F', surface: '#13131A', surfaceAlt: '#1C1C26', border: '#2A2A38',
  accent: '#00E5A0', accentDim: '#00E5A022', accentGlow: '#00E5A044',
  tp: '#F0F0F8', ts: '#8888AA', tm: '#44445A',
}

const BackIc = () => <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={T.tp} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
const CheckIc = () => <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>

export default function AddUnit({ building, onBack, onSaved }) {
  const [unitName, setUnitName] = useState('')
  const [rent, setRent] = useState(building?.units?.[0]?.rent?.toString() || '')
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const save = async () => {
    if (!unitName.trim() || !rent) return
    setSaving(true)
    setError('')
    const { error } = await supabase.from('units').insert({
      building_id: building.id,
      name: unitName.trim(),
      rent: parseInt(rent),
    })
    if (error) { setError(error.message); setSaving(false); return }
    setDone(true)
    setTimeout(() => onSaved(), 1400)
  }

  if (done) return (
    <div style={{ minHeight: '100vh', background: `radial-gradient(ellipse at 50% 30%, ${T.accentGlow} 0%, ${T.bg} 60%)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: 32 }}>
      <div style={{ width: 80, height: 80, borderRadius: 24, background: T.accentDim, border: `1px solid ${T.accent}44`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CheckIc />
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color: T.tp }}>Unit Added!</div>
      <div style={{ fontSize: 14, color: T.ts }}>
        <span style={{ color: T.accent, fontWeight: 700 }}>{unitName}</span> added to {building.name}
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ padding: '20px 24px', background: `linear-gradient(180deg,${T.accentGlow} 0%,transparent 100%)` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div onClick={onBack} style={{ width: 40, height: 40, background: T.surface, borderRadius: 12, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <BackIc />
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: T.tp }}>Add Unit</div>
            <div style={{ fontSize: 12, color: T.ts }}>{building.name}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '24px 24px 40px' }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: T.tp, marginBottom: 6 }}>New Unit</div>
        <div style={{ fontSize: 14, color: T.ts, marginBottom: 24 }}>
          Add a unit to <span style={{ color: T.accent }}>{building.name}</span>
        </div>

        {error && (
          <div style={{ background: '#FF4D6A22', border: '1px solid #FF4D6A44', borderRadius: 12, padding: '12px 16px', color: '#FF4D6A', fontSize: 13, marginBottom: 16 }}>{error}</div>
        )}

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: T.ts, marginBottom: 6, fontWeight: 600 }}>Unit Name</div>
          <input placeholder="e.g. House 7, Unit D, Bedsitter"
            value={unitName} onChange={e => setUnitName(e.target.value)}
            style={{ width: '100%', background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 14, padding: '14px 16px', color: T.tp, fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
        </div>

        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 12, color: T.ts, marginBottom: 6, fontWeight: 600 }}>Monthly Rent (KES)</div>
          <input type="number" placeholder="e.g. 25000"
            value={rent} onChange={e => setRent(e.target.value)}
            style={{ width: '100%', background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 14, padding: '14px 16px', color: T.tp, fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
        </div>

        <div style={{ background: T.surfaceAlt, borderRadius: 14, border: `1px solid ${T.border}`, padding: '14px 16px', marginBottom: 28, fontSize: 13, color: T.ts, lineHeight: 1.7 }}>
          💡 After adding, an invite code is generated automatically. Share it with your tenant from the unit detail screen.
        </div>

        <button onClick={save} disabled={saving || !unitName.trim() || !rent}
          style={{ width: '100%', background: saving || !unitName.trim() || !rent ? T.border : T.accent, color: T.bg, border: 'none', borderRadius: 16, padding: 15, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
          {saving ? 'Adding...' : 'Add Unit'}
        </button>
      </div>
    </div>
  )
}
