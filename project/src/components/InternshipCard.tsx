import {
  MapPin,
  Clock,
  DollarSign,
  Star,
  Building2,
  Calendar,
  ArrowRight,
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

export default function InternshipCard({
  internship,
  onClick,
  featured = false,
}: {
  internship: Internship;
  onClick: () => void;
  featured?: boolean;
}) {
  const c = colorMap[internship.logo_color] ?? colorMap.blue;
  const deadline = internship.deadline
    ? new Date(internship.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null;
  const daysLeft = internship.deadline
    ? Math.ceil((new Date(internship.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl"
    >
      {featured && (
        <div className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
          <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
          Featured
        </div>
      )}
      <div className="p-5">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${c.bg} ${c.text} text-lg font-bold ring-1 ${c.ring}`}
          >
            {internship.company.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-slate-900">{internship.title}</h3>
            <p className="flex items-center gap-1 text-sm text-slate-500">
              <Building2 className="h-3.5 w-3.5" />
              {internship.company}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className={`inline-flex items-center gap-1 rounded-lg ${c.bg} ${c.text} px-2 py-1 text-xs font-medium`}>
            {internship.category}
          </span>
          <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
            {internship.type}
          </span>
          {internship.paid && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
              <DollarSign className="h-3 w-3" />
              Paid
            </span>
          )}
        </div>

        <div className="mt-4 space-y-1.5 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
            <span className="truncate">{internship.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0 text-slate-400" />
            <span>{internship.duration}</span>
          </div>
          {deadline && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 shrink-0 text-slate-400" />
              <span>
                Due {deadline}
                {daysLeft !== null && daysLeft >= 0 && (
                  <span className={`ml-1.5 text-xs font-medium ${daysLeft < 14 ? 'text-rose-600' : 'text-slate-400'}`}>
                    ({daysLeft}d left)
                  </span>
                )}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-slate-100 px-5 py-3">
        <span className="text-sm font-semibold text-slate-700">
          {internship.salary ? internship.salary : internship.paid ? 'Paid' : 'Unpaid'}
        </span>
        <span className="flex items-center gap-1 text-sm font-medium text-blue-600 transition-transform group-hover:translate-x-0.5">
          View
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </button>
  );
}
