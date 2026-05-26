import { supabase } from '../lib/supabase'

const T = {
  surface: '#13131A', surfaceAlt: '#1C1C26', border: '#2A2A38',
  accent: '#00E5A0', accentDim: '#00E5A022',
  tp: '#F0F0F8', ts: '#8888AA', tm: '#44445A', overdue: '#FF4D6A',
}

export default function ProfileScreen({ profile, session }) {
  const signOut = () => supabase.auth.signOut()

  return (
    <div style={{ padding: '24px 24px 40px', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: T.tp, marginBottom: 24 }}>Profile</div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        <div style={{ width: 64, height: 64, borderRadius: 20, background: `linear-gradient(135deg,${T.accent},#00B8FF)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: '#0A0A0F' }}>
          {profile.full_name?.[0] || '?'}
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: T.tp }}>{profile.full_name}</div>
          <div style={{ fontSize: 13, color: T.ts }}>{session.user.email}</div>
          <div style={{ fontSize: 12, color: T.accent, marginTop: 3, fontWeight: 600, textTransform: 'capitalize' }}>{profile.role}</div>
        </div>
      </div>

      <div style={{ background: T.surface, borderRadius: 18, border: `1px solid ${T.border}`, padding: 16, marginBottom: 20 }}>
        {[['Full Name', profile.full_name], ['Email', session.user.email], ['Role', profile.role]].map(([l, v], i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 2 ? `1px solid ${T.border}` : 'none' }}>
            <div style={{ fontSize: 13, color: T.ts }}>{l}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.tp, textTransform: i === 2 ? 'capitalize' : 'none' }}>{v}</div>
          </div>
        ))}
      </div>

      <button onClick={signOut} style={{ width: '100%', background: '#FF4D6A18', color: T.overdue, border: `1.5px solid ${T.overdue}44`, borderRadius: 16, padding: '14px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
        Sign Out
      </button>
    </div>
  )
}
