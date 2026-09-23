import { useState, useEffect } from 'react';

interface TaskbarProps {
  onStartClick: () => void;
  startOpen: boolean;
  openWindows: { id: string; title: string; icon: string; isMinimized: boolean }[];
  onWindowClick: (id: string) => void;
  onActionCenterClick: () => void;
  onCalendarClick: () => void;
  onQuickSettingsClick: () => void;
  onTaskViewClick: () => void;
  onWindowHover: (appId: string, x: number) => void;
  onWindowLeave: () => void;
  actionCenterOpen: boolean;
  calendarOpen: boolean;
  quickSettingsOpen: boolean;
  taskViewOpen: boolean;
}

export default function Taskbar({
  onStartClick,
  startOpen,
  openWindows,
  onWindowClick,
  onActionCenterClick,
  onCalendarClick,
  onQuickSettingsClick,
  onTaskViewClick,
  onWindowHover,
  onWindowLeave,
  actionCenterOpen,
  calendarOpen,
  quickSettingsOpen,
  taskViewOpen,
}: TaskbarProps) {
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
    <div className="absolute bottom-0 left-0 right-0 h-[48px] bg-[#1f1f1f]/96 backdrop-blur-md flex items-center z-[9999] border-t border-white/5">
      {/* Start Button */}
      <button
        className={`h-full w-[48px] flex items-center justify-center transition-colors ${startOpen ? 'bg-white/12' : 'hover:bg-white/8'}`}
        onClick={onStartClick}
        onTouchEnd={(e) => { e.preventDefault(); onStartClick(); }}
        title="Start"
      >
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <rect x="1" y="1" width="8.5" height="8.5" fill="#4cc2ff" />
          <rect x="10.5" y="1" width="8.5" height="8.5" fill="#4cc2ff" />
          <rect x="1" y="10.5" width="8.5" height="8.5" fill="#4cc2ff" />
          <rect x="10.5" y="10.5" width="8.5" height="8.5" fill="#4cc2ff" />
        </svg>
      </button>

      {/* Search */}
      <div className="h-[32px] ml-1.5 px-3 bg-white/8 rounded-[4px] flex items-center min-w-[180px] max-w-[260px] hover:bg-white/12 transition-colors cursor-text">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="white" className="opacity-50 mr-2 flex-shrink-0">
          <circle cx="7" cy="7" r="5.5" fill="none" stroke="white" strokeWidth="1.5" opacity="0.5" />
          <line x1="11" y1="11" x2="14.5" y2="14.5" stroke="white" strokeWidth="1.5" opacity="0.5" />
        </svg>
        <span className="text-white/50 text-[13px] truncate">Type here to search</span>
      </div>

      {/* Task View */}
      <button
        className={`h-full w-[40px] flex items-center justify-center transition-colors ${taskViewOpen ? 'bg-white/12' : 'hover:bg-white/8'}`}
        onClick={(e) => { e.stopPropagation(); onTaskViewClick(); }}
        onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); onTaskViewClick(); }}
        title="Task View"
      >
        <svg width="16" height="16" viewBox="0 0 18 18" fill="none" className="text-white/70">
          <rect x="1" y="1" width="6.5" height="6.5" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
          <rect x="10.5" y="1" width="6.5" height="6.5" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
          <rect x="1" y="10.5" width="6.5" height="6.5" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
          <rect x="10.5" y="10.5" width="6.5" height="6.5" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </button>

      {/* Pinned apps / File Explorer */}
      <button className="h-full w-[44px] flex items-center justify-center hover:bg-white/8 transition-colors" title="File Explorer">
        <span className="text-xl">📁</span>
      </button>

      <button className="h-full w-[44px] flex items-center justify-center hover:bg-white/8 transition-colors" title="Microsoft Edge">
        <span className="text-xl">🌐</span>
      </button>

      {/* Separator */}
      <div className="w-px h-5 bg-white/10 mx-0.5" />

      {/* Open Windows */}
      <div className="flex-1 flex items-center h-full ml-0.5 overflow-x-auto">
        {openWindows.map(win => (
          <button
            key={win.id}
            className={`h-full min-w-[44px] max-w-[160px] px-2 flex items-center gap-1.5 transition-colors relative ${
              !win.isMinimized
                ? 'bg-white/12 hover:bg-white/16'
                : 'hover:bg-white/8'
            }`}
            onClick={() => onWindowClick(win.id)}
            onTouchEnd={() => onWindowClick(win.id)}
            onMouseEnter={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              onWindowHover(win.id, rect.left + rect.width / 2);
            }}
            onMouseLeave={onWindowLeave}
            title={win.title}
          >
            <span className="text-base flex-shrink-0">{win.icon}</span>
            <span className="text-white/80 text-[11px] truncate hidden md:inline">{win.title}</span>
            {/* Active indicator */}
            {!win.isMinimized && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[20px] h-[2px] bg-[#4cc2ff] rounded-full" />
            )}
            {win.isMinimized && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[6px] h-[2px] bg-white/40 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* System Tray */}
      <div className="flex items-center h-full ml-auto flex-shrink-0">
        {/* Show hidden icons */}
        <button className="h-full w-[20px] flex items-center justify-center hover:bg-white/8">
          <svg width="8" height="8" viewBox="0 0 8 8" fill="white" className="opacity-50">
            <path d="M1 5l3-3 3 3" fill="none" stroke="white" strokeWidth="1.2" opacity="0.5" />
          </svg>
        </button>

        {/* Network, Sound, Battery */}
        <button
          className={`h-full px-1.5 flex items-center gap-1.5 hover:bg-white/8 transition-colors ${quickSettingsOpen ? 'bg-white/12' : ''}`}
          title="Network & Sound"
          onClick={(e) => { e.stopPropagation(); onQuickSettingsClick(); }}
          onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); onQuickSettingsClick(); }}
        >
          <svg width="14" height="12" viewBox="0 0 16 14" fill="none" className="text-white/70">
            <path d="M1 10 Q8 2 15 10" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4" />
            <path d="M3 10 Q8 5 13 10" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6" />
            <path d="M5 10 Q8 7 11 10" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.8" />
            <circle cx="8" cy="11" r="1.5" fill="currentColor" />
          </svg>
          <svg width="14" height="12" viewBox="0 0 16 14" fill="none" className="text-white/70">
            <path d="M3 5 L3 11 L6 11 L10 14 L10 2 L6 5 Z" fill="currentColor" opacity="0.8" />
            <path d="M12 4 Q14 7 12 10" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.6" />
          </svg>
          <svg width="18" height="10" viewBox="0 0 22 12" fill="none" className="text-white/70">
            <rect x="0.5" y="0.5" width="18" height="11" rx="1.5" stroke="currentColor" strokeWidth="1" opacity="0.6" />
            <rect x="2" y="2" width="13" height="8" rx="0.5" fill="currentColor" opacity="0.7" />
            <rect x="19.5" y="3.5" width="2" height="5" rx="0.5" fill="currentColor" opacity="0.4" />
          </svg>
        </button>

        {/* Clock / Calendar */}
        <button
          className={`h-full px-3 flex flex-col items-center justify-center hover:bg-white/8 transition-colors ${calendarOpen ? 'bg-white/12' : ''}`}
          onClick={onCalendarClick}
          onTouchEnd={(e) => { e.preventDefault(); onCalendarClick(); }}
        >
          <span className="text-white/90 text-[12px] leading-[14px]">{formatTime(time)}</span>
          <span className="text-white/90 text-[12px] leading-[14px]">{formatDate(time)}</span>
        </button>

        {/* Notification / Action Center */}
        <button
          className={`h-full w-[40px] flex items-center justify-center hover:bg-white/8 transition-colors ${actionCenterOpen ? 'bg-white/12' : ''}`}
          onClick={onActionCenterClick}
          onTouchEnd={(e) => { e.preventDefault(); onActionCenterClick(); }}
          title="Notifications"
        >
          <div className="relative">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="white" className="opacity-70">
              <rect x="1" y="1" width="14" height="10" rx="1" fill="none" stroke="white" strokeWidth="1.2" opacity="0.7" />
              <line x1="4" y1="13" x2="12" y2="13" stroke="white" strokeWidth="1.2" opacity="0.7" />
            </svg>
            {/* Notification badge */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full flex items-center justify-center">
              <span className="text-[7px] text-white font-bold">3</span>
            </div>
          </div>
        </button>

        {/* Show Desktop */}
        <button
          className="h-full w-[5px] hover:bg-white/20 transition-colors border-l border-white/5"
          title="Show Desktop"
        />
      </div>
    </div>
  );
}
