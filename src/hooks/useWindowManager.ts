import { useState, useCallback, useEffect } from 'react';
import { WindowState } from '../types';
import { processManager } from '../lib/processManager';

let nextZIndex = 100;
let windowCounter = 0;

export function useWindowManager() {
  const [windows, setWindows] = useState<WindowState[]>([]);

  const openWindow = useCallback((title: string, icon: string, component: string) => {
    windowCounter++;
    const id = `window-${windowCounter}-${Date.now()}`;
    nextZIndex++;
    
    const newWindow: WindowState = {
      id,
      title,
      icon,
      component,
      x: 100 + (windowCounter % 5) * 30,
      y: 50 + (windowCounter % 5) * 30,
      width: component === 'calculator' ? 320 : 700,
      height: component === 'calculator' ? 480 : 500,
      isMinimized: false,
      isMaximized: false,
      zIndex: nextZIndex,
    };

    // Create process for this window
    processManager.createProcess(id, title, icon, title, component);

    setWindows(prev => [...prev, newWindow]);
    return id;
  }, []);

  const closeWindow = useCallback((id: string) => {
    // Find and terminate the process
    const process = processManager.getProcessByWindowId(id);
    if (process) {
      processManager.terminateProcess(process.pid);
    }
    
    setWindows(prev => prev.filter(w => w.id !== id));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => {
      if (w.id !== id) return w;
      return { ...w, isMaximized: !w.isMaximized, isMinimized: false };
    }));
  }, []);

  const restoreWindow = useCallback((id: string) => {
    nextZIndex++;
    setWindows(prev => prev.map(w => {
      if (w.id !== id) return w;
      return { ...w, isMinimized: false, zIndex: nextZIndex };
    }));
  }, []);

  const focusWindow = useCallback((id: string) => {
    nextZIndex++;
    setWindows(prev => prev.map(w => {
      if (w.id !== id) return w;
      return { ...w, zIndex: nextZIndex, isMinimized: false };
    }));
  }, []);

  const moveWindow = useCallback((id: string, x: number, y: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, x, y } : w));
  }, []);

  const resizeWindow = useCallback((id: string, width: number, height: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, width, height } : w));
  }, []);

  // Update process stats periodically
  useEffect(() => {
    const interval = setInterval(() => {
      processManager.updateProcessStats();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return {
    windows,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    focusWindow,
    moveWindow,
    resizeWindow,
  };
}
