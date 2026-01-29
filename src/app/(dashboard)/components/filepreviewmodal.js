/**
 * 📄 FilePreviewModal
 *
 * Purpose of this file:
 * - Displays a full-screen modal overlay when a user double-clicks a file.
 * - Intelligently renders content based on file type:
 * 1. Images (jpg, png, gif) -> Standard <img> tag
 * 2. PDFs -> Embed using <iframe />
 * 3. Text/Code (txt, js, json) -> Simple text display
 * 4. Others (zip, exe) -> "No Preview Available" message with Download button
 * - Follows Google Drive's dark overlay style.
 */

"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

const FilePreviewModal = ({ file, isOpen, onClose }) => {
  // State to store the signed URL fetched from backend
  const [fileUrl, setFileUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch signed URL when modal opens
  useEffect(() => {
    if (!isOpen || !file) return;

    const fetchSignedUrl = async () => {
      try {
        setLoading(true);
        setError(null);
        // Call backend to get signed download URL
        const response = await api.get(`/files/${file.id}/download`);
        setFileUrl(response.downloadUrl);
      } catch (err) {
        console.error("Failed to fetch file URL:", err);
        setError("Failed to load file preview");
      } finally {
        setLoading(false);
      }
    };

    fetchSignedUrl();
  }, [file, isOpen]);

  // Close modal on ESC key press
  useEffect(() => {
    if (!isOpen || !file) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, file, onClose]);

  // If modal is closed or no file is selected, render nothing
  if (!isOpen || !file) return null;

  // Determine file type category based on extension or mime type
  const getFileType = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return 'image';
    if (['pdf'].includes(ext)) return 'pdf';
    if (['txt', 'md', 'json', 'js', 'css', 'html'].includes(ext)) return 'text';
    return 'unknown';
  };

  const fileType = getFileType(file.name);

  return (
    // 1. Overlay Container (Dark semi-transparent background)
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose} // Clicking outside closes the modal
    >

      {/* 2. Main Modal Content Wrapper */}
      <div
        className="relative w-full max-w-5xl h-[85vh] bg-white rounded-lg overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
      >

        {/* --- Header: File Name + Actions --- */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            {/* File Icon (Simple unicode fallback) */}
            <span className="text-xl">📄</span>
            <h2 className="text-sm font-medium truncate max-w-md" title={file.name}>
              {file.name}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Download Button */}
            <a
              href={fileUrl || '#'}
              download
              className="text-slate-300 hover:text-white transition-colors"
              title="Download"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </a>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="text-slate-300 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* --- Body: Content Viewer --- */}
        <div className="flex-1 bg-slate-100 flex items-center justify-center overflow-auto p-4 relative">

          {/* Loading State */}
          {loading && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto mb-4"></div>
              <p className="text-slate-500">Loading preview...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                ❌
              </div>
              <h3 className="text-lg font-medium text-slate-700">{error}</h3>
              <p className="text-slate-500 mb-6">Please try again later.</p>
            </div>
          )}

          {/* File Content (only show when loaded) */}
          {!loading && !error && fileUrl && (
            <>
              {/* A. IMAGE VIEWER */}
              {fileType === 'image' && (
                <img
                  src={fileUrl}
                  alt={file.name}
                  className="max-w-full max-h-full object-contain shadow-md rounded"
                />
              )}

              {/* B. PDF VIEWER (Using Browser Native Embed) */}
              {fileType === 'pdf' && (
                <iframe
                  src={`${fileUrl}#toolbar=0`}
                  className="w-full h-full border-none rounded bg-white shadow-sm"
                  title="PDF Preview"
                />
              )}

              {/* C. TEXT VIEWER (Fallback for code/txt) */}
              {fileType === 'text' && (
                <div className="bg-white p-8 shadow-sm rounded max-w-2xl w-full h-full overflow-auto">
                  <p className="text-slate-500 text-sm mb-4">Text Preview:</p>
                  {/* Note: This assumes public access or signed URL logic handles CORS correctly */}
                  <iframe
                    src={fileUrl}
                    className="w-full h-full border-none font-mono text-sm"
                    sandbox
                  />
                </div>
              )}

              {/* D. UNKNOWN FILE TYPE (Fallback) */}
              {fileType === 'unknown' && (
                <div className="text-center">
                  <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                    &quest;
                  </div>
                  <h3 className="text-lg font-medium text-slate-700">No Preview Available</h3>
                  <p className="text-slate-500 mb-6 max-w-xs mx-auto">
                    We can&apos;t preview this file type directly in the browser.
                  </p>
                  <a
                    href={fileUrl}
                    download
                    className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Download File
                  </a>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default FilePreviewModal;