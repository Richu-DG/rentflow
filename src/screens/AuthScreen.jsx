import { useState } from 'react'
import { supabase } from '../lib/supabase'

const T = {
  bg: '#0A0A0F', surface: '#13131A', surfaceAlt: '#1C1C26', border: '#2A2A38',
  accent: '#00E5A0', accentDim: '#00E5A022', accentGlow: '#00E5A044',
  tp: '#F0F0F8', ts: '#8888AA', tm: '#44445A', overdue: '#FF4D6A',
}

const GoogleIc = () => (
  <svg width={20} height={20} viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

export default function AuthScreen() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const signInWithGoogle = async () => {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://tcoaluuomcnrfefokhhn.supabase.co/auth/v1/callback',
        skipBrowserRedirect: false,
      },
    })
    if (error) { setError(error.message); setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', background: `radial-gradient(ellipse at 50% 0%, ${T.accentGlow} 0%, ${T.bg} 60%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 42, fontWeight: 800, color: T.tp, letterSpacing: -1 }}>
            Rent<span style={{ color: T.accent }}>Flow</span>
          </div>
          <div style={{ fontSize: 15, color: T.ts, marginTop: 8 }}>Smart rent tracking for Kenya</div>
        </div>

        {/* Feature hints */}
        {[
          { e: '🏢', t: 'Manage buildings & units' },
          { e: '✅', t: 'Track payments in real time' },
          { e: '🔔', t: 'Get notified on your chosen day' },
        ].map(f => (
          <div key={f.t} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 22, width: 32, textAlign: 'center' }}>{f.e}</div>
            <div style={{ fontSize: 14, color: T.ts, fontWeight: 500 }}>{f.t}</div>
          </div>
        ))}

        <div style={{ marginTop: 40 }}>
          {error && (
            <div style={{ background: '#FF4D6A22', border: `1px solid ${T.overdue}44`, borderRadius: 12, padding: '12px 16px', color: T.overdue, fontSize: 13, marginBottom: 16 }}>
              {error}
            </div>
          )}

          <button onClick={signInWithGoogle} disabled={loading}
            style={{ width: '100%', background: loading ? T.border : '#fff', color: '#1a1a1a', border: 'none', borderRadius: 16, padding: '16px 24px', fontSize: 15, fontWeight: 700, cursor: loading ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, boxShadow: '0 4px 24px #00000033' }}>
            <GoogleIc />
            {loading ? 'Redirecting...' : 'Continue with Google'}
          </button>

          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: T.tm, lineHeight: 1.6 }}>
            By continuing you agree to our Terms of Service.<br />
            Your data is stored securely.
          </div>
        </div>
      </div>
    </div>
  )
}
