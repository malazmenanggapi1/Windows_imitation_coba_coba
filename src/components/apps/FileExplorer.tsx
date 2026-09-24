import { useState, useEffect } from 'react';
import { vfs, VirtualFile } from '../../lib/virtualFileSystem';

interface FileExplorerProps {
  onOpenWith?: (filePath: string[], fileName: string, app: string) => void;
}

export default function FileExplorer({ onOpenWith }: FileExplorerProps) {
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [files, setFiles] = useState<VirtualFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showNewMenu, setShowNewMenu] = useState(false);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    loadFiles();
    const unsubscribe = vfs.subscribe(() => {
      loadFiles();
    });
    return unsubscribe;
  }, [currentPath]);

  const loadFiles = () => {
    const fileList = vfs.listDirectory(currentPath);
    setFiles(fileList);
  };

  const handleDoubleClick = (file: VirtualFile) => {
    if (file.type === 'folder') {
      setCurrentPath([...currentPath, file.name]);
      setSelectedFile(null);
    } else {
      // Open file with Notepad
      if (onOpenWith) {
        onOpenWith([...currentPath, file.name], file.name, 'notepad');
      }
    }
  };

  const handleCreateFolder = () => {
    const folderName = prompt('Enter folder name:');
    if (folderName) {
      vfs.create(currentPath, folderName, 'folder');
      setShowNewMenu(false);
    }
  };

  const handleCreateFile = () => {
    const fileName = prompt('Enter file name (with extension):');
    if (fileName) {
      vfs.create(currentPath, fileName, 'file', '');
      setShowNewMenu(false);
    }
  };

  const handleDelete = () => {
    if (selectedFile && confirm(`Delete "${selectedFile}"?`)) {
      vfs.delete(currentPath, selectedFile);
      setSelectedFile(null);
    }
  };

  const handleRename = () => {
    if (selectedFile) {
      setRenaming(selectedFile);
      setNewName(selectedFile);
    }
  };

  const handleRenameSubmit = () => {
    if (renaming && newName && newName !== renaming) {
      vfs.rename(currentPath, renaming, newName);
    }
    setRenaming(null);
    setNewName('');
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    // Could implement context menu here
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFileIcon = (file: VirtualFile) => {
    if (file.type === 'folder') return '📁';
    const ext = file.name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'txt':
      case 'md':
        return '📝';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return '🖼️';
      case 'mp3':
      case 'wav':
        return '🎵';
      case 'mp4':
      case 'avi':
        return '🎬';
      case 'pdf':
        return '📕';
      case 'doc':
      case 'docx':
        return '📄';
      case 'xls':
      case 'xlsx':
        return '📊';
      default:
        return '📄';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200 bg-gray-50">
        <button
          className="px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
          disabled={currentPath.length === 0}
          onClick={() => {
            setCurrentPath(currentPath.slice(0, -1));
            setSelectedFile(null);
          }}
        >
          ← Back
        </button>
        <button
          className="px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-100"
          onClick={() => setShowNewMenu(!showNewMenu)}
        >
          + New
        </button>
        <button
          className="px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
          disabled={!selectedFile}
          onClick={handleDelete}
        >
          🗑️ Delete
        </button>
        <button
          className="px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
          disabled={!selectedFile}
          onClick={handleRename}
        >
          ✏️ Rename
        </button>
        <div className="flex-1" />
        <button
          className={`px-2 py-1 text-xs border rounded ${viewMode === 'list' ? 'bg-blue-100 border-blue-300' : 'bg-white border-gray-300'}`}
          onClick={() => setViewMode('list')}
        >
          ☰ List
        </button>
        <button
          className={`px-2 py-1 text-xs border rounded ${viewMode === 'grid' ? 'bg-blue-100 border-blue-300' : 'bg-white border-gray-300'}`}
          onClick={() => setViewMode('grid')}
        >
          ⊞ Grid
        </button>
      </div>

      {/* New menu dropdown */}
      {showNewMenu && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setShowNewMenu(false)} />
          <div className="absolute top-12 left-20 bg-white border border-gray-300 rounded shadow-lg z-20">
            <button
              className="w-full px-4 py-2 text-xs text-left hover:bg-gray-100"
              onClick={handleCreateFolder}
            >
              📁 New Folder
            </button>
            <button
              className="w-full px-4 py-2 text-xs text-left hover:bg-gray-100"
              onClick={handleCreateFile}
            >
              📄 New File
            </button>
          </div>
        </>
      )}

      {/* Address bar */}
      <div className="flex items-center px-3 py-2 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-1 text-xs text-gray-700 flex-1">
          <button
            className="px-2 py-1 hover:bg-gray-100 rounded"
            onClick={() => {
              setCurrentPath([]);
              setSelectedFile(null);
            }}
          >
            💻 This PC
          </button>
          {currentPath.map((segment, index) => (
            <span key={index} className="flex items-center gap-1">
              <span className="text-gray-400">›</span>
              <button
                className="px-2 py-1 hover:bg-gray-100 rounded"
                onClick={() => {
                  setCurrentPath(currentPath.slice(0, index + 1));
                  setSelectedFile(null);
                }}
              >
                {segment}
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* File list */}
      <div className="flex-1 overflow-auto" onContextMenu={handleContextMenu}>
        {viewMode === 'list' ? (
          <table className="w-full text-xs">
            <thead className="bg-gray-50 sticky top-0">
              <tr className="border-b border-gray-200">
                <th className="text-left px-3 py-2 font-medium text-gray-700">Name</th>
                <th className="text-left px-3 py-2 font-medium text-gray-700 w-32">Date modified</th>
                <th className="text-left px-3 py-2 font-medium text-gray-700 w-20">Type</th>
                <th className="text-right px-3 py-2 font-medium text-gray-700 w-20">Size</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr
                  key={file.name}
                  className={`border-b border-gray-100 cursor-pointer ${
                    selectedFile === file.name ? 'bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedFile(file.name)}
                  onDoubleClick={() => handleDoubleClick(file)}
                >
                  <td className="px-3 py-2">
                    {renaming === file.name ? (
                      <input
                        type="text"
                        className="px-1 py-0.5 border border-blue-500 rounded text-xs w-full"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onBlur={handleRenameSubmit}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleRenameSubmit();
                          if (e.key === 'Escape') {
                            setRenaming(null);
                            setNewName('');
                          }
                        }}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-base">{getFileIcon(file)}</span>
                        <span className="text-gray-900">{file.name}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2 text-gray-600">{formatDate(file.modified)}</td>
                  <td className="px-3 py-2 text-gray-600">
                    {file.type === 'folder' ? 'Folder' : file.name.split('.').pop()?.toUpperCase()}
                  </td>
                  <td className="px-3 py-2 text-right text-gray-600">
                    {file.type === 'file' ? formatSize(file.size) : ''}
                  </td>
                </tr>
              ))}
              {files.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-3 py-8 text-center text-gray-500">
                    This folder is empty
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <div className="p-4 grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-2">
            {files.map((file) => (
              <div
                key={file.name}
                className={`flex flex-col items-center p-3 rounded cursor-pointer ${
                  selectedFile === file.name ? 'bg-blue-100' : 'hover:bg-gray-100'
                }`}
                onClick={() => setSelectedFile(file.name)}
                onDoubleClick={() => handleDoubleClick(file)}
              >
                <span className="text-4xl mb-2">{getFileIcon(file)}</span>
                {renaming === file.name ? (
                  <input
                    type="text"
                    className="px-1 py-0.5 border border-blue-500 rounded text-xs w-full text-center"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onBlur={handleRenameSubmit}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRenameSubmit();
                      if (e.key === 'Escape') {
                        setRenaming(null);
                        setNewName('');
                      }
                    }}
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span className="text-xs text-gray-900 text-center break-all">{file.name}</span>
                )}
              </div>
            ))}
            {files.length === 0 && (
              <div className="col-span-full text-center text-gray-500 py-8">
                This folder is empty
              </div>
            )}
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-t border-gray-200 bg-gray-50 text-[10px] text-gray-600">
        <div>{files.length} items</div>
        {selectedFile && <div>1 item selected</div>}
      </div>
    </div>
  );
}
