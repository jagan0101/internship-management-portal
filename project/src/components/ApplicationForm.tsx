import { useEffect, useState } from 'react';
import {
  X,
  Loader2,
  CheckCircle2,
  Building2,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Briefcase,
  User,
  Mail,
  Phone,
  GraduationCap,
  FileText,
  Link2,
  Send,
} from 'lucide-react';
import { supabase, type Internship, type ApplicationInput } from '../lib/supabase';

const colorMap: Record<string, { bg: string; text: string; ring: string }> = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-700', ring: 'ring-blue-100' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', ring: 'ring-indigo-100' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-100' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-700', ring: 'ring-rose-100' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-700', ring: 'ring-amber-100' },
  pink: { bg: 'bg-pink-50', text: 'text-pink-700', ring: 'ring-pink-100' },
  green: { bg: 'bg-green-50', text: 'text-green-700', ring: 'ring-green-100' },
  slate: { bg: 'bg-slate-100', text: 'text-slate-700', ring: 'ring-slate-200' },
  cyan: { bg: 'bg-cyan-50', text: 'text-cyan-700', ring: 'ring-cyan-100' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-700', ring: 'ring-violet-100' },
  red: { bg: 'bg-red-50', text: 'text-red-700', ring: 'ring-red-100' },
};

export default function ApplicationForm({
  internship,
  userEmail,
  onClose,
}: {
  internship: Internship;
  userEmail: string;
  onClose: () => void;
}) {
  const [form, setForm] = useState<ApplicationInput>({
    internship_id: internship.id,
    full_name: '',
    email: userEmail,
    phone: '',
    university: '',
    major: '',
    graduation_year: '',
    gpa: '',
    resume_url: '',
    cover_letter: '',
    availability: '',
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  function update<K extends keyof ApplicationInput>(key: K, value: ApplicationInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    const required: (keyof ApplicationInput)[] = [
      'full_name', 'email', 'phone', 'university', 'major',
      'graduation_year', 'gpa', 'cover_letter', 'availability',
    ];
    const missing = required.filter((k) => !String(form[k] ?? '').trim());
    if (missing.length > 0) {
      setErr('Please fill in all required fields before submitting.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        resume_url: form.resume_url?.trim() || null,
      };
      const { error } = await supabase.from('applications').insert(payload);
      if (error) throw error;
      setSubmitted(true);
    } catch (e: any) {
      setErr(e.message ?? 'Failed to submit application.');
    } finally {
      setSaving(false);
    }
  }

  const c = colorMap[internship.logo_color] ?? colorMap.blue;
  const deadline = internship.deadline
    ? new Date(internship.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null;

  const inputCls =
    'w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 py-2.5 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100';
  const inputNoIcon =
    'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100';
  const labelCls = 'mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500';
  const reqStar = <span className="text-rose-500">*</span>;

  if (submitted) {
    const submittedAt = new Date().toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-200/30 blur-3xl" />
          <div className="absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-indigo-200/20 blur-3xl" />
        </div>

        <div className="relative flex min-h-full items-center justify-center px-4 py-12">
          <div className="w-full max-w-lg text-center">
            {/* Animated checkmark */}
            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-2xl shadow-emerald-500/30 animate-[scaleIn_0.4s_ease]">
              <CheckCircle2 className="h-14 w-14 text-white" strokeWidth={2.5} />
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Thank You!
            </h1>
            <p className="mt-3 text-lg font-medium text-slate-700">
              Your application has been successfully submitted.
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              We've received your application and our team will review it shortly. You'll receive an
              update at <span className="font-semibold text-slate-700">{form.email}</span> regarding
              the next steps.
            </p>

            {/* Application summary card */}
            <div className="mx-auto mt-8 max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className={`flex items-center gap-4 ${c.bg} px-6 py-4`}>
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white ${c.text} text-lg font-bold ring-1 ${c.ring}`}>
                  {internship.company.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 text-left">
                  <p className="truncate font-semibold text-slate-900">{internship.title}</p>
                  <p className="truncate text-sm text-slate-600">{internship.company}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 divide-x divide-slate-100 border-t border-slate-100">
                <div className="px-6 py-4 text-left">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Applicant</p>
                  <p className="mt-0.5 truncate text-sm font-semibold text-slate-800">{form.full_name}</p>
                </div>
                <div className="px-6 py-4 text-left">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Submitted</p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-800">{submittedAt}</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 border-t border-slate-100 bg-slate-50 px-6 py-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  Status: Under Review
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                onClick={onClose}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800 active:scale-95 sm:w-auto"
              >
                Back to Internships
              </button>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setForm({
                    internship_id: internship.id,
                    full_name: '',
                    email: userEmail,
                    phone: '',
                    university: '',
                    major: '',
                    graduation_year: '',
                    gpa: '',
                    resume_url: '',
                    cover_letter: '',
                    availability: '',
                  });
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 active:scale-95 sm:w-auto"
              >
                Apply to Another
              </button>
            </div>

            <p className="mt-8 text-xs text-slate-400">
              Reference ID: {Date.now().toString(36).toUpperCase()}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease]" onClick={onClose} />
      <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl animate-[slideUp_0.3s_ease]">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur">
          <h2 className="text-lg font-bold text-slate-900">Apply for Internship</h2>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Internship summary */}
        <div className={`border-b border-slate-200 ${c.bg} px-6 py-5`}>
          <div className="flex items-start gap-4">
            <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white ${c.text} text-xl font-bold ring-1 ${c.ring}`}>
              {internship.company.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-slate-900">{internship.title}</h3>
              <p className="flex items-center gap-1.5 text-sm text-slate-600">
                <Building2 className="h-4 w-4" />
                {internship.company}
              </p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{internship.location}</span>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{internship.type} · {internship.duration}</span>
                <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" />{internship.salary ?? (internship.paid ? 'Paid' : 'Unpaid')}</span>
                {deadline && <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />Due {deadline}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="space-y-5 p-6">
          {err && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{err}</div>
          )}

          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Personal Information
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Full Name {reqStar}</label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input className={inputCls} value={form.full_name} onChange={(e) => update('full_name', e.target.value)} placeholder="Jane Doe" />
              </div>
            </div>
            <div>
              <label className={labelCls}>Email {reqStar}</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input type="email" className={inputCls} value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="jane@university.edu" />
              </div>
            </div>
          </div>

          <div>
            <label className={labelCls}>Phone {reqStar}</label>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input className={inputCls} value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+1 (555) 123-4567" />
            </div>
          </div>

          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Academic Information
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>University {reqStar}</label>
              <div className="relative">
                <GraduationCap className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input className={inputCls} value={form.university} onChange={(e) => update('university', e.target.value)} placeholder="Stanford University" />
              </div>
            </div>
            <div>
              <label className={labelCls}>Major {reqStar}</label>
              <div className="relative">
                <Briefcase className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input className={inputCls} value={form.major} onChange={(e) => update('major', e.target.value)} placeholder="Computer Science" />
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Graduation Year {reqStar}</label>
              <select className={inputNoIcon} value={form.graduation_year} onChange={(e) => update('graduation_year', e.target.value)}>
                <option value="">Select year</option>
                {['2026', '2027', '2028', '2029', '2030'].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>GPA {reqStar}</label>
              <input className={inputNoIcon} value={form.gpa} onChange={(e) => update('gpa', e.target.value)} placeholder="3.8 / 4.0" />
            </div>
          </div>

          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Application Details
          </div>

          <div>
            <label className={labelCls}>Resume Link (optional)</label>
            <div className="relative">
              <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input className={inputCls} value={form.resume_url ?? ''} onChange={(e) => update('resume_url', e.target.value)} placeholder="https://link.to/your/resume" />
            </div>
          </div>

          <div>
            <label className={labelCls}>Availability / Start Date {reqStar}</label>
            <input className={inputNoIcon} value={form.availability} onChange={(e) => update('availability', e.target.value)} placeholder="Available from June 2026" />
          </div>

          <div>
            <label className={labelCls}>Why do you want this internship? {reqStar}</label>
            <div className="relative">
              <FileText className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <textarea
                className={`${inputNoIcon} min-h-[120px] resize-y pl-10`}
                value={form.cover_letter}
                onChange={(e) => update('cover_letter', e.target.value)}
                placeholder="Tell us why you're interested in this role and what you hope to learn..."
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 active:scale-95 disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
