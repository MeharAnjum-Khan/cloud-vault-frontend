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


const FileList = ({
  folderId = null,
  isTrash = false,
  onNavigate,
  refreshTrigger,
  searchQuery = "" // ✅ added (Day 6)
}) => {
  const [items, setItems] = useState({ folders: [], files: [] });
  const [loading, setLoading] = useState(true);
  const [renameItem, setRenameItem] = useState(null);

  // Pagination (Day 6)
  const [page, setPage] = useState(1);
  const limit = 20;


  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (folderId) query.append("folderId", folderId);
      if (folderId) query.append("parentId", folderId);
      if (isTrash) query.append("trash", "true");

      // Pagination params
      query.append("page", page);
      query.append("limit", limit);

      // 🔍 FILES API
      const filesEndpoint = searchQuery
        ? `/search?q=${searchQuery}&${query.toString()}`
        : `/files?${query.toString()}`;

      const [filesRes, foldersRes] = await Promise.all([
        api.get(filesEndpoint),
        api.get(`/folders?${query.toString()}`)
      ]);

      setItems({
        files: filesRes.files || filesRes, // supports both old & new response shapes
        folders: foldersRes.folders
      });
    } catch (error) {
      console.error("Failed to fetch items:", error);
    } finally {
      setLoading(false);
    }
  }, [folderId, isTrash, searchQuery, page]);

  useEffect(() => {
    // Reset pagination when search changes
    setPage(1);
    fetchItems();
  }, [fetchItems, searchQuery]);

  const handleRename = async () => {
    fetchItems();
    setRenameItem(null);
  };

  const handleDelete = async (item, type) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      const endpoint = type === "folder" ? `/folders/${item.id}` : `/files/${item.id}`;
      if (!isTrash) {
        await api.del(endpoint);
      }
      fetchItems();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleRestore = async (item, type) => {
    try {
      const endpoint = type === "folder"
        ? `/folders/${item.id}/restore`
        : `/files/${item.id}/restore`;
      await api.put(endpoint, {});
      fetchItems();
    } catch (error) {
      alert(error.message);
    }
  };

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