import { useState, useEffect } from 'react';

interface LockScreenProps {
  onUnlock: () => void;
}

export default function LockScreen({ onUnlock }: LockScreenProps) {
  const [time, setTime] = useState(new Date());
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const diff = dragStartY - e.touches[0].clientY;
    if (diff > 0) {
      setDragY(Math.min(diff, window.innerHeight));
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (dragY > window.innerHeight * 0.3) {
      setShowLogin(true);
    }
    setDragY(0);
  };

  const handleLogin = () => {
    onUnlock();
  };

  const handleClick = () => {
    if (!showLogin) {
      setShowLogin(true);
    }
  };

  if (showLogin) {
    return (
      <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #0078d4 0%, #005a9e 30%, #003a6a 60%, #001f3f 100%)',
        }}
      >
        {/* Blurred background effect */}
        <div className="absolute inset-0 backdrop-blur-md bg-black/20" />
        
        <div className="relative z-10 flex flex-col items-center">
          {/* User avatar */}
          <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-4xl font-bold mb-4 shadow-lg">
            U
          </div>
          
          {/* Username */}
          <h2 className="text-white text-xl font-medium mb-4">User</h2>
          
          {/* Password field */}
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="flex flex-col items-center">
            <div className="flex items-center bg-white/10 border border-white/20 rounded">
              <input
                type="password"
                className="bg-transparent text-white placeholder-white/50 px-4 py-2.5 text-sm outline-none w-56"
                placeholder="Password (press Enter)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                style={{ userSelect: 'text' }}
              />
              <button
                type="submit"
                className="px-3 py-2.5 text-white/70 hover:text-white"
              >
                <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM6.2 5.2l4.6 2.8-4.6 2.8V5.2z" />
                </svg>
              </button>
            </div>
            <button
              type="button"
              className="text-white/60 text-xs mt-2 hover:text-white/80"
              onClick={handleLogin}
            >
              Sign-in options
            </button>
          </form>

          {/* Power options */}
          <div className="absolute bottom-8 right-8 flex gap-3">
            <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 text-white/70">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0v-5A.5.5 0 0 1 8 0z" />
                <path d="M3.5 3.5a.5.5 0 0 1 .7.0A5.5 5.5 0 1 0 12 3.5a.5.5 0 0 1 .7-.7 6.5 6.5 0 1 1-9.9 0 .5.5 0 0 1 .7.7z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center cursor-pointer transition-transform duration-200"
      style={{
        background: 'linear-gradient(135deg, #0078d4 0%, #005a9e 30%, #003a6a 60%, #001f3f 100%)',
        transform: `translateY(-${dragY}px)`,
        opacity: 1 - (dragY / window.innerHeight) * 0.5,
      }}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Light effects */}
      <div className="absolute inset-0 opacity-30" style={{
        background: 'radial-gradient(ellipse at 30% 60%, rgba(255,255,255,0.2) 0%, transparent 50%), radial-gradient(ellipse at 70% 40%, rgba(100,200,255,0.15) 0%, transparent 40%)',
      }} />

      {/* Time */}
      <div className="relative z-10 text-center">
        <h1 className="text-white text-7xl font-light mb-2 drop-shadow-lg" style={{ fontSize: 'clamp(3rem, 10vw, 6rem)' }}>
          {formatTime(time)}
        </h1>
        <p className="text-white/90 text-xl font-light drop-shadow-md" style={{ fontSize: 'clamp(1rem, 3vw, 1.5rem)' }}>
          {formatDate(time)}
        </p>
      </div>

      {/* Swipe up hint */}
      <div className="absolute bottom-12 text-white/50 text-sm animate-bounce">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto mb-1">
          <path d="M18 15l-6-6-6 6" />
        </svg>
        Swipe up or click to unlock
      </div>
    </div>
  );
}
