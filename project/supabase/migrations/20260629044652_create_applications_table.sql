/*
# Create applications table

1. New Tables
- `applications`
  - `id` (uuid, primary key)
  - `internship_id` (uuid, FK to internships, ON DELETE CASCADE)
  - `user_id` (uuid, NOT NULL, defaults to auth.uid(), FK to auth.users, ON DELETE CASCADE)
  - `full_name` (text, not null) — applicant's full name
  - `email` (text, not null) — applicant's email
  - `phone` (text, not null) — applicant's phone number
  - `university` (text, not null) — current university
  - `major` (text, not null) — field of study
  - `graduation_year` (text, not null) — expected graduation year
  - `gpa` (text, not null) — current GPA
  - `resume_url` (text, nullable) — link to resume (optional)
  - `cover_letter` (text, not null) — why they want this internship
  - `availability` (text, not null) — when they can start
  - `status` (text, not null default 'pending') — application status
  - `created_at` (timestamptz, default now())
2. Security
- Enable RLS on `applications`.
- SELECT: owner can read their own applications.
- INSERT: authenticated users can insert their own applications.
- UPDATE: owner can update their own applications.
- DELETE: owner can delete their own applications.
3. Indexes
- Index on user_id for owner queries.
- Index on internship_id for lookup by internship.
*/

CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  internship_id uuid NOT NULL REFERENCES internships(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  university text NOT NULL,
  major text NOT NULL,
  graduation_year text NOT NULL,
  gpa text NOT NULL,
  resume_url text,
  cover_letter text NOT NULL,
  availability text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_applications" ON applications;
CREATE POLICY "select_own_applications" ON applications FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_applications" ON applications;
CREATE POLICY "insert_own_applications" ON applications FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_applications" ON applications;
CREATE POLICY "update_own_applications" ON applications FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_applications" ON applications;
CREATE POLICY "delete_own_applications" ON applications FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS applications_user_id_idx ON applications(user_id);
CREATE INDEX IF NOT EXISTS applications_internship_id_idx ON applications(internship_id);
