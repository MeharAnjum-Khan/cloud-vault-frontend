// src/app/(dashboard)/components/file.js

/**
 * PURPOSE:
 * Google Drive-style file card component
 * - Card-based layout with hover effects
 * - File type icons and thumbnails
 * - Context menu for actions
 */

"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
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

  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [textContent, setTextContent] = useState(null);

  useEffect(() => {
    // Only fetch thumbnails/content for files
    if (isFolder || isTrash) return;
    const ext = item.name?.split('.').pop()?.toLowerCase();

    // 1. Fetch Signed URL for Images/PDFs/Office
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'docx', 'xlsx', 'pptx', 'xls'].includes(ext)) {
      const fetchThumbnail = async () => {
        try {
          const data = await api.get(`/files/${item.id}/download`);
          setThumbnailUrl(data.downloadUrl);
        } catch (error) {
          console.error("Failed to fetch thumbnail", error);
        }
      };
      fetchThumbnail();
    }

    // 2. Fetch Snippet for Text files
    if (['txt', 'md', 'json', 'js', 'css', 'html'].includes(ext)) {
      const fetchText = async () => {
        try {
          const data = await api.get(`/files/${item.id}/download`);
          const res = await fetch(data.downloadUrl);
          const text = await res.text();
          setTextContent(text.substring(0, 500)); // Show first 500 chars
        } catch (error) {
          console.error("Failed to fetch text snippet", error);
        }
      };
      fetchText();
    }
  }, [item, isFolder, isTrash]);

  const handleDoubleClick = () => {
    if (!isFolder && !isTrash && onPreview) {
      onPreview(item);
    }
  };

  // Get file icon based on type
  const getFileIcon = () => {
    if (isFolder) return <Folder className="w-12 h-12 text-blue-500 fill-blue-500" />;

    const ext = item.name?.split('.').pop()?.toLowerCase();
    const iconClass = "w-16 h-16 opacity-80";

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
        {/* File Icon/Thumbnail/Preview Area */}
        <div className="aspect-[4/3] bg-slate-50 flex items-center justify-center border-b border-slate-100 overflow-hidden relative pointer-events-none">
          {(() => {
            if (isFolder) return <div className="flex flex-col items-center gap-2">{getFileIcon()}</div>;

            const ext = item.name?.split('.').pop()?.toLowerCase();

            // Image Preview (Standard)
            if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext) && thumbnailUrl) {
              return <img src={thumbnailUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />;
            }

            // Document Preview (PDF/Office) with Aggressive Scrollbar/UI Clipping
            if (['pdf', 'docx', 'xlsx', 'pptx', 'xls'].includes(ext) && thumbnailUrl) {
              const src = ext === 'pdf'
                ? `${thumbnailUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`
                : `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(thumbnailUrl)}`;

              return (
                <div className="w-full h-full relative overflow-hidden pointer-events-none bg-white">
                  {/* Aggressive clipping container (140% scale, -20% offset) to hide scrollbars and iframe UI */}
                  <div className="w-[140%] h-[140%] absolute -top-[20%] -left-[20%] overflow-hidden">
                    <iframe
                      src={src}
                      className="w-full h-full border-none select-none pointer-events-none"
                      scrolling="no"
                      style={{ border: 'none', overflow: 'hidden' }}
                    />
                  </div>
                  {/* Invisible mask to prevent any potential interaction/UI popups */}
                  <div className="absolute inset-0 z-10 bg-transparent" />
                </div>
              );
            }

            // Text Preview
            if (textContent) {
              return (
                <div className="w-full h-full p-4 bg-white overflow-hidden pointer-events-none select-none">
                  <pre className="text-[8px] leading-[10px] text-slate-400 font-mono whitespace-pre-wrap">{textContent}</pre>
                </div>
              );
            }

            // Fallback to Icon
            return <div className="flex flex-col items-center gap-2">{getFileIcon()}</div>;
          })()}

          {/* Context Menu Button (Top Right of Preview Area) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white z-10 pointer-events-auto"
          >
            <MoreVertical className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        {/* File Info Area (Bottom) */}
        <div className="p-3 bg-white">
          <h3 className="text-sm font-medium text-slate-700 truncate mb-0.5" title={item.name}>
            {item.name}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {isFolder ? "Folder" : formatSize(item.size_bytes)}
          </p>
        </div>

        {/* Context Menu */}
        {showMenu && (
          <div
            className="absolute right-2 top-10 bg-white border border-slate-200 rounded-xl shadow-2xl z-[60] py-2 min-w-[180px] animate-in fade-in zoom-in-95 duration-200"
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