import { useState } from 'react';

export default function Browser() {
  const [url, setUrl] = useState('https://www.bing.com');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      setUrl(`https://www.bing.com/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Tab bar */}
      <div className="flex items-center h-9 bg-gray-100 border-b border-gray-200 px-1">
        <div className="flex items-center h-7 bg-white rounded-t px-3 min-w-[150px] max-w-[200px] border border-gray-200 border-b-white -mb-px">
          <span className="text-xs text-gray-600 truncate flex-1">Bing</span>
          <button className="ml-2 w-4 h-4 flex items-center justify-center rounded hover:bg-gray-200 text-gray-400 text-xs">×</button>
        </div>
        <button className="ml-1 w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 text-gray-500 text-lg">+</button>
      </div>

      {/* Navigation bar */}
      <div className="flex items-center h-10 bg-gray-50 border-b border-gray-200 px-2 gap-1">
        <button className="p-1.5 rounded hover:bg-gray-200">
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
            <path d="M8 1v14M1 8h14" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 1a7 7 0 0 1 0 14" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>

        {/* URL bar */}
        <form onSubmit={handleSearch} className="flex-1 mx-1">
          <div className="flex items-center h-7 bg-white border border-gray-300 rounded-full px-3">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="gray" className="mr-2 flex-shrink-0">
              <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1z" fill="none" stroke="gray" strokeWidth="1.5" />
              <path d="M8 4v4l3 2" fill="none" stroke="gray" strokeWidth="1.5" />
            </svg>
            <input
              type="text"
              className="flex-1 text-xs outline-none bg-transparent"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={{ userSelect: 'text' }}
            />
          </div>
        </form>

        <button className="p-1.5 rounded hover:bg-gray-200">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="3" cy="8" r="1.5" />
            <circle cx="8" cy="8" r="1.5" />
            <circle cx="13" cy="8" r="1.5" />
          </svg>
        </button>
      </div>

      {/* Content - Bing-like page */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-blue-50 to-white">
        <div className="flex flex-col items-center justify-center pt-20">
          {/* Bing logo */}
          <div className="text-5xl font-bold mb-8">
            <span className="text-blue-600">B</span>
            <span className="text-purple-600">i</span>
            <span className="text-green-600">n</span>
            <span className="text-yellow-600">g</span>
          </div>

          {/* Search box */}
          <form onSubmit={handleSearch} className="w-full max-w-lg px-4">
            <div className="flex items-center bg-white rounded-full shadow-lg border border-gray-200 px-4 py-3">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="gray" className="mr-3">
                <circle cx="7" cy="7" r="5" fill="none" stroke="gray" strokeWidth="1.5" />
                <line x1="11" y1="11" x2="14" y2="14" stroke="gray" strokeWidth="1.5" />
              </svg>
              <input
                type="text"
                className="flex-1 outline-none text-sm"
                placeholder="Search the web"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ userSelect: 'text' }}
              />
            </div>
          </form>

          {/* Quick links */}
          <div className="grid grid-cols-4 gap-4 mt-10 px-4">
            {[
              { icon: '📧', label: 'Outlook' },
              { icon: '📰', label: 'News' },
              { icon: '🌤️', label: 'Weather' },
              { icon: '🎬', label: 'Videos' },
            ].map(item => (
              <button key={item.label} className="flex flex-col items-center p-3 rounded-lg hover:bg-white/80 transition-colors">
                <span className="text-2xl mb-1">{item.icon}</span>
                <span className="text-xs text-gray-600">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
