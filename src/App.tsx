import { useState, useCallback } from 'react';
import Desktop from './components/Desktop';
import Taskbar from './components/Taskbar';
import StartMenu from './components/StartMenu';
import Window from './components/Window';
import ContextMenu from './components/ContextMenu';
import LockScreen from './components/LockScreen';
import ActionCenter from './components/ActionCenter';
import CalendarPopup from './components/CalendarPopup';
import QuickSettings from './components/QuickSettings';
import { useWindowManager } from './hooks/useWindowManager';
import { ContextMenuState } from './types';

// Import apps
import Notepad from './components/apps/Notepad';
import Calculator from './components/apps/Calculator';
import FileExplorer from './components/apps/FileExplorer';
import Settings from './components/apps/Settings';
import Terminal from './components/apps/Terminal';
import Browser from './components/apps/Browser';
import Paint from './components/apps/Paint';

function App() {
  const [isLocked, setIsLocked] = useState(true);
  const [startOpen, setStartOpen] = useState(false);
  const [actionCenterOpen, setActionCenterOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [quickSettingsOpen, setQuickSettingsOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    items: [],
  });

  const {
    windows,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    focusWindow,
    moveWindow,
    resizeWindow,
  } = useWindowManager();

  const handleAppOpen = useCallback((component: string, title: string, icon: string) => {
    openWindow(title, icon, component);
  }, [openWindow]);

  const handleStartClick = useCallback(() => {
    setStartOpen(prev => !prev);
    setActionCenterOpen(false);
    setCalendarOpen(false);
  }, []);

  const handleActionCenterClick = useCallback(() => {
    setActionCenterOpen(prev => !prev);
    setStartOpen(false);
    setCalendarOpen(false);
  }, []);

  const handleCalendarClick = useCallback(() => {
    setCalendarOpen(prev => !prev);
    setStartOpen(false);
    setActionCenterOpen(false);
    setQuickSettingsOpen(false);
  }, []);

  const handleQuickSettingsClick = useCallback(() => {
    setQuickSettingsOpen(prev => !prev);
    setStartOpen(false);
    setActionCenterOpen(false);
    setCalendarOpen(false);
  }, []);

  const closeAllPopups = useCallback(() => {
    setStartOpen(false);
    setActionCenterOpen(false);
    setCalendarOpen(false);
    setQuickSettingsOpen(false);
  }, []);

  const snapWindow = useCallback((id: string, direction: 'left' | 'right' | 'top') => {
    if (direction === 'top') {
      maximizeWindow(id);
    } else {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight - 48;
      const x = direction === 'left' ? 0 : screenWidth / 2;
      moveWindow(id, x, 0);
      resizeWindow(id, screenWidth / 2, screenHeight);
    }
  }, [maximizeWindow, moveWindow, resizeWindow]);

  const handleContextMenu = useCallback((x: number, y: number) => {
    setContextMenu({
      visible: true,
      x,
      y,
      items: [
        { label: 'View', icon: '👁️', action: () => {} },
        { label: 'Sort by', icon: '↕️', action: () => {} },
        { label: 'Refresh', icon: '🔄', action: () => window.location.reload() },
        { label: '', action: () => {}, separator: true },
        { label: 'New', icon: '📄', action: () => {} },
        { label: '', action: () => {}, separator: true },
        { label: 'Display settings', icon: '🖥️', action: () => handleAppOpen('settings', 'Settings', '⚙️') },
        { label: 'Personalize', icon: '🎨', action: () => handleAppOpen('settings', 'Settings', '⚙️') },
        { label: '', action: () => {}, separator: true },
        { label: 'Open in Terminal', icon: '⬛', action: () => handleAppOpen('terminal', 'Terminal', '⬛') },
      ],
    });
  }, [handleAppOpen]);

  const handleWindowClick = useCallback((id: string) => {
    const win = windows.find(w => w.id === id);
    if (win?.isMinimized) {
      restoreWindow(id);
    } else {
      focusWindow(id);
    }
  }, [windows, restoreWindow, focusWindow]);

  const renderAppContent = (component: string) => {
    switch (component) {
      case 'notepad': return <Notepad />;
      case 'calculator': return <Calculator />;
      case 'explorer': return <FileExplorer />;
      case 'settings': return <Settings />;
      case 'terminal': return <Terminal />;
      case 'browser': return <Browser />;
      case 'paint': return <Paint />;
      case 'recyclebin': return (
        <div className="flex flex-col items-center justify-center h-full bg-white text-gray-500">
          <span className="text-6xl mb-4">🗑️</span>
          <p className="text-sm">Recycle Bin is empty</p>
        </div>
      );
      case 'photos': return (
        <div className="flex flex-col items-center justify-center h-full bg-gray-900 text-gray-400">
          <span className="text-6xl mb-4">🖼️</span>
          <p className="text-sm">Photos</p>
          <p className="text-xs mt-2 text-gray-500">No photos to display</p>
          <div className="grid grid-cols-3 gap-2 mt-6 px-8">
            {['🌄', '🌅', '🏔️', '🌊', '🌺', '🌸'].map((emoji, i) => (
              <div key={i} className="w-16 h-16 bg-gray-800 rounded flex items-center justify-center text-2xl">
                {emoji}
              </div>
            ))}
          </div>
        </div>
      );
      case 'store': return (
        <div className="flex flex-col items-center justify-center h-full bg-white text-gray-500">
          <span className="text-6xl mb-4">🛍️</span>
          <p className="text-sm font-medium">Microsoft Store</p>
          <p className="text-xs mt-2">Discover apps, games, and more</p>
          <div className="grid grid-cols-3 gap-3 mt-6">
            {['🎮 Games', '📱 Apps', '🎬 Movies', '📚 Books', '🎵 Music', '📺 TV'].map((item, i) => (
              <div key={i} className="w-20 h-16 bg-gray-50 rounded border border-gray-200 flex items-center justify-center text-xs text-gray-600">
                {item}
              </div>
            ))}
          </div>
        </div>
      );
      default: return (
        <div className="flex items-center justify-center h-full bg-white text-gray-500">
          <p className="text-sm">Application not found</p>
        </div>
      );
    }
  };

  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Lock Screen */}
      {isLocked && <LockScreen onUnlock={() => setIsLocked(false)} />}

      {/* Desktop Background - Windows 10 Hero wallpaper */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #0078d4 0%, #005a9e 25%, #003a6a 50%, #001f3f 100%)',
        }}
      >
        {/* Light beam effects like Win10 default wallpaper */}
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(ellipse at 25% 60%, rgba(0,180,255,0.3) 0%, transparent 50%),
            radial-gradient(ellipse at 75% 35%, rgba(100,200,255,0.15) 0%, transparent 40%),
            radial-gradient(ellipse at 50% 80%, rgba(0,100,200,0.2) 0%, transparent 50%),
            linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.1) 100%)
          `,
        }} />
      </div>

      {/* Desktop Icons */}
      <Desktop
        onAppOpen={handleAppOpen}
        onContextMenu={handleContextMenu}
        onDesktopClick={closeAllPopups}
      />

      {/* Windows */}
      {windows.map(win => (
        <Window
          key={win.id}
          window={win}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onFocus={focusWindow}
          onMove={moveWindow}
          onResize={resizeWindow}
          onSnap={snapWindow}
        >
          {renderAppContent(win.component)}
        </Window>
      ))}

      {/* Start Menu */}
      {startOpen && (
        <StartMenu
          onClose={() => setStartOpen(false)}
          onAppClick={handleAppOpen}
        />
      )}

      {/* Action Center */}
      {actionCenterOpen && (
        <ActionCenter onClose={() => setActionCenterOpen(false)} />
      )}

      {/* Calendar */}
      {calendarOpen && (
        <CalendarPopup onClose={() => setCalendarOpen(false)} />
      )}

      {/* Quick Settings */}
      {quickSettingsOpen && (
        <QuickSettings onClose={() => setQuickSettingsOpen(false)} />
      )}

      {/* Taskbar */}
      <Taskbar
        onStartClick={handleStartClick}
        startOpen={startOpen}
        openWindows={windows.map(w => ({ id: w.id, title: w.title, icon: w.icon, isMinimized: w.isMinimized }))}
        onWindowClick={handleWindowClick}
        onActionCenterClick={handleActionCenterClick}
        onCalendarClick={handleCalendarClick}
        onQuickSettingsClick={handleQuickSettingsClick}
        actionCenterOpen={actionCenterOpen}
        calendarOpen={calendarOpen}
        quickSettingsOpen={quickSettingsOpen}
      />

      {/* Context Menu */}
      <ContextMenu
        menu={contextMenu}
        onClose={() => setContextMenu(prev => ({ ...prev, visible: false }))}
      />
    </div>
  );
}

export default App;
