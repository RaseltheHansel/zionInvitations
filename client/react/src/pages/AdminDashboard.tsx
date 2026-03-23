import { useEffect, useState } from 'react';
import api from '../api/axios';

interface Guest {
  _id:           string;
  name:          string;
  email:         string;
  phone?:        string;
  numberOfSeats: number;
  inviteToken:   string;
  rsvp:          { status: string; attendingCount: number; message?: string } | null;
}

interface Stats {
  total:          number;
  accepted:       number;
  declined:       number;
  pending:        number;
  totalAttending: number;
}

export default function AdminDashboard() {
  const [guests,  setGuests]  = useState<Guest[]>([]);
  const [stats,   setStats]   = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [form,    setForm]    = useState({ name: '', email: '', phone: '', numberOfSeats: 1 });
  const [adding,  setAdding]  = useState(false);
  const [copied,  setCopied]  = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [gRes, sRes] = await Promise.all([
        api.get<Guest[]>('/guests'),
        api.get<Stats>('/rsvp/stats'),
      ]);
      setGuests(gRes.data);
      setStats(sRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async () => {
    if (!form.name || !form.email) return;
    setAdding(true);
    try {
      await api.post('/guests', form);
      setForm({ name: '', email: '', phone: '', numberOfSeats: 1 });
      fetchData();
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this guest?')) return;
    await api.delete(`/guests/${id}`);
    fetchData();
  };

  const copyLink = (token: string) => {
    const link = `${window.location.origin}/invite/${token}`;
    navigator.clipboard.writeText(link);
    setCopied(token);
    setTimeout(() => setCopied(null), 2000);
  };

  const statusColor = (status: string) => {
    if (status === 'accepted') return 'bg-green-100 text-green-700';
    if (status === 'declined') return 'bg-red-100 text-red-600';
    return 'bg-yellow-100 text-yellow-700';
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <div className="bg-linear-to-r from-sky-500 to-blue-600 text-white p-6 shadow">
        <div className="max-w-5xl mx-auto">
          <p className="text-sky-200 text-xs tracking-widest uppercase mb-1">Admin</p>
          <h1 className="text-2xl font-light">Christening Guest Manager</h1>
          <p className="text-sky-100 text-sm mt-1">Emmette Zion Gabriel Amorsolo — May 3, 3:30 PM</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6 space-y-6">

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: 'Total Guests',   value: stats.total,          color: 'text-slate-700' },
              { label: 'Accepted',       value: stats.accepted,       color: 'text-green-600' },
              { label: 'Declined',       value: stats.declined,       color: 'text-red-500'   },
              { label: 'Pending',        value: stats.pending,        color: 'text-yellow-600' },
              { label: 'Total Attending',value: stats.totalAttending, color: 'text-sky-600'   },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm text-center">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-slate-400 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Add Guest Form */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-slate-700 font-medium mb-4">Add Guest</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              placeholder="Full name *"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none
                focus:border-sky-400 placeholder:text-slate-300"
            />
            <input
              placeholder="Email address *"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none
                focus:border-sky-400 placeholder:text-slate-300"
            />
            <input
              placeholder="Phone (optional)"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none
                focus:border-sky-400 placeholder:text-slate-300"
            />
            <div className="flex gap-2">
              <input
                type="number" min={1} max={10}
                placeholder="Seats"
                value={form.numberOfSeats}
                onChange={e => setForm(f => ({ ...f, numberOfSeats: Number(e.target.value) }))}
                className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none
                  focus:border-sky-400 w-20"
              />
              <button
                onClick={handleAdd}
                disabled={adding || !form.name || !form.email}
                className="flex-1 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white
                  rounded-xl text-sm font-medium transition-colors duration-200">
                {adding ? 'Adding...' : '+ Add'}
              </button>
            </div>
          </div>
        </div>

        {/* Guest List */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-slate-700 font-medium">Guest List ({guests.length})</h2>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400 text-sm">Loading...</div>
          ) : guests.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              No guests yet. Add your first guest above.
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {guests.map(g => (
                <div key={g._id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">

                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-600
                    flex items-center justify-center text-sm font-bold shrink-0">
                    {g.name[0].toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-700 text-sm truncate">{g.name}</p>
                    <p className="text-slate-400 text-xs truncate">{g.email}</p>
                    {g.rsvp?.message && (
                      <p className="text-slate-400 text-xs italic mt-0.5 truncate">
                        "{g.rsvp.message}"
                      </p>
                    )}
                  </div>

                  {/* Seats */}
                  <div className="text-center shrink-0 hidden md:block">
                    <p className="text-slate-700 text-sm font-medium">{g.numberOfSeats}</p>
                    <p className="text-slate-400 text-xs">seats</p>
                  </div>

                  {/* RSVP Status */}
                  <span className={`px-3 py-1 rounded-full text-xs font-medium shrink-0
                    ${statusColor(g.rsvp?.status || 'pending')}`}>
                    {g.rsvp?.status || 'pending'}
                    {g.rsvp?.status === 'accepted' && g.rsvp.attendingCount
                      ? ` (${g.rsvp.attendingCount})`
                      : ''}
                  </span>

                  {/* Actions */}
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => copyLink(g.inviteToken)}
                      className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-600
                        rounded-lg text-xs font-medium transition-colors duration-200">
                      {copied === g.inviteToken ? '✓ Copied!' : 'Copy Link'}
                    </button>
                    <button
                      onClick={() => handleDelete(g._id)}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-500
                        rounded-lg text-xs font-medium transition-colors duration-200">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}