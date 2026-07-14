import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Internship = {
  id: string;
  title: string;
  company: string;
  location: string;
  category: string;
  type: string;
  duration: string;
  paid: boolean;
  salary: string | null;
  description: string;
  requirements: string;
  logo_color: string;
  deadline: string | null;
  featured: boolean;
  link: string | null;
  user_id: string | null;
  created_at: string;
};

export type InternshipInput = Omit<Internship, 'id' | 'created_at' | 'user_id'>;

export type Application = {
  id: string;
  internship_id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  university: string;
  major: string;
  graduation_year: string;
  gpa: string;
  resume_url: string | null;
  cover_letter: string;
  availability: string;
  status: string;
  created_at: string;
};

export type ApplicationInput = Omit<Application, 'id' | 'user_id' | 'status' | 'created_at'>;
