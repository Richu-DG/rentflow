import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { PushNotifications } from '@capacitor/push-notifications'
import { Capacitor } from '@capacitor/core'
import Dashboard from './Dashboard'
import AddBuilding from './AddBuilding'
import BuildingDetail from './BuildingDetail'
import AddUnit from './AddUnit'
import UnitDetail from './UnitDetail'
import JoinScreen from './JoinScreen'
import TenantHome from './TenantHome'
import ProfileScreen from './ProfileScreen'
import MessagesScreen from './MessagesScreen'

const T = {
  bg: '#0A0A0F', surface: '#13131A', border: '#2A2A38',
  accent: '#00E5A0', accentDim: '#00E5A022', accentGlow: '#00E5A044',
  tp: '#F0F0F8', ts: '#8888AA', tm: '#44445A', overdue: '#FF4D6A',
}

const HomeIc = ({ a }) => <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={a ? T.accent : T.tm} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" /></svg>
const UserIc = ({ a }) => <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={a ? T.accent : T.tm} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" /></svg>

function SetupProfile({ session, onDone }) {
  const [role, setRole] = useState(null)
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const save = async () => {
    if (!role || !fullName.trim()) return
    setLoading(true)
    setError('')
    const { error } = await supabase.from('profiles').upsert({ id: session.user.id, full_name: fullName.trim(), role })
    if (error) { setError(error.message); setLoading(false); return }
    onDone()
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: `radial-gradient(ellipse at 50% 0%, ${T.accentGlow} 0%, ${T.bg} 60%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400, background: T.surface, borderRadius: 24, border: `1px solid ${T.border}`, padding: 32 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: T.tp, marginBottom: 6 }}>One last thing</div>
        <div style={{ fontSize: 14, color: T.ts, marginBottom: 24 }}>Tell us who you are</div>
        {error && <div style={{ background: '#FF4D6A22', border: '1px solid #FF4D6A44', borderRadius: 12, padding: '12px 16px', color: T.overdue, fontSize: 13, marginBottom: 16 }}>{error}</div>}
        <input placeholder="Your full name" value={fullName} onChange={e => setFullName(e.target.value)}
          style={{ width: '100%', background: '#1C1C26', border: `1px solid ${T.border}`, borderRadius: 14, padding: '14px 16px', color: T.tp, fontSize: 15, outline: 'none', marginBottom: 16, display: 'block', boxSizing: 'border-box' }} />
        {[{ id: 'landlord', l: 'Landlord / Manager', s: 'Manage buildings & track payments', e: '🏢' },
          { id: 'tenant', l: 'Tenant / Renter', s: 'View your unit & mark payments', e: '🏠' }
        ].map(r => (
          <div key={r.id} onClick={() => setRole(r.id)}
            style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, borderRadius: 16, marginBottom: 12, cursor: 'pointer', background: role === r.id ? T.accentDim : '#1C1C26', border: `1.5px solid ${role === r.id ? T.accent : T.border}` }}>
            <div style={{ fontSize: 28 }}>{r.e}</div>
            <div><div style={{ fontSize: 15, fontWeight: 700, color: T.tp }}>{r.l}</div><div style={{ fontSize: 12, color: T.ts, marginTop: 2 }}>{r.s}</div></div>
          </div>
        ))}
        <button onClick={save} disabled={loading || !role || !fullName.trim()}
          style={{ width: '100%', background: loading || !role || !fullName.trim() ? T.border : T.accent, color: loading || !role || !fullName.trim() ? T.ts : T.bg, border: 'none', borderRadius: 16, padding: '15px', fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 8 }}>
          {loading ? 'Saving...' : `Continue as ${role === 'landlord' ? 'Landlord' : role === 'tenant' ? 'Tenant' : '...'}`}
        </button>
      </div>
    </div>
  )
}

export default function AppShell({ session }) {
  const [profile, setProfile] = useState(null)
  const [profileLoaded, setProfileLoaded] = useState(false)
  const [hasUnit, setHasUnit] = useState(false)
  const [tab, setTab] = useState('home')
  const [screen, setScreen] = useState('main')
  const [screenData, setScreenData] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const fetchProfile = async () => {
    const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
    setProfile(data)

    // If tenant, check if they have a unit
    if (data?.role === 'tenant') {
      const { data: unit } = await supabase.from('units').select('id').eq('tenant_id', session.user.id).single()
      setHasUnit(!!unit)
    }

    setProfileLoaded(true)
  }

  useEffect(() => { fetchProfile() }, [session])

  useEffect(() => {
    if (!session?.user?.id || !Capacitor.isNativePlatform()) return
    registerPushToken(session.user.id)
  }, [session])

  const registerPushToken = async (userId) => {
    try {
      const { receive } = await PushNotifications.checkPermissions()
      const status = receive === 'granted'
        ? { receive: 'granted' }
        : await PushNotifications.requestPermissions()

      if (status.receive !== 'granted') return

      await PushNotifications.register()

      PushNotifications.addListener('registration', async ({ value: token }) => {
        await supabase.from('device_tokens').upsert(
          { user_id: userId, token, platform: 'android', updated_at: new Date().toISOString() },
          { onConflict: 'user_id' }
        )
      })
    } catch {
      // Silently fail — app works fine without notifications
    }
  }

  const navigate = (to, data = null) => { setScreen(to); setScreenData(data) }
  const goHome = () => { setScreen('main'); setScreenData(null); setTab('home'); setRefreshKey(k => k + 1) }

  if (!profileLoaded) return (
    <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: T.accent, fontSize: 18, fontWeight: 800 }}>Rent<span style={{ color: T.tp }}>Flow</span></div>
    </div>
  )

  if (!profile || !profile.role) return (
    <SetupProfile session={session} onDone={fetchProfile} />
  )

  // Tenant with no unit yet — show join screen
  if (profile.role === 'tenant' && !hasUnit) return (
    <JoinScreen session={session} onJoined={fetchProfile} />
  )

  // Full-screen flows (no bottom nav)
  if (screen === 'addBuilding') return (
    <AddBuilding profile={profile} onBack={goHome} onSaved={goHome} />
  )
  if (screen === 'building') return (
    <BuildingDetail building={screenData} onBack={goHome} onNavigate={navigate} />
  )
  if (screen === 'addUnit') return (
    <AddUnit building={screenData} onBack={() => navigate('building', screenData)} onSaved={() => navigate('building', screenData)} />
  )
  if (screen === 'unit') return (
    <UnitDetail unit={screenData.unit} building={screenData.building} onBack={() => navigate('building', screenData.building)} onNavigate={navigate} />
  )
  if (screen === 'messages') return (
    <MessagesScreen unit={screenData.unit} building={screenData.building} profile={profile} onBack={() => { setScreen('main'); setScreenData(null) }} />
  )

  // Bottom nav tabs
  const navItems = [{ id: 'home', label: 'Home', Icon: HomeIc }, { id: 'profile', label: 'Profile', Icon: UserIc }]

  return (
    <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', flexDirection: 'column', maxWidth: 480, margin: '0 auto', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {tab === 'home' && profile.role === 'landlord' && <Dashboard key={refreshKey} profile={profile} onNavigate={navigate} />}
        {tab === 'home' && profile.role === 'tenant'   && <TenantHome profile={profile} onNavigate={navigate} />}
        {tab === 'profile' && <ProfileScreen profile={profile} session={session} />}
      </div>
      <div style={{ height: 72, background: T.surface, borderTop: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexShrink: 0, paddingBottom: 8 }}>
        {navItems.map(({ id, label, Icon }) => (
          <div key={id} onClick={() => { setTab(id); setScreen('main'); if (id === 'home') setRefreshKey(k => k + 1) }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer', padding: '4px 24px' }}>
            <Icon a={tab === id} />
            <span style={{ fontSize: 10, fontWeight: 600, color: tab === id ? T.accent : T.tm }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
