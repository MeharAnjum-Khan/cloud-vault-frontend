/**
 * 📄 FilePreviewModal
 *
 * Purpose of this file:
 * - Displays a full-screen modal overlay when a user double-clicks a file.
 * - Intelligently renders content based on file type (Images, PDFs, Text).
 */

"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
  X,
  Download,
  File as FileIcon,
  FileText,
  Image as ImageIcon,
  AlertCircle,
  Loader2
} from "lucide-react";

/**
 * Helper to determine file type category
 */
const getFileType = (fileName) => {
  const ext = fileName.split('.').pop().toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image';
  if (['pdf'].includes(ext)) return 'pdf';
  if (['txt', 'md', 'json', 'js', 'css', 'html'].includes(ext)) return 'text';
  if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext)) return 'office';
  return 'unknown';
};

const FilePreviewModal = ({ file, isOpen, onClose }) => {
  const [fileUrl, setFileUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [textContent, setTextContent] = useState("");

  const fileType = file ? getFileType(file.name) : 'unknown';

  useEffect(() => {
    if (!isOpen || !file) return;

    const fetchPreview = async () => {
      try {
        setLoading(true);
        setError(null);
        setTextContent("");

        // 1. Get signed URL
        const data = await api.get(`/files/${file.id}/download`);
        const { downloadUrl } = data;
        setFileUrl(downloadUrl);

        // 2. Fetch text content if needed
        if (fileType === 'text') {
          try {
            const textRes = await fetch(downloadUrl);
            const text = await textRes.text();
            setTextContent(text);
          } catch (err) {
            console.error("Text fetch error:", err);
            setTextContent("Failed to load text content.");
          }
        }
      } catch (err) {
        console.error("Preview load error:", err);
        setError("Unable to load preview.");
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [file, isOpen, fileType]);

  const handleDownload = async () => {
    if (!fileUrl) return;
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Manual download failed:", err);
      // Fallback: search for standard download
      window.open(fileUrl, '_blank');
    }
  };

  // ESC key support
  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen || !file) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl h-full max-h-[90vh] bg-white rounded-2xl overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white text-slate-800 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-50 rounded-lg">
              {fileType === 'image' ? <ImageIcon className="w-5 h-5 text-purple-600" /> :
                fileType === 'pdf' ? <FileText className="w-5 h-5 text-red-600" /> :
                  <FileIcon className="w-5 h-5 text-blue-600" />}
            </div>
            <h2 className="text-base font-semibold truncate max-w-md text-slate-700">{file.name}</h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.open(fileUrl, '_blank')}
              className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-500 hover:text-indigo-600"
              title="Open in new tab"
            >
              <FileIcon size={18} />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-500 hover:text-indigo-600"
              title="Download"
            >
              <Download size={20} />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-500 hover:text-red-600"
              title="Close"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 bg-slate-100 flex items-center justify-center overflow-hidden p-4 relative">
          {loading && (
            <div className="flex flex-col items-center">
              <Loader2 className="w-12 h-12 text-slate-400 animate-spin mb-4" />
              <p className="text-slate-500 font-medium font-sans">Generating preview...</p>
            </div>
          )}

          {error && (
            <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
              <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-800 mb-2">{error}</h3>
              <p className="text-slate-500 mb-6">You can still download the file to view it locally.</p>
              <button onClick={onClose} className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">Close</button>
            </div>
          )}

          {!loading && !error && (
            <div className="w-full h-full flex items-center justify-center">
              {fileType === 'image' && (
                <img src={fileUrl} alt={file.name} className="max-w-full max-h-full object-contain shadow-sm rounded-lg" />
              )}

              {fileType === 'pdf' && (
                <iframe src={`${fileUrl}#toolbar=0`} className="w-full h-full border-none rounded-lg bg-white shadow-inner" title="PDF" />
              )}

              {fileType === 'text' && (
                <div className="w-full h-full bg-slate-50 p-8 overflow-auto rounded-lg border border-slate-200 shadow-inner">
                  <pre className="whitespace-pre-wrap font-mono text-sm text-slate-700 leading-relaxed">{textContent}</pre>
                </div>
              )}

              {fileType === 'office' && (
                <iframe
                  src={`https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`}
                  className="w-full h-full border-none rounded-lg bg-white shadow-inner"
                  title="Office Document"
                />
              )}

              {fileType === 'unknown' && (
                <div className="text-center p-12 bg-white rounded-3xl shadow-xl max-w-md">
                  <div className="w-24 h-24 bg-slate-50 text-slate-400 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <FileIcon size={48} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">No Preview Available</h3>
                  <p className="text-slate-500 mb-8 leading-relaxed">We can&apos;t display a preview for this file type in the browser.</p>
                  <a href={fileUrl} download className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
                    <Download size={18} /> Download
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilePreviewModal;