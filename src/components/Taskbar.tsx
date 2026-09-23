import { useState, useEffect } from 'react';

interface TaskbarProps {
  onStartClick: () => void;
  startOpen: boolean;
  openWindows: { id: string; title: string; icon: string; isMinimized: boolean }[];
  onWindowClick: (id: string) => void;
}

export default function Taskbar({ onStartClick, startOpen, openWindows, onWindowClick }: TaskbarProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gray-900/95 backdrop-blur-sm flex items-center z-[9999] border-t border-gray-700/50">
      {/* Start Button */}
      <button
        className={`h-full px-4 flex items-center justify-center taskbar-item transition-colors ${startOpen ? 'bg-white/15' : ''}`}
        onClick={onStartClick}
        onTouchEnd={onStartClick}
      >
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <rect x="1" y="1" width="8" height="8" fill="#4cc2ff" />
          <rect x="11" y="1" width="8" height="8" fill="#4cc2ff" />
          <rect x="1" y="11" width="8" height="8" fill="#4cc2ff" />
          <rect x="11" y="11" width="8" height="8" fill="#4cc2ff" />
        </svg>
      </button>

      {/* Search */}
      <div className="h-8 ml-2 px-3 bg-white/10 rounded flex items-center min-w-[180px] max-w-[260px]">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="white" className="opacity-60 mr-2 flex-shrink-0">
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
        </svg>
        <span className="text-white/60 text-sm truncate">Type here to search</span>
      </div>

      {/* Task View */}
      <button className="h-full px-3 flex items-center justify-center taskbar-item">
        <svg width="18" height="18" viewBox="0 0 20 20" fill="white" className="opacity-80">
          <rect x="1" y="1" width="7" height="7" rx="1" />
          <rect x="12" y="1" width="7" height="7" rx="1" />
          <rect x="1" y="12" width="7" height="7" rx="1" />
          <rect x="12" y="12" width="7" height="7" rx="1" />
        </svg>
      </button>

      {/* Open Windows */}
      <div className="flex-1 flex items-center h-full ml-1 overflow-x-auto">
        {openWindows.map(win => (
          <button
            key={win.id}
            className={`h-full px-3 flex items-center justify-center taskbar-item transition-colors min-w-[44px] ${!win.isMinimized ? 'active' : ''}`}
            onClick={() => onWindowClick(win.id)}
            onTouchEnd={() => onWindowClick(win.id)}
            title={win.title}
          >
            <span className="text-lg mr-1">{win.icon}</span>
            <span className="text-white/90 text-xs truncate max-w-[100px] hidden sm:inline">{win.title}</span>
          </button>
        ))}
      </div>

      {/* System Tray */}
      <div className="flex items-center h-full ml-auto">
        <button className="h-full px-2 flex items-center taskbar-item">
          <span className="text-white/70 text-xs">▲</span>
        </button>
        
        {/* Network, Sound, Battery icons */}
        <div className="flex items-center px-2 gap-2">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="white" className="opacity-70">
            <path d="M1 14.5A1.5 1.5 0 0 0 2.5 16h11a1.5 1.5 0 0 0 1.5-1.5v-5a1.5 1.5 0 0 0-1.5-1.5h-11A1.5 1.5 0 0 0 1 9.5v5z" />
            <path d="M2 3h12v2H2V3z" fill="white" opacity="0.5" />
          </svg>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="white" className="opacity-70">
            <path d="M11.5 1a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-1 0v-13a.5.5 0 0 1 .5-.5z" />
            <path d="M3 8a5 5 0 0 1 10 0" fill="none" stroke="white" strokeWidth="1.5" opacity="0.7" />
            <path d="M5 8a3 3 0 0 1 6 0" fill="none" stroke="white" strokeWidth="1.5" opacity="0.7" />
          </svg>
          <svg width="16" height="14" viewBox="0 0 20 14" fill="white" className="opacity-70">
            <rect x="1" y="2" width="15" height="10" rx="1" fill="none" stroke="white" strokeWidth="1.5" />
            <rect x="3" y="4" width="10" height="6" rx="0.5" fill="white" opacity="0.7" />
            <rect x="17" y="5" width="2" height="4" rx="0.5" fill="white" opacity="0.7" />
          </svg>
        </div>

        {/* Clock */}
        <button className="h-full px-3 flex flex-col items-center justify-center taskbar-item">
          <span className="text-white/90 text-xs leading-tight">{formatTime(time)}</span>
          <span className="text-white/90 text-xs leading-tight">{formatDate(time)}</span>
        </button>

        {/* Notification */}
        <button className="h-full px-2 flex items-center taskbar-item">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="white" className="opacity-70">
            <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
