import { useState } from 'react';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [resetNext, setResetNext] = useState(false);

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

  const Button = ({ label, onClick, className = '' }: { label: string; onClick: () => void; className?: string }) => (
    <button
      className={`flex items-center justify-center text-sm font-medium rounded transition-colors active:scale-95 ${className}`}
      onClick={onClick}
      onTouchEnd={(e) => { e.preventDefault(); onClick(); }}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="px-4 pt-3 pb-1">
        <h2 className="text-xs text-gray-500 font-medium">Standard</h2>
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
        </div>
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
  );
}
