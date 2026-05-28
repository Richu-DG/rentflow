import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

// This function is called daily by Supabase cron.
// It finds all tenants whose building notify_day matches today
// and who haven't paid for the current month, then sends reminders.
Deno.serve(async () => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

  const today = new Date()
  const todayDay = today.getDate()
  const currentMonth = today.toISOString().slice(0, 7)

  // Find occupied units in buildings where today is the notify_day
  const { data: units, error } = await supabase
    .from('units')
    .select('id, rent, tenant_id, buildings(name, notify_day)')
    .not('tenant_id', 'is', null)

  if (error || !units) {
    return new Response(JSON.stringify({ ok: false, error }), { status: 500 })
  }

  const remindable = units.filter((u: any) => u.buildings?.notify_day === todayDay)
  if (remindable.length === 0) {
    return new Response(JSON.stringify({ ok: true, sent: 0 }))
  }

  // Check which of those haven't paid this month
  const unitIds = remindable.map((u: any) => u.id)
  const { data: paid } = await supabase
    .from('payments')
    .select('unit_id')
    .in('unit_id', unitIds)
    .eq('month', currentMonth)
    .in('status', ['pending', 'confirmed'])

  const paidUnitIds = new Set((paid || []).map((p: any) => p.unit_id))
  const unpaid = remindable.filter((u: any) => !paidUnitIds.has(u.id))

  let sent = 0
  for (const unit of unpaid) {
    await fetch(`${SUPABASE_URL}/functions/v1/send-notification`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to_user_id: unit.tenant_id,
        title: 'Rent Reminder',
        body: `Your rent of KES ${unit.rent.toLocaleString()} for ${unit.buildings.name} is due. Please mark as paid once you've sent via M-Pesa.`,
        data: { type: 'rent_reminder', unit_id: unit.id },
      }),
    })
    sent++
  }

  return new Response(JSON.stringify({ ok: true, sent }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
