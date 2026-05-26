-- Profiles
create table if not exists profiles (
  id uuid references auth.users primary key,
  full_name text,
  phone text,
  role text check (role in ('landlord','tenant')),
  created_at timestamptz default now()
);

-- Buildings
create table if not exists buildings (
  id uuid primary key default gen_random_uuid(),
  landlord_id uuid references profiles(id) on delete cascade,
  name text not null,
  location text,
  due_day int default 1,
  notify_day int default 5,
  created_at timestamptz default now()
);

-- Units
create table if not exists units (
  id uuid primary key default gen_random_uuid(),
  building_id uuid references buildings(id) on delete cascade,
  name text not null,
  rent int not null,
  tenant_id uuid references profiles(id) on delete set null,
  invite_code text unique default upper(substring(gen_random_uuid()::text,1,8)),
  created_at timestamptz default now()
);

-- Payments
create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid references units(id) on delete cascade,
  tenant_id uuid references profiles(id),
  month text not null,
  amount int not null,
  status text default 'pending' check (status in ('pending','confirmed','rejected')),
  mpesa_ref text,
  marked_at timestamptz default now(),
  confirmed_at timestamptz,
  created_at timestamptz default now(),
  unique(unit_id, month)
);

-- Row Level Security
alter table profiles enable row level security;
alter table buildings enable row level security;
alter table units enable row level security;
alter table payments enable row level security;

-- Drop existing policies to avoid conflicts
drop policy if exists "users manage own profile" on profiles;
drop policy if exists "users see own profile" on profiles;
drop policy if exists "landlord manages own buildings" on buildings;
drop policy if exists "landlord sees own buildings" on buildings;
drop policy if exists "landlord manages own units" on units;
drop policy if exists "landlord sees own units" on units;
drop policy if exists "tenant sees assigned unit" on units;
drop policy if exists "landlord manages payments for own units" on payments;
drop policy if exists "landlord sees payments for their units" on payments;
drop policy if exists "tenant manages own payments" on payments;
drop policy if exists "tenant sees own payments" on payments;

-- Recreate policies
create policy "users manage own profile"
  on profiles for all using (id = auth.uid());

create policy "landlord manages own buildings"
  on buildings for all using (landlord_id = auth.uid());

create policy "landlord manages own units"
  on units for all using (
    building_id in (select id from buildings where landlord_id = auth.uid())
  );

create policy "tenant sees assigned unit"
  on units for select using (tenant_id = auth.uid());

create policy "landlord manages payments for own units"
  on payments for all using (
    unit_id in (
      select u.id from units u
      join buildings b on u.building_id = b.id
      where b.landlord_id = auth.uid()
    )
  );

create policy "tenant manages own payments"
  on payments for all using (tenant_id = auth.uid());
