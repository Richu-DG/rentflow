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

export default function BuildingDetail({ building, onBack, onNavigate }) {
  const [units, setUnits] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => { fetchUnits() }, [building.id])

  const fetchUnits = async () => {
    const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM

    const { data: unitsData } = await supabase
      .from('units')
      .select('*, payments(*)')
      .eq('building_id', building.id)
      .order('name')

    // Attach current month payment status to each unit
    const enriched = (unitsData || []).map(u => {
      const thisMonth = (u.payments || []).find(p => p.month === currentMonth)
      return {
        ...u,
        paymentStatus: u.tenant_id ? (thisMonth?.status || 'pending') : 'vacant',
        currentPayment: thisMonth || null,
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
          <div onClick={() => onNavigate('addUnit', building)}
            style={{ width: 36, height: 36, background: T.accentDim, borderRadius: 10, border: `1px solid ${T.accent}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <PlusIc />
          </div>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 14 }}>
          <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}><SearchIc /></div>
          <input placeholder="Search units or tenants..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 14, padding: '12px 16px 12px 42px', color: T.tp, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {[['all', 'All'], ['confirmed', 'Paid'], ['pending', 'Pending'], ['rejected', 'Overdue']].map(([val, label]) => (
            <div key={val} onClick={() => setFilter(val)}
              style={{ flexShrink: 0, padding: '7px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: filter === val ? T.accent : T.surfaceAlt, color: filter === val ? T.bg : T.ts, transition: 'all 0.2s' }}>
              {label} ({counts[val] ?? units.length})
            </div>
          ))}
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
          <div key={unit.id} onClick={() => onNavigate('unit', { unit, building })}
            style={{ background: T.surface, borderRadius: 16, border: `1px solid ${T.border}`, padding: 16, marginBottom: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, background: statusBg(unit.paymentStatus), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: statusColor(unit.paymentStatus), flexShrink: 0 }}>
              {unit.name.charAt(unit.name.length - 1)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: T.tp }}>{unit.name}</div>
              <div style={{ fontSize: 12, color: T.ts, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {unit.tenant_id ? 'Tenant assigned' : 'Vacant'}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.tp, marginTop: 2 }}>
                KES {unit.rent.toLocaleString()}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
              <Pill status={unit.paymentStatus} />
              <ChevR />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
