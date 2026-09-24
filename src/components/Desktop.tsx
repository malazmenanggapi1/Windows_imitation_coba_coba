import { useState } from 'react';
import { DesktopIcon } from '../types';

interface DesktopProps {
  onAppOpen: (component: string, title: string, icon: string) => void;
  onContextMenu: (x: number, y: number) => void;
  onDesktopClick?: () => void;
}

const desktopIcons: DesktopIcon[] = [
  { id: 'pc', title: 'This PC', icon: '💻', component: 'explorer' },
  { id: 'recycle', title: 'Recycle Bin', icon: '🗑️', component: 'recyclebin' },
  { id: 'notepad', title: 'Notepad', icon: '📝', component: 'notepad' },
  { id: 'calculator', title: 'Calculator', icon: '🔢', component: 'calculator' },
  { id: 'explorer', title: 'File Explorer', icon: '📁', component: 'explorer' },
  { id: 'browser', title: 'Microsoft Edge', icon: '🌐', component: 'browser' },
  { id: 'terminal', title: 'Terminal', icon: '⬛', component: 'terminal' },
  { id: 'settings', title: 'Settings', icon: '⚙️', component: 'settings' },
  { id: 'paint', title: 'Paint', icon: '🎨', component: 'paint' },
  { id: 'taskmanager', title: 'Task Manager', icon: '📊', component: 'taskmanager' },
  { id: 'photos', title: 'Photos', icon: '🖼️', component: 'photos' },
];

export default function Desktop({ onAppOpen, onContextMenu, onDesktopClick }: DesktopProps) {
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [lastTap, setLastTap] = useState<{ id: string; time: number }>({ id: '', time: 0 });

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onContextMenu(e.clientX, e.clientY);
  };

  const longPressTimer = { current: null as ReturnType<typeof setTimeout> | null };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    longPressTimer.current = setTimeout(() => {
      onContextMenu(touch.clientX, touch.clientY);
    }, 700);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleTouchMove = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleIconClick = (icon: DesktopIcon) => {
    setSelectedIcon(icon.id);
  };

  const handleIconDoubleClick = (icon: DesktopIcon) => {
    onAppOpen(icon.component, icon.title, icon.icon);
  };

  const handleIconTouchEnd = (e: React.TouchEvent, icon: DesktopIcon) => {
    e.stopPropagation();
    const now = Date.now();
    if (lastTap.id === icon.id && now - lastTap.time < 400) {
      onAppOpen(icon.component, icon.title, icon.icon);
      setLastTap({ id: '', time: 0 });
    } else {
      setLastTap({ id: icon.id, time: now });
      setSelectedIcon(icon.id);
    }
  };

  return (
    <div
      className="absolute inset-0 pb-12"
      onContextMenu={handleContextMenu}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onClick={() => { setSelectedIcon(null); onDesktopClick?.(); }}
    >
      {/* Desktop icons grid - Windows 10 style */}
      <div className="p-2 flex flex-col flex-wrap content-start gap-0.5 h-full" style={{ maxHeight: 'calc(100vh - 48px)' }}>
        {desktopIcons.map(icon => (
          <button
            key={icon.id}
            className={`desktop-icon flex flex-col items-center justify-center w-[76px] h-[82px] rounded-sm border transition-all ${
              selectedIcon === icon.id
                ? 'bg-white/15 border-white/30'
                : 'bg-transparent border-transparent hover:bg-white/8 hover:border-white/15'
            }`}
            onClick={(e) => { e.stopPropagation(); handleIconClick(icon); }}
            onDoubleClick={() => handleIconDoubleClick(icon)}
            onTouchEnd={(e) => handleIconTouchEnd(e, icon)}
          >
            <span className="text-[40px] leading-none mb-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">{icon.icon}</span>
            <span className="text-white text-[11px] text-center leading-[13px] max-w-[70px] px-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] line-clamp-2">
              {icon.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
