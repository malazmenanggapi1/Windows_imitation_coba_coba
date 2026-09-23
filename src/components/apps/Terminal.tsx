import { useState, useRef, useEffect } from 'react';

export default function Terminal() {
  const [lines, setLines] = useState<string[]>([
    'Microsoft Windows [Version 10.0.19045.3803]',
    '(c) Microsoft Corporation. All rights reserved.',
    '',
    'C:\\Users\\User>',
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentPath, setCurrentPath] = useState('C:\\Users\\User');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines]);

  const processCommand = (cmd: string) => {
    const command = cmd.trim().toLowerCase();
    const newLines = [...lines];
    newLines[newLines.length - 1] = `${currentPath}>${cmd}`;

    switch (command) {
      case 'help':
        newLines.push(
          '',
          'Available commands:',
          '  help     - Show this help message',
          '  cls      - Clear screen',
          '  dir      - List directory contents',
          '  echo     - Display a message',
          '  date     - Display current date',
          '  time     - Display current time',
          '  ver      - Display Windows version',
          '  whoami   - Display current user',
          '  hostname - Display computer name',
          '  ipconfig - Display IP configuration',
          '  systeminfo - Display system information',
          '  exit     - Close terminal',
          ''
        );
        break;
      case 'cls':
        setLines([`${currentPath}>`]);
        setCurrentInput('');
        return;
      case 'dir':
        newLines.push(
          '',
          ` Directory of ${currentPath}`,
          '',
          '12/15/2024  10:30 AM    <DIR>          .',
          '12/15/2024  10:30 AM    <DIR>          ..',
          '12/14/2024  02:15 PM    <DIR>          Desktop',
          '12/14/2024  02:15 PM    <DIR>          Documents',
          '12/15/2024  09:00 AM    <DIR>          Downloads',
          '12/14/2024  11:30 AM             2,048 readme.txt',
          '               1 File(s)          2,048 bytes',
          '               5 Dir(s)  237,456,123,904 bytes free',
          ''
        );
        break;
      case 'date':
        newLines.push('', `The current date is: ${new Date().toLocaleDateString()}`, '');
        break;
      case 'time':
        newLines.push('', `The current time is: ${new Date().toLocaleTimeString()}`, '');
        break;
      case 'ver':
        newLines.push('', 'Microsoft Windows [Version 10.0.19045.3803]', '');
        break;
      case 'whoami':
        newLines.push('', 'desktop-win10\\user', '');
        break;
      case 'hostname':
        newLines.push('', 'DESKTOP-WIN10', '');
        break;
      case 'ipconfig':
        newLines.push(
          '',
          'Windows IP Configuration',
          '',
          'Ethernet adapter Ethernet:',
          '',
          '   Connection-specific DNS Suffix  . : localdomain',
          '   IPv4 Address. . . . . . . . . . . : 192.168.1.100',
          '   Subnet Mask . . . . . . . . . . . : 255.255.255.0',
          '   Default Gateway . . . . . . . . . : 192.168.1.1',
          ''
        );
        break;
      case 'systeminfo':
        newLines.push(
          '',
          'Host Name:                 DESKTOP-WIN10',
          'OS Name:                   Microsoft Windows 10 Pro',
          'OS Version:                10.0.19045 Build 19045',
          'OS Manufacturer:           Microsoft Corporation',
          'System Manufacturer:       QEMU',
          'System Type:               x64-based PC',
          'Processor(s):              1 Processor(s) Installed.',
          '                           [01]: Intel64 Family 6 Model 142 Stepping 12 ~2.40GHz',
          'BIOS Version:              American Megatrends Inc. 1.0, 01/01/2024',
          'Windows Directory:         C:\\Windows',
          'System Directory:          C:\\Windows\\system32',
          'Total Physical Memory:     16,384 MB',
          'Available Physical Memory: 8,192 MB',
          'Virtual Memory: Max Size:  32,768 MB',
          ''
        );
        break;
      case 'exit':
        newLines.push('', 'Terminal closed.');
        break;
      default:
        if (command.startsWith('echo ')) {
          newLines.push('', cmd.slice(5), '');
        } else if (command === '') {
          // empty command
        } else {
          newLines.push('', `'${cmd}' is not recognized as an internal or external command,`, 'operable program or batch file.', '');
        }
    }

    newLines.push(`${currentPath}>`);
    setLines(newLines);
    setCurrentInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      processCommand(currentInput);
    }
  };

  return (
    <div
      className="flex flex-col h-full bg-gray-900 font-mono text-sm"
      ref={containerRef}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex-1 overflow-y-auto p-2">
        {lines.map((line, i) => (
          <div key={i} className="text-gray-100 leading-5 whitespace-pre-wrap" style={{ userSelect: 'text' }}>
            {line}
          </div>
        ))}
        <div className="flex items-center text-gray-100">
          <span>{currentPath}&gt;</span>
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent outline-none text-gray-100 ml-0.5"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            style={{ userSelect: 'text' }}
          />
        </div>
      </div>
    </div>
  );
}
