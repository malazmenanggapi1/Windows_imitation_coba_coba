import { useState } from 'react';
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
  { id: 'browser', title: 'Microsoft Edge', icon: '🌐', component: 'browser' },
  { id: 'terminal', title: 'Terminal', icon: '⬛', component: 'terminal' },
  { id: 'paint', title: 'Paint', icon: '🎨', component: 'paint' },
  { id: 'photos', title: 'Photos', icon: '🖼️', component: 'photos' },
  { id: 'store', title: 'Microsoft Store', icon: '🛍️', component: 'store' },
  { id: 'mail', title: 'Mail', icon: '📧', component: 'mail' },
  { id: 'calendar', title: 'Calendar', icon: '📅', component: 'calendar' },
  { id: 'music', title: 'Groove Music', icon: '🎵', component: 'music' },
];

const allApps = [
  { name: 'Calculator', icon: '🔢', component: 'calculator', title: 'Calculator' },
  { name: 'Calendar', icon: '📅', component: 'calendar', title: 'Calendar' },
  { name: 'Camera', icon: '📷', component: 'camera', title: 'Camera' },
  { name: 'File Explorer', icon: '📁', component: 'explorer', title: 'File Explorer' },
  { name: 'Groove Music', icon: '🎵', component: 'music', title: 'Groove Music' },
  { name: 'Mail', icon: '📧', component: 'mail', title: 'Mail' },
  { name: 'Microsoft Edge', icon: '🌐', component: 'browser', title: 'Microsoft Edge' },
  { name: 'Microsoft Store', icon: '🛍️', component: 'store', title: 'Microsoft Store' },
  { name: 'Notepad', icon: '📝', component: 'notepad', title: 'Notepad' },
  { name: 'Paint', icon: '🎨', component: 'paint', title: 'Paint' },
  { name: 'Photos', icon: '🖼️', component: 'photos', title: 'Photos' },
  { name: 'Settings', icon: '⚙️', component: 'settings', title: 'Settings' },
  { name: 'Terminal', icon: '⬛', component: 'terminal', title: 'Terminal' },
];

export default function StartMenu({ onClose, onAppClick }: StartMenuProps) {
  const [showAllApps, setShowAllApps] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredApps = searchQuery
    ? allApps.filter(app => app.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : allApps;

  return (
    <div
      className="absolute bottom-[48px] left-0 w-[420px] bg-[#2b2b2b]/98 backdrop-blur-2xl border border-white/10 shadow-[0_-4px_24px_rgba(0,0,0,0.5)] start-menu-open z-[9998] flex flex-col"
      style={{ maxHeight: 'calc(100vh - 60px)', maxWidth: 'calc(100vw - 16px)' }}
      onClick={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
    >
      {/* Left sidebar - user and power */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel - hamburger + all apps */}
        <div className="w-[48px] bg-black/20 flex flex-col items-center py-2 flex-shrink-0">
          <button
            className="w-10 h-10 flex items-center justify-center rounded hover:bg-white/10 mb-2"
            onClick={() => setShowAllApps(!showAllApps)}
          >
            <svg width="18" height="14" viewBox="0 0 18 14" fill="white" className="opacity-80">
              <rect y="0" width="18" height="2" rx="1" />
              <rect y="6" width="18" height="2" rx="1" />
              <rect y="12" width="18" height="2" rx="1" />
            </svg>
          </button>
          
          <div className="flex-1" />
          
          {/* User */}
          <button className="w-10 h-10 flex items-center justify-center rounded hover:bg-white/10 mb-1">
            <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
              U
            </div>
          </button>
          
          {/* Documents */}
          <button className="w-10 h-10 flex items-center justify-center rounded hover:bg-white/10 mb-1">
            <span className="text-base">📁</span>
          </button>
          
          {/* Pictures */}
          <button className="w-10 h-10 flex items-center justify-center rounded hover:bg-white/10 mb-1">
            <span className="text-base">🖼️</span>
          </button>
          
          {/* Settings */}
          <button
            className="w-10 h-10 flex items-center justify-center rounded hover:bg-white/10 mb-1"
            onClick={() => { onAppClick('settings', 'Settings', '⚙️'); onClose(); }}
          >
            <span className="text-base">⚙️</span>
          </button>
          
          {/* Power */}
          <button className="w-10 h-10 flex items-center justify-center rounded hover:bg-white/10">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="white" className="opacity-80">
              <path d="M8 0C7.4 0 7 .4 7 1v6c0 .6.4 1 1 1s1-.4 1-1V1c0-.6-.4-1-1-1z" />
              <path d="M4.2 2.8c-.4-.4-1-.4-1.4 0C1 4.6 0 7 0 9.5 0 13.1 3.6 16 8 16s8-2.9 8-6.5c0-2.5-1-4.9-2.8-6.7-.4-.4-1-.4-1.4 0s-.4 1 0 1.4C13.2 5.6 14 7.5 14 9.5 14 12 11.3 14 8 14s-6-2-6-4.5c0-2 .8-3.9 2.2-5.3.4-.4.4-1 0-1.4z" />
            </svg>
          </button>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {showAllApps ? (
            /* All Apps List */
            <div className="flex-1 overflow-y-auto py-2">
              <div className="px-4 py-2">
                <h3 className="text-white/80 text-xs font-semibold">All apps</h3>
              </div>
              {filteredApps.map(app => (
                <button
                  key={app.name}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white/8 transition-colors"
                  onClick={() => { onAppClick(app.component, app.title, app.icon); onClose(); }}
                  onTouchEnd={() => { onAppClick(app.component, app.title, app.icon); onClose(); }}
                >
                  <span className="text-lg">{app.icon}</span>
                  <span className="text-white/90 text-sm">{app.name}</span>
                </button>
              ))}
            </div>
          ) : (
            <>
              {/* Search */}
              <div className="p-3 border-b border-white/5">
                <div className="flex items-center bg-white/10 rounded px-3 py-2">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="white" className="opacity-50 mr-2">
                    <circle cx="7" cy="7" r="5.5" fill="none" stroke="white" strokeWidth="1.5" opacity="0.5" />
                    <line x1="11" y1="11" x2="14.5" y2="14.5" stroke="white" strokeWidth="1.5" opacity="0.5" />
                  </svg>
                  <input
                    type="text"
                    className="bg-transparent text-white/80 text-sm outline-none flex-1 placeholder-white/40"
                    placeholder="Type here to search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ userSelect: 'text' }}
                  />
                </div>
              </div>

              {/* Pinned section */}
              <div className="flex-1 overflow-y-auto p-3">
                <h3 className="text-white/80 text-xs font-semibold mb-3 px-1">Pinned</h3>
                <div className="grid grid-cols-5 gap-0.5">
                  {pinnedApps.map(app => (
                    <button
                      key={app.id}
                      className="flex flex-col items-center justify-center p-2.5 rounded hover:bg-white/10 transition-colors"
                      onClick={() => { onAppClick(app.component, app.title, app.icon); onClose(); }}
                      onTouchEnd={() => { onAppClick(app.component, app.title, app.icon); onClose(); }}
                    >
                      <span className="text-2xl mb-1">{app.icon}</span>
                      <span className="text-white/80 text-[10px] text-center leading-tight line-clamp-2">{app.title}</span>
                    </button>
                  ))}
                </div>

                {/* Recommended */}
                <h3 className="text-white/80 text-xs font-semibold mt-4 mb-2 px-1">Recommended</h3>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-3 p-2 rounded hover:bg-white/8">
                    <span className="text-lg">📄</span>
                    <div>
                      <p className="text-white/90 text-xs">Document.txt</p>
                      <p className="text-white/40 text-[10px]">Recently added</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded hover:bg-white/8">
                    <span className="text-lg">🖼️</span>
                    <div>
                      <p className="text-white/90 text-xs">Screenshot.png</p>
                      <p className="text-white/40 text-[10px]">Yesterday</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded hover:bg-white/8">
                    <span className="text-lg">📊</span>
                    <div>
                      <p className="text-white/90 text-xs">Report.xlsx</p>
                      <p className="text-white/40 text-[10px]">Last week</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
