import { WindowState } from '../types';

interface TaskbarPreviewProps {
  windows: WindowState[];
  position: { x: number; y: number };
  onWindowClick: (id: string) => void;
  onClose: () => void;
}

export default function TaskbarPreview({ windows, position, onWindowClick, onClose }: TaskbarPreviewProps) {
  if (windows.length === 0) return null;

  return (
    <>
      <div className="fixed inset-0 z-[9998]" onMouseLeave={onClose} />
      <div
        className="fixed z-[9999] pointer-events-auto"
        style={{
          bottom: '52px',
          left: Math.max(8, Math.min(position.x - (windows.length * 160) / 2, window.innerWidth - windows.length * 160 - 8)),
        }}
        onMouseLeave={onClose}
      >
        <div className="flex gap-1 p-1 bg-[#2b2b2b]/98 backdrop-blur-xl border border-white/10 rounded shadow-2xl">
          {windows.map(win => (
            <button
              key={win.id}
              className="w-[160px] bg-white/5 hover:bg-white/15 rounded transition-colors overflow-hidden"
              onClick={() => onWindowClick(win.id)}
              onTouchEnd={() => onWindowClick(win.id)}
            >
              {/* Preview */}
              <div className="aspect-[16/10] bg-gradient-to-br from-gray-100 to-gray-200 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl">{win.icon}</span>
                </div>
                {/* Title bar */}
                <div className="absolute top-0 left-0 right-0 h-4 bg-gray-100 flex items-center px-1.5">
                  <span className="text-[8px] text-gray-500 truncate">{win.title}</span>
                </div>
              </div>
              {/* Title */}
              <div className="px-2 py-1.5 flex items-center gap-1.5">
                <span className="text-sm">{win.icon}</span>
                <span className="text-white/90 text-[11px] truncate">{win.title}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
