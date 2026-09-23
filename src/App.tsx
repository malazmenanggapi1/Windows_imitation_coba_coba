import { useState, useCallback } from 'react';
import Desktop from './components/Desktop';
import Taskbar from './components/Taskbar';
import StartMenu from './components/StartMenu';
import Window from './components/Window';
import ContextMenu from './components/ContextMenu';
import LockScreen from './components/LockScreen';
import { useWindowManager } from './hooks/useWindowManager';
import { ContextMenuState } from './types';

// Import apps
import Notepad from './components/apps/Notepad';
import Calculator from './components/apps/Calculator';
import FileExplorer from './components/apps/FileExplorer';
import Settings from './components/apps/Settings';
import Terminal from './components/apps/Terminal';
import Browser from './components/apps/Browser';

function App() {
  const [isLocked, setIsLocked] = useState(true);
  const [startOpen, setStartOpen] = useState(false);
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
  } = useWindowManager();

  const handleAppOpen = useCallback((component: string, title: string, icon: string) => {
    openWindow(title, icon, component);
  }, [openWindow]);

  const handleStartClick = useCallback(() => {
    setStartOpen(prev => !prev);
  }, []);

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
        { label: 'Open Terminal', icon: '⬛', action: () => handleAppOpen('terminal', 'Terminal', '⬛') },
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
      case 'recyclebin': return (
        <div className="flex flex-col items-center justify-center h-full bg-white text-gray-500">
          <span className="text-6xl mb-4">🗑️</span>
          <p className="text-sm">Recycle Bin is empty</p>
        </div>
      );
      case 'photos': return (
        <div className="flex flex-col items-center justify-center h-full bg-white text-gray-500">
          <span className="text-6xl mb-4">🖼️</span>
          <p className="text-sm">No photos to display</p>
        </div>
      );
      case 'store': return (
        <div className="flex flex-col items-center justify-center h-full bg-white text-gray-500">
          <span className="text-6xl mb-4">🛍️</span>
          <p className="text-sm">Microsoft Store</p>
          <p className="text-xs mt-2">Coming soon...</p>
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

      {/* Desktop Background - Windows 10 default blue */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #0078d4 0%, #005a9e 30%, #003a6a 60%, #001f3f 100%)',
        }}
      >
        {/* Windows 10 style light rays */}
        <div className="absolute inset-0 opacity-20" style={{
          background: 'radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(ellipse at 70% 30%, rgba(100,200,255,0.2) 0%, transparent 40%)',
        }} />
      </div>

      {/* Desktop Icons */}
      <Desktop
        onAppOpen={handleAppOpen}
        onContextMenu={handleContextMenu}
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

      {/* Taskbar */}
      <Taskbar
        onStartClick={handleStartClick}
        startOpen={startOpen}
        openWindows={windows.map(w => ({ id: w.id, title: w.title, icon: w.icon, isMinimized: w.isMinimized }))}
        onWindowClick={handleWindowClick}
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
