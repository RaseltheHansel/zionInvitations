import { useState } from 'react';
import api from '../api/axios';

interface Props {
  token:     string;
  onSuccess: (status: string) => void;
  onCancel:  () => void;
}

export default function RSVPForm({ token, onSuccess, onCancel }: Props) {
  const [status,   setStatus]   = useState<'accepted' | 'declined'>('accepted');
  const [count,    setCount]    = useState(1);
  const [message,  setMessage]  = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await api.post(`/rsvp/${token}`, {
        status,
        attendingCount: status === 'accepted' ? count : 0,
        message,
      });
      onSuccess(status);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 text-left">
      <p className="text-slate-600 text-sm font-medium text-center">Your RSVP</p>

      {/* Accept / Decline toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setStatus('accepted')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200
            ${status === 'accepted'
              ? 'bg-sky-500 text-white border-sky-500'
              : 'bg-white text-slate-500 border-slate-200 hover:border-sky-300'}`}>
          ✓ Accept
        </button>
        <button
          onClick={() => setStatus('declined')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200
            ${status === 'declined'
              ? 'bg-red-400 text-white border-red-400'
              : 'bg-white text-slate-500 border-slate-200 hover:border-red-300'}`}>
          ✗ Decline
        </button>
      </div>

      {/* Number of attendees */}
      {status === 'accepted' && (
        <div>
          <label className="text-xs text-slate-500 block mb-1">Number of attendees</label>
          <div className="flex items-center gap-3">
            <button onClick={() => setCount(c => Math.max(1, c - 1))}
              className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 font-bold
                flex items-center justify-center hover:bg-sky-200 transition-colors">
              −
            </button>
            <span className="text-slate-700 font-medium w-8 text-center">{count}</span>
            <button onClick={() => setCount(c => Math.min(10, c + 1))}
              className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 font-bold
                flex items-center justify-center hover:bg-sky-200 transition-colors">
              +
            </button>
          </div>
        </div>
      )}

      {/* Message */}
      <div>
        <label className="text-xs text-slate-500 block mb-1">Message (optional)</label>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Leave a message for the family..."
          rows={3}
          className="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-700
            outline-none focus:border-sky-400 resize-none placeholder:text-slate-300"
        />
      </div>

      {error && <p className="text-red-500 text-xs">{error}</p>}

      <div className="flex gap-2">
        <button onClick={onCancel}
          className="px-4 py-2.5 rounded-xl text-sm text-slate-500 border border-slate-200
            hover:bg-slate-50 transition-colors">
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white
            py-2.5 rounded-xl text-sm font-medium transition-colors duration-200">
          {loading ? 'Submitting...' : 'Submit RSVP'}
        </button>
      </div>
    </div>
  );
}