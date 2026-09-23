import { useState } from 'react';

export default function Settings() {
  const [activeSection, setActiveSection] = useState('system');

  const sections = [
    { id: 'system', icon: '💻', label: 'System' },
    { id: 'devices', icon: '🖨️', label: 'Devices' },
    { id: 'network', icon: '🌐', label: 'Network & Internet' },
    { id: 'personalization', icon: '🎨', label: 'Personalization' },
    { id: 'apps', icon: '📱', label: 'Apps' },
    { id: 'accounts', icon: '👤', label: 'Accounts' },
    { id: 'time', icon: '🕐', label: 'Time & Language' },
    { id: 'gaming', icon: '🎮', label: 'Gaming' },
    { id: 'accessibility', icon: '♿', label: 'Ease of Access' },
    { id: 'privacy', icon: '🔒', label: 'Privacy' },
    { id: 'update', icon: '🔄', label: 'Update & Security' },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-gray-800 text-white px-6 py-6">
        <h1 className="text-xl font-light">Settings</h1>
        <div className="mt-3 flex items-center bg-white/10 rounded px-3 py-2">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="white" className="opacity-60 mr-2">
            <circle cx="7" cy="7" r="5" fill="none" stroke="white" strokeWidth="1.5" opacity="0.6" />
            <line x1="11" y1="11" x2="14" y2="14" stroke="white" strokeWidth="1.5" opacity="0.6" />
          </svg>
          <span className="text-sm text-white/60">Find a setting</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-56 overflow-y-auto bg-white border-r border-gray-200 py-2">
          {sections.map(section => (
            <button
              key={section.id}
              className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-gray-100 ${activeSection === section.id ? 'bg-gray-100 font-medium' : 'text-gray-700'}`}
              onClick={() => setActiveSection(section.id)}
            >
              <span className="text-lg">{section.icon}</span>
              {section.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeSection === 'system' && (
            <div>
              <h2 className="text-2xl font-light text-gray-800 mb-6">System</h2>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-800">Display</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Brightness, night light, resolution</p>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="gray">
                      <path d="M6 3l5 5-5 5" fill="none" stroke="gray" strokeWidth="1.5" />
                    </svg>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-800">Sound</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Volume, output, input</p>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="gray">
                      <path d="M6 3l5 5-5 5" fill="none" stroke="gray" strokeWidth="1.5" />
                    </svg>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-800">Notifications & actions</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Alerts from apps, focus assist</p>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="gray">
                      <path d="M6 3l5 5-5 5" fill="none" stroke="gray" strokeWidth="1.5" />
                    </svg>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-800">Power & sleep</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Screen timeout, sleep settings</p>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="gray">
                      <path d="M6 3l5 5-5 5" fill="none" stroke="gray" strokeWidth="1.5" />
                    </svg>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-800">Storage</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Storage space, drives, configuration</p>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="gray">
                      <path d="M6 3l5 5-5 5" fill="none" stroke="gray" strokeWidth="1.5" />
                    </svg>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-medium text-gray-800">About</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Device specifications, Windows specs</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1 mt-2 pt-2 border-t border-gray-100">
                    <p><strong>Device name:</strong> DESKTOP-WIN10</p>
                    <p><strong>Processor:</strong> Intel Core i7-10700K</p>
                    <p><strong>Installed RAM:</strong> 16.0 GB</p>
                    <p><strong>System type:</strong> 64-bit operating system</p>
                    <p><strong>Edition:</strong> Windows 10 Pro</p>
                    <p><strong>Version:</strong> 22H2</p>
                    <p><strong>OS build:</strong> 19045.3803</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'personalization' && (
            <div>
              <h2 className="text-2xl font-light text-gray-800 mb-6">Personalization</h2>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-800 mb-3">Background</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500', 'bg-teal-500', 'bg-red-500', 'bg-indigo-500'].map((color, i) => (
                      <div key={i} className={`h-12 rounded ${color} cursor-pointer hover:ring-2 ring-blue-400`} />
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-800 mb-2">Colors</h3>
                  <p className="text-xs text-gray-500">Choose your mode: Light / Dark / Custom</p>
                </div>
              </div>
            </div>
          )}

          {activeSection !== 'system' && activeSection !== 'personalization' && (
            <div>
              <h2 className="text-2xl font-light text-gray-800 mb-6">
                {sections.find(s => s.id === activeSection)?.label}
              </h2>
              <div className="bg-white rounded-lg p-8 border border-gray-200 text-center">
                <span className="text-4xl">{sections.find(s => s.id === activeSection)?.icon}</span>
                <p className="text-gray-500 mt-3 text-sm">Settings for this section are available in the full version.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
