import { useState, useRef, useEffect, useCallback } from 'react';

export default function Paint() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);
  const [tool, setTool] = useState<'brush' | 'eraser' | 'fill'>('brush');
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    const container = canvas.parentElement;
    if (container) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }
    
    // Fill white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Handle resize
    const handleResize = () => {
      if (container) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.putImageData(imageData, 0, 0);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDraw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const pos = getPos(e);
    lastPos.current = pos;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.arc(pos.x, pos.y, brushSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.fill();
  }, [color, brushSize, tool]);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing || !lastPos.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getPos(e);

    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    lastPos.current = pos;
  }, [isDrawing, color, brushSize, tool]);

  const endDraw = useCallback(() => {
    setIsDrawing(false);
    lastPos.current = null;
  }, []);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const colors = [
    '#000000', '#7f7f7f', '#880015', '#ed1c24', '#ff7f27',
    '#fff200', '#22b14c', '#00a2e8', '#3f48cc', '#a349a4',
    '#ffffff', '#c3c3c3', '#b97a57', '#ffaec9', '#ffc90e',
    '#efe4b0', '#b5e61d', '#99d9ea', '#7092be', '#c8bfe7',
  ];

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 p-2">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Tools */}
          <div className="flex gap-1">
            <button
              className={`w-8 h-8 flex items-center justify-center rounded border ${tool === 'brush' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
              onClick={() => setTool('brush')}
              title="Brush"
            >
              ✏️
            </button>
            <button
              className={`w-8 h-8 flex items-center justify-center rounded border ${tool === 'eraser' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
              onClick={() => setTool('eraser')}
              title="Eraser"
            >
              🧹
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 hover:bg-gray-50"
              onClick={clearCanvas}
              title="Clear"
            >
              🗑️
            </button>
          </div>

          {/* Separator */}
          <div className="w-px h-6 bg-gray-200" />

          {/* Brush size */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Size:</span>
            <input
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-20 h-1 accent-blue-500"
            />
            <span className="text-xs text-gray-600 w-4">{brushSize}</span>
          </div>

          {/* Separator */}
          <div className="w-px h-6 bg-gray-200" />

          {/* Color palette */}
          <div className="flex gap-0.5 flex-wrap max-w-[200px]">
            {colors.map(c => (
              <button
                key={c}
                className={`w-5 h-5 rounded-sm border ${color === c ? 'border-blue-500 ring-1 ring-blue-300' : 'border-gray-300'}`}
                style={{ backgroundColor: c }}
                onClick={() => { setColor(c); setTool('brush'); }}
              />
            ))}
          </div>

          {/* Custom color */}
          <input
            type="color"
            value={color}
            onChange={(e) => { setColor(e.target.value); setTool('brush'); }}
            className="w-7 h-7 rounded cursor-pointer border border-gray-200"
          />
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-hidden bg-gray-200 p-2">
        <canvas
          ref={canvasRef}
          className="bg-white shadow-sm cursor-crosshair w-full h-full"
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
      </div>

      {/* Status bar */}
      <div className="h-6 bg-gray-50 border-t border-gray-200 flex items-center px-3 text-[10px] text-gray-500">
        <span>Tool: {tool}</span>
        <span className="ml-4">Size: {brushSize}px</span>
        <span className="ml-4">Color: {color}</span>
      </div>
    </div>
  );
}
