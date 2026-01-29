// src/app/(dashboard)/components/file.js

/**
 * PURPOSE:
 * Google Drive-style file card component
 * - Card-based layout with hover effects
 * - File type icons and thumbnails
 * - Context menu for actions
 */

"use client";

import { useState } from "react";
import ShareModal from "./sharemodal";
import {
  Folder,
  FileText,
  Image as ImageIcon,
  Film,
  Music,
  FileCode,
  FileArchive,
  File as FileIcon,
  MoreVertical,
  Eye,
  Edit2,
  Share2,
  Trash2,
  RotateCcw
} from "lucide-react";

const File = ({ item, onNavigate, onDelete, onRename, onRestore, isTrash, onPreview }) => {
  const isFolder = item.type === "folder";
  const [issharemodalopen, setissharemodalopen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleWrapperClick = () => {
    if (isFolder && !isTrash && onNavigate) {
      onNavigate(item);
    }
  };

  const handleDoubleClick = () => {
    if (!isFolder && !isTrash && onPreview) {
      onPreview(item);
    }
  };

  // Get file icon based on type
  const getFileIcon = () => {
    if (isFolder) return <Folder className="w-12 h-12 text-blue-500 fill-blue-500" />;

    const ext = item.name?.split('.').pop()?.toLowerCase();
    const iconClass = "w-12 h-12";

    switch (ext) {
      case 'pdf': return <FileText className={`${iconClass} text-red-500`} />;
      case 'doc':
      case 'docx': return <FileText className={`${iconClass} text-blue-500`} />;
      case 'xls':
      case 'xlsx': return <FileText className={`${iconClass} text-green-600`} />;
      case 'ppt':
      case 'pptx': return <FileText className={`${iconClass} text-orange-500`} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp': return <ImageIcon className={`${iconClass} text-purple-500`} />;
      case 'mp4':
      case 'mov':
      case 'avi': return <Film className={`${iconClass} text-slate-700`} />;
      case 'mp3':
      case 'wav': return <Music className={`${iconClass} text-pink-500`} />;
      case 'zip':
      case 'rar': return <FileArchive className={`${iconClass} text-yellow-600`} />;
      case 'txt':
      case 'md': return <FileText className={`${iconClass} text-slate-600`} />;
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
      case 'html':
      case 'css': return <FileCode className={`${iconClass} text-blue-400`} />;
      default: return <FileIcon className={`${iconClass} text-slate-400`} />;
    }
  };

  // Format file size
  const formatSize = (bytes) => {
    if (!bytes) return "0 KB";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    if (mb < 1024) return `${mb.toFixed(1)} MB`;
    return `${(mb / 1024).toFixed(1)} GB`;
  };

  return (
    <>
      <div
        className="group relative bg-white border border-slate-200 rounded-lg hover:shadow-md hover:border-blue-300 transition-all cursor-pointer"
        onClick={handleWrapperClick}
        onDoubleClick={handleDoubleClick}
        onContextMenu={(e) => {
          e.preventDefault();
          setShowMenu(!showMenu);
        }}
      >
        {/* File Icon/Thumbnail */}
        <div className="aspect-square bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center text-6xl border-b border-slate-200">
          {getFileIcon()}
        </div>

        {/* File Info */}
        <div className="p-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-medium text-slate-800 truncate flex-1" title={item.name}>
              {item.name}
            </h3>

            {/* Three-dot menu button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-slate-100 rounded-full transition-all duration-200"
            >
              <MoreVertical className="w-4 h-4 text-slate-600" />
            </button>
          </div>

          <p className="text-xs text-slate-500 mt-1">
            {isFolder ? "Folder" : formatSize(item.size_bytes)}
          </p>
        </div>

        {/* Context Menu */}
        {showMenu && (
          <div
            className="absolute right-0 top-full mt-2 bg-white border border-slate-200 rounded-lg shadow-xl z-50 py-1 min-w-[160px]"
            onClick={(e) => e.stopPropagation()}
          >
            {isTrash ? (
              <button
                onClick={() => {
                  onRestore(item, item.type);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 flex items-center gap-3 text-slate-700"
              >
                <RotateCcw className="w-4 h-4 text-slate-500" /> Restore
              </button>
            ) : (
              <>
                {!isFolder && (
                  <button
                    onClick={() => {
                      onPreview(item);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 flex items-center gap-3 text-slate-700"
                  >
                    <Eye className="w-4 h-4 text-slate-500" /> Preview
                  </button>
                )}
                <button
                  onClick={() => {
                    onRename(item);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 flex items-center gap-3 text-slate-700"
                >
                  <Edit2 className="w-4 h-4 text-slate-500" /> Rename
                </button>
                <button
                  onClick={() => {
                    setissharemodalopen(true);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 flex items-center gap-3 text-slate-700"
                >
                  <Share2 className="w-4 h-4 text-slate-500" /> Share
                </button>
                <hr className="my-1 border-slate-100" />
                <button
                  onClick={() => {
                    onDelete(item, item.type);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-3"
                >
                  <Trash2 className="w-4 h-4 text-red-500" /> Delete
                </button>
              </>
            )}
          </div>
        )}

        {/* Click outside to close menu */}
        {showMenu && (
          <div
            className="fixed inset-0 z-0"
            onClick={() => setShowMenu(false)}
          />
        )}
      </div>

      {issharemodalopen && (
        <ShareModal
          file={item}
          onclose={() => setissharemodalopen(false)}
        />
      )}
    </>
  );
};

export default File;