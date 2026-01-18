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
import api from "@/lib/api";
import FileGrid from "./filegrid";
import RenameModal from "./renamemodal";

const FileList = ({ folderId = null, isTrash = false, onNavigate, refreshTrigger }) => {
  const [items, setItems] = useState({ folders: [], files: [] });
  const [loading, setLoading] = useState(true);
  const [renameItem, setRenameItem] = useState(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (folderId) query.append("folderId", folderId); // backend expects folderId for files
      if (folderId) query.append("parentId", folderId); // backend expects parentId for folders
      if (isTrash) query.append("trash", "true");

      const [filesRes, foldersRes] = await Promise.all([
        api.get(`/files?${query.toString()}`),
        api.get(`/folders?${query.toString()}`)
      ]);

      setItems({
        files: filesRes.files,
        folders: foldersRes.folders
      });
    } catch (error) {
      console.error("Failed to fetch items:", error);
    } finally {
      setLoading(false);
    }
  }, [folderId, isTrash]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems, refreshTrigger]);

  const handleRename = async () => {
    fetchItems();
    setRenameItem(null);
  };

  const handleDelete = async (item, type) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      const endpoint = type === "folder" ? `/folders/${item.id}` : `/files/${item.id}`;
      // For trash, we might want permanent delete or restore logic here, but for now assuming soft delete from main view
      if (isTrash) {
        // If in trash, delete means permanent delete (if implemented) or we can add restore button
        // For now let's implement RESTORE as primary action in trash
      } else {
        await api.del(endpoint);
      }
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

  // Sort: Folders first, then Files
  // ... actually specific sorting might be needed but let's just pass them

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
      <div className="flex flex-col items-center justify-center mt-12 text-center">
        <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-3xl">
          {isTrash ? "🗑️" : "📁"}
        </div>
        <h2 className="text-lg font-medium text-slate-700">
          {isTrash ? "Trash is empty" : "This folder is empty"}
        </h2>
      </div>
    );
  }

  return (
    <>
      <FileGrid
        folders={items.folders}
        files={items.files}
        onNavigate={onNavigate}
        onDelete={handleDelete}
        onRename={(item) => setRenameItem(item)}
        onRestore={handleRestore}
        isTrash={isTrash}
      />

      <RenameModal
        isOpen={!!renameItem}
        onClose={() => setRenameItem(null)}
        onRenamed={handleRename}
        item={renameItem}
      />
    </>
  );
};

export default FileList;
