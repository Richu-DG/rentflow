create table if not exists building_messages (
  id uuid primary key default gen_random_uuid(),
  building_id uuid references buildings(id) on delete cascade,
  sender_id uuid references profiles(id),
  sender_name text not null,
  body text not null,
  created_at timestamptz default now()
);

alter table building_messages enable row level security;

-- Landlord or any tenant in the building can read and write
create policy "building participants can manage messages"
  on building_messages for all using (
    building_id in (
      select b.id from buildings b where b.landlord_id = auth.uid()
      union
      select u.building_id from units u where u.tenant_id = auth.uid()
    )
  );
