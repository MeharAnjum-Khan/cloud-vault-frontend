// src/app/(dashboard)/components/FileList.js

/**
 * PURPOSE:
 * This component is responsible for displaying
 * all files uploaded by the logged-in user.
 *
 * In simple terms:
 * - Calls backend API to fetch files
 * - Passes files to UI components
 * - This is the "My Files" section of CloudVault
 */

"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/api";
import FileGrid from "./filegrid";
import RenameModal from "./renamemodal";
import FilePreviewModal from "./filepreviewmodal"; // ✅ Component for Previews

const FileList = ({
  folderId = null,
  isTrash = false,
  onNavigate,
  refreshTrigger,
  searchQuery: propSearchQuery = ""
}) => {
  const searchParams = useSearchParams();
  const searchQuery = propSearchQuery || searchParams.get("q") || "";

  const [items, setItems] = useState({ folders: [], files: [] });
  const [loading, setLoading] = useState(true);
  const [renameItem, setRenameItem] = useState(null);

  // ✅ State for File Preview
  const [previewFile, setPreviewFile] = useState(null);

  // ✅ State for Drag-and-Drop & Uploads
  const [isDragging, setIsDragging] = useState(false);
  const [uploadQueue, setUploadQueue] = useState([]);

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 20;

  const [prevSearchQuery, setPrevSearchQuery] = useState(searchQuery);
  if (searchQuery !== prevSearchQuery) {
    setPrevSearchQuery(searchQuery);
    setPage(1);
  }

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (folderId) query.append("folderId", folderId);
      if (folderId) query.append("parentId", folderId);
      if (isTrash) query.append("trash", "true");

      query.append("page", page);
      query.append("limit", limit);

      const filesEndpoint = searchQuery
        ? `/search?q=${searchQuery}&${query.toString()}`
        : `/files?${query.toString()}`;

      const [filesRes, foldersRes] = await Promise.all([
        api.get(filesEndpoint),
        searchQuery
          ? Promise.resolve({ folders: [] })
          : api.get(`/folders?${query.toString()}`)
      ]);

      setItems({
        files: filesRes.files || filesRes,
        folders: foldersRes.folders
      });
    } catch (error) {
      console.error("Failed to fetch items:", error);
    } finally {
      setLoading(false);
    }
  }, [folderId, isTrash, searchQuery, page]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems, searchQuery, refreshTrigger]);

  /* ========================================================
     ✅ Drag-and-Drop Handlers (Professional & Reliable)
     ======================================================== */
  useEffect(() => {
    const handleWindowDragOver = (e) => {
      e.preventDefault();
      if (!isTrash) setIsDragging(true);
    };

    const handleWindowDrop = () => {
      setIsDragging(false);
    };

    window.addEventListener("dragover", handleWindowDragOver);
    window.addEventListener("drop", handleWindowDrop);

    return () => {
      window.removeEventListener("dragover", handleWindowDragOver);
      window.removeEventListener("drop", handleWindowDrop);
    };
  }, [isTrash]);

  const handleDragLeave = (e) => {
    // Only turn off if we leave the main window
    if (e.clientY <= 0 || e.clientX <= 0 || e.clientX >= window.innerWidth || e.clientY >= window.innerHeight) {
      setIsDragging(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      console.log("Files dropped:", files.length);
      await handleFileUpload(files);
    }
  };

  const handleFileUpload = async (files) => {
    console.log(`Starting upload of ${files.length} files...`);
    const newUploads = files.map(file => ({
      name: file.name,
      progress: 0,
      status: 'uploading'
    }));
    setUploadQueue(prev => [...prev, ...newUploads]);

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      if (folderId) formData.append("parent_id", folderId);

      try {
        await api.post("/files/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadQueue(prev => prev.map(item =>
                item.name === file.name ? { ...item, progress: percent } : item
              ));
            }
          }
        });

        setUploadQueue(prev => prev.filter(item => item.name !== file.name));
        fetchItems();

      } catch (error) {
        console.error("Upload failed", error);
        setUploadQueue(prev => prev.map(item =>
          item.name === file.name ? { ...item, status: 'error' } : item
        ));
        setTimeout(() => {
          setUploadQueue(prev => prev.filter(item => item.name !== file.name));
        }, 3000);
      }
    }
  };

  const handleRename = async () => {
    fetchItems();
    setRenameItem(null);
  };

  const handleDelete = async (item, type) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      const endpoint = type === "folder" ? `/folders/${item.id}` : `/files/${item.id}`;
      if (!isTrash) await api.del(endpoint);
      fetchItems();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleRestore = async (item, type) => {
    try {
      const endpoint = type === "folder" ? `/folders/${item.id}/restore` : `/files/${item.id}/restore`;
      await api.put(endpoint, {});
      fetchItems();
    } catch (error) {
      alert(error.message);
    }
  };

  // ✅ Determine Content to Render
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mb-4"></div>
          <p className="text-slate-500">Loading...</p>
        </div>
      );
    }

    if (items.files.length === 0 && items.folders.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center mt-12 text-center pointer-events-none">
          <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-3xl">
            {isTrash ? "🗑️" : "📁"}
          </div>
          <h2 className="text-lg font-medium text-slate-700">
            {isTrash ? "Trash is empty" : "No results found"}
          </h2>
          {!isTrash && <p className="text-slate-400 text-sm mt-2">Drag and drop files here to upload</p>}
        </div>
      );
    }

    return (
      <FileGrid
        folders={items.folders}
        files={items.files}
        onNavigate={onNavigate}
        onDelete={handleDelete}
        onRename={(item) => setRenameItem(item)}
        onRestore={handleRestore}
        onPreview={(file) => setPreviewFile(file)}
        isTrash={isTrash}
      />
    );
  };

  // ✅ MAIN RENDER: The Wrapper Div handles Drag Events for the WHOLE area
  return (
    <div
      className="relative min-h-[80vh] h-full w-full outline-none"
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >

      {/* 1. Content (Grid, Loading, or Empty State) */}
      {renderContent()}

      {/* 2. Drag Overlay (Shows when dragging) */}
      {isDragging && (
        <div className="fixed inset-0 bg-blue-600/10 backdrop-blur-[2px] border-4 border-dashed border-blue-500 z-[100] flex items-center justify-center pointer-events-none transition-all duration-300">
          <div className="bg-white p-8 rounded-2xl shadow-2xl text-center scale-110">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-5xl">📤</span>
            </div>
            <p className="text-blue-600 font-bold text-2xl">Drop files to upload</p>
            <p className="text-slate-400 mt-2">Your files will be added to this folder</p>
          </div>
        </div>
      )}

      {/* 3. Upload Progress Toast */}
      {uploadQueue.length > 0 && (
        <div className="fixed bottom-6 right-6 bg-white shadow-2xl rounded-xl p-0 w-80 z-[100] border border-slate-200 overflow-hidden animate-in slide-in-from-bottom duration-300">
          <div className="bg-slate-900 text-white px-4 py-3 flex justify-between items-center">
            <h4 className="font-medium text-sm">Uploading {uploadQueue.length} items</h4>
            <div className="flex gap-2">
              <div className="animate-spin rounded-full h-3 w-3 border-2 border-slate-400 border-t-white"></div>
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto p-4 bg-white">
            {uploadQueue.map((item, idx) => (
              <div key={idx} className="mb-4 last:mb-0">
                <div className="flex justify-between text-xs mb-2">
                  <span className="truncate w-40 text-slate-700 font-medium">{item.name}</span>
                  <span className="text-slate-500">{item.status === 'error' ? '❌ Failed' : `${item.progress}%`}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${item.status === 'error' ? 'bg-red-500' : 'bg-blue-600'}`}
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Rename Modal */}
      <RenameModal
        isOpen={!!renameItem}
        onClose={() => setRenameItem(null)}
        onRenamed={handleRename}
        item={renameItem}
      />

      {/* 5. File Preview Modal */}
      {previewFile && (
        <FilePreviewModal
          file={previewFile}
          isOpen={!!previewFile}
          onClose={() => setPreviewFile(null)}
        />
      )}
    </div>
  );
};

export default FileList;