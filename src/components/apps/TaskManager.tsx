import { useState, useEffect } from 'react';
import { processManager, Process } from '../../lib/processManager';

export default function TaskManager() {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);
  const [activeTab, setActiveTab] = useState<'processes' | 'performance' | 'app-history'>('processes');
  const [sortBy, setSortBy] = useState<'name' | 'cpu' | 'memory'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    // Initial load
    setProcesses(processManager.getAllProcesses());

    // Subscribe to process changes
    const unsubscribe = processManager.subscribe(() => {
      setProcesses(processManager.getAllProcesses());
    });

    // Update stats every 2 seconds
    const interval = setInterval(() => {
      processManager.updateProcessStats();
    }, 2000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const handleEndTask = () => {
    if (selectedProcess) {
      processManager.terminateProcess(selectedProcess.pid);
      setSelectedProcess(null);
    }
  };

  const handleSort = (column: 'name' | 'cpu' | 'memory') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const sortedProcesses = [...processes].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'cpu':
        comparison = a.cpu - b.cpu;
        break;
      case 'memory':
        comparison = a.memory - b.memory;
        break;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const systemStats = processManager.getSystemStats();

  const formatMemory = (kb: number) => {
    if (kb >= 1024 * 1024) {
      return `${(kb / (1024 * 1024)).toFixed(1)} GB`;
    }
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const formatUptime = (startTime: number) => {
    const seconds = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}:${String(minutes % 60).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
    }
    return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'processes'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setActiveTab('processes')}
        >
          Processes
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'performance'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setActiveTab('performance')}
        >
          Performance
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'app-history'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setActiveTab('app-history')}
        >
          App history
        </button>
      </div>

      {activeTab === 'processes' && (
        <>
          {/* Toolbar */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 bg-gray-50">
            <div className="flex gap-2">
              <button
                className="px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                disabled={!selectedProcess}
                onClick={handleEndTask}
              >
                End task
              </button>
              <button className="px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50">
                Resource monitor
              </button>
            </div>
            <div className="text-xs text-gray-600">
              Processes: {systemStats.processCount}
            </div>
          </div>

          {/* Process List */}
          <div className="flex-1 overflow-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 sticky top-0">
                <tr className="border-b border-gray-200">
                  <th
                    className="text-left px-3 py-2 font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('name')}
                  >
                    Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="text-right px-3 py-2 font-medium text-gray-700 cursor-pointer hover:bg-gray-100 w-20"
                    onClick={() => handleSort('cpu')}
                  >
                    CPU {sortBy === 'cpu' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="text-right px-3 py-2 font-medium text-gray-700 cursor-pointer hover:bg-gray-100 w-24"
                    onClick={() => handleSort('memory')}
                  >
                    Memory {sortBy === 'memory' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="text-right px-3 py-2 font-medium text-gray-700 w-20">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedProcesses.map((process) => (
                  <tr
                    key={process.pid}
                    className={`border-b border-gray-100 cursor-pointer ${
                      selectedProcess?.pid === process.pid
                        ? 'bg-blue-50'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedProcess(process)}
                  >
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{process.icon}</span>
                        <div>
                          <div className="font-medium text-gray-900">{process.name}</div>
                          <div className="text-gray-500 text-[10px]">{process.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-right text-gray-700">
                      {process.cpu.toFixed(1)}%
                    </td>
                    <td className="px-3 py-2 text-right text-gray-700">
                      {formatMemory(process.memory)}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] ${
                        process.status === 'running'
                          ? 'bg-green-100 text-green-700'
                          : process.status === 'suspended'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {process.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {sortedProcesses.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-3 py-8 text-center text-gray-500">
                      No processes running
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Status Bar */}
          <div className="flex items-center justify-between px-3 py-1.5 border-t border-gray-200 bg-gray-50 text-[10px] text-gray-600">
            <div className="flex gap-4">
              <span>Processes: {systemStats.processCount}</span>
              <span>Threads: {systemStats.processCount * 3}</span>
              <span>Memory: {formatMemory(systemStats.totalMemory)}</span>
            </div>
            <div>
              CPU: {systemStats.totalCpu.toFixed(1)}%
            </div>
          </div>
        </>
      )}

      {activeTab === 'performance' && (
        <div className="flex-1 p-4 overflow-auto">
          <h3 className="text-sm font-medium text-gray-900 mb-4">System Performance</h3>
          
          <div className="grid grid-cols-2 gap-4">
            {/* CPU */}
            <div className="border border-gray-200 rounded p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-700">CPU</span>
                <span className="text-xs text-gray-500">{systemStats.totalCpu.toFixed(1)}%</span>
              </div>
              <div className="h-20 bg-gray-100 rounded flex items-end">
                <div
                  className="w-full bg-blue-500 rounded transition-all duration-500"
                  style={{ height: `${systemStats.totalCpu}%` }}
                />
              </div>
              <div className="mt-2 text-[10px] text-gray-500">
                Intel Core i7-10700K
              </div>
            </div>

            {/* Memory */}
            <div className="border border-gray-200 rounded p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-700">Memory</span>
                <span className="text-xs text-gray-500">
                  {formatMemory(systemStats.totalMemory)} / 16.0 GB
                </span>
              </div>
              <div className="h-20 bg-gray-100 rounded flex items-end">
                <div
                  className="w-full bg-green-500 rounded transition-all duration-500"
                  style={{ height: `${(systemStats.totalMemory / (16 * 1024 * 1024)) * 100}%` }}
                />
              </div>
              <div className="mt-2 text-[10px] text-gray-500">
                16.0 GB DDR4
              </div>
            </div>

            {/* Disk */}
            <div className="border border-gray-200 rounded p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-700">Disk 0 (C:)</span>
                <span className="text-xs text-gray-500">0%</span>
              </div>
              <div className="h-20 bg-gray-100 rounded flex items-end">
                <div
                  className="w-full bg-orange-500 rounded transition-all duration-500"
                  style={{ height: '5%' }}
                />
              </div>
              <div className="mt-2 text-[10px] text-gray-500">
                476 GB SSD
              </div>
            </div>

            {/* Network */}
            <div className="border border-gray-200 rounded p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-700">Network</span>
                <span className="text-xs text-gray-500">0 Mbps</span>
              </div>
              <div className="h-20 bg-gray-100 rounded flex items-end">
                <div
                  className="w-full bg-purple-500 rounded transition-all duration-500"
                  style={{ height: '2%' }}
                />
              </div>
              <div className="mt-2 text-[10px] text-gray-500">
                Ethernet
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'app-history' && (
        <div className="flex-1 p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-4">App History</h3>
          <div className="text-xs text-gray-500">
            Track app usage over time
          </div>
          <div className="mt-4 text-center text-gray-400">
            No app history available
          </div>
        </div>
      )}
    </div>
  );
}
