import React, { useRef, useCallback, useState, useEffect } from 'react';
import { WindowState } from '../types';

interface WindowProps {
  window: WindowState;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  onResize: (id: string, width: number, height: number) => void;
  onSnap: (id: string, direction: 'left' | 'right' | 'top') => void;
  children: React.ReactNode;
}

export default function Window({ window: win, onClose, onMinimize, onMaximize, onFocus, onMove, onResize, onSnap, children }: WindowProps) {
  const dragRef = useRef<{ startX: number; startY: number; winX: number; winY: number } | null>(null);
  const resizeRef = useRef<{ startX: number; startY: number; startW: number; startH: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [showSnapPreview, setShowSnapPreview] = useState<'left' | 'right' | null>(null);

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
    const newX = Math.max(-win.width + 100, dragRef.current.winX + dx);
    const newY = Math.max(0, dragRef.current.winY + dy);
    onMove(win.id, newX, newY);

    // Snap preview detection
    if (clientX <= 5) {
      setShowSnapPreview('left');
    } else if (clientX >= window.innerWidth - 5) {
      setShowSnapPreview('right');
    } else if (clientY <= 5) {
      // maximize on top
    } else {
      setShowSnapPreview(null);
    }
  }, [win.id, win.isMaximized, win.width, onMove]);

  const handleDragEnd = useCallback((clientX?: number) => {
    if (showSnapPreview && clientX !== undefined) {
      onSnap(win.id, showSnapPreview);
    }
    dragRef.current = null;
    setIsDragging(false);
    setShowSnapPreview(null);
  }, [win.id, showSnapPreview, onSnap]);

  const handleResizeStart = useCallback((clientX: number, clientY: number) => {
    if (win.isMaximized) return;
    resizeRef.current = {
      startX: clientX,
      startY: clientY,
      startW: win.width,
      startH: win.height,
    };
    setIsResizing(true);
    onFocus(win.id);
  }, [win.id, win.width, win.height, win.isMaximized, onFocus]);

  const handleResizeMove = useCallback((clientX: number, clientY: number) => {
    if (!resizeRef.current) return;
    const dx = clientX - resizeRef.current.startX;
    const dy = clientY - resizeRef.current.startY;
    const newW = Math.max(300, resizeRef.current.startW + dx);
    const newH = Math.max(200, resizeRef.current.startH + dy);
    onResize(win.id, newW, newH);
  }, [win.id, onResize]);

  const handleResizeEnd = useCallback(() => {
    resizeRef.current = null;
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (!isDragging && !isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) handleDragMove(e.clientX, e.clientY);
      if (isResizing) handleResizeMove(e.clientX, e.clientY);
    };
    const handleMouseUp = (e: MouseEvent) => {
      if (isDragging) handleDragEnd(e.clientX);
      if (isResizing) handleResizeEnd();
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        if (isDragging) handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
        if (isResizing) handleResizeMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const handleTouchEnd = (e: TouchEvent) => {
      if (isDragging) handleDragEnd(e.changedTouches[0]?.clientX);
      if (isResizing) handleResizeEnd();
    };

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
  }, [isDragging, isResizing, handleDragMove, handleDragEnd, handleResizeMove, handleResizeEnd]);

  if (win.isMinimized) return null;

  const style: React.CSSProperties = win.isMaximized
    ? { top: 0, left: 0, width: '100%', height: 'calc(100% - 48px)', zIndex: win.zIndex }
    : { top: win.y, left: win.x, width: win.width, height: win.height, zIndex: win.zIndex };

  return (
    <>
      {/* Snap preview overlay */}
      {showSnapPreview && (
        <div
          className="fixed bg-blue-400/20 border-2 border-blue-400/50 z-[99998] pointer-events-none transition-all"
          style={{
            top: 0,
            left: showSnapPreview === 'left' ? 0 : undefined,
            right: showSnapPreview === 'right' ? 0 : undefined,
            width: '50%',
            height: 'calc(100% - 48px)',
          }}
        />
      )}

      <div
        className="absolute flex flex-col bg-white shadow-[0_4px_16px_rgba(0,0,0,0.3)] border border-gray-300/80 window-open"
        style={style}
        onMouseDown={() => onFocus(win.id)}
        onTouchStart={() => onFocus(win.id)}
      >
        {/* Title Bar */}
        <div
          className="flex items-center h-[32px] bg-gray-100 border-b border-gray-200 flex-shrink-0 cursor-default select-none"
          onMouseDown={(e) => handleDragStart(e.clientX, e.clientY)}
          onTouchStart={(e) => {
            if (e.touches.length === 1) {
              handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
            }
          }}
          onDoubleClick={() => onMaximize(win.id)}
        >
          <div className="flex items-center px-3 flex-1 min-w-0">
            <span className="text-sm mr-2 flex-shrink-0">{win.icon}</span>
            <span className="text-[12px] text-gray-700 truncate">{win.title}</span>
          </div>
          <div className="flex h-full flex-shrink-0">
            <button
              className="w-[46px] h-full flex items-center justify-center hover:bg-gray-200/80 transition-colors active:bg-gray-300"
              onClick={(e) => { e.stopPropagation(); onMinimize(win.id); }}
              onTouchEnd={(e) => { e.stopPropagation(); e.preventDefault(); onMinimize(win.id); }}
            >
              <svg width="10" height="1" viewBox="0 0 10 1" className="text-gray-600">
                <rect width="10" height="1" fill="currentColor" />
              </svg>
            </button>
            <button
              className="w-[46px] h-full flex items-center justify-center hover:bg-gray-200/80 transition-colors active:bg-gray-300"
              onClick={(e) => { e.stopPropagation(); onMaximize(win.id); }}
              onTouchEnd={(e) => { e.stopPropagation(); e.preventDefault(); onMaximize(win.id); }}
            >
              {win.isMaximized ? (
                <svg width="10" height="10" viewBox="0 0 10 10" className="text-gray-600">
                  <rect x="2" y="0" width="8" height="8" fill="none" stroke="currentColor" strokeWidth="1" />
                  <rect x="0" y="2" width="8" height="8" fill="white" stroke="currentColor" strokeWidth="1" />
                </svg>
              ) : (
                <svg width="10" height="10" viewBox="0 0 10 10" className="text-gray-600">
                  <rect x="0.5" y="0.5" width="9" height="9" fill="none" stroke="currentColor" strokeWidth="1" />
                </svg>
              )}
            </button>
            <button
              className="w-[46px] h-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors group active:bg-red-600"
              onClick={(e) => { e.stopPropagation(); onClose(win.id); }}
              onTouchEnd={(e) => { e.stopPropagation(); e.preventDefault(); onClose(win.id); }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" className="text-gray-600 group-hover:text-white">
                <line x1="0" y1="0" x2="10" y2="10" stroke="currentColor" strokeWidth="1.2" />
                <line x1="10" y1="0" x2="0" y2="10" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden relative">
          {children}
        </div>

        {/* Resize handle - bottom right */}
        {!win.isMaximized && (
          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-10"
            onMouseDown={(e) => { e.stopPropagation(); handleResizeStart(e.clientX, e.clientY); }}
            onTouchStart={(e) => {
              e.stopPropagation();
              if (e.touches.length === 1) {
                handleResizeStart(e.touches[0].clientX, e.touches[0].clientY);
              }
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" className="absolute bottom-0.5 right-0.5 text-gray-400">
              <line x1="10" y1="2" x2="2" y2="10" stroke="currentColor" strokeWidth="1" />
              <line x1="10" y1="5" x2="5" y2="10" stroke="currentColor" strokeWidth="1" />
              <line x1="10" y1="8" x2="8" y2="10" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>
        )}
      </div>
    </>
  );
}
