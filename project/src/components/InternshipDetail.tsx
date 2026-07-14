import { useEffect } from 'react';
import {
  X,
  MapPin,
  Clock,
  DollarSign,
  Building2,
  Calendar,
  Star,
  Pencil,
  Trash2,
  Briefcase,
  ArrowRight,
  ExternalLink,
  Link as LinkIcon,
} from 'lucide-react';
import type { Internship } from '../lib/supabase';

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
};

export default function InternshipDetail({
  internship,
  canEdit,
  onClose,
  onEdit,
  onDelete,
  onApply,
}: {
  internship: Internship;
  canEdit: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onApply: () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const c = colorMap[internship.logo_color] ?? colorMap.blue;
  const deadline = internship.deadline
    ? new Date(internship.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease]" onClick={onClose} />
      <div className="relative h-full w-full max-w-xl overflow-y-auto bg-white shadow-2xl animate-[slideIn_0.3s_ease]">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/90 px-5 py-4 backdrop-blur">
          <span className="text-sm font-medium text-slate-500">Internship Details</span>
          <div className="flex items-center gap-1">
            {canEdit && (
              <>
                <button
                  onClick={onEdit}
                  className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                  title="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={onDelete}
                  className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${c.bg} ${c.text} text-2xl font-bold ring-1 ${c.ring}`}
            >
              {internship.company.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              {internship.featured && (
                <div className="mb-1.5 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                  <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                  Featured
                </div>
              )}
              <h2 className="text-xl font-bold text-slate-900">{internship.title}</h2>
              <p className="flex items-center gap-1.5 text-slate-500">
                <Building2 className="h-4 w-4" />
                {internship.company}
              </p>
            </div>
          </div>

          {/* Meta grid */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Meta icon={MapPin} label="Location" value={internship.location} />
            <Meta icon={Briefcase} label="Category" value={internship.category} />
            <Meta icon={Clock} label="Duration" value={`${internship.type} · ${internship.duration}`} />
            <Meta
              icon={DollarSign}
              label="Compensation"
              value={internship.salary ?? (internship.paid ? 'Paid' : 'Unpaid')}
            />
          </div>

          {deadline && (
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <Calendar className="h-5 w-5 text-slate-400" />
              <span className="text-sm text-slate-600">
                Application deadline: <span className="font-semibold text-slate-800">{deadline}</span>
              </span>
            </div>
          )}

          {/* Description */}
          <Section title="About the role">
            <p className="text-sm leading-relaxed text-slate-600">{internship.description}</p>
          </Section>

          {/* Requirements */}
          <Section title="Requirements">
            <p className="text-sm leading-relaxed text-slate-600">{internship.requirements}</p>
          </Section>

          {/* Application link */}
          {internship.link && (
            <Section title="Application Link">
              <a
                href={internship.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition-colors hover:border-slate-300 hover:bg-slate-100"
              >
                <span className="flex min-w-0 items-center gap-2.5 text-sm font-medium text-blue-600">
                  <LinkIcon className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-blue-600" />
                  <span className="truncate">{internship.link}</span>
                </span>
                <ExternalLink className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-blue-600" />
              </a>
            </Section>
          )}

          {/* Apply button */}
          <button
            onClick={onApply}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 active:scale-[0.98]"
          >
            Apply Now
            <ArrowRight className="h-4 w-4" />
          </button>
          <p className="mt-3 text-center text-xs text-slate-400">
            Fill out the application form to submit your interest.
          </p>
        </div>
      </div>
    </div>
  );
}

function Meta({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-slate-800">{value}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-400">{title}</h3>
      {children}
    </div>
  );
}


