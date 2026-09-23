import { DesktopIcon } from '../types';

interface StartMenuProps {
  onClose: () => void;
  onAppClick: (component: string, title: string, icon: string) => void;
}

const pinnedApps: DesktopIcon[] = [
  { id: 'explorer', title: 'File Explorer', icon: '📁', component: 'explorer' },
  { id: 'notepad', title: 'Notepad', icon: '📝', component: 'notepad' },
  { id: 'calculator', title: 'Calculator', icon: '🔢', component: 'calculator' },
  { id: 'settings', title: 'Settings', icon: '⚙️', component: 'settings' },
  { id: 'browser', title: 'Edge', icon: '🌐', component: 'browser' },
  { id: 'terminal', title: 'Terminal', icon: '⬛', component: 'terminal' },
  { id: 'photos', title: 'Photos', icon: '🖼️', component: 'photos' },
  { id: 'store', title: 'Store', icon: '🛍️', component: 'store' },
];

export default function StartMenu({ onClose, onAppClick }: StartMenuProps) {
  return (
    <div
      className="absolute bottom-12 left-0 w-[320px] bg-gray-900/97 backdrop-blur-xl border border-gray-600/50 shadow-2xl start-menu-open z-[9998]"
      style={{ maxHeight: 'calc(100vh - 60px)' }}
    >
      {/* User section */}
      <div className="p-4 border-b border-gray-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            U
          </div>
          <span className="text-white text-sm font-medium">User</span>
        </div>
      </div>

      {/* Pinned Apps */}
      <div className="p-3">
        <h3 className="text-white/80 text-xs font-semibold mb-2 px-1">Pinned</h3>
        <div className="grid grid-cols-4 gap-1">
          {pinnedApps.map(app => (
            <button
              key={app.id}
              className="flex flex-col items-center justify-center p-3 rounded hover:bg-white/10 transition-colors"
              onClick={() => { onAppClick(app.component, app.title, app.icon); onClose(); }}
              onTouchEnd={() => { onAppClick(app.component, app.title, app.icon); onClose(); }}
            >
              <span className="text-2xl mb-1">{app.icon}</span>
              <span className="text-white/90 text-[10px] text-center leading-tight">{app.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recommended */}
      <div className="p-3 border-t border-gray-700/50">
        <h3 className="text-white/80 text-xs font-semibold mb-2 px-1">Recommended</h3>
        <div className="space-y-1">
          <div className="flex items-center gap-3 p-2 rounded hover:bg-white/10">
            <span className="text-lg">📄</span>
            <div>
              <p className="text-white/90 text-xs">Document.txt</p>
              <p className="text-white/50 text-[10px]">Recently added</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2 rounded hover:bg-white/10">
            <span className="text-lg">🖼️</span>
            <div>
              <p className="text-white/90 text-xs">Screenshot.png</p>
              <p className="text-white/50 text-[10px]">Yesterday</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between p-3 border-t border-gray-700/50">
        <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/10">
          <span className="text-lg">👤</span>
          <span className="text-white/90 text-xs">User</span>
        </button>
        <button className="p-2 rounded hover:bg-white/10" title="Power">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="white" className="opacity-80">
            <path d="M8 0a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0v-5A.5.5 0 0 1 8 0z" />
            <path d="M4.354 2.354a.5.5 0 0 1 .707 0 .5.5 0 0 1 0 .707A4.5 4.5 0 1 0 12.5 8a.5.5 0 0 1 1 0 5.5 5.5 0 1 1-9.854-3.439.5.5 0 0 1 .708-.207z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
