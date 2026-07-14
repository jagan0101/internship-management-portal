import { useEffect, useState, useMemo } from 'react';
import {
  Briefcase,
  MapPin,
  DollarSign,
  Search,
  Filter,
  Plus,
  X,
  Star,
  Building2,
  Calendar,
  Sparkles,
  GraduationCap,
  Loader2,
  LogOut,
  User,
} from 'lucide-react';
import { supabase, type Internship, type InternshipInput } from './lib/supabase';
import { useAuth } from './lib/useAuth';
import InternshipCard from './components/InternshipCard';
import InternshipModal from './components/InternshipModal';
import InternshipDetail from './components/InternshipDetail';
import AuthModal from './components/AuthModal';
import ApplicationForm from './components/ApplicationForm';
import LoginPage from './components/LoginPage';

const CATEGORIES = ['Engineering', 'Design', 'Data', 'Marketing', 'Finance', 'Product', 'Research'];
const TYPES = ['Summer', 'Full-time', 'Part-time', 'Co-op'];
const COLORS = ['blue', 'indigo', 'emerald', 'rose', 'amber', 'pink', 'green', 'slate', 'cyan', 'violet'];

export default function App() {
  const { session, loading: authLoading } = useAuth();
  const user = session?.user ?? null;

  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [paidOnly, setPaidOnly] = useState(false);
  const [remoteOnly, setRemoteOnly] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Internship | null>(null);
  const [selected, setSelected] = useState<Internship | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [applyTarget, setApplyTarget] = useState<Internship | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('internships')
      .select('*')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false });
    if (error) {
      setError(error.message);
    } else {
      setInternships((data as Internship[]) ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return internships.filter((i) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        i.title.toLowerCase().includes(q) ||
        i.company.toLowerCase().includes(q) ||
        i.location.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q);
      const matchesCategory = categoryFilter.length === 0 || categoryFilter.includes(i.category);
      const matchesType = typeFilter.length === 0 || typeFilter.includes(i.type);
      const matchesPaid = !paidOnly || i.paid;
      const matchesRemote = !remoteOnly || i.location.toLowerCase().includes('remote');
      return matchesSearch && matchesCategory && matchesType && matchesPaid && matchesRemote;
    });
  }, [internships, search, categoryFilter, typeFilter, paidOnly, remoteOnly]);

  const featured = useMemo(() => filtered.filter((i) => i.featured).slice(0, 3), [filtered]);

  function toggleArray(value: string, arr: string[], setter: (v: string[]) => void) {
    setter(arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]);
  }

  function openNew() {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    setEditing(null);
    setModalOpen(true);
  }
  function openEdit(i: Internship) {
    if (!user || user.id !== i.user_id) return;
    setEditing(i);
    setModalOpen(true);
  }

  async function handleSave(input: InternshipInput, id?: string) {
    if (id) {
      const { error } = await supabase.from('internships').update(input).eq('id', id);
      if (error) throw error;
      setModalOpen(false);
      await load();
    } else {
      const { data, error } = await supabase
        .from('internships')
        .insert(input)
        .select()
        .single();
      if (error) throw error;
      setModalOpen(false);
      await load();
      if (data) {
        setSelected(data as Internship);
      }
    }
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from('internships').delete().eq('id', id);
    if (error) {
      setError(error.message);
      return;
    }
    setSelected(null);
    await load();
  }

  async function signOut() {
    setMenuOpen(false);
    await supabase.auth.signOut();
  }

  const stats = [
    { label: 'Open Positions', value: internships.length, icon: Briefcase, color: 'text-blue-600' },
    { label: 'Companies', value: new Set(internships.map((i) => i.company)).size, icon: Building2, color: 'text-emerald-600' },
    { label: 'Categories', value: new Set(internships.map((i) => i.category)).size, icon: Sparkles, color: 'text-amber-600' },
    { label: 'Paid Roles', value: internships.filter((i) => i.paid).length, icon: DollarSign, color: 'text-rose-600' },
  ];

  const userEmail = user?.email ?? '';
  const userInitial = userEmail.charAt(0).toUpperCase();

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-600/20">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900">InternHub</h1>
              <p className="hidden text-xs text-slate-500 sm:block">Find your dream internship</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={openNew}
              className="group flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-800 hover:shadow-md active:scale-95"
            >
              <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
              <span className="hidden sm:inline">Post Internship</span>
              <span className="sm:hidden">Post</span>
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-sm font-bold text-white shadow-sm transition-transform hover:scale-105"
                >
                  {userInitial}
                </button>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 top-12 z-20 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl animate-[slideUp_0.15s_ease]">
                      <div className="border-b border-slate-100 px-4 py-3">
                        <p className="text-xs font-medium text-slate-400">Signed in as</p>
                        <p className="truncate text-sm font-semibold text-slate-800">{userEmail}</p>
                      </div>
                      <button
                        onClick={signOut}
                        className="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => setAuthOpen(true)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-95"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Sign In</span>
                <span className="sm:hidden">Login</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-blue-500 blur-3xl" />
          <div className="absolute right-0 top-40 h-72 w-72 rounded-full bg-emerald-500 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-indigo-500 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-slate-200 backdrop-blur">
              <Sparkles className="h-4 w-4 text-amber-400" />
              {internships.length} active opportunities
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Launch your career with the
              <span className="block bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
                perfect internship
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
              Browse curated opportunities from world-class companies. Filter by field, location, and
              pay to find the role that fits you.
            </p>
            <div className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-2xl border border-white/15 bg-white/10 p-2 backdrop-blur-md">
              <Search className="ml-2 h-5 w-5 shrink-0 text-slate-300" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, company, or location..."
                className="w-full bg-transparent px-2 py-2 text-white placeholder-slate-400 outline-none"
              />
              {search && (
                <button onClick={() => setSearch('')} className="rounded-lg p-1.5 text-slate-300 hover:bg-white/10">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-md transition-transform hover:-translate-y-1"
              >
                <s.icon className={`mx-auto mb-2 h-6 w-6 ${s.color}`} />
                <div className="text-2xl font-bold text-white">{loading ? '—' : s.value}</div>
                <div className="text-xs text-slate-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Featured */}
        {featured.length > 0 && !search && categoryFilter.length === 0 && typeFilter.length === 0 && (
          <section className="mb-12">
            <div className="mb-5 flex items-center gap-2">
              <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
              <h3 className="text-xl font-bold text-slate-900">Featured Opportunities</h3>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((i) => (
                <InternshipCard key={i.id} internship={i} onClick={() => setSelected(i)} featured />
              ))}
            </div>
          </section>
        )}

        {/* Filters */}
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Filter className="h-4 w-4" />
            Filters
          </div>
          <div className="space-y-4">
            <div>
              <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Category</div>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => toggleArray(c, categoryFilter, setCategoryFilter)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                      categoryFilter.includes(c)
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Type</div>
              <div className="flex flex-wrap gap-2">
                {TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => toggleArray(t, typeFilter, setTypeFilter)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                      typeFilter.includes(t)
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setPaidOnly(!paidOnly)}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                  paidOnly ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <DollarSign className="h-4 w-4" />
                Paid only
              </button>
              <button
                onClick={() => setRemoteOnly(!remoteOnly)}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                  remoteOnly ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <MapPin className="h-4 w-4" />
                Remote only
              </button>
              {(categoryFilter.length > 0 || typeFilter.length > 0 || paidOnly || remoteOnly) && (
                <button
                  onClick={() => {
                    setCategoryFilter([]);
                    setTypeFilter([]);
                    setPaidOnly(false);
                    setRemoteOnly(false);
                  }}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-700"
                >
                  <X className="h-4 w-4" />
                  Clear all
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results header */}
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">
            {loading ? 'Loading...' : `${filtered.length} ${filtered.length === 1 ? 'position' : 'positions'}`}
          </h3>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
            <Briefcase className="mb-4 h-12 w-12 text-slate-300" />
            <h4 className="text-lg font-semibold text-slate-700">No internships found</h4>
            <p className="mt-1 text-sm text-slate-500">Try adjusting your filters or search terms.</p>
            <button
              onClick={openNew}
              className="mt-5 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              <Plus className="h-4 w-4" />
              Post the first one
            </button>
          </div>
        )}

        {/* Grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((i) => (
              <InternshipCard key={i.id} internship={i} onClick={() => setSelected(i)} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-slate-400" />
              <span className="text-sm font-semibold text-slate-600">InternHub</span>
            </div>
            <p className="text-sm text-slate-400">Connecting students with opportunities that matter.</p>
          </div>
        </div>
      </footer>

      {/* Detail drawer */}
      {selected && (
        <InternshipDetail
          internship={selected}
          canEdit={!!user && user.id === selected.user_id}
          onClose={() => setSelected(null)}
          onEdit={() => {
            openEdit(selected);
            setSelected(null);
          }}
          onDelete={() => handleDelete(selected.id)}
          onApply={() => {
            if (!user) {
              setAuthOpen(true);
              return;
            }
            setApplyTarget(selected);
            setSelected(null);
          }}
        />
      )}

      {/* Create/Edit modal */}
      {modalOpen && (
        <InternshipModal
          internship={editing}
          categories={CATEGORIES}
          types={TYPES}
          colors={COLORS}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}

      {/* Auth modal */}
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
      {/* Application form */}
      {applyTarget && user && (
        <ApplicationForm
          internship={applyTarget}
          userEmail={user.email ?? ''}
          onClose={() => setApplyTarget(null)}
        />
      )}
    </div>
  );
}
