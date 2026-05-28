import { useState, useEffect } from 'react'
import { Capacitor } from '@capacitor/core'
import { supabase, sendNotification } from '../lib/supabase'

const shareWhatsApp = (text) => {
  const encoded = encodeURIComponent(text)
  const url = Capacitor.isNativePlatform()
    ? `whatsapp://send?text=${encoded}`
    : `https://wa.me/?text=${encoded}`
  window.open(url, '_blank')
}

const T = {
  bg: '#0A0A0F', surface: '#13131A', surfaceAlt: '#1C1C26', border: '#2A2A38',
  accent: '#00E5A0', accentDim: '#00E5A022', accentGlow: '#00E5A044',
  tp: '#F0F0F8', ts: '#8888AA', tm: '#44445A',
  paid: '#00E5A0', pending: '#FFB800', overdue: '#FF4D6A',
}

const BackIc = () => <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={T.tp} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
const CheckIc = ({ size = 14, color = '#fff' }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
const CopyIc = () => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M8 4H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2M8 4h8M8 4a2 2 0 012-2h4a2 2 0 012 2" /></svg>
const EditIc = () => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>

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

export default function UnitDetail({ unit: unitProp, building, onBack, onNavigate }) {
  const [unit, setUnit] = useState(unitProp)
  const [monthSlots, setMonthSlots] = useState([])
  const [currentPayment, setCurrentPayment] = useState(null)
  const [tenantProfile, setTenantProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [confirming, setConfirming] = useState(false)
  const [copied, setCopied] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [editName, setEditName] = useState(unit.name)
  const [editRent, setEditRent] = useState(String(unit.rent))
  const [editSaving, setEditSaving] = useState(false)
  const [removeModal, setRemoveModal] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const deleteUnit = async () => {
    setDeleting(true)
    const { error } = await supabase.from('units').delete().eq('id', unit.id)
    if (!error) onBack()
    setDeleting(false)
  }

  const saveEdit = async () => {
    setEditSaving(true)
    const { data, error } = await supabase
      .from('units')
      .update({ name: editName.trim(), rent: parseInt(editRent) })
      .eq('id', unit.id)
      .select()
      .single()
    if (!error && data) setUnit(prev => ({ ...prev, name: data.name, rent: data.rent }))
    setEditSaving(false)
    setEditModal(false)
  }

  const removeTenant = async () => {
    setRemoving(true)
    const { error } = await supabase
      .from('units')
      .update({ tenant_id: null })
      .eq('id', unit.id)
    if (!error) {
      setUnit(prev => ({ ...prev, tenant_id: null }))
      setTenantProfile(null)
      setCurrentPayment(null)
      setMonthSlots([])
    }
    setRemoving(false)
    setRemoveModal(false)
  }

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
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div onClick={() => { setEditName(unit.name); setEditRent(String(unit.rent)); setEditModal(true) }}
              style={{ width: 34, height: 34, background: T.surfaceAlt, borderRadius: 10, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <EditIc />
            </div>
            <Pill status={paymentStatus} />
          </div>
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

        {/* Message tenant */}
        {unit.tenant_id && (
          <button onClick={() => onNavigate('messages', { unit, building })}
            style={{ width: '100%', background: T.accentDim, border: `1px solid ${T.accent}33`, borderRadius: 14, padding: '12px', color: T.accent, fontWeight: 600, fontSize: 13, cursor: 'pointer', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
            Message Tenant
          </button>
        )}

        {/* Remove tenant / Delete unit */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          {unit.tenant_id && (
            <button onClick={() => setRemoveModal(true)}
              style={{ flex: 1, background: 'transparent', border: `1px solid ${T.overdue}44`, borderRadius: 14, padding: '12px', color: T.overdue, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
              Remove Tenant
            </button>
          )}
          {!unit.tenant_id && (
            <button onClick={() => setDeleteModal(true)}
              style={{ flex: 1, background: 'transparent', border: `1px solid ${T.overdue}44`, borderRadius: 14, padding: '12px', color: T.overdue, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
              Delete Unit
            </button>
          )}
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
          <div style={{ background: T.accentDim, borderRadius: 16, border: `1px solid ${T.accent}44`, padding: 16, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
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
            <button onClick={() => {
              const month = new Date(currentMonth + '-01').toLocaleString('en-KE', { month: 'long', year: 'numeric' })
              shareWhatsApp(
                `*Rent Receipt — ${building.name}*\n\nUnit: ${unit.name}\nMonth: ${month}\nAmount: KES ${unit.rent.toLocaleString()}${currentPayment.mpesa_ref ? `\nM-Pesa Ref: ${currentPayment.mpesa_ref}` : ''}\nStatus: ✅ Confirmed\n\nThank you for your payment.`
              )
            }}
              style={{ width: '100%', background: '#25D36618', border: '1px solid #25D36633', borderRadius: 12, padding: '10px', color: '#25D366', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
              Send Receipt via WhatsApp
            </button>
          </div>
        )}

        {/* Invite section */}
        <div style={{ background: T.surface, borderRadius: 16, border: `1px solid ${T.border}`, padding: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.tp, marginBottom: 12 }}>📨 Tenant Invite</div>
          <div style={{ background: T.bg, borderRadius: 12, padding: '12px 16px', marginBottom: 12, textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: T.ts, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Invite Code</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: T.accent, letterSpacing: 6 }}>{unit.invite_code}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button onClick={copyCode}
              style={{ background: copied ? T.accent : T.accentDim, border: `1px solid ${T.accent}44`, borderRadius: 12, padding: 12, color: copied ? T.bg : T.accent, fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              {copied ? <><CheckIc size={14} color={T.bg} /> Copied!</> : <><CopyIc /> Copy Code</>}
            </button>
            <button onClick={() => shareWhatsApp(
              `Hi! I'd like you to join RentFlow to track your rent payments.\n\nBuilding: ${building.name}\nUnit: ${unit.name}\nInvite Code: *${unit.invite_code}*\n\nDownload RentFlow and enter this code to get started.`
            )}
              style={{ background: '#25D36622', border: '1px solid #25D36644', borderRadius: 12, padding: 12, color: '#25D366', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              WhatsApp
            </button>
          </div>
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

      {/* Edit unit modal */}
      {editModal && (
        <div style={{ position: 'fixed', inset: 0, background: '#000000BB', display: 'flex', alignItems: 'flex-end', zIndex: 100 }}
          onClick={() => setEditModal(false)}>
          <div style={{ background: T.surface, borderRadius: '24px 24px 0 0', padding: '28px 24px 48px', width: '100%', boxSizing: 'border-box', maxWidth: 480, margin: '0 auto' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ width: 40, height: 4, background: T.border, borderRadius: 2, margin: '0 auto 24px' }} />
            <div style={{ fontSize: 20, fontWeight: 800, color: T.tp, marginBottom: 20 }}>Edit Unit</div>
            {[['Unit Name', editName, setEditName, 'text'], ['Monthly Rent (KES)', editRent, setEditRent, 'number']].map(([label, val, setter, type]) => (
              <div key={label} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, color: T.ts, marginBottom: 6, fontWeight: 600 }}>{label}</div>
                <input type={type} value={val} onChange={e => setter(e.target.value)}
                  style={{ width: '100%', background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 14, padding: '14px 16px', color: T.tp, fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
              </div>
            ))}
            <button onClick={saveEdit} disabled={editSaving || !editName.trim() || !editRent}
              style={{ width: '100%', background: T.accent, color: T.bg, border: 'none', borderRadius: 16, padding: 15, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: 10, marginTop: 10 }}>
              {editSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <button onClick={() => setEditModal(false)}
              style={{ width: '100%', background: 'transparent', color: T.ts, border: `1px solid ${T.border}`, borderRadius: 16, padding: 15, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Delete unit confirmation */}
      {deleteModal && (
        <div style={{ position: 'fixed', inset: 0, background: '#000000BB', display: 'flex', alignItems: 'flex-end', zIndex: 100 }}
          onClick={() => setDeleteModal(false)}>
          <div style={{ background: T.surface, borderRadius: '24px 24px 0 0', padding: '28px 24px 48px', width: '100%', boxSizing: 'border-box', maxWidth: 480, margin: '0 auto' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ width: 40, height: 4, background: T.border, borderRadius: 2, margin: '0 auto 24px' }} />
            <div style={{ fontSize: 20, fontWeight: 800, color: T.tp, marginBottom: 8 }}>Delete Unit?</div>
            <div style={{ fontSize: 14, color: T.ts, marginBottom: 24, lineHeight: 1.6 }}>
              This will permanently delete <span style={{ color: T.tp, fontWeight: 600 }}>{unit.name}</span> and all its payment history. This cannot be undone.
            </div>
            <button onClick={deleteUnit} disabled={deleting}
              style={{ width: '100%', background: T.overdue, color: '#fff', border: 'none', borderRadius: 16, padding: 15, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: 10 }}>
              {deleting ? 'Deleting...' : 'Yes, Delete Unit'}
            </button>
            <button onClick={() => setDeleteModal(false)}
              style={{ width: '100%', background: 'transparent', color: T.ts, border: `1px solid ${T.border}`, borderRadius: 16, padding: 15, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Remove tenant confirmation */}
      {removeModal && (
        <div style={{ position: 'fixed', inset: 0, background: '#000000BB', display: 'flex', alignItems: 'flex-end', zIndex: 100 }}
          onClick={() => setRemoveModal(false)}>
          <div style={{ background: T.surface, borderRadius: '24px 24px 0 0', padding: '28px 24px 48px', width: '100%', boxSizing: 'border-box', maxWidth: 480, margin: '0 auto' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ width: 40, height: 4, background: T.border, borderRadius: 2, margin: '0 auto 24px' }} />
            <div style={{ fontSize: 20, fontWeight: 800, color: T.tp, marginBottom: 8 }}>Remove Tenant?</div>
            <div style={{ fontSize: 14, color: T.ts, marginBottom: 24, lineHeight: 1.6 }}>
              This will vacate <span style={{ color: T.tp, fontWeight: 600 }}>{unit.name}</span> and unlink <span style={{ color: T.tp, fontWeight: 600 }}>{tenantProfile?.full_name || 'the tenant'}</span>. Their payment history stays on record.
            </div>
            <button onClick={removeTenant} disabled={removing}
              style={{ width: '100%', background: T.overdue, color: '#fff', border: 'none', borderRadius: 16, padding: 15, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: 10 }}>
              {removing ? 'Removing...' : 'Yes, Remove Tenant'}
            </button>
            <button onClick={() => setRemoveModal(false)}
              style={{ width: '100%', background: 'transparent', color: T.ts, border: `1px solid ${T.border}`, borderRadius: 16, padding: 15, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
