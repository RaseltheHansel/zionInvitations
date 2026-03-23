import { useState } from 'react';
import InvitationModal from './InvitationModal';

interface Props {
  guestName: string;
  token:     string;
  rsvp:      { status: string } | null;
}

export default function EnvelopeScene({ guestName, token, rsvp }: Props) {
  const [opened,     setOpened]     = useState(false);
  const [showModal,  setShowModal]  = useState(false);
  const [animating,  setAnimating]  = useState(false);

  const handleClick = () => {
    if (animating || opened) return;
    setAnimating(true);
    setOpened(true);
    setTimeout(() => {
      setShowModal(true);
      setAnimating(false);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-blue-50 flex flex-col items-center justify-center px-4 relative overflow-hidden">

      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div key={i}
            className="absolute rounded-full opacity-20"
            style={{
              width:  `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              background: i % 2 === 0 ? '#93c5fd' : '#bfdbfe',
              left:   `${Math.random() * 100}%`,
              top:    `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Header text */}
      <div className="text-center mb-10 z-10">
        <p className="text-sky-400 text-sm tracking-[0.3em] uppercase font-light mb-2">
          You are cordially invited
        </p>
        <h1 className="text-3xl md:text-4xl font-light text-slate-700"
          style={{ fontFamily: 'Georgia, serif' }}>
          Dear <span className="text-sky-500 italic">{guestName}</span>
        </h1>
      </div>

      {/* Envelope */}
      <div
        className={`relative cursor-pointer z-10 select-none
          transition-transform duration-300 hover:scale-105 hover:-translate-y-1
          ${opened ? 'cursor-default hover:scale-100 hover:translate-y-0' : ''}`}
        onClick={handleClick}
        style={{ width: '320px', height: '220px' }}
      >
        {/* Envelope body */}
        <div className="absolute inset-0 bg-white rounded-lg shadow-2xl border border-blue-100 overflow-hidden">

          {/* Envelope bottom triangle */}
          <div className="absolute bottom-0 left-0 right-0 h-28 overflow-hidden">
            <div className="absolute bottom-0 left-0 right-0"
              style={{
                width: 0,
                height: 0,
                borderLeft: '160px solid transparent',
                borderRight: '160px solid transparent',
                borderBottom: '112px solid #dbeafe',
              }}
            />
          </div>

          {/* Left triangle */}
          <div className="absolute top-0 bottom-0 left-0 overflow-hidden">
            <div style={{
              width: 0, height: 0,
              borderTop: '110px solid transparent',
              borderBottom: '110px solid transparent',
              borderLeft: '160px solid #eff6ff',
            }} />
          </div>

          {/* Right triangle */}
          <div className="absolute top-0 bottom-0 right-0 overflow-hidden">
            <div style={{
              width: 0, height: 0,
              borderTop: '110px solid transparent',
              borderBottom: '110px solid transparent',
              borderRight: '160px solid #dbeafe',
            }} />
          </div>

          {/* Seal */}
          {!opened && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sky-400 to-blue-500
                flex items-center justify-center shadow-lg border-2 border-white
                transition-all duration-300">
                <span className="text-white text-xl">✝</span>
              </div>
            </div>
          )}
        </div>

        {/* Top flap — animates open */}
        <div
          className="absolute top-0 left-0 right-0 z-30 origin-top transition-transform"
          style={{
            height: '110px',
            clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
            background: 'linear-gradient(160deg, #bfdbfe 0%, #93c5fd 100%)',
            transform: opened ? 'rotateX(-180deg)' : 'rotateX(0deg)',
            transitionDuration: '0.8s',
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
            transformStyle: 'preserve-3d',
            perspective: '600px',
          }}
        />

        {/* Card peeking out */}
        {opened && (
          <div
            className="absolute left-4 right-4 bg-white rounded shadow-lg z-20
              flex items-center justify-center border border-blue-100"
            style={{
              height: '60px',
              bottom: '20px',
              animation: 'riseCard 0.7s 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards',
              opacity: 0,
              transform: 'translateY(0)',
            }}
          >
            <p className="text-sky-400 text-xs tracking-widest uppercase">Open Invitation</p>
          </div>
        )}
      </div>

      {/* Click hint */}
      {!opened && (
        <p className="mt-8 text-slate-400 text-sm z-10"
          style={{ animation: 'pulse 2s ease-in-out infinite' }}>
          Click the envelope to open ✉️
        </p>
      )}

      {/* RSVP status badge */}
      {rsvp && rsvp.status !== 'pending' && (
        <div className={`mt-6 px-6 py-2 rounded-full text-sm font-medium z-10
          ${rsvp.status === 'accepted'
            ? 'bg-green-100 text-green-700 border border-green-200'
            : 'bg-red-100 text-red-600 border border-red-200'}`}>
          {rsvp.status === 'accepted' ? '✓ You have accepted this invitation' : '✗ You have declined this invitation'}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <InvitationModal
          guestName={guestName}
          token={token}
          rsvp={rsvp}
          onClose={() => setShowModal(false)}
        />
      )}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes riseCard {
          from { opacity: 0.3; transform: translateY(0); }
          to   { opacity: 1;   transform: translateY(-20px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1; }
        }
      `}</style>
    </div>
  );
}