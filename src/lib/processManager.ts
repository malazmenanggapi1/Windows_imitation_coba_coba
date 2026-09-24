// Process Manager - Manages actual running processes/windows
export interface Process {
  pid: number;
  name: string;
  windowId: string;
  icon: string;
  title: string;
  component: string;
  memory: number; // in KB
  cpu: number; // percentage
  startTime: number;
  status: 'running' | 'suspended' | 'not responding';
}

class ProcessManager {
  private processes: Map<number, Process> = new Map();
  private nextPid: number = 1000;
  private listeners: Set<() => void> = new Set();

  // Create a new process
  createProcess(windowId: string, name: string, icon: string, title: string, component: string): number {
    const pid = this.nextPid++;
    const process: Process = {
      pid,
      name,
      windowId,
      icon,
      title,
      component,
      memory: Math.floor(Math.random() * 50000) + 10000, // 10-60 MB
      cpu: Math.floor(Math.random() * 5), // 0-5%
      startTime: Date.now(),
      status: 'running',
    };
    this.processes.set(pid, process);
    this.notifyListeners();
    return pid;
  }

  // Terminate a process
  terminateProcess(pid: number): boolean {
    const deleted = this.processes.delete(pid);
    if (deleted) {
      this.notifyListeners();
    }
    return deleted;
  }

  // Get process by PID
  getProcess(pid: number): Process | undefined {
    return this.processes.get(pid);
  }

  // Get process by window ID
  getProcessByWindowId(windowId: string): Process | undefined {
    for (const process of this.processes.values()) {
      if (process.windowId === windowId) {
        return process;
      }
    }
    return undefined;
  }

  // Get all processes
  getAllProcesses(): Process[] {
    return Array.from(this.processes.values());
  }

  // Update process stats (simulate real-time updates)
  updateProcessStats() {
    for (const process of this.processes.values()) {
      // Simulate memory fluctuation
      process.memory = Math.max(5000, process.memory + Math.floor(Math.random() * 1000 - 500));
      // Simulate CPU fluctuation
      process.cpu = Math.max(0, Math.min(100, process.cpu + Math.floor(Math.random() * 4 - 2)));
    }
    this.notifyListeners();
  }

  // Subscribe to changes
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  // Get system stats
  getSystemStats() {
    const processes = this.getAllProcesses();
    const totalMemory = processes.reduce((sum, p) => sum + p.memory, 0);
    const totalCpu = processes.reduce((sum, p) => sum + p.cpu, 0);
    
    return {
      processCount: processes.length,
      totalMemory,
      totalCpu: Math.min(100, totalCpu),
      uptime: Date.now(),
    };
  }
}

// Singleton instance
export const processManager = new ProcessManager();
