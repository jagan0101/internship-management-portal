import { useState } from 'react';
import { Mail, Lock, Loader2, GraduationCap, User, Briefcase, Building2, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!email.trim() || !password.trim()) {
      setErr('Please enter your email and password.');
      return;
    }
    if (password.length < 6) {
      setErr('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email: email.trim(), password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
      }
    } catch (e: any) {
      setErr(e.message ?? 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  }

  const inputCls =
    'w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 py-3 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100';

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-12">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-500 blur-3xl" />
        <div className="absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-emerald-500 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-indigo-500 blur-3xl" />
      </div>

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-2">
        {/* Left — Brand panel */}
        <div className="relative hidden flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-10 md:flex">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute left-10 top-10 h-48 w-48 rounded-full bg-blue-500 blur-3xl" />
            <div className="absolute bottom-10 right-10 h-48 w-48 rounded-full bg-emerald-500 blur-3xl" />
          </div>

          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/30">
                <GraduationCap className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">InternHub</h1>
                <p className="text-xs text-slate-400">Find your dream internship</p>
              </div>
            </div>
          </div>

          <div className="relative space-y-6">
            <h2 className="text-3xl font-bold leading-tight text-white">
              Launch your career with the{' '}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
                perfect internship
              </span>
            </h2>
            <p className="text-sm leading-relaxed text-slate-300">
              Browse curated opportunities from world-class companies. Filter by field, location, and
              pay to find the role that fits you.
            </p>
            <div className="space-y-3">
              {[
                { icon: Briefcase, text: 'Hundreds of open positions' },
                { icon: Building2, text: 'Top companies hiring now' },
                { icon: Sparkles, text: 'Curated, quality opportunities' },
              ].map((f) => (
                <div key={f.text} className="flex items-center gap-3 text-sm text-slate-200">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                    <f.icon className="h-4 w-4 text-blue-300" />
                  </div>
                  {f.text}
                </div>
              ))}
            </div>
          </div>

          <div className="relative text-xs text-slate-500">
            &copy; {new Date().getFullYear()} InternHub. All rights reserved.
          </div>
        </div>

        {/* Right — Form */}
        <div className="flex flex-col justify-center p-8 sm:p-12">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-3 md:hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/30">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">InternHub</h1>
              <p className="text-xs text-slate-500">Find your dream internship</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="mt-1.5 text-sm text-slate-500">
            {mode === 'login'
              ? 'Sign in to browse and apply to internships.'
              : 'Join InternHub to start your journey.'}
          </p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            {err && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {err}
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  className={inputCls}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  className={inputCls}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : mode === 'login' ? (
                <>
                  <User className="h-4 w-4" />
                  Sign In
                </>
              ) : (
                <>
                  <GraduationCap className="h-4 w-4" />
                  Create Account
                </>
              )}
            </button>

            <p className="text-center text-sm text-slate-500">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'login' ? 'signup' : 'login');
                  setErr(null);
                }}
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
