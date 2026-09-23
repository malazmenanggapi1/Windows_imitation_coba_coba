import { useState, useEffect } from 'react';

interface BootScreenProps {
  onComplete: () => void;
}

export default function BootScreen({ onComplete }: BootScreenProps) {
  const [phase, setPhase] = useState<'logo' | 'loading' | 'welcome'>('logo');
  const [dots, setDots] = useState(0);

  useEffect(() => {
    // Phase 1: Logo (1.5s)
    const t1 = setTimeout(() => setPhase('loading'), 1500);
    // Phase 2: Loading dots (3s)
    const t2 = setTimeout(() => setPhase('welcome'), 4500);
    // Phase 3: Welcome -> complete (1.5s)
    const t3 = setTimeout(() => onComplete(), 6000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  useEffect(() => {
    if (phase !== 'loading') return;
    const interval = setInterval(() => {
      setDots(d => (d + 1) % 6);
    }, 300);
    return () => clearInterval(interval);
  }, [phase]);

  if (phase === 'welcome') {
    return (
      <div className="fixed inset-0 z-[999999] bg-[#0078d4] flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <h1 className="text-white text-4xl font-light">Welcome</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[999999] bg-black flex flex-col items-center justify-center">
      {/* Windows Logo */}
      <div className="mb-12">
        <svg width="88" height="88" viewBox="0 0 88 88" fill="none">
          <rect x="2" y="2" width="38" height="38" fill="#f25022" />
          <rect x="48" y="2" width="38" height="38" fill="#7fba00" />
          <rect x="2" y="48" width="38" height="38" fill="#00a4ef" />
          <rect x="48" y="48" width="38" height="38" fill="#ffb900" />
        </svg>
      </div>

      {/* Loading spinner */}
      {phase === 'loading' && (
        <div className="flex items-center gap-1.5">
          {[0, 1, 2, 3, 4].map(i => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-white"
              style={{
                opacity: ((dots + i) % 5) / 5 + 0.2,
                transform: `scale(${0.6 + ((dots + i) % 5) * 0.1})`,
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
