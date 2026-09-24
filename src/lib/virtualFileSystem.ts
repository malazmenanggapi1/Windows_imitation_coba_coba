// Virtual File System with localStorage persistence
export interface VirtualFile {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: Record<string, VirtualFile>;
  created: number;
  modified: number;
  size?: number;
}

class VirtualFileSystem {
  private root: VirtualFile;
  private listeners: Set<() => void> = new Set();

  constructor() {
    // Load from localStorage or create default structure
    const saved = localStorage.getItem('win10-vfs');
    if (saved) {
      try {
        this.root = JSON.parse(saved);
      } catch {
        this.root = this.createDefaultStructure();
      }
    } else {
      this.root = this.createDefaultStructure();
    }
  }

  private createDefaultStructure(): VirtualFile {
    return {
      name: 'This PC',
      type: 'folder',
      created: Date.now(),
      modified: Date.now(),
      children: {
        'Desktop': {
          name: 'Desktop',
          type: 'folder',
          created: Date.now(),
          modified: Date.now(),
          children: {
            'readme.txt': {
              name: 'readme.txt',
              type: 'file',
              content: 'Welcome to Windows 10!\n\nThis is a virtual file system.\nYou can create, edit, and delete files.',
              created: Date.now(),
              modified: Date.now(),
              size: 100,
            },
          },
        },
        'Documents': {
          name: 'Documents',
          type: 'folder',
          created: Date.now(),
          modified: Date.now(),
          children: {
            'notes.txt': {
              name: 'notes.txt',
              type: 'file',
              content: 'My notes...',
              created: Date.now(),
              modified: Date.now(),
              size: 12,
            },
          },
        },
        'Downloads': {
          name: 'Downloads',
          type: 'folder',
          created: Date.now(),
          modified: Date.now(),
          children: {},
        },
        'Pictures': {
          name: 'Pictures',
          type: 'folder',
          created: Date.now(),
          modified: Date.now(),
          children: {},
        },
        'Music': {
          name: 'Music',
          type: 'folder',
          created: Date.now(),
          modified: Date.now(),
          children: {},
        },
        'Videos': {
          name: 'Videos',
          type: 'folder',
          created: Date.now(),
          modified: Date.now(),
          children: {},
        },
      },
    };
  }

  private save() {
    localStorage.setItem('win10-vfs', JSON.stringify(this.root));
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  // Navigate to a path
  getNode(path: string[]): VirtualFile | null {
    let current = this.root;
    for (const segment of path) {
      if (current.type !== 'folder' || !current.children) {
        return null;
      }
      const child = current.children[segment];
      if (!child) {
        return null;
      }
      current = child;
    }
    return current;
  }

  // List files in a directory
  listDirectory(path: string[]): VirtualFile[] {
    const node = this.getNode(path);
    if (!node || node.type !== 'folder' || !node.children) {
      return [];
    }
    return Object.values(node.children);
  }

  // Create a file or folder
  create(path: string[], name: string, type: 'file' | 'folder', content?: string): boolean {
    const parent = this.getNode(path);
    if (!parent || parent.type !== 'folder' || !parent.children) {
      return false;
    }
    if (parent.children[name]) {
      return false; // Already exists
    }

    parent.children[name] = {
      name,
      type,
      content: type === 'file' ? (content || '') : undefined,
      children: type === 'folder' ? {} : undefined,
      created: Date.now(),
      modified: Date.now(),
      size: content?.length || 0,
    };

    parent.modified = Date.now();
    this.save();
    return true;
  }

  // Delete a file or folder
  delete(path: string[], name: string): boolean {
    const parent = this.getNode(path);
    if (!parent || parent.type !== 'folder' || !parent.children) {
      return false;
    }
    if (!parent.children[name]) {
      return false;
    }

    delete parent.children[name];
    parent.modified = Date.now();
    this.save();
    return true;
  }

  // Read file content
  readFile(path: string[]): string | null {
    const node = this.getNode(path);
    if (!node || node.type !== 'file') {
      return null;
    }
    return node.content || '';
  }

  // Write file content
  writeFile(path: string[], content: string): boolean {
    const node = this.getNode(path);
    if (!node || node.type !== 'file') {
      return false;
    }
    node.content = content;
    node.modified = Date.now();
    node.size = content.length;
    this.save();
    return true;
  }

  // Rename a file or folder
  rename(path: string[], oldName: string, newName: string): boolean {
    const parent = this.getNode(path);
    if (!parent || parent.type !== 'folder' || !parent.children) {
      return false;
    }
    if (!parent.children[oldName] || parent.children[newName]) {
      return false;
    }

    const node = parent.children[oldName];
    node.name = newName;
    node.modified = Date.now();
    parent.children[newName] = node;
    delete parent.children[oldName];
    parent.modified = Date.now();
    this.save();
    return true;
  }

  // Subscribe to changes
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Reset to default
  reset() {
    this.root = this.createDefaultStructure();
    this.save();
  }
}

// Singleton instance
export const vfs = new VirtualFileSystem();
