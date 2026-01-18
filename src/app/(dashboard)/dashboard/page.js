"use client";

import { useState } from "react";
import FileList from "../components/filelist";
import FolderCreateModal from "../components/foldercreatemodal";

export default function DashboardPage() {
  const [currentFolder, setCurrentFolder] = useState(null); // null = root
  const [folderPath, setFolderPath] = useState([]); // Breadcrumb trail
  const [refreshKey, setRefreshKey] = useState(0); // For forcing refresh
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);

  // Navigation handler
  const handleNavigate = (folder) => {
    setFolderPath([...folderPath, folder]);
    setCurrentFolder(folder);
  };

  const handleNavigateUp = () => {
    if (folderPath.length === 0) return;
    const newPath = [...folderPath];
    newPath.pop(); // Remove last folder
    setFolderPath(newPath);
    setCurrentFolder(newPath.length > 0 ? newPath[newPath.length - 1] : null);
  };

  const handleFolderCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {currentFolder && (
            <button
              onClick={handleNavigateUp}
              className="p-2 hover:bg-slate-100 rounded-full"
            >
              ⬅️
            </button>
          )}
          <h1 className="text-2xl font-semibold text-slate-800">
            {currentFolder ? currentFolder.name : "My Files"}
          </h1>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsFolderModalOpen(true)}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg flex items-center gap-2"
          >
            ➕ New Folder
          </button>
        </div>
      </div>

      <FileList
        folderId={currentFolder?.id}
        onNavigate={handleNavigate}
        refreshTrigger={refreshKey}
      />

      <FolderCreateModal
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        onFolderCreated={handleFolderCreated}
        parentId={currentFolder?.id}
      />
    </div>
  );
}
