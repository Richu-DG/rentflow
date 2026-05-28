create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid references units(id) on delete cascade,
  sender_id uuid references profiles(id),
  body text not null,
  created_at timestamptz default now(),
  read_at timestamptz
);

alter table messages enable row level security;

-- Landlord of the building or tenant of the unit can read and write
create policy "unit participants can manage messages"
  on messages for all using (
    unit_id in (
      select u.id from units u
      join buildings b on u.building_id = b.id
      where b.landlord_id = auth.uid() or u.tenant_id = auth.uid()
    )
  );
