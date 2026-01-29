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
import { useFolder } from "../context/FolderContext";

export default function DashboardPage({ searchQuery }) {
  // Stores the currently opened folder (null = Root)
  const [currentFolder, setCurrentFolder] = useState(null);

  // Keeps track of folder navigation path (breadcrumb history)
  const [folderPath, setFolderPath] = useState([]);

  // Used to force refresh of FileList after creating a folder
  const [refreshKey, setRefreshKey] = useState(0);

  // Controls whether the "Create Folder" modal is open or closed
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);

  const { setCurrentFolderId } = useFolder() || {};

  // Called when user clicks a folder to enter it
  const handleNavigate = (folder) => {
    setFolderPath([...folderPath, folder]); // Add folder to history
    setCurrentFolder(folder);               // Set as current
    if (setCurrentFolderId) setCurrentFolderId(folder.id);
  };

  // ✅ ADDED: Handle clicking a specific breadcrumb (Google Drive Jump)
  const handleBreadcrumbClick = (folder, index) => {
    // If clicking the active folder, do nothing
    if (folder.id === currentFolder?.id) return;

    // Set new current folder
    setCurrentFolder(folder);

    // Cut the history path to match where we jumped to
    setFolderPath(folderPath.slice(0, index + 1));

    if (setCurrentFolderId) setCurrentFolderId(folder.id);
  };

  // ✅ ADDED: Handle clicking "My Files" (Root)
  const handleRootClick = () => {
    setCurrentFolder(null);
    setFolderPath([]); // Clear history
    if (setCurrentFolderId) setCurrentFolderId(null);
  };

  // Triggered after a folder is successfully created
  const handleFolderCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="p-6 h-full flex flex-col">

      {/* =====================================================
          ✅ DAY 9 UPDATE: GOOGLE DRIVE STYLE BREADCRUMBS
          - Replaced simple "Back" button with clickable path
          - Added proper icons (Home, Chevron)
          - Consistent styling with the requested theme
         ===================================================== */}
      <div className="flex items-center justify-between mb-6">

        {/* Breadcrumb Navigation Bar */}
        <nav className="flex items-center text-lg text-slate-600">

          {/* Root Item: "My Files" */}
          <button
            onClick={handleRootClick}
            className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${!currentFolder
                ? "font-semibold text-slate-900 pointer-events-none" // Active state
                : "hover:bg-slate-100 text-slate-600" // Link state
              }`}
          >
            {/* Home Icon SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            My Files
          </button>

          {/* Map through history to create breadcrumbs */}
          {folderPath.map((folder, index) => (
            <div key={folder.id} className="flex items-center">

              {/* Chevron Icon Divider */}
              <span className="text-slate-400 mx-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </span>

              {/* Breadcrumb Item */}
              <button
                onClick={() => handleBreadcrumbClick(folder, index)}
                className={`px-2 py-1 rounded-md transition-colors truncate max-w-xs ${index === folderPath.length - 1
                    ? "font-semibold text-slate-900 pointer-events-none" // Active Folder
                    : "hover:bg-slate-100 text-slate-600" // Parent Folder
                  }`}
              >
                {folder.name}
              </button>
            </div>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setIsFolderModalOpen(true)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center gap-2 transition-colors border border-slate-200"
          >
            {/* Plus Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" /><path d="M12 5v14" />
            </svg>
            New Folder
          </button>
        </div>
      </div>

      {/* File and folder list */}
      {/* Passed onNavigate so FileList can trigger folder entry */}
      <FileList
        folderId={currentFolder?.id}
        onNavigate={handleNavigate}
        refreshTrigger={refreshKey}
        searchQuery={searchQuery}
      />

      {/* Folder creation modal */}
      <FolderCreateModal
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        onFolderCreated={handleFolderCreated}
        parentId={currentFolder?.id}
      />
    </div>
  );
}