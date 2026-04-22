-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.venues enable row level security;
alter table public.specials enable row level security;
alter table public.venue_ratings enable row level security;
alter table public.special_ratings enable row level security;
alter table public.communities enable row level security;
alter table public.community_members enable row level security;
alter table public.beacons enable row level security;
alter table public.beacon_responses enable row level security;
alter table public.community_polls enable row level security;
alter table public.poll_options enable row level security;
alter table public.poll_votes enable row level security;

-- ============================================================
-- PROFILES
-- ============================================================
create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

-- ============================================================
-- VENUES & SPECIALS (public read, admin-only write via service key)
-- ============================================================
create policy "Venues are viewable by everyone"
  on public.venues for select using (true);

create policy "Specials are viewable by everyone"
  on public.specials for select using (true);

-- ============================================================
-- VENUE RATINGS
-- ============================================================
create policy "Venue ratings are viewable by everyone"
  on public.venue_ratings for select using (true);

create policy "Authenticated users can insert their own venue rating"
  on public.venue_ratings for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own venue rating"
  on public.venue_ratings for update
  using (auth.uid() = user_id);

create policy "Users can delete their own venue rating"
  on public.venue_ratings for delete
  using (auth.uid() = user_id);

-- ============================================================
-- SPECIAL RATINGS
-- ============================================================
create policy "Special ratings are viewable by everyone"
  on public.special_ratings for select using (true);

create policy "Authenticated users can insert their own special rating"
  on public.special_ratings for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own special rating"
  on public.special_ratings for update
  using (auth.uid() = user_id);

create policy "Users can delete their own special rating"
  on public.special_ratings for delete
  using (auth.uid() = user_id);

-- ============================================================
-- COMMUNITIES
-- ============================================================
create policy "Public communities are viewable by everyone"
  on public.communities for select
  using (is_public or exists (
    select 1 from public.community_members
    where community_id = communities.id and user_id = auth.uid()
  ));

create policy "Authenticated users can create communities"
  on public.communities for insert
  with check (auth.uid() = created_by);

-- ============================================================
-- COMMUNITY MEMBERS
-- ============================================================
create policy "Members can view their community members"
  on public.community_members for select
  using (exists (
    select 1 from public.community_members cm
    where cm.community_id = community_members.community_id and cm.user_id = auth.uid()
  ));

create policy "Users can join communities"
  on public.community_members for insert
  with check (auth.uid() = user_id);

-- ============================================================
-- BEACONS
-- ============================================================
create policy "Beacons visible to relevant users"
  on public.beacons for select
  using (
    community_id is null
    or exists (
      select 1 from public.community_members
      where community_id = beacons.community_id and user_id = auth.uid()
    )
  );

create policy "Authenticated users can create beacons"
  on public.beacons for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own beacons"
  on public.beacons for delete
  using (auth.uid() = user_id);

-- ============================================================
-- BEACON RESPONSES
-- ============================================================
create policy "Beacon responses visible to relevant users"
  on public.beacon_responses for select
  using (exists (
    select 1 from public.beacons b
    where b.id = beacon_responses.beacon_id
    and (b.community_id is null or exists (
      select 1 from public.community_members
      where community_id = b.community_id and user_id = auth.uid()
    ))
  ));

create policy "Authenticated users can respond to beacons"
  on public.beacon_responses for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own beacon response"
  on public.beacon_responses for update
  using (auth.uid() = user_id);

-- ============================================================
-- POLLS
-- ============================================================
create policy "Polls visible to community members"
  on public.community_polls for select
  using (exists (
    select 1 from public.community_members
    where community_id = community_polls.community_id and user_id = auth.uid()
  ));

create policy "Members can create polls"
  on public.community_polls for insert
  with check (auth.uid() = created_by and exists (
    select 1 from public.community_members
    where community_id = community_polls.community_id and user_id = auth.uid()
  ));

create policy "Poll options visible to community members"
  on public.poll_options for select
  using (exists (
    select 1 from public.community_polls p
    join public.community_members cm on cm.community_id = p.community_id
    where p.id = poll_options.poll_id and cm.user_id = auth.uid()
  ));

create policy "Poll votes visible to community members"
  on public.poll_votes for select
  using (exists (
    select 1 from public.community_polls p
    join public.community_members cm on cm.community_id = p.community_id
    where p.id = poll_votes.poll_id and cm.user_id = auth.uid()
  ));

create policy "Members can vote"
  on public.poll_votes for insert
  with check (auth.uid() = user_id);
