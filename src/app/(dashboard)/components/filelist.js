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

import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/api";
import FileGrid from "./filegrid";
import RenameModal from "./renamemodal";
import FilePreviewModal from "./filepreviewmodal";
import {
  CloudUpload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X
} from "lucide-react";
import { useUpload } from "../context/UploadContext"; // ✅ ADDED

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

  // ✅ Use Upload Context for Drag-and-Drop & Uploads
  const { uploadFiles, isDragging, uploadQueue, refreshTrigger: globalRefreshTrigger } = useUpload();

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 20;
  const [hasMore, setHasMore] = useState(false);
  const observerTarget = useRef(null);

  const [prevSearchQuery, setPrevSearchQuery] = useState(searchQuery);
  const [prevFolderId, setPrevFolderId] = useState(folderId);

  // Reset when filter changes
  useEffect(() => {
    if (searchQuery !== prevSearchQuery || folderId !== prevFolderId) {
      setPrevSearchQuery(searchQuery);
      setPrevFolderId(folderId);
      setPage(1);
      setItems({ folders: [], files: [] });
    }
  }, [searchQuery, folderId, prevSearchQuery, prevFolderId]);

  const fetchItems = useCallback(async (isLoadMore = false) => {
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
        // Folders are only fetched on the first page or when not searching
        (!isLoadMore && !searchQuery)
          ? api.get(`/folders?${query.toString()}`)
          : Promise.resolve({ folders: [] })
      ]);

      const newFiles = filesRes.files || filesRes;
      const pagination = filesRes.pagination;

      setItems(prev => ({
        files: isLoadMore ? [...prev.files, ...newFiles] : newFiles,
        folders: isLoadMore ? prev.folders : (foldersRes.folders || [])
      }));

      setHasMore(pagination?.hasMore || false);

    } catch (error) {
      console.error("Failed to fetch items:", error);
    } finally {
      setLoading(false);
    }
  }, [folderId, isTrash, searchQuery, page]);

  useEffect(() => {
    fetchItems(page > 1);
  }, [fetchItems, searchQuery, refreshTrigger, globalRefreshTrigger, page]); // ✅ Use both local and global refresh

  // Infinite Scroll Observer
  useEffect(() => {
    const currentTarget = observerTarget.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading]);

  /* ========================================================
     ✅ Drag-and-Drop Handlers (Professional & Reliable)
     ======================================================== */
  // Removed local drag/drop event listeners as they are now handled by the UploadContext

  // Removed handleFileUpload as its logic is now in UploadContext

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
          {!isTrash && !isDragging && <p className="text-slate-400 text-sm mt-2">Drag and drop files here to upload</p>}
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
    <div className="relative min-h-[80vh] h-full w-full outline-none">

      {/* 1. Content (Grid, Loading, or Empty State) */}
      {renderContent()}

      {/* Infinite Scroll Trigger */}
      <div ref={observerTarget} className="h-10 w-full flex items-center justify-center mt-4">
        {loading && page > 1 && (
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        )}
      </div>



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