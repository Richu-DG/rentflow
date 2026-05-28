import { useState, useEffect } from 'react'
import { supabase, sendNotification } from '../lib/supabase'

const T = {
  bg: '#0A0A0F', surface: '#13131A', surfaceAlt: '#1C1C26', border: '#2A2A38',
  accent: '#00E5A0', accentDim: '#00E5A022', accentGlow: '#00E5A044',
  tp: '#F0F0F8', ts: '#8888AA', tm: '#44445A',
  paid: '#00E5A0', pending: '#FFB800', overdue: '#FF4D6A',
}

const CheckIc = ({ size = 14, color = '#fff' }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
const KeyIc = () => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" /></svg>

const Pill = ({ status }) => {
  const m = {
    confirmed: { bg: T.accentDim, c: T.paid, l: 'Paid ✓' },
    pending:   { bg: '#FFB80022', c: T.pending, l: 'Awaiting Confirmation' },
    rejected:  { bg: '#FF4D6A22', c: T.overdue, l: 'Rejected' },
    unpaid:    { bg: '#FF4D6A18', c: T.overdue, l: 'Unpaid' },
  }
  const s = m[status] || m.pending
  return <span style={{ background: s.bg, color: s.c, borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 700 }}>{s.l}</span>
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

export default function TenantHome({ profile }) {
  const [unit, setUnit] = useState(null)
  const [building, setBuilding] = useState(null)
  const [currentPayment, setCurrentPayment] = useState(null)
  const [monthSlots, setMonthSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [mpesaRef, setMpesaRef] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const currentMonth = new Date().toISOString().slice(0, 7)
  const monthLabel = new Date().toLocaleString('en-KE', { month: 'long', year: 'numeric' })

  useEffect(() => { fetchData() }, [profile.id])

  const fetchData = async () => {
    const { data: unitData } = await supabase
      .from('units')
      .select('*, buildings(*)')
      .eq('tenant_id', profile.id)
      .single()

    if (!unitData) { setLoading(false); return }

    setUnit(unitData)
    setBuilding(unitData.buildings)

    const { data: pays } = await supabase
      .from('payments')
      .select('*')
      .eq('unit_id', unitData.id)
      .order('month', { ascending: false })

    const slots = buildMonthSlots(unitData.created_at, pays || [], currentMonth)
    setMonthSlots(slots)
    setCurrentPayment((pays || []).find(p => p.month === currentMonth) || null)
    setLoading(false)
  }

  const markAsPaid = async () => {
    setSubmitting(true)
    const { data, error } = await supabase
      .from('payments')
      .upsert({
        unit_id: unit.id,
        tenant_id: profile.id,
        month: currentMonth,
        amount: unit.rent,
        status: 'pending',
        mpesa_ref: mpesaRef.trim() || null,
        marked_at: new Date().toISOString(),
      }, { onConflict: 'unit_id,month' })
      .select()
      .single()

    if (!error && data) {
      setCurrentPayment(data)
      setMonthSlots(prev => prev.map(s =>
        s.month === currentMonth ? { ...s, payment: data, status: data.status } : s
      ))

      // Notify the landlord
      const { data: buildingData } = await supabase
        .from('buildings')
        .select('landlord_id, name')
        .eq('id', building.id)
        .single()

      if (buildingData?.landlord_id) {
        sendNotification({
          to_user_id: buildingData.landlord_id,
          title: 'Payment Marked',
          body: `${profile.full_name} has marked rent for ${unit.name} as paid${mpesaRef.trim() ? ` (Ref: ${mpesaRef.trim()})` : ''}.`,
          data: { type: 'payment_marked', unit_id: unit.id },
        })
      }
    }
    setSubmitting(false)
    setModal(false)
    setMpesaRef('')
  }

  if (loading) return <div style={{ padding: 24, color: T.ts }}>Loading...</div>

  if (!unit) return (
    <div style={{ padding: 24, textAlign: 'center', paddingTop: 80 }}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>🏠</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: T.tp, marginBottom: 8 }}>No unit linked</div>
      <div style={{ fontSize: 14, color: T.ts }}>Ask your landlord for an invite code.</div>
    </div>
  )

  const payStatus = currentPayment?.status || null

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ padding: '20px 24px', background: `linear-gradient(180deg,${T.accentGlow} 0%,transparent 100%)` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 13, color: T.ts, marginBottom: 4 }}>Hello 👋</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: T.tp }}>{profile.full_name}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, color: T.ts }}>{building?.name}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: T.accent }}>{unit.name}</div>
          </div>
        </div>

        {/* Rent card */}
        <div style={{
          background: payStatus === 'confirmed'
            ? `linear-gradient(135deg,${T.accentDim},#00E5A011)`
            : `linear-gradient(135deg,${T.surfaceAlt},${T.surface})`,
          borderRadius: 20, border: `1.5px solid ${payStatus === 'confirmed' ? T.accent + '44' : T.border}`, padding: 20
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 12, color: T.ts, marginBottom: 4 }}>Rent Due</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: T.tp, letterSpacing: -0.5 }}>
                KES {unit.rent.toLocaleString()}
              </div>
              <div style={{ fontSize: 13, color: T.ts, marginTop: 4 }}>{monthLabel}</div>
            </div>
            {payStatus && <Pill status={payStatus} />}
          </div>

          {/* CTA based on state */}
          {!payStatus && (
            <button onClick={() => setModal(true)}
              style={{ width: '100%', background: T.accent, color: T.bg, border: 'none', borderRadius: 14, padding: '14px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
              Mark as Paid
            </button>
          )}

          {payStatus === 'pending' && (
            <div style={{ background: '#FFB80018', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ fontSize: 18 }}>⏳</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.pending }}>Marked as Paid</div>
                <div style={{ fontSize: 11, color: T.ts }}>Awaiting landlord confirmation</div>
              </div>
            </div>
          )}

          {payStatus === 'confirmed' && (
            <div style={{ background: T.accentDim, borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 28, height: 28, background: T.accent, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CheckIc color={T.bg} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.accent }}>Payment Confirmed</div>
                <div style={{ fontSize: 11, color: T.ts }}>
                  {currentPayment?.mpesa_ref ? `Ref: ${currentPayment.mpesa_ref}` : monthLabel}
                </div>
              </div>
            </div>
          )}

          {payStatus === 'rejected' && (
            <div style={{ background: '#FF4D6A18', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ fontSize: 18 }}>❌</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.overdue }}>Payment Rejected</div>
                <div style={{ fontSize: 11, color: T.ts }}>Contact your landlord for details</div>
              </div>
            </div>
          )}
          {payStatus === 'rejected' && (
            <button onClick={() => setModal(true)} style={{ width: '100%', background: T.accent, color: T.bg, border: 'none', borderRadius: 14, padding: '14px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
              Resubmit Payment
            </button>
          )}
        </div>
      </div>

      {/* Unit info */}
      <div style={{ padding: '20px 24px' }}>
        <div style={{ background: T.surface, borderRadius: 16, border: `1px solid ${T.border}`, padding: 16, marginBottom: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[['Building', building?.name], ['Unit', unit.name], ['Location', building?.location], ['Due Date', `${building?.due_day}${building?.due_day === 1 ? 'st' : 'nd'} of month`]].map(([l, v]) => (
              <div key={l}>
                <div style={{ fontSize: 11, color: T.tm, marginBottom: 3 }}>{l}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.tp }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment history — skip current month (shown in card above) */}
        <div style={{ fontSize: 17, fontWeight: 700, color: T.tp, marginBottom: 14 }}>Payment History</div>
        {(() => {
          const pastSlots = monthSlots.filter(s => s.month !== currentMonth)
          if (pastSlots.length === 0) return (
            <div style={{ textAlign: 'center', padding: '24px 0', color: T.ts, fontSize: 14 }}>No history yet.</div>
          )
          return pastSlots.map((s, i) => (
            <div key={s.month} style={{ display: 'flex', alignItems: 'center', padding: '14px 0', borderBottom: i < pastSlots.length - 1 ? `1px solid ${T.border}` : 'none' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: s.status === 'unpaid' ? T.overdue : T.tp }}>{s.label}</div>
                <div style={{ fontSize: 12, color: T.ts }}>
                  {s.payment?.mpesa_ref ? `Ref: ${s.payment.mpesa_ref}` : s.status === 'unpaid' ? 'Not paid' : '—'}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.tp, marginBottom: 4 }}>KES {unit.rent.toLocaleString()}</div>
                <Pill status={s.status} />
              </div>
            </div>
          ))
        })()}
      </div>

      {/* Mark as paid modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: '#000000BB', display: 'flex', alignItems: 'flex-end', zIndex: 100 }}
          onClick={() => setModal(false)}>
          <div style={{ background: T.surface, borderRadius: '24px 24px 0 0', padding: '28px 24px 48px', width: '100%', boxSizing: 'border-box', maxWidth: 480, margin: '0 auto' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ width: 40, height: 4, background: T.border, borderRadius: 2, margin: '0 auto 24px' }} />
            <div style={{ fontSize: 20, fontWeight: 800, color: T.tp, marginBottom: 6 }}>Mark Rent as Paid</div>
            <div style={{ fontSize: 14, color: T.ts, marginBottom: 24 }}>KES {unit.rent.toLocaleString()} — {monthLabel}</div>

            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 12, color: T.ts, marginBottom: 6, fontWeight: 600 }}>M-Pesa Reference (optional)</div>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}><KeyIc /></div>
                <input placeholder="e.g. MPX3928110"
                  value={mpesaRef} onChange={e => setMpesaRef(e.target.value)}
                  style={{ width: '100%', background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 14, padding: '14px 16px 14px 42px', color: T.tp, fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ fontSize: 12, color: T.tm, marginBottom: 24 }}>
              Adding a reference helps your landlord verify faster.
            </div>

            <button onClick={markAsPaid} disabled={submitting}
              style={{ width: '100%', background: submitting ? T.border : T.accent, color: T.bg, border: 'none', borderRadius: 16, padding: 15, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: 10 }}>
              {submitting ? 'Submitting...' : 'Confirm Payment Marked'}
            </button>
            <button onClick={() => setModal(false)}
              style={{ width: '100%', background: 'transparent', color: T.ts, border: `1px solid ${T.border}`, borderRadius: 16, padding: 15, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
