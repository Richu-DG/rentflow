import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { App as CapApp } from '@capacitor/app'
import { Browser } from '@capacitor/browser'
import { Capacitor } from '@capacitor/core'
import AuthScreen from './screens/AuthScreen'
import AppShell from './screens/AppShell'

async function handleOAuthCallback(url) {
  try { await Browser.close() } catch (_) {}
  const { error } = await supabase.auth.exchangeCodeForSession(url)
  if (error) console.error('OAuth exchange error:', error.message)
}

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

    if (!Capacitor.isNativePlatform()) {
      return () => subscription.unsubscribe()
    }

    // Cold start: app was launched directly from the deep link
    CapApp.getLaunchUrl().then(result => {
      if (result?.url?.startsWith('app.rentflow.app://auth/callback')) {
        handleOAuthCallback(result.url)
      }
    })

    // Warm start: app was already running in background
    const listenerPromise = CapApp.addListener('appUrlOpen', ({ url }) => {
      if (url.startsWith('app.rentflow.app://auth/callback')) {
        handleOAuthCallback(url)
      }
    })

    return () => {
      subscription.unsubscribe()
      listenerPromise.then(l => l.remove())
    }
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
