import { useState } from 'react';
import RSVPForm from './RSVPForm';

interface Props {
  guestName: string;
  token:     string;
  rsvp:      { status: string; attendingCount?: number } | null;
  onClose:   () => void;
}

export default function InvitationModal({ guestName, token, rsvp, onClose }: Props) {
  const [showRSVP, setShowRSVP] = useState(false);
  const [rsvpDone, setRsvpDone] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState(rsvp?.status || 'pending');

  const handleRSVPSuccess = (status: string) => {
    setRsvpStatus(status);
    setRsvpDone(true);
    setShowRSVP(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(8px)' }}>
      <div
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden
          animate-[slideUp_0.5s_cubic-bezier(0.34,1.3,0.64,1)_forwards]"
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >

        {/* Top banner */}
        <div className="bg-gradient-to-br from-sky-400 to-blue-500 p-8 text-center relative">
          <button onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl leading-none">
            ×
          </button>

          {/* Cross ornament */}
          <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/40
            flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">✝</span>
          </div>

          <p className="text-sky-100 text-xs tracking-[0.3em] uppercase mb-1">
            Holy Baptism
          </p>
          <h2 className="text-white font-light text-2xl leading-tight"
            style={{ fontFamily: 'Georgia, serif' }}>
            Emmette Zion Gabriel
          </h2>
          <p className="text-white/80 text-lg mt-1"
            style={{ fontFamily: 'Georgia, serif' }}>
            Amorsolo
          </p>
        </div>

        {/* Invitation body */}
        <div className="p-8 text-center">

          {/* Decorative divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-sky-100" />
            <span className="text-sky-300 text-lg">✦</span>
            <div className="flex-1 h-px bg-sky-100" />
          </div>

          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            Together with our families, we joyfully invite you to celebrate the
            <span className="text-sky-500 font-medium"> Holy Baptism</span> of our beloved child
          </p>

          {/* Event details */}
          <div className="space-y-4 mb-6">
            <div className="bg-sky-50 rounded-xl p-4 border border-sky-100">
              <p className="text-sky-400 text-xs tracking-widest uppercase mb-1">Date & Time</p>
              <p className="text-slate-700 font-medium">Saturday, May 3rd</p>
              <p className="text-slate-600 text-sm">3:30 in the afternoon</p>
            </div>

            <div className="bg-sky-50 rounded-xl p-4 border border-sky-100">
              <p className="text-sky-400 text-xs tracking-widest uppercase mb-1">Venue</p>
              <p className="text-slate-700 font-medium">To be announced</p>
              <p className="text-slate-500 text-sm">Address here</p>
            </div>

            <div className="bg-sky-50 rounded-xl p-4 border border-sky-100">
              <p className="text-sky-400 text-xs tracking-widest uppercase mb-1">Parents</p>
              <p className="text-slate-700 font-medium">To be updated</p>
            </div>
          </div>

          {/* Bible verse */}
          <div className="border-l-4 border-sky-200 pl-4 mb-6 text-left">
            <p className="text-slate-500 text-sm italic leading-relaxed">
              "Before I formed you in the womb I knew you, before you were born I set you apart."
            </p>
            <p className="text-sky-400 text-xs mt-1">— Jeremiah 1:5</p>
          </div>

          <p className="text-slate-500 text-sm mb-6">
            Kindly extend this invitation to{' '}
            <span className="text-sky-500 font-medium">{guestName}</span>
          </p>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-sky-100" />
            <span className="text-sky-300 text-lg">✦</span>
            <div className="flex-1 h-px bg-sky-100" />
          </div>

          {/* RSVP Section */}
          {rsvpDone || rsvpStatus !== 'pending' ? (
            <div className={`rounded-xl p-4 text-center ${
              rsvpStatus === 'accepted'
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              <p className={`font-medium ${
                rsvpStatus === 'accepted' ? 'text-green-700' : 'text-red-600'
              }`}>
                {rsvpStatus === 'accepted'
                  ? '🎉 Thank you! We look forward to seeing you!'
                  : 'We understand. Thank you for letting us know.'}
              </p>
            </div>
          ) : showRSVP ? (
            <RSVPForm
              token={token}
              onSuccess={handleRSVPSuccess}
              onCancel={() => setShowRSVP(false)}
            />
          ) : (
            <div>
              <p className="text-slate-500 text-sm mb-4">
                Will you be joining us for this special occasion?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRSVP(true)}
                  className="flex-1 bg-sky-500 hover:bg-sky-600 text-white py-3 rounded-xl
                    font-medium transition-colors duration-200">
                  Yes, I'll be there 🎉
                </button>
                <button
                  onClick={() => setShowRSVP(true)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-3 rounded-xl
                    font-medium transition-colors duration-200">
                  Can't make it
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}