import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import EnvelopeScene from '../components/EnvelopeScene';

interface GuestData {
  _id:           string;
  name:          string;
  email:         string;
  numberOfSeats: number;
  inviteToken:   string;
  rsvp:          { status: string; attendingCount: number } | null;
}

export default function GuestInvite() {
  const { token }            = useParams<{ token: string }>();
  const [guest,   setGuest]  = useState<GuestData | null>(null);
  const [loading, setLoading]= useState(true);
  const [error,   setError]  = useState('');

  useEffect(() => {
    if (!token) return;
    api.get<GuestData>(`/guests/${token}`)
      .then(r => setGuest(r.data))
      .catch(() => setError('Invitation not found or has expired.'))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return (
    <div className="min-h-screen bg-sky-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-sky-300 border-t-sky-500 rounded-full
          animate-spin mx-auto mb-4" />
        <p className="text-slate-500 text-sm">Loading your invitation...</p>
      </div>
    </div>
  );

  if (error || !guest) return (
    <div className="min-h-screen bg-sky-50 flex items-center justify-center">
      <div className="text-center p-8">
        <p className="text-4xl mb-4">✉️</p>
        <h2 className="text-slate-700 text-xl font-medium mb-2">Invitation Not Found</h2>
        <p className="text-slate-500 text-sm">{error}</p>
      </div>
    </div>
  );

  return (
    <EnvelopeScene
      guestName={guest.name}
      token={guest.inviteToken}
      rsvp={guest.rsvp}
    />
  );
}