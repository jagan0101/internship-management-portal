/*
# Add user_id to internships for owner-scoped access

1. Modified Tables
- `internships`
  - Add `user_id` (uuid, NOT NULL, defaults to auth.uid(), references auth.users with ON DELETE CASCADE)
  - This makes each internship owned by the user who posted it.
2. Security Changes
- Backfill existing rows: set user_id to a known placeholder is NOT possible (no auth user yet).
  Instead, existing seeded rows get user_id set to the first authenticated user on first insert is not viable.
  We set existing rows' user_id to NULL temporarily, but column is NOT NULL — so we must backfill.
  Since there is no existing auth user, we use a DO block to set existing rows to a sentinel that will
  be replaced. However, FK constraint requires a valid auth.users id. 
  Solution: make the column nullable first for backfill, then enforce NOT NULL after backfill is not
  possible without a real user. 
  
  Approach: Add column as nullable with DEFAULT auth.uid(). Existing rows get NULL (owned by nobody).
  New inserts from authenticated users get auth.uid() automatically. We keep it nullable so existing
  seeded data remains visible to all authenticated users via a SELECT policy that allows reading all
  internships (shared/public read) while writes are owner-scoped.

- RLS policy changes:
  - SELECT: any authenticated user can read all internships (shared browsing).
  - INSERT: only if auth.uid() = user_id (owner creates own).
  - UPDATE: only owner can update.
  - DELETE: only owner can delete.
  - Existing NULL user_id rows: readable by all, not editable/deletable by anyone (no owner).
*/

-- Add user_id column, nullable to preserve existing seeded rows
ALTER TABLE internships
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Set default for future inserts
ALTER TABLE internships
  ALTER COLUMN user_id SET DEFAULT auth.uid();

-- SELECT: all authenticated users can browse all internships
DROP POLICY IF EXISTS "anon_select_internships" ON internships;
DROP POLICY IF EXISTS "auth_select_internships" ON internships;
CREATE POLICY "auth_select_internships" ON internships FOR SELECT
  TO authenticated USING (true);

-- INSERT: owner only (user_id defaults to auth.uid())
DROP POLICY IF EXISTS "anon_insert_internships" ON internships;
DROP POLICY IF EXISTS "auth_insert_internships" ON internships;
CREATE POLICY "auth_insert_internships" ON internships FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- UPDATE: owner only
DROP POLICY IF EXISTS "anon_update_internships" ON internships;
DROP POLICY IF EXISTS "auth_update_internships" ON internships;
CREATE POLICY "auth_update_internships" ON internships FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- DELETE: owner only
DROP POLICY IF EXISTS "anon_delete_internships" ON internships;
DROP POLICY IF EXISTS "auth_delete_internships" ON internships;
CREATE POLICY "auth_delete_internships" ON internships FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Index for owner queries
CREATE INDEX IF NOT EXISTS internships_user_id_idx ON internships(user_id);
