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
    { name: 'Desktop', type: 'folder', icon: '🖥️', modified: '12/15/2024 10:30 AM' },
    { name: 'Documents', type: 'folder', icon: '📄', modified: '12/14/2024 2:15 PM' },
    { name: 'Downloads', type: 'folder', icon: '📥', modified: '12/15/2024 9:00 AM' },
    { name: 'Music', type: 'folder', icon: '🎵', modified: '11/20/2024 3:45 PM' },
    { name: 'Pictures', type: 'folder', icon: '🖼️', modified: '12/10/2024 11:20 AM' },
    { name: 'Videos', type: 'folder', icon: '🎬', modified: '11/05/2024 4:30 PM' },
    { name: 'Local Disk (C:)', type: 'folder', icon: '💿', size: '237 GB free of 476 GB', modified: '12/15/2024' },
  ],
  'Desktop': [
    { name: 'Projects', type: 'folder', icon: '📁', modified: '12/15/2024 10:30 AM' },
    { name: 'Screenshots', type: 'folder', icon: '📁', modified: '12/14/2024 3:20 PM' },
    { name: 'readme.txt', type: 'file', icon: '📝', size: '2 KB', modified: '12/14/2024 2:15 PM' },
    { name: 'photo.png', type: 'file', icon: '🖼️', size: '1.2 MB', modified: '12/10/2024 11:20 AM' },
    { name: 'notes.docx', type: 'file', icon: '📄', size: '45 KB', modified: '12/13/2024 9:00 AM' },
  ],
  'Documents': [
    { name: 'Work', type: 'folder', icon: '📁', modified: '12/14/2024 2:15 PM' },
    { name: 'Personal', type: 'folder', icon: '📁', modified: '12/12/2024 4:30 PM' },
    { name: 'report.docx', type: 'file', icon: '📄', size: '45 KB', modified: '12/14/2024 2:15 PM' },
    { name: 'notes.txt', type: 'file', icon: '📝', size: '1 KB', modified: '12/13/2024 9:00 AM' },
    { name: 'budget.xlsx', type: 'file', icon: '📊', size: '128 KB', modified: '12/11/2024 10:00 AM' },
    { name: 'presentation.pptx', type: 'file', icon: '📊', size: '2.4 MB', modified: '12/09/2024 1:30 PM' },
  ],
  'Downloads': [
    { name: 'setup.exe', type: 'file', icon: '⚙️', size: '25.4 MB', modified: '12/15/2024 9:00 AM' },
    { name: 'image.jpg', type: 'file', icon: '🖼️', size: '3.2 MB', modified: '12/14/2024 3:20 PM' },
    { name: 'archive.zip', type: 'file', icon: '📦', size: '15.7 MB', modified: '12/13/2024 11:45 AM' },
    { name: 'document.pdf', type: 'file', icon: '📕', size: '890 KB', modified: '12/12/2024 2:00 PM' },
  ],
  'Music': [
    { name: 'Playlist', type: 'folder', icon: '📁', modified: '11/20/2024 3:45 PM' },
    { name: 'song1.mp3', type: 'file', icon: '🎵', size: '4.2 MB', modified: '11/18/2024 10:00 AM' },
    { name: 'song2.mp3', type: 'file', icon: '🎵', size: '3.8 MB', modified: '11/15/2024 2:30 PM' },
  ],
  'Pictures': [
    { name: 'Camera Roll', type: 'folder', icon: '📁', modified: '12/10/2024 11:20 AM' },
    { name: 'Screenshots', type: 'folder', icon: '📁', modified: '12/08/2024 4:15 PM' },
    { name: 'wallpaper.jpg', type: 'file', icon: '🖼️', size: '2.1 MB', modified: '12/05/2024 9:30 AM' },
    { name: 'vacation.png', type: 'file', icon: '🖼️', size: '4.5 MB', modified: '11/28/2024 1:00 PM' },
  ],
  'Videos': [
    { name: 'video1.mp4', type: 'file', icon: '🎬', size: '125 MB', modified: '11/05/2024 4:30 PM' },
    { name: 'tutorial.mkv', type: 'file', icon: '🎬', size: '340 MB', modified: '10/20/2024 11:00 AM' },
  ],
};

export default function FileExplorer() {
  const [currentPath, setCurrentPath] = useState('This PC');
  const [pathHistory, setPathHistory] = useState<string[]>(['This PC']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'icons'>('list');

  const navigateTo = (folder: string) => {
    const newHistory = [...pathHistory.slice(0, historyIndex + 1), folder];
    setPathHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentPath(folder);
    setSelectedItem(null);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentPath(pathHistory[newIndex]);
      setSelectedItem(null);
    }
  };

  const goForward = () => {
    if (historyIndex < pathHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentPath(pathHistory[newIndex]);
      setSelectedItem(null);
    }
  };

  const goUp = () => {
    if (currentPath !== 'This PC') {
      navigateTo('This PC');
    }
  };

  const items = fileSystem[currentPath] || [];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Ribbon Toolbar */}
      <div className="bg-[#f3f3f3] border-b border-gray-200">
        {/* Tab headers */}
        <div className="flex items-center h-[28px] px-2 gap-0 border-b border-gray-200">
          <button className="px-3 h-full text-[12px] text-gray-700 hover:bg-gray-200 border-b-2 border-transparent hover:border-blue-400">File</button>
          <button className="px-3 h-full text-[12px] text-blue-600 border-b-2 border-blue-500 font-medium">Home</button>
          <button className="px-3 h-full text-[12px] text-gray-700 hover:bg-gray-200 border-b-2 border-transparent hover:border-blue-400">Share</button>
          <button className="px-3 h-full text-[12px] text-gray-700 hover:bg-gray-200 border-b-2 border-transparent hover:border-blue-400">View</button>
        </div>

        {/* Toolbar content */}
        <div className="flex items-center h-[40px] px-2 gap-2">
          <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
            <button className="px-2 py-1 text-[11px] text-gray-600 hover:bg-gray-200 rounded flex items-center gap-1">
              <span>📋</span> Copy
            </button>
            <button className="px-2 py-1 text-[11px] text-gray-600 hover:bg-gray-200 rounded flex items-center gap-1">
              <span>📋</span> Paste
            </button>
            <button className="px-2 py-1 text-[11px] text-gray-600 hover:bg-gray-200 rounded flex items-center gap-1">
              <span>✂️</span> Cut
            </button>
            <button className="px-2 py-1 text-[11px] text-gray-600 hover:bg-gray-200 rounded flex items-center gap-1">
              <span>🗑️</span> Delete
            </button>
            <button className="px-2 py-1 text-[11px] text-gray-600 hover:bg-gray-200 rounded flex items-center gap-1">
              <span>✏️</span> Rename
            </button>
          </div>

          <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
            <button className="px-2 py-1 text-[11px] text-gray-600 hover:bg-gray-200 rounded flex items-center gap-1">
              <span>📁</span> New folder
            </button>
            <button className="px-2 py-1 text-[11px] text-gray-600 hover:bg-gray-200 rounded flex items-center gap-1">
              <span>⚙️</span> Properties
            </button>
          </div>

          <div className="flex items-center gap-1 ml-auto">
            <button
              className={`p-1 rounded ${viewMode === 'icons' ? 'bg-blue-100' : 'hover:bg-gray-200'}`}
              onClick={() => setViewMode('icons')}
              title="Extra large icons"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" className="text-gray-600">
                <rect x="1" y="1" width="5" height="5" rx="0.5" />
                <rect x="8" y="1" width="5" height="5" rx="0.5" />
                <rect x="1" y="8" width="5" height="5" rx="0.5" />
                <rect x="8" y="8" width="5" height="5" rx="0.5" />
              </svg>
            </button>
            <button
              className={`p-1 rounded ${viewMode === 'list' ? 'bg-blue-100' : 'hover:bg-gray-200'}`}
              onClick={() => setViewMode('list')}
              title="Details"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" className="text-gray-600">
                <rect x="1" y="2" width="12" height="1.5" rx="0.5" />
                <rect x="1" y="5.5" width="12" height="1.5" rx="0.5" />
                <rect x="1" y="9" width="12" height="1.5" rx="0.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation bar */}
      <div className="flex items-center h-[34px] bg-white border-b border-gray-200 px-2 gap-1">
        <button
          className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30"
          onClick={goBack}
          disabled={historyIndex <= 0}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M8 1L3 6l5 5" stroke="currentColor" strokeWidth="1.5" className="text-gray-600" />
          </svg>
        </button>
        <button
          className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30"
          onClick={goForward}
          disabled={historyIndex >= pathHistory.length - 1}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M4 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" className="text-gray-600" />
          </svg>
        </button>
        <button
          className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30"
          onClick={goUp}
          disabled={currentPath === 'This PC'}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 8l5-5 5 5" stroke="currentColor" strokeWidth="1.5" className="text-gray-600" />
          </svg>
        </button>

        {/* Address bar */}
        <div className="flex-1 flex items-center h-[26px] bg-white border border-gray-300 rounded-sm px-2 mx-1 hover:border-blue-400 focus-within:border-blue-500">
          <div className="flex items-center gap-1 text-[12px] text-gray-700 flex-1">
            {pathHistory.slice(0, historyIndex + 1).map((p, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <span className="text-gray-400">›</span>}
                <button
                  className="hover:bg-gray-100 px-1 rounded"
                  onClick={() => {
                    setHistoryIndex(i);
                    setCurrentPath(p);
                  }}
                >
                  {p}
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center h-[26px] bg-white border border-gray-300 rounded-sm px-2 w-[180px] hover:border-blue-400 focus-within:border-blue-500">
          <svg width="12" height="12" viewBox="0 0 16 16" className="mr-1.5 text-gray-400">
            <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <line x1="11" y1="11" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <span className="text-[12px] text-gray-400">Search {currentPath}</span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-[200px] bg-white border-r border-gray-200 overflow-y-auto py-1 flex-shrink-0">
          <div className="px-3 py-1.5 text-[11px] text-gray-500 font-semibold">⭐ Quick access</div>
          {['Desktop', 'Downloads', 'Documents', 'Pictures', 'Music', 'Videos'].map(item => (
            <button
              key={item}
              className={`w-full text-left px-3 py-[5px] text-[12px] hover:bg-gray-100 flex items-center gap-2 ${currentPath === item ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
              onClick={() => navigateTo(item)}
            >
              <span className="text-sm">📁</span>
              {item}
            </button>
          ))}
          
          <div className="px-3 py-1.5 mt-2 text-[11px] text-gray-500 font-semibold">💻 This PC</div>
          <button
            className={`w-full text-left px-3 py-[5px] text-[12px] hover:bg-gray-100 flex items-center gap-2 ${currentPath === 'This PC' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
            onClick={() => navigateTo('This PC')}
          >
            <span className="text-sm">💻</span>
            This PC
          </button>
          <button className="w-full text-left px-6 py-[5px] text-[12px] hover:bg-gray-100 flex items-center gap-2 text-gray-600">
            <span className="text-sm">💿</span>
            Local Disk (C:)
          </button>

          <div className="px-3 py-1.5 mt-2 text-[11px] text-gray-500 font-semibold">🌐 Network</div>
        </div>

        {/* File list */}
        <div className="flex-1 overflow-y-auto bg-white">
          {viewMode === 'list' ? (
            <>
              {/* Column headers */}
              <div className="flex items-center h-[24px] bg-white border-b border-gray-200 text-[11px] text-gray-500 font-normal sticky top-0 z-10">
                <div className="flex-1 px-3 border-r border-gray-200">Name</div>
                <div className="w-[140px] px-2 border-r border-gray-200">Date modified</div>
                <div className="w-[80px] px-2 border-r border-gray-200">Type</div>
                <div className="w-[100px] px-2">Size</div>
              </div>

              {/* Files */}
              {items.map(item => (
                <button
                  key={item.name}
                  className={`w-full flex items-center h-[22px] text-[12px] hover:bg-blue-50 border-b border-transparent ${selectedItem === item.name ? 'bg-blue-100 hover:bg-blue-100' : ''}`}
                  onClick={() => setSelectedItem(item.name)}
                  onDoubleClick={() => item.type === 'folder' && navigateTo(item.name)}
                >
                  <div className="flex-1 px-3 flex items-center gap-2 truncate">
                    <span className="text-sm flex-shrink-0">{item.icon}</span>
                    <span className="truncate text-gray-800">{item.name}</span>
                  </div>
                  <div className="w-[140px] px-2 text-gray-500 text-[11px]">{item.modified}</div>
                  <div className="w-[80px] px-2 text-gray-500 text-[11px]">{item.type === 'folder' ? 'File folder' : 'File'}</div>
                  <div className="w-[100px] px-2 text-gray-500 text-[11px]">{item.size || ''}</div>
                </button>
              ))}
            </>
          ) : (
            <div className="p-3 grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-1">
              {items.map(item => (
                <button
                  key={item.name}
                  className={`flex flex-col items-center p-2 rounded hover:bg-blue-50 ${selectedItem === item.name ? 'bg-blue-100' : ''}`}
                  onClick={() => setSelectedItem(item.name)}
                  onDoubleClick={() => item.type === 'folder' && navigateTo(item.name)}
                >
                  <span className="text-3xl mb-1">{item.icon}</span>
                  <span className="text-[11px] text-gray-700 text-center leading-tight line-clamp-2">{item.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center h-[24px] bg-[#f3f3f3] border-t border-gray-200 px-3 text-[11px] text-gray-500">
        <span>{items.length} items</span>
        {selectedItem && <span className="ml-3">| 1 item selected</span>}
        <div className="ml-auto flex items-center gap-2">
          <button
            className={`p-0.5 rounded ${viewMode === 'icons' ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'}`}
            onClick={() => setViewMode('icons')}
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="currentColor">
              <rect x="1" y="1" width="5" height="5" rx="0.5" />
              <rect x="8" y="1" width="5" height="5" rx="0.5" />
              <rect x="1" y="8" width="5" height="5" rx="0.5" />
              <rect x="8" y="8" width="5" height="5" rx="0.5" />
            </svg>
          </button>
          <button
            className={`p-0.5 rounded ${viewMode === 'list' ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'}`}
            onClick={() => setViewMode('list')}
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="currentColor">
              <rect x="1" y="2" width="12" height="1.5" rx="0.5" />
              <rect x="1" y="5.5" width="12" height="1.5" rx="0.5" />
              <rect x="1" y="9" width="12" height="1.5" rx="0.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
