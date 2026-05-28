create table if not exists device_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  token text not null,
  platform text default 'android',
  updated_at timestamptz default now(),
  unique(user_id)
);

alter table device_tokens enable row level security;

create policy "users manage own device token"
  on device_tokens for all using (user_id = auth.uid());

-- Allow edge functions (service role) to read tokens to send notifications
create policy "service role reads all tokens"
  on device_tokens for select using (auth.role() = 'service_role');
