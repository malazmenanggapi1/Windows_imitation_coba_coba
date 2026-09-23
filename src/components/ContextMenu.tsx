import { ContextMenuState } from '../types';

interface ContextMenuProps {
  menu: ContextMenuState;
  onClose: () => void;
}

export default function ContextMenu({ menu, onClose }: ContextMenuProps) {
  if (!menu.visible) return null;

  return (
    <>
      <div className="fixed inset-0 z-[10000]" onClick={onClose} onTouchEnd={onClose} />
      <div
        className="fixed bg-white border border-gray-300 shadow-lg rounded py-1 min-w-[200px] context-menu z-[10001]"
        style={{ left: Math.min(menu.x, window.innerWidth - 220), top: Math.min(menu.y, window.innerHeight - 300) }}
      >
        {menu.items.map((item, index) => (
          item.separator ? (
            <div key={index} className="h-px bg-gray-200 my-1" />
          ) : (
            <button
              key={index}
              className="w-full text-left px-4 py-1.5 text-sm text-gray-700 hover:bg-blue-500 hover:text-white flex items-center gap-3 transition-colors"
              onClick={() => { item.action(); onClose(); }}
              onTouchEnd={() => { item.action(); onClose(); }}
            >
              {item.icon && <span className="text-sm w-4 text-center">{item.icon}</span>}
              {item.label}
            </button>
          )
        ))}
      </div>
    </>
  );
}
