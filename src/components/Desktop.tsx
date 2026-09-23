import { useState } from 'react';
import { DesktopIcon } from '../types';

interface DesktopProps {
  onAppOpen: (component: string, title: string, icon: string) => void;
  onContextMenu: (x: number, y: number) => void;
}

const desktopIcons: DesktopIcon[] = [
  { id: 'pc', title: 'This PC', icon: '💻', component: 'explorer' },
  { id: 'recycle', title: 'Recycle Bin', icon: '🗑️', component: 'recyclebin' },
  { id: 'notepad', title: 'Notepad', icon: '📝', component: 'notepad' },
  { id: 'calculator', title: 'Calculator', icon: '🔢', component: 'calculator' },
  { id: 'explorer', title: 'File Explorer', icon: '📁', component: 'explorer' },
  { id: 'browser', title: 'Edge', icon: '🌐', component: 'browser' },
  { id: 'terminal', title: 'Terminal', icon: '⬛', component: 'terminal' },
  { id: 'settings', title: 'Settings', icon: '⚙️', component: 'settings' },
];

export default function Desktop({ onAppOpen, onContextMenu }: DesktopProps) {
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onContextMenu(e.clientX, e.clientY);
  };

  const handleTouchContextMenu = (e: React.TouchEvent) => {
    // Long press detection for context menu on touch
    const timer = setTimeout(() => {
      if (e.touches.length === 1) {
        onContextMenu(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, 800);

    const clearTimer = () => clearTimeout(timer);
    e.currentTarget.addEventListener('touchend', clearTimer, { once: true });
    e.currentTarget.addEventListener('touchmove', clearTimer, { once: true });
  };

  return (
    <div
      className="absolute inset-0 pb-12"
      onContextMenu={handleContextMenu}
      onTouchStart={handleTouchContextMenu}
      onClick={() => setSelectedIcon(null)}
    >
      <div className="p-2 grid grid-cols-1 gap-0" style={{ gridAutoFlow: 'column', gridTemplateRows: 'repeat(auto-fill, 90px)', height: 'calc(100% - 48px)' }}>
        {desktopIcons.map(icon => (
          <button
            key={icon.id}
            className={`desktop-icon flex flex-col items-center justify-center p-2 rounded border border-transparent transition-colors ${selectedIcon === icon.id ? 'selected' : ''}`}
            onClick={(e) => { e.stopPropagation(); setSelectedIcon(icon.id); }}
            onDoubleClick={() => onAppOpen(icon.component, icon.title, icon.icon)}
            onTouchEnd={(e) => {
              e.stopPropagation();
              // Double tap detection
              const now = Date.now();
              const lastTap = (e.currentTarget as any)._lastTap || 0;
              if (now - lastTap < 300) {
                onAppOpen(icon.component, icon.title, icon.icon);
              }
              (e.currentTarget as any)._lastTap = now;
              setSelectedIcon(icon.id);
            }}
          >
            <span className="text-3xl mb-1 drop-shadow-lg">{icon.icon}</span>
            <span className="text-white text-[11px] text-center leading-tight drop-shadow-md max-w-[70px] truncate">
              {icon.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
