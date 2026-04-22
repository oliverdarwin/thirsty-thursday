# CLAUDE.md

## Project

Thirsty Thursday — a pub specials directory for Sydney's Eastern Suburbs. Single-page vanilla HTML/CSS/JS app. No build system.

## Tech stack

- **Frontend:** Single `index.html` with inline CSS and JS. No framework, no bundler.
- **Fonts:** Press Start 2P (pixel headers), IBM Plex Mono (body) via Google Fonts CDN
- **Maps:** Leaflet.js 1.9.4 via CDN
- **Backend:** Supabase (auth + PostgreSQL). JS client loaded via CDN. App works fully without Supabase connected (graceful degradation to localStorage).
- **Server:** `npx serve -s . -l $PORT` for local dev
- **Analytics:** GoatCounter

`thursday-specials.jsx` is an older React prototype — not used in production. The live app is `index.html`.

## File structure

- `index.html` — the entire app (HTML + CSS + JS)
- `supabase/migrations/` — database schema (run in order: 001-004)
- `pub-specials-sydney-eastern-suburbs.json` — research data for venue specials
- `.env.example` — required Supabase config values

## Branches

- `main` — production
- `staging` — staging deploy (merge here to preview)
- Feature branches merge into staging or main

**Always `git fetch origin` before looking for or checking out branches.** Do not assume a branch doesn't exist just because it's not in the local branch list.

## Git practices

- Always fetch before claiming a branch doesn't exist
- Commit messages: short summary line, blank line, details if needed
- Don't push to main without asking
- Merge to `staging` when changes need to go live for preview

## How it works

Venue data is hardcoded in `index.html` in the `VENUES` array. Each venue has an id, name, suburb, lat/lng, and specials array. Specials have item, price, and type.

Ratings are dual-mode:
- Anonymous users: localStorage (`tt-ratings` key)
- Authenticated users: Supabase `venue_ratings` and `special_ratings` tables
- localStorage ratings auto-migrate to Supabase on first sign-in

## Supabase setup

To connect Supabase, replace `YOUR_SUPABASE_URL` and `YOUR_SUPABASE_ANON_KEY` at the top of the script block in `index.html`. Run migrations 001-004 in the Supabase SQL editor. The anon key is safe to expose in client code — access is gated by Row Level Security.

## Style guide

- Retro/neon arcade aesthetic. Dark mode default, light mode supported.
- CSS variables defined in `:root` — use them, don't hardcode colours.
- Pixel font (`--font-pixel`) for headings and labels, mono font (`--font-body`) for everything else.
- Keep the bouncer personality in auth UI (pub doorman vibe).

## Planned features

See `TODO.md`. Database tables for beacons and communities are already created (migrations 002) but frontend is not built yet.
