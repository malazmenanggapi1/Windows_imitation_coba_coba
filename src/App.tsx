import { useState, useCallback, useEffect } from 'react';
import Desktop from './components/Desktop';
import Taskbar from './components/Taskbar';
import StartMenu from './components/StartMenu';
import Window from './components/Window';
import ContextMenu from './components/ContextMenu';
import LockScreen from './components/LockScreen';
import BootScreen from './components/BootScreen';
import ActionCenter from './components/ActionCenter';
import CalendarPopup from './components/CalendarPopup';
import QuickSettings from './components/QuickSettings';
import TaskView from './components/TaskView';
import TaskbarPreview from './components/TaskbarPreview';
import TaskbarContextMenu from './components/TaskbarContextMenu';
import NotificationToast, { ToastNotification } from './components/NotificationToast';
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

type AppState = 'boot' | 'lock' | 'desktop';

function App() {
  const [appState, setAppState] = useState<AppState>('boot');
  const [startOpen, setStartOpen] = useState(false);
  const [actionCenterOpen, setActionCenterOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [quickSettingsOpen, setQuickSettingsOpen] = useState(false);
  const [taskViewOpen, setTaskViewOpen] = useState(false);
  const [taskbarPreview, setTaskbarPreview] = useState<{ appId: string; x: number } | null>(null);
  const [taskbarContextMenu, setTaskbarContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
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

  // Show welcome notification after boot
  useEffect(() => {
    if (appState === 'desktop') {
      const timer = setTimeout(() => {
        addToast('Windows Security', 'Your device is protected', 'Windows Defender is keeping you safe.', '🛡️', 6000);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [appState]);

  const addToast = useCallback((app: string, title: string, message: string, icon: string, duration?: number) => {
    const newToast: ToastNotification = {
      id: `toast-${Date.now()}-${Math.random()}`,
      app,
      title,
      message,
      icon,
      duration,
    };
    setToasts(prev => [...prev, newToast]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleAppOpen = useCallback((component: string, title: string, icon: string) => {
    openWindow(title, icon, component);
  }, [openWindow]);

  const handleStartClick = useCallback(() => {
    setStartOpen(prev => !prev);
    setActionCenterOpen(false);
    setCalendarOpen(false);
    setQuickSettingsOpen(false);
    setTaskViewOpen(false);
  }, []);

  const handleActionCenterClick = useCallback(() => {
    setActionCenterOpen(prev => !prev);
    setStartOpen(false);
    setCalendarOpen(false);
    setQuickSettingsOpen(false);
    setTaskViewOpen(false);
  }, []);

  const handleCalendarClick = useCallback(() => {
    setCalendarOpen(prev => !prev);
    setStartOpen(false);
    setActionCenterOpen(false);
    setQuickSettingsOpen(false);
    setTaskViewOpen(false);
  }, []);

  const handleQuickSettingsClick = useCallback(() => {
    setQuickSettingsOpen(prev => !prev);
    setStartOpen(false);
    setActionCenterOpen(false);
    setCalendarOpen(false);
    setTaskViewOpen(false);
  }, []);

  const handleTaskViewClick = useCallback(() => {
    setTaskViewOpen(prev => !prev);
    setStartOpen(false);
    setActionCenterOpen(false);
    setCalendarOpen(false);
    setQuickSettingsOpen(false);
  }, []);

  const closeAllPopups = useCallback(() => {
    setStartOpen(false);
    setActionCenterOpen(false);
    setCalendarOpen(false);
    setQuickSettingsOpen(false);
    setTaskViewOpen(false);
    setTaskbarPreview(null);
    setTaskbarContextMenu(null);
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
    setTaskbarPreview(null);
  }, [windows, restoreWindow, focusWindow]);

  const handleTaskbarHover = useCallback((appId: string, x: number) => {
    setTaskbarPreview({ appId, x });
  }, []);

  const handleTaskbarLeave = useCallback(() => {
    setTaskbarPreview(null);
  }, []);

  const handleTaskbarRightClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setTaskbarContextMenu({ x: e.clientX, y: e.clientY });
  }, []);

  const handleTaskbarContextAction = useCallback((action: string) => {
    switch (action) {
      case 'taskview':
        setTaskViewOpen(true);
        break;
      case 'settings':
        handleAppOpen('settings', 'Settings', '⚙️');
        break;
      case 'taskmanager':
        addToast('System', 'Task Manager', 'Task Manager is not available in this demo.', '📊', 3000);
        break;
      case 'desktop':
        windows.forEach(w => minimizeWindow(w.id));
        break;
    }
  }, [handleAppOpen, addToast, windows, minimizeWindow]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to close popups
      if (e.key === 'Escape') {
        closeAllPopups();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeAllPopups]);

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

  // Boot screen
  if (appState === 'boot') {
    return <BootScreen onComplete={() => setAppState('lock')} />;
  }

  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Lock Screen */}
      {appState === 'lock' && <LockScreen onUnlock={() => setAppState('desktop')} />}

      {/* Desktop Background - Windows 10 Hero wallpaper */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #0078d4 0%, #005a9e 25%, #003a6a 50%, #001f3f 100%)',
        }}
      >
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

      {/* Task View */}
      {taskViewOpen && (
        <TaskView
          windows={windows}
          onClose={() => setTaskViewOpen(false)}
          onWindowSelect={(id) => { focusWindow(id); setTaskViewOpen(false); }}
          onWindowClose={closeWindow}
        />
      )}

      {/* Taskbar Preview */}
      {taskbarPreview && (
        <TaskbarPreview
          windows={windows.filter(w => w.id === taskbarPreview.appId)}
          position={{ x: taskbarPreview.x, y: 0 }}
          onWindowClick={(id) => { handleWindowClick(id); setTaskbarPreview(null); }}
          onClose={() => setTaskbarPreview(null)}
        />
      )}

      {/* Taskbar Context Menu */}
      {taskbarContextMenu && (
        <TaskbarContextMenu
          x={taskbarContextMenu.x}
          y={taskbarContextMenu.y}
          onClose={() => setTaskbarContextMenu(null)}
          onAction={handleTaskbarContextAction}
        />
      )}

      {/* Notification Toasts */}
      <NotificationToast
        notifications={toasts}
        onDismiss={dismissToast}
      />

      {/* Taskbar */}
      <div onContextMenu={handleTaskbarRightClick}>
        <Taskbar
          onStartClick={handleStartClick}
          startOpen={startOpen}
          openWindows={windows.map(w => ({ id: w.id, title: w.title, icon: w.icon, isMinimized: w.isMinimized }))}
          onWindowClick={handleWindowClick}
          onActionCenterClick={handleActionCenterClick}
          onCalendarClick={handleCalendarClick}
          onQuickSettingsClick={handleQuickSettingsClick}
          onTaskViewClick={handleTaskViewClick}
          onWindowHover={handleTaskbarHover}
          onWindowLeave={handleTaskbarLeave}
          actionCenterOpen={actionCenterOpen}
          calendarOpen={calendarOpen}
          quickSettingsOpen={quickSettingsOpen}
          taskViewOpen={taskViewOpen}
        />
      </div>

      {/* Desktop Context Menu */}
      <ContextMenu
        menu={contextMenu}
        onClose={() => setContextMenu(prev => ({ ...prev, visible: false }))}
      />
    </div>
  );
}

export default App;
