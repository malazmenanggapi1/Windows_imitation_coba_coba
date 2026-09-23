import React, { useRef, useCallback, useState } from 'react';
import { WindowState } from '../types';

interface WindowProps {
  window: WindowState;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  children: React.ReactNode;
}

export default function Window({ window: win, onClose, onMinimize, onMaximize, onFocus, onMove, children }: WindowProps) {
  const dragRef = useRef<{ startX: number; startY: number; winX: number; winY: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = useCallback((clientX: number, clientY: number) => {
    if (win.isMaximized) return;
    dragRef.current = {
      startX: clientX,
      startY: clientY,
      winX: win.x,
      winY: win.y,
    };
    setIsDragging(true);
    onFocus(win.id);
  }, [win.id, win.x, win.y, win.isMaximized, onFocus]);

  const handleDragMove = useCallback((clientX: number, clientY: number) => {
    if (!dragRef.current || win.isMaximized) return;
    const dx = clientX - dragRef.current.startX;
    const dy = clientY - dragRef.current.startY;
    const newX = Math.max(0, dragRef.current.winX + dx);
    const newY = Math.max(0, dragRef.current.winY + dy);
    onMove(win.id, newX, newY);
  }, [win.id, win.isMaximized, onMove]);

  const handleDragEnd = useCallback(() => {
    dragRef.current = null;
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => handleDragMove(e.clientX, e.clientY);
    const handleMouseUp = () => handleDragEnd();
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const handleTouchEnd = () => handleDragEnd();

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  if (win.isMinimized) return null;

  const style: React.CSSProperties = win.isMaximized
    ? { top: 0, left: 0, width: '100%', height: 'calc(100% - 48px)', zIndex: win.zIndex }
    : { top: win.y, left: win.x, width: win.width, height: win.height, zIndex: win.zIndex };

  return (
    <div
      className="absolute flex flex-col bg-white shadow-lg border border-gray-300 window-open"
      style={style}
      onMouseDown={() => onFocus(win.id)}
      onTouchStart={() => onFocus(win.id)}
    >
      {/* Title Bar */}
      <div
        className="flex items-center h-8 bg-gray-100 border-b border-gray-200 flex-shrink-0 cursor-default select-none"
        onMouseDown={(e) => handleDragStart(e.clientX, e.clientY)}
        onTouchStart={(e) => {
          if (e.touches.length === 1) {
            handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
          }
        }}
        onDoubleClick={() => onMaximize(win.id)}
      >
        <div className="flex items-center px-2 flex-1 min-w-0">
          <span className="text-sm mr-2">{win.icon}</span>
          <span className="text-xs text-gray-700 truncate">{win.title}</span>
        </div>
        <div className="flex h-full">
          <button
            className="w-11 h-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            onClick={(e) => { e.stopPropagation(); onMinimize(win.id); }}
            onTouchEnd={(e) => { e.stopPropagation(); onMinimize(win.id); }}
          >
            <svg width="10" height="1" viewBox="0 0 10 1" fill="currentColor" className="text-gray-600">
              <rect width="10" height="1" />
            </svg>
          </button>
          <button
            className="w-11 h-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            onClick={(e) => { e.stopPropagation(); onMaximize(win.id); }}
            onTouchEnd={(e) => { e.stopPropagation(); onMaximize(win.id); }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" className="text-gray-600">
              <rect x="0.5" y="0.5" width="9" height="9" strokeWidth="1" />
            </svg>
          </button>
          <button
            className="w-11 h-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors group"
            onClick={(e) => { e.stopPropagation(); onClose(win.id); }}
            onTouchEnd={(e) => { e.stopPropagation(); onClose(win.id); }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" className="text-gray-600 group-hover:text-white">
              <line x1="0" y1="0" x2="10" y2="10" strokeWidth="1" />
              <line x1="10" y1="0" x2="0" y2="10" strokeWidth="1" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
