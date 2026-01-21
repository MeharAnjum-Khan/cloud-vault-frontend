/**
 * 📄 DashboardPage
 *
 * Purpose of this file:
 * - Acts as the main dashboard page for CloudVault
 * - Displays files and folders (like Google Drive)
 * - Handles folder navigation (enter folder / go back)
 * - Opens modal to create new folders
 * - Refreshes file list when folders are created
 */

"use client";

import { useState } from "react";
import FileList from "../components/filelist";
import FolderCreateModal from "../components/foldercreatemodal";

/* =====================================================
   Day 6:
   DashboardPage now receives searchQuery from layout
   ===================================================== */

export default function DashboardPage({ searchQuery }) {
  // Stores the currently opened folder
  // null means we are at the root ("My Files")
  const [currentFolder, setCurrentFolder] = useState(null);

  // Keeps track of folder navigation path (breadcrumb history)
  const [folderPath, setFolderPath] = useState([]);

  // Used to force refresh of FileList after creating a folder
  const [refreshKey, setRefreshKey] = useState(0);

  // Controls whether the "Create Folder" modal is open or closed
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);

  // Called when user clicks a folder to enter it
  const handleNavigate = (folder) => {
    setFolderPath([...folderPath, folder]); // add folder to path
    setCurrentFolder(folder);               // set as current folder
  };

  // Called when user clicks the back button
  const handleNavigateUp = () => {
    if (folderPath.length === 0) return;

    const newPath = [...folderPath];
    newPath.pop(); // remove last folder from path

    setFolderPath(newPath);
    setCurrentFolder(
      newPath.length > 0 ? newPath[newPath.length - 1] : null
    );
  };

  // Triggered after a folder is successfully created
  // Forces FileList to reload data
  const handleFolderCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="p-6">
      {/* Header section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {/* Back button shown only inside a folder */}
          {currentFolder && (
            <button
              onClick={handleNavigateUp}
              className="p-2 hover:bg-slate-100 rounded-full"
            >
              ⬅️
            </button>
          )}

          {/* Page title */}
          <h1 className="text-2xl font-semibold text-slate-800">
            {currentFolder ? currentFolder.name : "My Files"}
          </h1>
        </div>

        {/* Create folder button */}
        <div className="flex gap-2">
          <button
            onClick={() => setIsFolderModalOpen(true)}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg flex items-center gap-2"
          >
            ➕ New Folder
          </button>
        </div>
      </div>


      {/* =====================================================
          Day 6:
          Pass searchQuery down to FileList
          ===================================================== */}

      {/* File and folder list */}
      <FileList
        folderId={currentFolder?.id}   // current folder ID
        onNavigate={handleNavigate}    // folder click handler
        refreshTrigger={refreshKey}    // refresh control
        searchQuery={searchQuery}      // ✅ Day 6: pass search query
      />

      {/* Folder creation modal */}
      <FolderCreateModal
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        onFolderCreated={handleFolderCreated}
        parentId={currentFolder?.id}   // create inside current folder
      />
    </div>
  );
}
