import { useEffect, useState } from 'react';

export interface ToastNotification {
  id: string;
  app: string;
  title: string;
  message: string;
  icon: string;
  duration?: number;
}

interface NotificationToastProps {
  notifications: ToastNotification[];
  onDismiss: (id: string) => void;
}

export default function NotificationToast({ notifications, onDismiss }: NotificationToastProps) {
  return (
    <div className="fixed bottom-16 right-2 z-[99995] flex flex-col gap-2 max-w-[360px]">
      {notifications.map(notif => (
        <ToastItem key={notif.id} notification={notif} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({ notification, onDismiss }: { notification: ToastNotification; onDismiss: (id: string) => void }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in
    requestAnimationFrame(() => setIsVisible(true));

    // Auto dismiss
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onDismiss(notification.id), 300);
    }, notification.duration || 5000);

    return () => clearTimeout(timer);
  }, [notification, onDismiss]);

  return (
    <div
      className={`bg-[#2b2b2b]/98 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl p-3 transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
      style={{ minWidth: '320px' }}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">{notification.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-[10px] uppercase tracking-wide">{notification.app}</span>
            <button
              className="text-white/40 hover:text-white/80 w-5 h-5 flex items-center justify-center rounded hover:bg-white/10"
              onClick={() => { setIsVisible(false); setTimeout(() => onDismiss(notification.id), 300); }}
            >
              ×
            </button>
          </div>
          <h4 className="text-white/90 text-sm font-medium mt-0.5">{notification.title}</h4>
          <p className="text-white/60 text-xs mt-0.5 leading-tight">{notification.message}</p>
        </div>
      </div>
    </div>
  );
}
