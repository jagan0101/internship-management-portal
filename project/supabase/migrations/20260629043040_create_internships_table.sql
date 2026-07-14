/*
# Create internships table (single-tenant, no auth)

1. New Tables
- `internships`
  - `id` (uuid, primary key)
  - `title` (text, not null) — internship role title
  - `company` (text, not null) — company name
  - `location` (text, not null) — city/remote
  - `category` (text, not null) — field e.g. Engineering, Design, Marketing
  - `type` (text, not null) — Summer, Part-time, Full-time, Co-op
  - `duration` (text, not null) — e.g. "12 weeks"
  - `paid` (boolean, default true)
  - `salary` (text, nullable) — compensation description
  - `description` (text, not null) — full role description
  - `requirements` (text, not null) — qualifications
  - `logo_color` (text, not null default) — tailwind color for company avatar
  - `deadline` (date, nullable) — application deadline
  - `featured` (boolean, default false)
  - `created_at` (timestamptz, default now())
2. Security
- Enable RLS on `internships`.
- Allow anon + authenticated CRUD because the data is intentionally shared/public (no sign-in).
*/

CREATE TABLE IF NOT EXISTS internships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  company text NOT NULL,
  location text NOT NULL,
  category text NOT NULL,
  type text NOT NULL DEFAULT 'Summer',
  duration text NOT NULL DEFAULT '12 weeks',
  paid boolean NOT NULL DEFAULT true,
  salary text,
  description text NOT NULL,
  requirements text NOT NULL,
  logo_color text NOT NULL DEFAULT 'blue',
  deadline date,
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE internships ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_internships" ON internships;
CREATE POLICY "anon_select_internships" ON internships FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_internships" ON internships;
CREATE POLICY "anon_insert_internships" ON internships FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_internships" ON internships;
CREATE POLICY "anon_update_internships" ON internships FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_internships" ON internships;
CREATE POLICY "anon_delete_internships" ON internships FOR DELETE
TO anon, authenticated USING (true);

-- Seed sample internships
INSERT INTO internships (title, company, location, category, type, duration, paid, salary, description, requirements, logo_color, deadline, featured) VALUES
('Software Engineering Intern', 'Stripe', 'San Francisco, CA', 'Engineering', 'Summer', '12 weeks', true, '$9,500/mo', 'Join the payments platform team to build infrastructure that moves billions of dollars. You will work on APIs, distributed systems, and developer tooling used by millions of businesses worldwide.', 'Currently pursuing a CS or related degree. Proficient in at least one programming language. Strong problem-solving skills.', 'indigo', '2026-03-15', true),
('Product Design Intern', 'Figma', 'Remote', 'Design', 'Summer', '10 weeks', true, '$8,000/mo', 'Design features that millions of designers use daily. Collaborate with engineers and PMs to ship beautiful, intuitive product experiences.', 'Portfolio demonstrating strong visual and interaction design. Familiarity with Figma. Understanding of design systems.', 'pink', '2026-02-28', true),
('Data Science Intern', 'Spotify', 'New York, NY', 'Data', 'Summer', '12 weeks', true, '$8,500/mo', 'Analyze listening data from over 500M users to improve recommendation algorithms and personalize the music experience.', 'Coursework in statistics and machine learning. Python or R proficiency. Experience with SQL.', 'green', '2026-03-01', false),
('Marketing Intern', 'Airbnb', 'San Francisco, CA', 'Marketing', 'Part-time', '16 weeks', true, '$6,500/mo', 'Help craft campaigns that inspire travel and belonging. Work on brand strategy, content creation, and growth marketing initiatives.', 'Strong writing skills. Interest in brand and growth marketing. Creative storyteller.', 'rose', '2026-03-20', false),
('Machine Learning Intern', 'OpenAI', 'San Francisco, CA', 'Engineering', 'Full-time', '12 weeks', true, '$10,000/mo', 'Research and build large language models. Push the frontier of AI safety and capability alongside world-class researchers.', 'Strong ML background. Publications a plus. Deep understanding of neural networks and transformers.', 'emerald', '2026-02-15', true),
('Investment Banking Intern', 'Goldman Sachs', 'New York, NY', 'Finance', 'Summer', '10 weeks', true, '$9,000/mo', 'Support M&A advisory and capital raising teams. Build financial models, conduct industry research, and prepare client materials.', 'Finance or economics major. Excel modeling skills. Strong analytical ability and attention to detail.', 'blue', '2026-03-10', false),
('UX Research Intern', 'Notion', 'Remote', 'Design', 'Co-op', '16 weeks', true, '$7,500/mo', 'Conduct generative and evaluative research to shape the future of Notion. Synthesize insights that directly influence product decisions.', 'Coursework in HCI, psychology, or related field. Experience with qualitative research methods.', 'amber', '2026-03-25', false),
('Frontend Engineering Intern', 'Vercel', 'Remote', 'Engineering', 'Summer', '12 weeks', true, '$8,800/mo', 'Build the platform that builds the web. Work on Next.js, dashboard tooling, and developer experience products.', 'React and TypeScript proficiency. Understanding of modern web tooling. Open source contributions a plus.', 'slate', '2026-03-05', true)
ON CONFLICT DO NOTHING;
