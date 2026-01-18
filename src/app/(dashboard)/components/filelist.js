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

import { useEffect, useState } from "react";
import api from "@/lib/api";

/* ✅ ADDED: FileGrid component for rendering files */
import FileGrid from "./filegrid";

const FileList = () => {
  // 🔍 DEBUG LOG (ADD THIS LINE)
  console.log("FileList component rendered");
  // State to store files fetched from backend
  const [files, setFiles] = useState([]);

  // State to handle loading UI
  const [loading, setLoading] = useState(true);

  /**
   * Fetch user's files when component loads
   */
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        // ✅ FIX: Use centralized api helper instead of axios
        const response = await api.get("/files");
        console.log("FILES API RESPONSE:", response);
        setFiles(response.files);
        /* 
          Backend returns:
          {
            message: "...",
            files: [...]
          }
        */
        //setFiles(response.files);
      } catch (error) {
        console.error("Failed to fetch files:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  // Show loading text while API call is in progress
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mb-4"></div>
        <p className="text-slate-500">Loading files...</p>
      </div>
    );
  }

  // If no files exist
  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center mt-12 text-center">
        <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-3xl">
          📁
        </div>

        <h2 className="text-lg font-medium text-slate-700">
          No files yet
        </h2>

        <p className="text-sm text-slate-500 mt-1 max-w-sm">
          Upload files or create folders to see them appear here.
        </p>
      </div>
    );
  }

  /* =====================================================
     ✅ UPDATED: Delegate UI rendering to FileGrid
     ===================================================== */
  return (
    <div>
      {/* FileGrid handles layout + File component */}
      <FileGrid files={files} />
    </div>
  );
};

export default FileList;
