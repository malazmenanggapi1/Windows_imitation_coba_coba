interface TaskbarContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onAction: (action: string) => void;
}

export default function TaskbarContextMenu({ x, y, onClose, onAction }: TaskbarContextMenuProps) {
  const menuItems = [
    { label: 'Toolbars', action: 'toolbars', hasSubmenu: true },
    { label: 'Search', action: 'search', hasSubmenu: true },
    { label: 'News and interests', action: 'news', hasSubmenu: true },
    { label: 'Task View', action: 'taskview', icon: '🗔' },
    { separator: true },
    { label: 'Cascade windows', action: 'cascade' },
    { label: 'Show windows stacked', action: 'stacked' },
    { label: 'Show windows side by side', action: 'sidebyside' },
    { label: 'Show the desktop', action: 'desktop' },
    { separator: true },
    { label: 'Taskbar settings', action: 'settings', icon: '⚙️' },
    { label: 'Task Manager', action: 'taskmanager', icon: '📊' },
  ];

  return (
    <>
      <div className="fixed inset-0 z-[99999]" onClick={onClose} onTouchEnd={onClose} />
      <div
        className="fixed bg-white border border-gray-300 shadow-lg rounded py-1 min-w-[220px] context-menu z-[100000]"
        style={{
          left: Math.min(x, window.innerWidth - 240),
          top: Math.max(y - 300, 8),
        }}
      >
        {menuItems.map((item, index) => {
          if ('separator' in item && item.separator) {
            return <div key={index} className="h-px bg-gray-200 my-1" />;
          }
          return (
            <button
              key={index}
              className="w-full text-left px-4 py-1.5 text-sm text-gray-700 hover:bg-blue-500 hover:text-white flex items-center gap-3 transition-colors"
              onClick={() => { onAction(item.action!); onClose(); }}
              onTouchEnd={() => { onAction(item.action!); onClose(); }}
            >
              {'icon' in item && item.icon && <span className="text-sm w-4 text-center">{item.icon}</span>}
              <span className="flex-1">{item.label}</span>
              {'hasSubmenu' in item && item.hasSubmenu && (
                <svg width="8" height="12" viewBox="0 0 8 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-50">
                  <path d="M2 1l5 5-5 5" />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}
