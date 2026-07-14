/*
# Add application link column to internships

1. Modified Tables
- `internships`
  - Added `link` (text, nullable) — optional external URL for the internship posting or application page
2. Security
- No RLS changes; existing policies already allow anon + authenticated CRUD on this public table.
3. Notes
- The column is nullable so existing rows and inserts that omit it are unaffected.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'internships' AND column_name = 'link'
  ) THEN
    ALTER TABLE internships ADD COLUMN link text;
  END IF;
END $$;
