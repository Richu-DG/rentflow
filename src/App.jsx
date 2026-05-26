import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { App as CapApp } from '@capacitor/app'
import { Browser } from '@capacitor/browser'
import { Capacitor } from '@capacitor/core'
import AuthScreen from './screens/AuthScreen'
import AppShell from './screens/AppShell'

async function handleOAuthCallback(url) {
  try { await Browser.close() } catch (_) {}

  // Implicit flow: tokens arrive in the URL hash fragment
  const hash = url.split('#')[1]
  if (hash) {
    const params = new URLSearchParams(hash)
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')
    if (accessToken) {
      const { error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
      if (error) console.error('setSession error:', error.message)
      return
    }
  }

  // Fallback: PKCE code exchange
  const { error } = await supabase.auth.exchangeCodeForSession(url)
  if (error) console.error('exchangeCode error:', error.message)
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

    // Cold start: app launched directly via deep link
    CapApp.getLaunchUrl().then(result => {
      if (result?.url?.startsWith('app.rentflow.app://auth/callback')) {
        handleOAuthCallback(result.url)
      }
    })

    // Warm start: app already in background
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
