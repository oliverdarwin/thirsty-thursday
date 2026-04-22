-- ============================================================
-- PROFILES (extends Supabase auth.users)
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- VENUES
-- ============================================================
create table public.venues (
  id integer primary key,
  name text not null,
  suburb text not null,
  lat double precision not null,
  lng double precision not null,
  address text,
  source_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- SPECIALS
-- ============================================================
create table public.specials (
  id integer primary key generated always as identity,
  venue_id integer not null references public.venues(id) on delete cascade,
  item text not null,
  price numeric(6,2) not null,
  type text not null,
  day_of_week text not null default 'Thu',
  time_description text,
  is_always_on boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_specials_venue on public.specials(venue_id);
create index idx_specials_day on public.specials(day_of_week);
create index idx_specials_type on public.specials(type);

-- ============================================================
-- VENUE RATINGS (user rates overall venue, 1-5 stars)
-- ============================================================
create table public.venue_ratings (
  id bigint primary key generated always as identity,
  user_id uuid not null references public.profiles(id) on delete cascade,
  venue_id integer not null references public.venues(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, venue_id)
);

create index idx_venue_ratings_venue on public.venue_ratings(venue_id);

-- ============================================================
-- SPECIAL RATINGS (user rates individual special, 1-5 stars)
-- ============================================================
create table public.special_ratings (
  id bigint primary key generated always as identity,
  user_id uuid not null references public.profiles(id) on delete cascade,
  special_id integer not null references public.specials(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, special_id)
);

create index idx_special_ratings_special on public.special_ratings(special_id);

-- ============================================================
-- AGGREGATE VIEWS
-- ============================================================
create or replace view public.venue_rating_stats as
select
  venue_id,
  count(*) as rating_count,
  round(avg(rating)::numeric, 1) as avg_rating
from public.venue_ratings
group by venue_id;

create or replace view public.special_rating_stats as
select
  special_id,
  count(*) as rating_count,
  round(avg(rating)::numeric, 1) as avg_rating
from public.special_ratings
group by special_id;
