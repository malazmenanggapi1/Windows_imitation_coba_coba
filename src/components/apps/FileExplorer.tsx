import { useState } from 'react';

interface FileItem {
  name: string;
  type: 'folder' | 'file';
  icon: string;
  size?: string;
  modified?: string;
}

const fileSystem: Record<string, FileItem[]> = {
  'This PC': [
    { name: 'Desktop', type: 'folder', icon: '🖥️', modified: '12/15/2024' },
    { name: 'Documents', type: 'folder', icon: '📄', modified: '12/14/2024' },
    { name: 'Downloads', type: 'folder', icon: '📥', modified: '12/15/2024' },
    { name: 'Music', type: 'folder', icon: '🎵', modified: '11/20/2024' },
    { name: 'Pictures', type: 'folder', icon: '🖼️', modified: '12/10/2024' },
    { name: 'Videos', type: 'folder', icon: '🎬', modified: '11/05/2024' },
    { name: 'Local Disk (C:)', type: 'folder', icon: '💿', size: '237 GB free', modified: '12/15/2024' },
  ],
  'Desktop': [
    { name: 'New Folder', type: 'folder', icon: '📁', modified: '12/15/2024' },
    { name: 'readme.txt', type: 'file', icon: '📝', size: '2 KB', modified: '12/14/2024' },
    { name: 'photo.png', type: 'file', icon: '🖼️', size: '1.2 MB', modified: '12/10/2024' },
  ],
  'Documents': [
    { name: 'Work', type: 'folder', icon: '📁', modified: '12/14/2024' },
    { name: 'Personal', type: 'folder', icon: '📁', modified: '12/12/2024' },
    { name: 'report.docx', type: 'file', icon: '📄', size: '45 KB', modified: '12/14/2024' },
    { name: 'notes.txt', type: 'file', icon: '📝', size: '1 KB', modified: '12/13/2024' },
  ],
  'Downloads': [
    { name: 'setup.exe', type: 'file', icon: '⚙️', size: '25.4 MB', modified: '12/15/2024' },
    { name: 'image.jpg', type: 'file', icon: '🖼️', size: '3.2 MB', modified: '12/14/2024' },
    { name: 'archive.zip', type: 'file', icon: '📦', size: '15.7 MB', modified: '12/13/2024' },
  ],
};

export default function FileExplorer() {
  const [currentPath, setCurrentPath] = useState('This PC');
  const [pathHistory, setPathHistory] = useState<string[]>(['This PC']);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const navigateTo = (folder: string) => {
    setCurrentPath(folder);
    setPathHistory(prev => [...prev, folder]);
    setSelectedItem(null);
  };

  const goBack = () => {
    if (pathHistory.length > 1) {
      const newHistory = pathHistory.slice(0, -1);
      setPathHistory(newHistory);
      setCurrentPath(newHistory[newHistory.length - 1]);
      setSelectedItem(null);
    }
  };

  const items = fileSystem[currentPath] || [];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Toolbar */}
      <div className="flex items-center h-10 bg-gray-50 border-b border-gray-200 px-2 gap-1">
        <button
          className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-30"
          onClick={goBack}
          disabled={pathHistory.length <= 1}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M11 1L4 8l7 7" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
        <button className="p-1.5 rounded hover:bg-gray-200 opacity-30">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M5 1l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
        <button className="p-1.5 rounded hover:bg-gray-200">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 3v10M3 8h10" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>

        {/* Address bar */}
        <div className="flex-1 flex items-center h-7 bg-white border border-gray-300 rounded px-2 mx-2">
          <span className="text-xs text-gray-600">{currentPath}</span>
        </div>

        {/* Search */}
        <div className="flex items-center h-7 bg-white border border-gray-300 rounded px-2 w-40">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="gray" className="mr-1">
            <circle cx="7" cy="7" r="5" fill="none" stroke="gray" strokeWidth="1.5" />
            <line x1="11" y1="11" x2="14" y2="14" stroke="gray" strokeWidth="1.5" />
          </svg>
          <span className="text-xs text-gray-400">Search</span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-44 bg-gray-50 border-r border-gray-200 overflow-y-auto py-1">
          <div className="px-2 py-1 text-[10px] text-gray-500 font-semibold uppercase">Quick access</div>
          {['Desktop', 'Documents', 'Downloads'].map(item => (
            <button
              key={item}
              className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-200 flex items-center gap-2 ${currentPath === item ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
              onClick={() => navigateTo(item)}
            >
              <span className="text-sm">📁</span>
              {item}
            </button>
          ))}
          <div className="px-2 py-1 mt-2 text-[10px] text-gray-500 font-semibold uppercase">This PC</div>
          <button
            className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-200 flex items-center gap-2 ${currentPath === 'This PC' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
            onClick={() => navigateTo('This PC')}
          >
            <span className="text-sm">💻</span>
            This PC
          </button>
        </div>

        {/* File list */}
        <div className="flex-1 overflow-y-auto">
          {/* Column headers */}
          <div className="flex items-center h-7 bg-gray-50 border-b border-gray-200 text-[10px] text-gray-500 font-medium sticky top-0">
            <div className="flex-1 px-3">Name</div>
            <div className="w-24 px-2">Date modified</div>
            <div className="w-20 px-2">Type</div>
            <div className="w-20 px-2">Size</div>
          </div>

          {/* Files */}
          {items.map(item => (
            <button
              key={item.name}
              className={`w-full flex items-center h-8 text-xs hover:bg-blue-50 border-b border-gray-100 ${selectedItem === item.name ? 'bg-blue-100' : ''}`}
              onClick={() => setSelectedItem(item.name)}
              onDoubleClick={() => item.type === 'folder' && navigateTo(item.name)}
            >
              <div className="flex-1 px-3 flex items-center gap-2 truncate">
                <span className="text-sm">{item.icon}</span>
                <span className="truncate text-gray-800">{item.name}</span>
              </div>
              <div className="w-24 px-2 text-gray-500">{item.modified}</div>
              <div className="w-20 px-2 text-gray-500">{item.type === 'folder' ? 'Folder' : 'File'}</div>
              <div className="w-20 px-2 text-gray-500">{item.size || ''}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center h-6 bg-gray-50 border-t border-gray-200 px-3 text-[10px] text-gray-500">
        <span>{items.length} items</span>
        {selectedItem && <span className="ml-4">1 item selected</span>}
      </div>
    </div>
  );
}
