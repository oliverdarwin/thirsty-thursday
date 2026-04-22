-- ============================================================
-- COMMUNITIES
-- ============================================================
create table public.communities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  created_by uuid not null references public.profiles(id) on delete set null,
  invite_code text unique default substr(gen_random_uuid()::text, 1, 8),
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.community_members (
  community_id uuid not null references public.communities(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  joined_at timestamptz not null default now(),
  primary key (community_id, user_id)
);

-- ============================================================
-- BEACONS
-- ============================================================
create table public.beacons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  venue_id integer references public.venues(id) on delete set null,
  community_id uuid references public.communities(id) on delete cascade,
  message text,
  beacon_date date not null default current_date,
  expires_at timestamptz not null default (now() + interval '8 hours'),
  created_at timestamptz not null default now()
);

create index idx_beacons_date on public.beacons(beacon_date);
create index idx_beacons_community on public.beacons(community_id);
create index idx_beacons_user on public.beacons(user_id);

create table public.beacon_responses (
  id uuid primary key default gen_random_uuid(),
  beacon_id uuid not null references public.beacons(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'interested' check (status in ('interested', 'going', 'declined')),
  created_at timestamptz not null default now(),
  unique (beacon_id, user_id)
);

-- ============================================================
-- COMMUNITY POLLS / VOTES
-- ============================================================
create table public.community_polls (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities(id) on delete cascade,
  created_by uuid not null references public.profiles(id) on delete cascade,
  question text not null,
  closes_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.poll_options (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references public.community_polls(id) on delete cascade,
  venue_id integer references public.venues(id) on delete set null,
  label text not null,
  sort_order integer not null default 0
);

create table public.poll_votes (
  poll_id uuid not null references public.community_polls(id) on delete cascade,
  option_id uuid not null references public.poll_options(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (poll_id, user_id)
);
