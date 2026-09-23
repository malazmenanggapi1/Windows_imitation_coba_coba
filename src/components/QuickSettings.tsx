import { useState } from 'react';

interface QuickSettingsProps {
  onClose: () => void;
}

export default function QuickSettings({ onClose }: QuickSettingsProps) {
  const [volume, setVolume] = useState(65);
  const [brightness, setBrightness] = useState(80);

  return (
    <>
      <div className="fixed inset-0 z-[9997]" onClick={onClose} onTouchEnd={onClose} />
      <div
        className="fixed bottom-[52px] right-[44px] w-[360px] bg-[#2b2b2b]/98 backdrop-blur-2xl border border-white/10 shadow-2xl z-[9998] start-menu-open rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        {/* Network section */}
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">📶</span>
              <div>
                <p className="text-white/90 text-sm">HomeNetwork-5G</p>
                <p className="text-white/50 text-[11px]">Connected, secured</p>
              </div>
            </div>
            <button className="text-white/50 text-xs px-2 py-1 rounded hover:bg-white/10">
              ›
            </button>
          </div>

          {/* Available networks */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 p-2 rounded hover:bg-white/8">
              <span className="text-sm opacity-60">📶</span>
              <span className="text-white/70 text-xs">Neighbor_WiFi</span>
              <span className="text-white/30 text-[10px] ml-auto">Secured</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded hover:bg-white/8">
              <span className="text-sm opacity-60">📶</span>
              <span className="text-white/70 text-xs">CoffeeShop_Free</span>
              <span className="text-white/30 text-[10px] ml-auto">Open</span>
            </div>
          </div>
        </div>

        {/* Volume */}
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <span className="text-lg">🔊</span>
            <div className="flex-1">
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <span className="text-white/60 text-xs w-8 text-right">{volume}%</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-white/50 text-[11px]">Speakers (Realtek High Definition Audio)</span>
          </div>
        </div>

        {/* Brightness */}
        <div className="p-4">
          <div className="flex items-center gap-3">
            <span className="text-lg">🔆</span>
            <div className="flex-1">
              <input
                type="range"
                min="0"
                max="100"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <span className="text-white/60 text-xs w-8 text-right">{brightness}%</span>
          </div>
        </div>
      </div>
    </>
  );
}
