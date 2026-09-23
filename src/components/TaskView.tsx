import { WindowState } from '../types';

interface TaskViewProps {
  windows: WindowState[];
  onClose: () => void;
  onWindowSelect: (id: string) => void;
  onWindowClose: (id: string) => void;
}

export default function TaskView({ windows, onClose, onWindowSelect, onWindowClose }: TaskViewProps) {
  const visibleWindows = windows.filter(w => !w.isMinimized);

  return (
    <div
      className="fixed inset-0 z-[99990] bg-black/60 backdrop-blur-md flex flex-col"
      onClick={onClose}
      onTouchEnd={onClose}
    >
      {/* Top bar - Desktops */}
      <div className="flex items-center justify-center h-16 px-4">
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white/15 border border-white/20 rounded text-white/90 text-sm flex items-center gap-2">
            <span>🖥️</span>
            <span>Desktop 1</span>
          </div>
          <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 text-white/70 text-xl">
            +
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="flex justify-center px-4 mb-6">
        <div className="flex items-center bg-white/10 border border-white/20 rounded-full px-4 py-2 w-full max-w-md">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="white" className="opacity-50 mr-2">
            <circle cx="7" cy="7" r="5.5" fill="none" stroke="white" strokeWidth="1.5" opacity="0.5" />
            <line x1="11" y1="11" x2="14.5" y2="14.5" stroke="white" strokeWidth="1.5" opacity="0.5" />
          </svg>
          <span className="text-white/50 text-sm">Type here to search</span>
        </div>
      </div>

      {/* Window thumbnails */}
      <div className="flex-1 flex items-center justify-center px-8 pb-8">
        {visibleWindows.length === 0 ? (
          <div className="text-white/50 text-center">
            <p className="text-lg">No open windows</p>
            <p className="text-sm mt-2">Open an app from the Start menu or desktop</p>
          </div>
        ) : (
          <div className="grid gap-6" style={{
            gridTemplateColumns: `repeat(auto-fit, minmax(280px, 1fr))`,
            maxWidth: '1200px',
            width: '100%',
          }}>
            {visibleWindows.map(win => (
              <div
                key={win.id}
                className="group relative bg-white/10 rounded-lg overflow-hidden border border-white/20 hover:border-white/40 transition-all hover:scale-105 cursor-pointer"
                onClick={(e) => { e.stopPropagation(); onWindowSelect(win.id); }}
                onTouchEnd={(e) => { e.stopPropagation(); onWindowSelect(win.id); }}
              >
                {/* Window preview */}
                <div className="aspect-video bg-white relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
                    <span className="text-6xl">{win.icon}</span>
                  </div>
                  {/* Title bar mockup */}
                  <div className="absolute top-0 left-0 right-0 h-6 bg-gray-100 flex items-center px-2">
                    <span className="text-[10px] text-gray-600 truncate">{win.title}</span>
                  </div>
                </div>

                {/* Window title */}
                <div className="px-3 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-base">{win.icon}</span>
                    <span className="text-white/90 text-sm truncate">{win.title}</span>
                  </div>
                  <button
                    className="w-6 h-6 rounded flex items-center justify-center hover:bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => { e.stopPropagation(); onWindowClose(win.id); }}
                    onTouchEnd={(e) => { e.stopPropagation(); onWindowClose(win.id); }}
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" className="text-white">
                      <line x1="0" y1="0" x2="10" y2="10" stroke="currentColor" strokeWidth="1.5" />
                      <line x1="10" y1="0" x2="0" y2="10" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
