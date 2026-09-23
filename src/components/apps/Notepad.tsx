import { useState, useRef } from 'react';

export default function Notepad() {
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('Untitled');
  const [modified, setModified] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [wordWrap, setWordWrap] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setModified(true);
  };

  const handleNew = () => {
    setText('');
    setFileName('Untitled');
    setModified(false);
    setOpenMenu(null);
  };

  const handleSave = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setModified(false);
    setOpenMenu(null);
  };

  const handleOpen = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.md,.js,.ts,.css,.html,.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setText(ev.target?.result as string || '');
          setFileName(file.name.replace(/\.[^/.]+$/, ''));
          setModified(false);
        };
        reader.readAsText(file);
      }
    };
    input.click();
    setOpenMenu(null);
  };

  const getLineCol = () => {
    if (!textareaRef.current) return { line: 1, col: 1 };
    const pos = textareaRef.current.selectionStart;
    const lines = text.substring(0, pos).split('\n');
    return { line: lines.length, col: lines[lines.length - 1].length + 1 };
  };

  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });

  const menus: Record<string, { label: string; action?: () => void; shortcut?: string; separator?: boolean }[]> = {
    'File': [
      { label: 'New', action: handleNew, shortcut: 'Ctrl+N' },
      { label: 'Open...', action: handleOpen, shortcut: 'Ctrl+O' },
      { label: 'Save', action: handleSave, shortcut: 'Ctrl+S' },
      { separator: true, label: '' },
      { label: 'Page setup...', action: () => setOpenMenu(null) },
      { label: 'Print...', action: () => window.print(), shortcut: 'Ctrl+P' },
      { separator: true, label: '' },
      { label: 'Exit', action: () => setOpenMenu(null) },
    ],
    'Edit': [
      { label: 'Undo', action: () => document.execCommand('undo'), shortcut: 'Ctrl+Z' },
      { separator: true, label: '' },
      { label: 'Cut', action: () => document.execCommand('cut'), shortcut: 'Ctrl+X' },
      { label: 'Copy', action: () => document.execCommand('copy'), shortcut: 'Ctrl+C' },
      { label: 'Paste', action: () => document.execCommand('paste'), shortcut: 'Ctrl+V' },
      { label: 'Delete', action: () => document.execCommand('delete'), shortcut: 'Del' },
      { separator: true, label: '' },
      { label: 'Select All', action: () => textareaRef.current?.select(), shortcut: 'Ctrl+A' },
      { label: 'Time/Date', action: () => { setText(text + new Date().toLocaleString()); setModified(true); }, shortcut: 'F5' },
    ],
    'Format': [
      { label: 'Word Wrap', action: () => setWordWrap(!wordWrap) },
      { label: 'Font...', action: () => setOpenMenu(null) },
    ],
    'View': [
      { label: 'Zoom In', action: () => setFontSize(Math.min(32, fontSize + 2)), shortcut: 'Ctrl++' },
      { label: 'Zoom Out', action: () => setFontSize(Math.max(8, fontSize - 2)), shortcut: 'Ctrl+-' },
      { label: 'Restore Default Zoom', action: () => setFontSize(14) },
      { separator: true, label: '' },
      { label: 'Status Bar', action: () => setOpenMenu(null) },
    ],
    'Help': [
      { label: 'View Help', action: () => setOpenMenu(null) },
      { separator: true, label: '' },
      { label: 'About Notepad', action: () => setOpenMenu(null) },
    ],
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Menu Bar */}
      <div className="flex items-center h-[24px] bg-white border-b border-gray-200 px-1 text-[12px] text-gray-700 relative z-10">
        {Object.keys(menus).map(menuName => (
          <div key={menuName} className="relative">
            <button
              className={`px-2 py-0.5 ${openMenu === menuName ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
              onClick={() => setOpenMenu(openMenu === menuName ? null : menuName)}
              onMouseEnter={() => openMenu && setOpenMenu(menuName)}
            >
              {menuName}
            </button>
            {openMenu === menuName && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setOpenMenu(null)} />
                <div className="absolute top-full left-0 bg-white border border-gray-300 shadow-lg rounded-sm py-1 min-w-[200px] z-30">
                  {menus[menuName].map((item, i) => {
                    if (item.separator) return <div key={i} className="h-px bg-gray-200 my-1" />;
                    return (
                      <button
                        key={i}
                        className="w-full text-left px-6 py-1 text-[12px] text-gray-700 hover:bg-blue-500 hover:text-white flex items-center justify-between"
                        onClick={item.action}
                      >
                        <span>{item.label}</span>
                        {item.shortcut && <span className="text-gray-400 text-[11px] ml-4">{item.shortcut}</span>}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Text Area */}
      <textarea
        ref={textareaRef}
        className="flex-1 p-2 outline-none border-none bg-white resize-none"
        style={{
          fontFamily: 'Consolas, monospace',
          fontSize: `${fontSize}px`,
          lineHeight: '1.5',
          whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
          overflowWrap: wordWrap ? 'break-word' : 'normal',
          userSelect: 'text',
        }}
        value={text}
        onChange={handleTextChange}
        onKeyUp={() => setCursorPos(getLineCol())}
        onClick={() => setCursorPos(getLineCol())}
        placeholder=""
        spellCheck={false}
      />

      {/* Status Bar */}
      <div className="flex items-center h-[22px] bg-gray-50 border-t border-gray-200 px-2 text-[11px] text-gray-500">
        <span className="mr-4">Ln {cursorPos.line}, Col {cursorPos.col}</span>
        <span className="mr-4">{text.length} characters</span>
        <span className="ml-auto mr-4">{fontSize * 100 / 14}%</span>
        <span>UTF-8</span>
      </div>
    </div>
  );
}
