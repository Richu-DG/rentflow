import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const T = {
  bg: '#0A0A0F', surface: '#13131A', surfaceAlt: '#1C1C26', border: '#2A2A38',
  accent: '#00E5A0', accentDim: '#00E5A022', accentGlow: '#00E5A044',
  info: '#4D9EFF', tp: '#F0F0F8', ts: '#8888AA', tm: '#44445A',
  paid: '#00E5A0', pending: '#FFB800', overdue: '#FF4D6A',
}

const BackIc = () => <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={T.tp} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
const PlusIc = () => <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
const ChevR = () => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={T.ts} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
const SearchIc = () => <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={T.tm} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" /></svg>
const EditIc = () => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
const ChatIc = () => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>

const ord = d => `${d}${d === 1 ? 'st' : d === 2 ? 'nd' : d === 3 ? 'rd' : 'th'}`

const Pill = ({ status }) => {
  const m = {
    confirmed: { bg: T.accentDim, c: T.paid, l: 'Paid' },
    pending:   { bg: '#FFB80022', c: T.pending, l: 'Pending' },
    rejected:  { bg: '#FF4D6A22', c: T.overdue, l: 'Overdue' },
    vacant:    { bg: T.surfaceAlt, c: T.ts, l: 'Vacant' },
  }
  const s = m[status] || m.vacant
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', background: s.bg, color: s.c, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>
      {s.l}
    </span>
  )
}

export default function BuildingDetail({ building: buildingProp, onBack, onNavigate, profile }) {
  const [building, setBuilding] = useState(buildingProp)
  const [units, setUnits] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [editModal, setEditModal] = useState(false)
  const [editName, setEditName] = useState(building.name)
  const [editLocation, setEditLocation] = useState(building.location || '')
  const [editDueDay, setEditDueDay] = useState(building.due_day)
  const [editNotifyDay, setEditNotifyDay] = useState(building.notify_day)
  const [saving, setSaving] = useState(false)
  const [confirmingAll, setConfirmingAll] = useState(false)

  const confirmAll = async () => {
    const currentMonth = new Date().toISOString().slice(0, 7)
    const pendingUnits = units.filter(u => u.paymentStatus === 'pending')
    if (pendingUnits.length === 0) return
    setConfirmingAll(true)
    const paymentIds = pendingUnits.map(u => u.currentPayment?.id).filter(Boolean)
    if (paymentIds.length > 0) {
      await supabase
        .from('payments')
        .update({ status: 'confirmed', confirmed_at: new Date().toISOString() })
        .in('id', paymentIds)
    }
    await fetchUnits()
    setConfirmingAll(false)
  }

  const openEdit = () => {
    setEditName(building.name)
    setEditLocation(building.location || '')
    setEditDueDay(building.due_day)
    setEditNotifyDay(building.notify_day)
    setEditModal(true)
  }

  const saveEdit = async () => {
    setSaving(true)
    const { data, error } = await supabase
      .from('buildings')
      .update({ name: editName.trim(), location: editLocation.trim(), due_day: editDueDay, notify_day: editNotifyDay })
      .eq('id', building.id)
      .select()
      .single()
    if (!error && data) setBuilding(data)
    setSaving(false)
    setEditModal(false)
  }

  useEffect(() => { fetchUnits() }, [building.id])

  const fetchUnits = async () => {
    const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM

    const { data: unitsData } = await supabase
      .from('units')
      .select('*, payments(*)')
      .eq('building_id', building.id)
      .order('name')

    // Fetch tenant profiles for occupied units
    const tenantIds = (unitsData || []).map(u => u.tenant_id).filter(Boolean)
    let profileMap = {}
    if (tenantIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', tenantIds)
      profileMap = Object.fromEntries((profiles || []).map(p => [p.id, p.full_name]))
    }

    const enriched = (unitsData || []).map(u => {
      const thisMonth = (u.payments || []).find(p => p.month === currentMonth)
      return {
        ...u,
        paymentStatus: u.tenant_id ? (thisMonth?.status || 'pending') : 'vacant',
        currentPayment: thisMonth || null,
        tenantName: u.tenant_id ? (profileMap[u.tenant_id] || 'Tenant') : null,
      }
    })

    setUnits(enriched)
    setLoading(false)
  }

  const filtered = units.filter(u => {
    const matchFilter = filter === 'all' || u.paymentStatus === filter
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) ||
      (u.tenant_name || '').toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const counts = {
    all: units.length,
    confirmed: units.filter(u => u.paymentStatus === 'confirmed').length,
    pending: units.filter(u => u.paymentStatus === 'pending').length,
    rejected: units.filter(u => u.paymentStatus === 'rejected').length,
  }

  const statusColor = s => s === 'confirmed' ? T.paid : s === 'rejected' ? T.overdue : s === 'vacant' ? T.ts : T.pending
  const statusBg = s => s === 'confirmed' ? T.accentDim : s === 'rejected' ? '#FF4D6A22' : s === 'vacant' ? T.surfaceAlt : '#FFB80022'

  if (loading) return (
    <div style={{ padding: 24, color: T.ts }}>Loading...</div>
  )

  return (
    <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', flexDirection: 'column', fontFamily: "'DM Sans', sans-serif" }}>

      {/* Header */}
      <div style={{ padding: '20px 24px', background: `linear-gradient(180deg,${T.accentGlow} 0%,transparent 100%)`, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div onClick={onBack} style={{ width: 40, height: 40, background: T.surface, borderRadius: 12, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <BackIc />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: T.tp }}>{building.name}</div>
              <div style={{ fontSize: 12, color: T.ts }}>{building.location}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div onClick={openEdit}
              style={{ width: 36, height: 36, background: T.surfaceAlt, borderRadius: 10, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <EditIc />
            </div>
            <div onClick={() => onNavigate('addUnit', building)}
              style={{ width: 36, height: 36, background: T.accentDim, borderRadius: 10, border: `1px solid ${T.accent}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <PlusIc />
            </div>
          </div>
        </div>

        {/* Community chat button */}
        <div onClick={() => onNavigate('buildingChat', { building })}
          style={{ display: 'flex', alignItems: 'center', gap: 10, background: T.accentDim, border: `1px solid ${T.accent}33`, borderRadius: 14, padding: '12px 16px', cursor: 'pointer', marginBottom: 14 }}>
          <ChatIc />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.accent }}>Community Chat</div>
            <div style={{ fontSize: 11, color: T.ts }}>Message all tenants in {building.name}</div>
          </div>
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 14 }}>
          <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}><SearchIc /></div>
          <input placeholder="Search units or tenants..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 14, padding: '12px 16px 12px 42px', color: T.tp, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
        </div>

        {/* Filter tabs + confirm all */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none', alignItems: 'center' }}>
          {[['all', 'All'], ['confirmed', 'Paid'], ['pending', 'Pending'], ['rejected', 'Overdue']].map(([val, label]) => (
            <div key={val} onClick={() => setFilter(val)}
              style={{ flexShrink: 0, padding: '7px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: filter === val ? T.accent : T.surfaceAlt, color: filter === val ? T.bg : T.ts, transition: 'all 0.2s' }}>
              {label} ({counts[val] ?? units.length})
            </div>
          ))}
          {counts.pending > 0 && (
            <div onClick={confirmAll}
              style={{ flexShrink: 0, marginLeft: 'auto', padding: '7px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: T.accentDim, border: `1px solid ${T.accent}44`, color: T.accent }}>
              {confirmingAll ? 'Confirming...' : `Confirm All (${counts.pending})`}
            </div>
          )}
        </div>
      </div>

      {/* Unit list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 24px 32px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🏠</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: T.tp, marginBottom: 6 }}>
              {units.length === 0 ? 'No units yet' : `No ${filter} units`}
            </div>
            <div style={{ fontSize: 13, color: T.ts }}>
              {units.length === 0 ? 'Tap + to add the first unit.' : 'No units match this filter.'}
            </div>
          </div>
        ) : filtered.map(unit => (
          <div key={unit.id}
            style={{ background: T.surface, borderRadius: 16, border: `1px solid ${unit.paymentStatus === 'pending' ? T.pending + '44' : T.border}`, padding: 16, marginBottom: 12 }}>
            <div onClick={() => onNavigate('unit', { unit, building })}
              style={{ display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}>
              <div style={{ width: 46, height: 46, borderRadius: 14, background: statusBg(unit.paymentStatus), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: statusColor(unit.paymentStatus), flexShrink: 0 }}>
                {unit.name.charAt(unit.name.length - 1)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: T.tp }}>{unit.name}</div>
                <div style={{ fontSize: 12, color: T.ts, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {unit.tenantName || 'Vacant'}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.tp, marginTop: 2 }}>
                  KES {unit.rent.toLocaleString()}
                  {unit.currentPayment?.mpesa_ref && (
                    <span style={{ color: T.ts, fontWeight: 400 }}> · {unit.currentPayment.mpesa_ref}</span>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                <Pill status={unit.paymentStatus} />
                <ChevR />
              </div>
            </div>
            {unit.paymentStatus === 'pending' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
                <button onClick={async (e) => {
                  e.stopPropagation()
                  await supabase.from('payments').update({ status: 'confirmed', confirmed_at: new Date().toISOString() }).eq('id', unit.currentPayment.id)
                  setUnits(prev => prev.map(u => u.id === unit.id ? { ...u, paymentStatus: 'confirmed', currentPayment: { ...u.currentPayment, status: 'confirmed' } } : u))
                }}
                  style={{ background: T.accentDim, border: `1px solid ${T.accent}44`, borderRadius: 10, padding: '9px', color: T.accent, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                  ✓ Confirm
                </button>
                <button onClick={async (e) => {
                  e.stopPropagation()
                  await supabase.from('payments').update({ status: 'rejected' }).eq('id', unit.currentPayment.id)
                  setUnits(prev => prev.map(u => u.id === unit.id ? { ...u, paymentStatus: 'rejected', currentPayment: { ...u.currentPayment, status: 'rejected' } } : u))
                }}
                  style={{ background: '#FF4D6A18', border: `1px solid ${T.overdue}44`, borderRadius: 10, padding: '9px', color: T.overdue, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                  ✗ Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Edit building modal */}
      {editModal && (
        <div style={{ position: 'fixed', inset: 0, background: '#000000BB', display: 'flex', alignItems: 'flex-end', zIndex: 100 }}
          onClick={() => setEditModal(false)}>
          <div style={{ background: T.surface, borderRadius: '24px 24px 0 0', padding: '28px 24px 48px', width: '100%', boxSizing: 'border-box', maxWidth: 480, margin: '0 auto' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ width: 40, height: 4, background: T.border, borderRadius: 2, margin: '0 auto 24px' }} />
            <div style={{ fontSize: 20, fontWeight: 800, color: T.tp, marginBottom: 20 }}>Edit Building</div>

            {[['Building Name', editName, setEditName], ['Location', editLocation, setEditLocation]].map(([label, val, setter]) => (
              <div key={label} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, color: T.ts, marginBottom: 6, fontWeight: 600 }}>{label}</div>
                <input value={val} onChange={e => setter(e.target.value)}
                  style={{ width: '100%', background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 14, padding: '14px 16px', color: T.tp, fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
              </div>
            ))}

            <div style={{ fontSize: 12, color: T.ts, marginBottom: 8, fontWeight: 600 }}>Rent Due Day</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {[1, 2, 3, 5, 10, 15, 20, 25, 28].map(d => (
                <div key={d} onClick={() => setEditDueDay(d)}
                  style={{ width: 44, height: 44, borderRadius: 12, background: editDueDay === d ? T.accent : T.surfaceAlt, border: `1px solid ${editDueDay === d ? T.accent : T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: editDueDay === d ? T.bg : T.ts, cursor: 'pointer' }}>
                  {d}
                </div>
              ))}
            </div>

            <div style={{ fontSize: 12, color: T.ts, marginBottom: 8, fontWeight: 600 }}>Notify Day</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
              {[1, 2, 3, 4, 5, 6, 7, 10, 14].map(d => (
                <div key={d} onClick={() => setEditNotifyDay(d)}
                  style={{ width: 44, height: 44, borderRadius: 12, background: editNotifyDay === d ? '#4D9EFF' : T.surfaceAlt, border: `1px solid ${editNotifyDay === d ? '#4D9EFF' : T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: editNotifyDay === d ? '#fff' : T.ts, cursor: 'pointer' }}>
                  {d}
                </div>
              ))}
            </div>

            <button onClick={saveEdit} disabled={saving || !editName.trim()}
              style={{ width: '100%', background: saving || !editName.trim() ? T.border : T.accent, color: T.bg, border: 'none', borderRadius: 16, padding: 15, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: 10 }}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button onClick={() => setEditModal(false)}
              style={{ width: '100%', background: 'transparent', color: T.ts, border: `1px solid ${T.border}`, borderRadius: 16, padding: 15, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
