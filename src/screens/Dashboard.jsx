import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const T = {
  bg: '#0A0A0F', surface: '#13131A', surfaceAlt: '#1C1C26', border: '#2A2A38',
  accent: '#00E5A0', accentDim: '#00E5A022', accentGlow: '#00E5A044',
  tp: '#F0F0F8', ts: '#8888AA', tm: '#44445A',
  paid: '#00E5A0', pending: '#FFB800', overdue: '#FF4D6A',
}

const ChevR = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={T.ts} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6" />
  </svg>
)

const BuildIc = () => (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 21V7l8-4 8 4v14M9 21v-6h6v6" />
  </svg>
)

export default function Dashboard({ profile, onNavigate }) {
  const [buildings, setBuildings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBuildings()
  }, [])

  const fetchBuildings = async () => {
    const currentMonth = new Date().toISOString().slice(0, 7)

    const { data } = await supabase
      .from('buildings')
      .select(`*, units(*, payments(status, month))`)
      .eq('landlord_id', profile.id)
      .order('created_at', { ascending: false })

    // Attach this month's payment status to each unit
    const enriched = (data || []).map(b => ({
      ...b,
      units: (b.units || []).map(u => {
        const thisMonth = (u.payments || []).find(p => p.month === currentMonth)
        return { ...u, paymentStatus: u.tenant_id ? (thisMonth?.status || 'pending') : 'vacant' }
      })
    }))

    setBuildings(enriched)
    setLoading(false)
  }

  const allUnits = buildings.flatMap(b => b.units || [])
  const paid = allUnits.filter(u => u.paymentStatus === 'confirmed').length
  const total = allUnits.filter(u => u.paymentStatus !== 'vacant').length
  const pct = total > 0 ? Math.round((paid / total) * 100) : 0
  const totalCollected = allUnits.filter(u => u.paymentStatus === 'confirmed').reduce((s, u) => s + u.rent, 0)
  const totalExpected = allUnits.filter(u => u.paymentStatus !== 'vacant').reduce((s, u) => s + u.rent, 0)

  if (loading) return (
    <div style={{ padding: 24, color: T.ts, fontSize: 14 }}>Loading...</div>
  )

  return (
    <div style={{ paddingBottom: 24 }}>
      <div style={{ padding: '20px 24px 0', background: `linear-gradient(180deg,${T.accentGlow} 0%,transparent 100%)` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 13, color: T.ts, marginBottom: 4 }}>Good day 👋</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: T.tp }}>{profile.full_name}</div>
          </div>
        </div>

        {/* Summary ring — only show if buildings exist */}
        {total > 0 && (
          <div style={{ background: T.surface, borderRadius: 18, border: `1px solid ${T.border}`, padding: 20, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
                <svg width="80" height="80" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="32" fill="none" stroke={T.border} strokeWidth="8" />
                  <circle cx="40" cy="40" r="32" fill="none" stroke={T.accent} strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 32}`}
                    strokeDashoffset={`${2 * Math.PI * 32 * (1 - pct / 100)}`}
                    strokeLinecap="round" transform="rotate(-90 40 40)" />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: T.accent }}>{pct}%</span>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 17, fontWeight: 700, color: T.tp, marginBottom: 2 }}>This Month</div>
                <div style={{ fontSize: 13, color: T.ts, marginBottom: 6 }}>
                  KES {totalCollected.toLocaleString()} / {totalExpected.toLocaleString()}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[[paid, T.paid, T.accentDim, 'Paid'],
                    [allUnits.filter(u => u.paymentStatus === 'pending').length, T.pending, '#FFB80018', 'Pend.'],
                    [allUnits.filter(u => u.paymentStatus === 'rejected').length, T.overdue, '#FF4D6A18', 'Late']
                  ].map(([v, c, bg, l]) => (
                    <div key={l} style={{ flex: 1, background: bg, borderRadius: 10, padding: '6px 10px', textAlign: 'center' }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: c }}>{v}</div>
                      <div style={{ fontSize: 10, color: T.tm }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: '0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <span style={{ fontSize: 17, fontWeight: 700, color: T.tp }}>My Buildings</span>
          <span onClick={() => onNavigate('addBuilding')}
            style={{ fontSize: 13, color: T.accent, fontWeight: 600, cursor: 'pointer' }}>+ Add</span>
        </div>

        {buildings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🏢</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: T.tp, marginBottom: 8 }}>No buildings yet</div>
            <div style={{ fontSize: 14, color: T.ts, marginBottom: 24, lineHeight: 1.6 }}>
              Add your first building to start tracking rent payments from your tenants.
            </div>
            <button onClick={() => onNavigate('addBuilding')}
              style={{ background: T.accent, color: T.bg, border: 'none', borderRadius: 16, padding: '14px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
              🏢 Add Your First Building
            </button>
          </div>
        ) : buildings.map(b => {
          const units = b.units || []
          const occupied = units.filter(u => u.paymentStatus !== 'vacant')
          const bPaid = units.filter(u => u.paymentStatus === 'confirmed').length
          const bOverdue = units.filter(u => u.paymentStatus === 'rejected').length
          const bPct = occupied.length > 0 ? Math.round((bPaid / occupied.length) * 100) : 0
          return (
            <div key={b.id} onClick={() => onNavigate('building', b)}
              style={{ background: T.surface, borderRadius: 18, border: `1px solid ${T.border}`, padding: 16, marginBottom: 14, cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                <div style={{ width: 44, height: 44, background: T.accentDim, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BuildIc />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: T.tp }}>{b.name}</div>
                  <div style={{ fontSize: 12, color: T.ts }}>{b.location}</div>
                </div>
                <ChevR />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 13, color: T.ts }}>{units.length} units · {bPaid} paid</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {bOverdue > 0 && (
                    <span style={{ background: '#FF4D6A22', color: T.overdue, borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>
                      ⚠ {bOverdue} late
                    </span>
                  )}
                  <span style={{ background: T.accentDim, color: T.accent, borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>
                    {bPct}%
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
