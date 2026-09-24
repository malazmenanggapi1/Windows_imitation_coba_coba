import { useState } from 'react';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [resetNext, setResetNext] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [memory, setMemory] = useState(0);
  const [showHistory, setShowHistory] = useState(false);

  const handleNumber = (num: string) => {
    if (resetNext) {
      setDisplay(num);
      setResetNext(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperation = (op: string) => {
    const current = parseFloat(display);
    if (prevValue !== null && operation) {
      const result = calculate(prevValue, current, operation);
      setHistory(prev => [...prev, `${prevValue} ${operation} ${current} = ${result}`]);
      setDisplay(String(result));
      setPrevValue(result);
    } else {
      setPrevValue(current);
    }
    setOperation(op);
    setResetNext(true);
  };

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? a / b : 0;
      default: return b;
    }
  };

  const handleEquals = () => {
    if (prevValue !== null && operation) {
      const current = parseFloat(display);
      const result = calculate(prevValue, current, operation);
      setHistory(prev => [...prev, `${prevValue} ${operation} ${current} = ${result}`]);
      setDisplay(String(result));
      setPrevValue(null);
      setOperation(null);
      setResetNext(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperation(null);
    setResetNext(false);
  };

  const handlePercent = () => {
    setDisplay(String(parseFloat(display) / 100));
  };

  const handleSign = () => {
    setDisplay(String(parseFloat(display) * -1));
  };

  const handleDecimal = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  // Memory functions
  const handleMC = () => setMemory(0);
  const handleMR = () => { setDisplay(String(memory)); setResetNext(true); };
  const handleMPlus = () => setMemory(memory + parseFloat(display));
  const handleMMinus = () => setMemory(memory - parseFloat(display));
  const handleMS = () => setMemory(parseFloat(display));

  const Button = ({ label, onClick, className = '', span = 1 }: { label: string; onClick: () => void; className?: string; span?: number }) => (
    <button
      className={`flex items-center justify-center text-sm font-medium rounded transition-all active:scale-95 ${span === 2 ? 'col-span-2' : ''} ${className}`}
      onClick={onClick}
      onTouchEnd={(e) => { e.preventDefault(); onClick(); }}
    >
      {label}
    </button>
  );

  return (
    <div className="flex h-full bg-gray-50">
      {/* Main calculator */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="px-4 pt-3 pb-1 flex items-center justify-between">
          <div>
            <h2 className="text-xs text-gray-500 font-medium">Standard</h2>
          </div>
          <button
            className="p-1 rounded hover:bg-gray-200"
            onClick={() => setShowHistory(!showHistory)}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-gray-500">
              <path d="M8 0a8 8 0 1 0 8 8 8 8 0 0 0-8-8zm0 14a6 6 0 1 1 6-6 6 6 0 0 1-6 6z" />
              <path d="M8 4v4l3 2" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>

        {/* Display */}
        <div className="px-4 py-2">
          <div className="text-right">
            {prevValue !== null && operation && (
              <div className="text-xs text-gray-400 h-4">{prevValue} {operation}</div>
            )}
            <div className="text-3xl font-light text-gray-900 truncate" style={{ userSelect: 'text' }}>
              {display}
            </div>
            {memory !== 0 && (
              <div className="text-[10px] text-blue-500 text-left">M = {memory}</div>
            )}
          </div>
        </div>

        {/* Memory buttons */}
        <div className="px-2 grid grid-cols-5 gap-1 mb-1">
          <Button label="MC" onClick={handleMC} className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs h-7" />
          <Button label="MR" onClick={handleMR} className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs h-7" />
          <Button label="M+" onClick={handleMPlus} className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs h-7" />
          <Button label="M-" onClick={handleMMinus} className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs h-7" />
          <Button label="MS" onClick={handleMS} className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs h-7" />
        </div>

        {/* Buttons */}
        <div className="flex-1 p-2 grid grid-cols-4 gap-1">
          <Button label="%" onClick={handlePercent} className="bg-gray-200 hover:bg-gray-300 text-gray-800" />
          <Button label="CE" onClick={handleClear} className="bg-gray-200 hover:bg-gray-300 text-gray-800" />
          <Button label="C" onClick={handleClear} className="bg-gray-200 hover:bg-gray-300 text-gray-800" />
          <Button label="⌫" onClick={handleBackspace} className="bg-gray-200 hover:bg-gray-300 text-gray-800" />

          <Button label="¹/ₓ" onClick={() => setDisplay(String(1 / parseFloat(display)))} className="bg-gray-200 hover:bg-gray-300 text-gray-800" />
          <Button label="x²" onClick={() => setDisplay(String(Math.pow(parseFloat(display), 2)))} className="bg-gray-200 hover:bg-gray-300 text-gray-800" />
          <Button label="√" onClick={() => setDisplay(String(Math.sqrt(parseFloat(display))))} className="bg-gray-200 hover:bg-gray-300 text-gray-800" />
          <Button label="÷" onClick={() => handleOperation('÷')} className="bg-gray-200 hover:bg-gray-300 text-gray-800" />

          <Button label="7" onClick={() => handleNumber('7')} className="bg-white hover:bg-gray-100 text-gray-900 border border-gray-200" />
          <Button label="8" onClick={() => handleNumber('8')} className="bg-white hover:bg-gray-100 text-gray-900 border border-gray-200" />
          <Button label="9" onClick={() => handleNumber('9')} className="bg-white hover:bg-gray-100 text-gray-900 border border-gray-200" />
          <Button label="×" onClick={() => handleOperation('×')} className="bg-gray-200 hover:bg-gray-300 text-gray-800" />

          <Button label="4" onClick={() => handleNumber('4')} className="bg-white hover:bg-gray-100 text-gray-900 border border-gray-200" />
          <Button label="5" onClick={() => handleNumber('5')} className="bg-white hover:bg-gray-100 text-gray-900 border border-gray-200" />
          <Button label="6" onClick={() => handleNumber('6')} className="bg-white hover:bg-gray-100 text-gray-900 border border-gray-200" />
          <Button label="-" onClick={() => handleOperation('-')} className="bg-gray-200 hover:bg-gray-300 text-gray-800" />

          <Button label="1" onClick={() => handleNumber('1')} className="bg-white hover:bg-gray-100 text-gray-900 border border-gray-200" />
          <Button label="2" onClick={() => handleNumber('2')} className="bg-white hover:bg-gray-100 text-gray-900 border border-gray-200" />
          <Button label="3" onClick={() => handleNumber('3')} className="bg-white hover:bg-gray-100 text-gray-900 border border-gray-200" />
          <Button label="+" onClick={() => handleOperation('+')} className="bg-gray-200 hover:bg-gray-300 text-gray-800" />

          <Button label="±" onClick={handleSign} className="bg-white hover:bg-gray-100 text-gray-900 border border-gray-200" />
          <Button label="0" onClick={() => handleNumber('0')} className="bg-white hover:bg-gray-100 text-gray-900 border border-gray-200" />
          <Button label="." onClick={handleDecimal} className="bg-white hover:bg-gray-100 text-gray-900 border border-gray-200" />
          <Button label="=" onClick={handleEquals} className="bg-blue-500 hover:bg-blue-600 text-white" />
        </div>
      </div>

      {/* History panel */}
      {showHistory && (
        <div className="w-48 bg-white border-l border-gray-200 flex flex-col">
          <div className="px-3 py-2 border-b border-gray-200 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700">History</span>
            <button
              className="text-[10px] text-blue-500 hover:text-blue-700"
              onClick={() => setHistory([])}
            >
              Clear
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {history.length === 0 ? (
              <p className="text-xs text-gray-400 text-center mt-4">No history yet</p>
            ) : (
              <div className="space-y-1">
                {history.map((item, i) => (
                  <div key={i} className="text-xs text-gray-600 py-1 px-2 rounded hover:bg-gray-50 cursor-pointer" style={{ userSelect: 'text' }}>
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
