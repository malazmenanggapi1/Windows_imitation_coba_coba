import { useState } from 'react';

interface ActionCenterProps {
  onClose: () => void;
}

export default function ActionCenter({ onClose }: ActionCenterProps) {
  const [brightness, setBrightness] = useState(80);
  const [volume, setVolume] = useState(65);
  const [activeQuickActions, setActiveQuickActions] = useState<string[]>(['wifi', 'bluetooth']);

  const quickActions = [
    { id: 'wifi', icon: '📶', label: 'Wi-Fi', active: true },
    { id: 'bluetooth', icon: '🔵', label: 'Bluetooth', active: true },
    { id: 'airplane', icon: '✈️', label: 'Airplane mode', active: false },
    { id: 'battery', icon: '🔋', label: 'Battery saver', active: false },
    { id: 'location', icon: '📍', label: 'Location', active: false },
    { id: 'night', icon: '🌙', label: 'Night light', active: false },
    { id: 'accessibility', icon: '♿', label: 'Accessibility', active: false },
    { id: 'connect', icon: '📡', label: 'Connect', active: false },
  ];

  const toggleQuickAction = (id: string) => {
    setActiveQuickActions(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const notifications = [
    { id: 1, app: 'Windows Security', message: 'No action needed. Your device is protected.', time: '2m ago', icon: '🛡️' },
    { id: 2, app: 'Microsoft Store', message: 'New updates available for your apps.', time: '15m ago', icon: '🛍️' },
    { id: 3, app: 'Tips', message: 'Get the most out of Windows 10', time: '1h ago', icon: '💡' },
  ];

  return (
    <>
      <div className="fixed inset-0 z-[9997]" onClick={onClose} onTouchEnd={onClose} />
      <div
        className="fixed bottom-12 right-0 w-[360px] bg-gray-900/97 backdrop-blur-xl border border-gray-600/50 shadow-2xl z-[9998] start-menu-open flex flex-col"
        style={{ maxHeight: 'calc(100vh - 60px)' }}
      >
        {/* Notifications */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white/90 text-sm font-medium">Notifications</h3>
            <button className="text-white/50 text-xs hover:text-white/80 px-2 py-1 rounded hover:bg-white/10">
              Clear all
            </button>
          </div>

          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <span className="text-3xl">🔔</span>
              <p className="text-white/50 text-xs mt-2">No new notifications</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {notifications.map(notif => (
                <div key={notif.id} className="bg-white/8 rounded-lg p-3 hover:bg-white/12 transition-colors">
                  <div className="flex items-start gap-2">
                    <span className="text-lg mt-0.5">{notif.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-white/90 text-xs font-medium">{notif.app}</span>
                        <span className="text-white/40 text-[10px]">{notif.time}</span>
                      </div>
                      <p className="text-white/60 text-[11px] mt-0.5 leading-tight">{notif.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="border-t border-gray-700/50 p-3">
          {/* Sliders */}
          <div className="space-y-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm">🔆</span>
              <input
                type="range"
                min="0"
                max="100"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="flex-1 h-1 accent-blue-400"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">🔊</span>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="flex-1 h-1 accent-blue-400"
              />
            </div>
          </div>

          {/* Quick action buttons */}
          <div className="grid grid-cols-4 gap-1.5">
            {quickActions.map(action => (
              <button
                key={action.id}
                className={`flex flex-col items-center justify-center p-2.5 rounded transition-colors ${
                  activeQuickActions.includes(action.id)
                    ? 'bg-blue-500/80 text-white'
                    : 'bg-white/8 text-white/70 hover:bg-white/15'
                }`}
                onClick={() => toggleQuickAction(action.id)}
                onTouchEnd={() => toggleQuickAction(action.id)}
              >
                <span className="text-lg mb-0.5">{action.icon}</span>
                <span className="text-[9px] leading-tight text-center">{action.label}</span>
              </button>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-700/30">
            <button className="text-white/60 text-xs hover:text-white/80 px-2 py-1 rounded hover:bg-white/10">
              Expand
            </button>
            <button className="text-white/60 text-xs hover:text-white/80 px-2 py-1 rounded hover:bg-white/10">
              Edit quick actions
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
