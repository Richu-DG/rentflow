import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import AuthScreen from './screens/AuthScreen'
import AppShell from './screens/AppShell'

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#00E5A0', fontSize: 24, fontWeight: 800, letterSpacing: -0.5 }}>
        Rent<span style={{ color: '#fff' }}>Flow</span>
      </div>
    </div>
  )

  return session ? <AppShell session={session} /> : <AuthScreen />
}
