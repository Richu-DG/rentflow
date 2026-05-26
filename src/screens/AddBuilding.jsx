import { useState } from 'react'
import { supabase } from '../lib/supabase'

const T = {
  bg: '#0A0A0F', surface: '#13131A', surfaceAlt: '#1C1C26', border: '#2A2A38',
  accent: '#00E5A0', accentDim: '#00E5A022', accentGlow: '#00E5A044',
  info: '#4D9EFF', tp: '#F0F0F8', ts: '#8888AA', tm: '#44445A',
}

const BackIc = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={T.tp} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
)

const CheckIc = () => (
  <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
)

const Inp = ({ label, placeholder, value, onChange, type = 'text' }) => (
  <div style={{ marginBottom: 14 }}>
    {label && <div style={{ fontSize: 12, color: T.ts, marginBottom: 6, fontWeight: 600 }}>{label}</div>}
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{ width: '100%', background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 14, padding: '14px 16px', color: T.tp, fontSize: 15, outline: 'none', boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif" }}
    />
  </div>
)

const Btn = ({ children, onClick, disabled }) => (
  <button onClick={onClick} disabled={disabled}
    style={{ width: '100%', background: disabled ? T.border : T.accent, color: disabled ? T.ts : T.bg, border: 'none', borderRadius: 16, padding: '15px', fontSize: 15, fontWeight: 700, cursor: disabled ? 'default' : 'pointer', marginBottom: 10 }}>
    {children}
  </button>
)

const ord = d => `${d}${d === 1 ? 'st' : d === 2 ? 'nd' : d === 3 ? 'rd' : 'th'}`

export default function AddBuilding({ profile, onBack, onSaved }) {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [defaultRent, setDefaultRent] = useState('')
  const [unitCount, setUnitCount] = useState('')
  const [unitNames, setUnitNames] = useState([])
  const [dueDay, setDueDay] = useState(1)
  const [notifyDay, setNotifyDay] = useState(5)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const confirmCount = () => {
    const c = parseInt(unitCount)
    if (c > 0 && c <= 50) {
      setUnitNames(Array.from({ length: c }, (_, i) => `House ${i + 1}`))
      setStep(3)
    }
  }

  const save = async () => {
    setSaving(true)
    setError('')

    // Insert building
    const { data: building, error: bErr } = await supabase
      .from('buildings')
      .insert({ landlord_id: profile.id, name, location, due_day: dueDay, notify_day: notifyDay })
      .select()
      .single()

    if (bErr) { setError(bErr.message); setSaving(false); return }

    // Insert units
    const units = unitNames.map(n => ({
      building_id: building.id,
      name: n,
      rent: parseInt(defaultRent) || 0,
    }))

    const { error: uErr } = await supabase.from('units').insert(units)
    if (uErr) { setError(uErr.message); setSaving(false); return }

    setSaving(false)
    setDone(true)
    setTimeout(() => onSaved(), 1500)
  }

  // Success screen
  if (done) return (
    <div style={{ minHeight: '100vh', background: `radial-gradient(ellipse at 50% 30%, ${T.accentGlow} 0%, ${T.bg} 60%)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: 32 }}>
      <div style={{ width: 80, height: 80, borderRadius: 24, background: T.accentDim, border: `1px solid ${T.accent}44`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CheckIc />
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color: T.tp }}>Building Created!</div>
      <div style={{ fontSize: 14, color: T.ts, textAlign: 'center' }}>
        <span style={{ color: T.accent, fontWeight: 700 }}>{name}</span> with {unitNames.length} units is ready.
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', flexDirection: 'column', fontFamily: "'DM Sans', sans-serif" }}>

      {/* Header */}
      <div style={{ padding: '20px 24px', background: `linear-gradient(180deg,${T.accentGlow} 0%,transparent 100%)`, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div onClick={step === 1 ? onBack : () => setStep(step - 1)}
            style={{ width: 40, height: 40, background: T.surface, borderRadius: 12, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <BackIc />
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: T.tp }}>Add Building</div>
            <div style={{ fontSize: 12, color: T.ts }}>Step {step} of 4</div>
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ height: 3, background: T.border, borderRadius: 2 }}>
          <div style={{ height: '100%', background: T.accent, width: `${(step / 4) * 100}%`, transition: 'width 0.4s ease', borderRadius: 2 }} />
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 24px 40px' }}>

        {error && (
          <div style={{ background: '#FF4D6A22', border: '1px solid #FF4D6A44', borderRadius: 12, padding: '12px 16px', color: '#FF4D6A', fontSize: 13, marginBottom: 16 }}>
            {error}
          </div>
        )}

        {/* Step 1 — Building details */}
        {step === 1 && <>
          <div style={{ fontSize: 22, fontWeight: 800, color: T.tp, marginBottom: 6 }}>Building Details</div>
          <div style={{ fontSize: 14, color: T.ts, marginBottom: 24 }}>Name your building and set a default rent</div>
          <Inp label="Building Name" placeholder="e.g. Sunset Apartments" value={name} onChange={setName} />
          <Inp label="Location" placeholder="e.g. Westlands, Nairobi" value={location} onChange={setLocation} />
          <Inp label="Default Monthly Rent (KES)" placeholder="e.g. 25000" type="number" value={defaultRent} onChange={setDefaultRent} />
          <Btn onClick={() => setStep(2)} disabled={!name.trim()}>Continue →</Btn>
        </>}

        {/* Step 2 — Unit count */}
        {step === 2 && <>
          <div style={{ fontSize: 22, fontWeight: 800, color: T.tp, marginBottom: 6 }}>Set Up Units</div>
          <div style={{ fontSize: 14, color: T.ts, marginBottom: 24 }}>
            How many units does <span style={{ color: T.accent }}>{name}</span> have?
          </div>
          <Inp label="Number of Units" placeholder="e.g. 12 (max 50)" type="number" value={unitCount} onChange={setUnitCount} />
          <div style={{ background: T.surfaceAlt, borderRadius: 14, border: `1px solid ${T.border}`, padding: '14px 16px', marginBottom: 24, fontSize: 13, color: T.ts, lineHeight: 1.7 }}>
            💡 Units will be auto-named <span style={{ color: T.accent }}>House 1, House 2...</span> — you can rename them in the next step.
          </div>
          <Btn onClick={confirmCount} disabled={!(parseInt(unitCount) > 0 && parseInt(unitCount) <= 50)}>Continue →</Btn>
        </>}

        {/* Step 3 — Unit names */}
        {step === 3 && <>
          <div style={{ fontSize: 22, fontWeight: 800, color: T.tp, marginBottom: 6 }}>Name Your Units</div>
          <div style={{ fontSize: 14, color: T.ts, marginBottom: 20 }}>Customise or keep the defaults</div>
          {unitNames.map((n, i) => (
            <Inp key={i} label={`Unit ${i + 1}`} placeholder={`Unit ${i + 1} name`} value={n}
              onChange={val => { const c = [...unitNames]; c[i] = val; setUnitNames(c) }} />
          ))}
          <Btn onClick={() => setStep(4)}>Continue →</Btn>
        </>}

        {/* Step 4 — Schedule */}
        {step === 4 && <>
          <div style={{ fontSize: 22, fontWeight: 800, color: T.tp, marginBottom: 6 }}>Payment Schedule</div>
          <div style={{ fontSize: 14, color: T.ts, marginBottom: 24 }}>Set due date and notification day</div>

          <div style={{ background: T.surface, borderRadius: 16, border: `1px solid ${T.border}`, padding: 16, marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.tp, marginBottom: 12 }}>📅 Rent Due Day</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {[1, 2, 3, 5, 10, 15, 20, 25, 28].map(d => (
                <div key={d} onClick={() => setDueDay(d)}
                  style={{ width: 44, height: 44, borderRadius: 12, background: dueDay === d ? T.accent : T.surfaceAlt, border: `1px solid ${dueDay === d ? T.accent : T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: dueDay === d ? T.bg : T.ts, cursor: 'pointer', transition: 'all 0.2s' }}>
                  {d}
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: T.surface, borderRadius: 16, border: `1px solid ${T.border}`, padding: 16, marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.tp, marginBottom: 4 }}>🔔 Notify Me On Day</div>
            <div style={{ fontSize: 12, color: T.tm, marginBottom: 12 }}>You get a summary of unpaid units on this day</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {[1, 2, 3, 4, 5, 6, 7, 10, 14].map(d => (
                <div key={d} onClick={() => setNotifyDay(d)}
                  style={{ width: 44, height: 44, borderRadius: 12, background: notifyDay === d ? T.info : T.surfaceAlt, border: `1px solid ${notifyDay === d ? T.info : T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: notifyDay === d ? '#fff' : T.ts, cursor: 'pointer', transition: 'all 0.2s' }}>
                  {d}
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div style={{ background: T.accentDim, borderRadius: 14, border: `1px solid ${T.accent}44`, padding: 16, marginBottom: 24, fontSize: 13, color: T.accent, lineHeight: 1.9 }}>
            📅 Rent due on the <strong>{ord(dueDay)}</strong> each month<br />
            🔔 Notified on day <strong>{notifyDay}</strong> with unpaid summary<br />
            🏢 <strong>{unitNames.length}</strong> units · Default KES <strong>{parseInt(defaultRent) ? parseInt(defaultRent).toLocaleString() : '0'}</strong>
          </div>

          <Btn onClick={save} disabled={saving}>
            {saving ? 'Creating...' : '🏢 Create Building'}
          </Btn>
        </>}
      </div>
    </div>
  )
}
