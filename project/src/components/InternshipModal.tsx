import { useEffect, useState } from 'react';
import { X, Loader2, Link as LinkIcon } from 'lucide-react';
import type { Internship, InternshipInput } from '../lib/supabase';

export default function InternshipModal({
  internship,
  categories,
  types,
  colors,
  onClose,
  onSave,
}: {
  internship: Internship | null;
  categories: string[];
  types: string[];
  colors: string[];
  onClose: () => void;
  onSave: (input: InternshipInput, id?: string) => Promise<void>;
}) {
  const [form, setForm] = useState<InternshipInput>({
    title: '',
    company: '',
    location: '',
    category: categories[0],
    type: types[0],
    duration: '12 weeks',
    paid: true,
    salary: '',
    description: '',
    requirements: '',
    logo_color: 'blue',
    deadline: '',
    link: '',
    featured: false,
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (internship) {
      setForm({
        title: internship.title,
        company: internship.company,
        location: internship.location,
        category: internship.category,
        type: internship.type,
        duration: internship.duration,
        paid: internship.paid,
        salary: internship.salary ?? '',
        description: internship.description,
        requirements: internship.requirements,
        logo_color: internship.logo_color,
        deadline: internship.deadline ?? '',
        link: internship.link ?? '',
        featured: internship.featured,
      });
    }
  }, [internship]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  function update<K extends keyof InternshipInput>(key: K, value: InternshipInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!form.title.trim() || !form.company.trim() || !form.description.trim() || !form.requirements.trim()) {
      setErr('Please fill in all required fields.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        salary: form.salary?.trim() || null,
        deadline: form.deadline?.trim() || null,
        link: form.link?.trim() || null,
      };
      await onSave(payload, internship?.id);
    } catch (e: any) {
      setErr(e.message ?? 'Failed to save.');
    } finally {
      setSaving(false);
    }
  }

  const inputCls =
    'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100';
  const labelCls = 'mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease]" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl animate-[slideUp_0.3s_ease]">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur">
          <h2 className="text-lg font-bold text-slate-900">
            {internship ? 'Edit Internship' : 'Post a New Internship'}
          </h2>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-5 p-6">
          {err && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{err}</div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Title *</label>
              <input className={inputCls} value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="Software Engineering Intern" />
            </div>
            <div>
              <label className={labelCls}>Company *</label>
              <input className={inputCls} value={form.company} onChange={(e) => update('company', e.target.value)} placeholder="Acme Corp" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Location *</label>
              <input className={inputCls} value={form.location} onChange={(e) => update('location', e.target.value)} placeholder="San Francisco, CA or Remote" />
            </div>
            <div>
              <label className={labelCls}>Duration</label>
              <input className={inputCls} value={form.duration} onChange={(e) => update('duration', e.target.value)} placeholder="12 weeks" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Category</label>
              <select className={inputCls} value={form.category} onChange={(e) => update('category', e.target.value)}>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Type</label>
              <select className={inputCls} value={form.type} onChange={(e) => update('type', e.target.value)}>
                {types.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Salary</label>
              <input className={inputCls} value={form.salary ?? ''} onChange={(e) => update('salary', e.target.value)} placeholder="$8,000/mo" />
            </div>
            <div>
              <label className={labelCls}>Application Deadline</label>
              <input type="date" className={inputCls} value={form.deadline ?? ''} onChange={(e) => update('deadline', e.target.value)} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Application Link</label>
            <div className="relative">
              <LinkIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                className={`${inputCls} pl-10`}
                value={form.link ?? ''}
                onChange={(e) => update('link', e.target.value)}
                placeholder="https://company.com/careers/internship-123"
                type="url"
              />
            </div>
            <p className="mt-1 text-xs text-slate-400">Optional — link to the posting or external application page.</p>
          </div>

          <div>
            <label className={labelCls}>Description *</label>
            <textarea
              className={`${inputCls} min-h-[100px] resize-y`}
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Describe the role, team, and what the intern will work on..."
            />
          </div>

          <div>
            <label className={labelCls}>Requirements *</label>
            <textarea
              className={`${inputCls} min-h-[80px] resize-y`}
              value={form.requirements}
              onChange={(e) => update('requirements', e.target.value)}
              placeholder="Qualifications, skills, and prerequisites..."
            />
          </div>

          <div>
            <label className={labelCls}>Company Logo Color</label>
            <div className="flex flex-wrap gap-2">
              {colors.map((col) => (
                <button
                  key={col}
                  type="button"
                  onClick={() => update('logo_color', col)}
                  className={`h-9 w-9 rounded-lg bg-${col}-500 ring-2 transition-all ${
                    form.logo_color === col ? 'ring-slate-900 scale-110' : 'ring-transparent'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={form.paid}
                onChange={(e) => update('paid', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
              />
              <span className="text-sm font-medium text-slate-700">Paid position</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => update('featured', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400"
              />
              <span className="text-sm font-medium text-slate-700">Featured</span>
            </label>
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
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {internship ? 'Save Changes' : 'Post Internship'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
