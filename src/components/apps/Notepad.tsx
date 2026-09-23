import { useState } from 'react';

export default function Notepad() {
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('Untitled.txt');

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Menu Bar */}
      <div className="flex items-center h-7 bg-gray-50 border-b border-gray-200 px-1 text-xs text-gray-700">
        <button className="px-2 py-0.5 hover:bg-gray-200 rounded">File</button>
        <button className="px-2 py-0.5 hover:bg-gray-200 rounded">Edit</button>
        <button className="px-2 py-0.5 hover:bg-gray-200 rounded">Format</button>
        <button className="px-2 py-0.5 hover:bg-gray-200 rounded">View</button>
        <button className="px-2 py-0.5 hover:bg-gray-200 rounded">Help</button>
      </div>

      {/* Text Area */}
      <textarea
        className="flex-1 p-2 text-sm font-mono resize-none outline-none border-none bg-white"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type something here..."
        style={{ userSelect: 'text' }}
      />

      {/* Status Bar */}
      <div className="flex items-center h-6 bg-gray-100 border-t border-gray-200 px-2 text-[10px] text-gray-500">
        <span className="mr-4">Ln 1, Col 1</span>
        <span className="mr-4">{text.length} characters</span>
        <span className="ml-auto">UTF-8</span>
        <span className="ml-4">Windows (CRLF)</span>
      </div>
    </div>
  );
}
