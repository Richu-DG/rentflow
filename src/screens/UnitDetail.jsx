import { useState, useEffect } from 'react'
import { supabase, sendNotification } from '../lib/supabase'

const T = {
  bg: '#0A0A0F', surface: '#13131A', surfaceAlt: '#1C1C26', border: '#2A2A38',
  accent: '#00E5A0', accentDim: '#00E5A022', accentGlow: '#00E5A044',
  tp: '#F0F0F8', ts: '#8888AA', tm: '#44445A',
  paid: '#00E5A0', pending: '#FFB800', overdue: '#FF4D6A',
}

const BackIc = () => <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={T.tp} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
const CheckIc = ({ size = 14, color = '#fff' }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
const CopyIc = () => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M8 4H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2M8 4h8M8 4a2 2 0 012-2h4a2 2 0 012 2" /></svg>

const Pill = ({ status }) => {
  const m = {
    confirmed: { bg: T.accentDim, c: T.paid, l: 'Paid' },
    pending:   { bg: '#FFB80022', c: T.pending, l: 'Pending' },
    rejected:  { bg: '#FF4D6A22', c: T.overdue, l: 'Rejected' },
    unpaid:    { bg: '#FF4D6A18', c: T.overdue, l: 'Unpaid' },
    vacant:    { bg: T.surfaceAlt, c: T.ts, l: 'Vacant' },
  }
  const s = m[status] || m.vacant
  return <span style={{ display: 'inline-flex', background: s.bg, color: s.c, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>{s.l}</span>
}

function buildMonthSlots(unitCreatedAt, payments, currentMonth) {
  const start = new Date(unitCreatedAt)
  const slots = []
  const cursor = new Date(start.getFullYear(), start.getMonth(), 1)
  const [cy, cm] = currentMonth.split('-').map(Number)

  while (cursor.getFullYear() < cy || (cursor.getFullYear() === cy && cursor.getMonth() + 1 <= cm)) {
    const month = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`
    const label = cursor.toLocaleString('en-KE', { month: 'long', year: 'numeric' })
    const payment = payments.find(p => p.month === month) || null
    const isPast = month < currentMonth
    slots.push({ month, label, payment, status: payment?.status || (isPast ? 'unpaid' : 'current') })
    cursor.setMonth(cursor.getMonth() + 1)
  }

  return slots.reverse()
}

export default function UnitDetail({ unit, building, onBack, onNavigate }) {
  const [monthSlots, setMonthSlots] = useState([])
  const [currentPayment, setCurrentPayment] = useState(null)
  const [tenantProfile, setTenantProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [confirming, setConfirming] = useState(false)
  const [copied, setCopied] = useState(false)

  const currentMonth = new Date().toISOString().slice(0, 7)
  const inviteLink = `rentflow.app/join/${unit.invite_code}`

  useEffect(() => { fetchData() }, [unit.id])

  const fetchData = async () => {
    const { data: pays } = await supabase
      .from('payments')
      .select('*')
      .eq('unit_id', unit.id)
      .order('month', { ascending: false })

    const slots = buildMonthSlots(unit.created_at, pays || [], currentMonth)
    setMonthSlots(slots)
    setCurrentPayment((pays || []).find(p => p.month === currentMonth) || null)

    // Fetch tenant profile if assigned
    if (unit.tenant_id) {
      const { data: tenant } = await supabase
        .from('profiles')
        .select('full_name, phone')
        .eq('id', unit.tenant_id)
        .single()
      setTenantProfile(tenant)
    }

    setLoading(false)
  }

  const confirmPayment = async (action) => {
    if (!currentPayment) return
    setConfirming(true)
    const { error } = await supabase
      .from('payments')
      .update({
        status: action,
        confirmed_at: action === 'confirmed' ? new Date().toISOString() : null,
      })
      .eq('id', currentPayment.id)

    if (!error) {
      const updated = { ...currentPayment, status: action }
      setCurrentPayment(updated)
      setMonthSlots(prev => prev.map(s =>
        s.payment?.id === currentPayment.id ? { ...s, payment: updated, status: action } : s
      ))

      if (unit.tenant_id) {
        const isConfirmed = action === 'confirmed'
        sendNotification({
          to_user_id: unit.tenant_id,
          title: isConfirmed ? 'Payment Confirmed ✓' : 'Payment Rejected',
          body: isConfirmed
            ? `Your rent for ${unit.name} has been confirmed by your landlord.`
            : `Your rent payment for ${unit.name} was rejected. Please contact your landlord.`,
          data: { type: `payment_${action}`, unit_id: unit.id },
        })
      }
    }
    setConfirming(false)
  }

  const copyCode = () => {
    navigator.clipboard?.writeText(unit.invite_code).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const paymentStatus = unit.tenant_id
    ? (currentPayment?.status || 'pending')
    : 'vacant'

  if (loading) return <div style={{ padding: 24, color: T.ts }}>Loading...</div>

  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: "'DM Sans', sans-serif" }}>

      {/* Header */}
      <div style={{ padding: '20px 24px', background: `linear-gradient(180deg,${T.accentGlow} 0%,transparent 100%)` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div onClick={onBack} style={{ width: 40, height: 40, background: T.surface, borderRadius: 12, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <BackIc />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: T.tp }}>{unit.name}</div>
              <div style={{ fontSize: 12, color: T.ts }}>{building.name}</div>
            </div>
          </div>
          <Pill status={paymentStatus} />
        </div>
      </div>

      <div style={{ padding: '0 24px 40px', overflowY: 'auto' }}>

        {/* Unit info card */}
        <div style={{ background: T.surface, borderRadius: 18, border: `1px solid ${T.border}`, padding: 20, marginBottom: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              ['Rent', `KES ${unit.rent.toLocaleString()}`],
              ['Due Date', `${building.due_day}${building.due_day === 1 ? 'st' : building.due_day === 2 ? 'nd' : building.due_day === 3 ? 'rd' : 'th'} of month`],
              ['Tenant', tenantProfile?.full_name || 'Not assigned'],
              ['Phone', tenantProfile?.phone || '—'],
            ].map(([l, v]) => (
              <div key={l} style={{ background: T.bg, borderRadius: 12, padding: '10px 14px' }}>
                <div style={{ fontSize: 11, color: T.tm, marginBottom: 4 }}>{l}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.tp }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending confirmation card */}
        {currentPayment?.status === 'pending' && (
          <div style={{ background: '#FFB80011', borderRadius: 16, border: `1px solid ${T.pending}44`, padding: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.pending, marginBottom: 4 }}>⏳ Tenant marked as paid</div>
            {currentPayment.mpesa_ref && (
              <div style={{ fontSize: 13, color: T.ts, marginBottom: 14 }}>
                M-Pesa Ref: <span style={{ color: T.tp, fontWeight: 600 }}>{currentPayment.mpesa_ref}</span>
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button onClick={() => confirmPayment('confirmed')} disabled={confirming}
                style={{ background: T.accentDim, border: `1px solid ${T.accent}`, borderRadius: 12, padding: 12, color: T.accent, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                ✓ Confirm
              </button>
              <button onClick={() => confirmPayment('rejected')} disabled={confirming}
                style={{ background: '#FF4D6A18', border: `1px solid ${T.overdue}`, borderRadius: 12, padding: 12, color: T.overdue, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                ✗ Reject
              </button>
            </div>
          </div>
        )}

        {/* Confirmed card */}
        {currentPayment?.status === 'confirmed' && (
          <div style={{ background: T.accentDim, borderRadius: 16, border: `1px solid ${T.accent}44`, padding: 16, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, background: T.accent, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <CheckIc size={18} color={T.bg} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.accent }}>Payment Confirmed</div>
              <div style={{ fontSize: 12, color: T.ts }}>
                {currentPayment.mpesa_ref ? `Ref: ${currentPayment.mpesa_ref}` : `Confirmed for ${currentMonth}`}
              </div>
            </div>
          </div>
        )}

        {/* Invite section */}
        <div style={{ background: T.surface, borderRadius: 16, border: `1px solid ${T.border}`, padding: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.tp, marginBottom: 12 }}>📨 Tenant Invite</div>
          <div style={{ background: T.bg, borderRadius: 12, padding: '12px 16px', marginBottom: 12, textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: T.ts, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Invite Code</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: T.accent, letterSpacing: 6 }}>{unit.invite_code}</div>
          </div>
          <button onClick={copyCode}
            style={{ width: '100%', background: copied ? T.accent : T.accentDim, border: `1px solid ${T.accent}44`, borderRadius: 12, padding: 12, color: copied ? T.bg : T.accent, fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s' }}>
            {copied ? <><CheckIc size={16} color={T.bg} /> Copied!</> : <><CopyIc /> Copy Code</>}
          </button>
          <div style={{ fontSize: 12, color: T.tm, marginTop: 10, lineHeight: 1.6 }}>
            Share this code with your tenant. They enter it in the RentFlow app to link to this unit.
          </div>
        </div>

        {/* Arrears summary */}
        {unit.tenant_id && (() => {
          const unpaidSlots = monthSlots.filter(s => s.status === 'unpaid')
          const arrearsTotal = unpaidSlots.length * unit.rent
          if (unpaidSlots.length === 0) return null
          return (
            <div style={{ background: '#FF4D6A12', borderRadius: 16, border: `1px solid ${T.overdue}33`, padding: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.overdue, marginBottom: 4 }}>
                ⚠ {unpaidSlots.length} month{unpaidSlots.length > 1 ? 's' : ''} unpaid
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: T.tp }}>
                KES {arrearsTotal.toLocaleString()} <span style={{ fontSize: 13, fontWeight: 400, color: T.ts }}>in arrears</span>
              </div>
            </div>
          )
        })()}

        {/* Payment history */}
        <div style={{ fontSize: 17, fontWeight: 700, color: T.tp, marginBottom: 14 }}>Payment History</div>
        {monthSlots.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: T.ts, fontSize: 14 }}>No history yet.</div>
        ) : monthSlots.map((s, i) => (
          <div key={s.month} style={{ display: 'flex', alignItems: 'center', padding: '14px 0', borderBottom: i < monthSlots.length - 1 ? `1px solid ${T.border}` : 'none' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: s.status === 'unpaid' ? T.overdue : T.tp }}>{s.label}</div>
              <div style={{ fontSize: 12, color: T.ts }}>
                {s.payment?.mpesa_ref ? `Ref: ${s.payment.mpesa_ref}` : s.status === 'unpaid' ? 'No payment recorded' : '—'}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.tp, marginBottom: 4 }}>KES {unit.rent.toLocaleString()}</div>
              <Pill status={s.status === 'current' ? 'pending' : s.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
