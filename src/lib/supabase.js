import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: 'implicit',
  },
})

export async function sendNotification({ to_user_id, title, body, data = {} }) {
  try {
    await supabase.functions.invoke('send-notification', {
      body: { to_user_id, title, body, data },
    })
  } catch {
    // Never block the UI if a notification fails
  }
}
