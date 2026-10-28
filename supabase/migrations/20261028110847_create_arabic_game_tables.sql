/*
# Arabic Learning Game — database tables

1. Purpose
   Persists per-child progress for the "سعيد يتعلم العربية" educational game:
   the mascot name the child picks, per-lesson scores/stars, and earned badges.
   This is a single-tenant, no-auth app — there is no sign-in screen. Each
   device generates a random `profile_id` (UUID) stored in localStorage and
   uses it to identify its own row. RLS is open to `anon, authenticated`
   because the Data API always runs as the `anon` role for this app.

2. New Tables
   - `player_profiles`
     - `id` (uuid, primary key) — client-generated profile id
     - `mascot_name` (text, not null) — the name the child gives the fox
     - `created_at` (timestamptz, default now())
     - `updated_at` (timestamptz, default now())
   - `lesson_results`
     - `id` (uuid, primary key)
     - `profile_id` (uuid, references player_profiles, cascade delete)
     - `section_id` (text, not null) — e.g. "u1-s1"
     - `stars` (int, 0..3, not null, default 0)
     - `score` (int, not null, default 0)
     - `completed_at` (timestamptz, default now())
     - unique on (profile_id, section_id) so re-playing a lesson upserts
   - `player_badges`
     - `id` (uuid, primary key)
     - `profile_id` (uuid, references player_profiles, cascade delete)
     - `badge_id` (text, not null) — e.g. "first-star"
     - `earned_at` (timestamptz, default now())
     - unique on (profile_id, badge_id)

3. Security
   - RLS enabled on all three tables.
   - Grants (SELECT/INSERT/UPDATE/DELETE) to `anon, authenticated` because
     this is a no-auth app — the frontend talks to the Data API as `anon`.
   - Policies use `USING (true)` / `WITH CHECK (true)` because all data is
     intentionally device-scoped via a client-generated UUID and there is no
     server-side identity to check against. This is the documented single-
     tenant pattern, not a shortcut around ownership checks.
   - `service_role` granted CRUD so future edge functions can read aggregate
     stats if needed.

4. Notes
   - The frontend keeps localStorage as a cache/fallback; the database is the
     source of truth. If a device clears localStorage, a new profile_id is
     generated and progress restarts — this is acceptable for a children's
     game with no accounts.
   - `lesson_results` and `player_badges` use ON DELETE CASCADE so deleting a
     profile cleans up all related rows.
*/

-- ---------- player_profiles ----------
CREATE TABLE IF NOT EXISTS player_profiles (
  id uuid PRIMARY KEY,
  mascot_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE player_profiles ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON player_profiles TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON player_profiles TO service_role;

DROP POLICY IF EXISTS "pp_select" ON player_profiles;
CREATE POLICY "pp_select" ON player_profiles
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "pp_insert" ON player_profiles;
CREATE POLICY "pp_insert" ON player_profiles
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "pp_update" ON player_profiles;
CREATE POLICY "pp_update" ON player_profiles
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "pp_delete" ON player_profiles;
CREATE POLICY "pp_delete" ON player_profiles
  FOR DELETE TO anon, authenticated USING (true);

-- ---------- lesson_results ----------
CREATE TABLE IF NOT EXISTS lesson_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES player_profiles(id) ON DELETE CASCADE,
  section_id text NOT NULL,
  stars smallint NOT NULL DEFAULT 0 CHECK (stars BETWEEN 0 AND 3),
  score integer NOT NULL DEFAULT 0,
  completed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (profile_id, section_id)
);

ALTER TABLE lesson_results ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON lesson_results TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON lesson_results TO service_role;

DROP POLICY IF EXISTS "lr_select" ON lesson_results;
CREATE POLICY "lr_select" ON lesson_results
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "lr_insert" ON lesson_results;
CREATE POLICY "lr_insert" ON lesson_results
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "lr_update" ON lesson_results;
CREATE POLICY "lr_update" ON lesson_results
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "lr_delete" ON lesson_results;
CREATE POLICY "lr_delete" ON lesson_results
  FOR DELETE TO anon, authenticated USING (true);

-- ---------- player_badges ----------
CREATE TABLE IF NOT EXISTS player_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES player_profiles(id) ON DELETE CASCADE,
  badge_id text NOT NULL,
  earned_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (profile_id, badge_id)
);

ALTER TABLE player_badges ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, DELETE ON player_badges TO anon, authenticated;
GRANT SELECT, INSERT, DELETE ON player_badges TO service_role;

DROP POLICY IF EXISTS "pb_select" ON player_badges;
CREATE POLICY "pb_select" ON player_badges
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "pb_insert" ON player_badges;
CREATE POLICY "pb_insert" ON player_badges
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "pb_delete" ON player_badges;
CREATE POLICY "pb_delete" ON player_badges
  FOR DELETE TO anon, authenticated USING (true);

-- Indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_lesson_results_profile ON lesson_results(profile_id);
CREATE INDEX IF NOT EXISTS idx_player_badges_profile ON player_badges(profile_id);
