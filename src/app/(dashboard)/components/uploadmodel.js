// PURPOSE:
// Reusable upload modal UI (Google Drive–style)
// UI only – no backend logic yet

import { useState } from "react";
import api from "@/lib/api"; // ✅ ADDED: centralized API import

export default function UploadModel({ isOpen, onClose, folderId }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); // ✅ ADDED

  if (!isOpen) return null;

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    // ✅ PASS FOLDER ID IF EXISTS
    if (folderId) {
      formData.append("folder_id", folderId);
    }

    try {
      /* ✅ FIX: Use api.upload ensuring headers are sent */
      const data = await api.upload("/upload", formData);

      console.log("Upload success:", data);

      setSuccessMessage("File uploaded successfully ✅"); // ✅ ADDED
      setSelectedFile(null); // ✅ ADDED (reset)

      // ✅ Refresh page to show new file (since TopBar is outside page context)
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-slate-800">
            Upload files
          </h2>

          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-full
                       text-slate-600 hover:bg-red-500 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {/* File input */}
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg p-6 cursor-pointer hover:bg-slate-50">
          <input
            type="file"
            className="hidden"
            onChange={(e) => {
              setSelectedFile(e.target.files[0]);
              setSuccessMessage(""); // ✅ ADDED (clear old message)
            }}
          />
          <div className="text-3xl mb-2">📤</div>
          <p className="text-sm text-slate-600">
            Click to select files
          </p>
        </label>

        {/* ✅ ADDED: Selected file name */}
        {selectedFile && (
          <p className="mt-3 text-sm text-slate-700">
            Selected file: <strong>{selectedFile.name}</strong>
          </p>
        )}

        {/* ✅ ADDED: Success message */}
        {successMessage && (
          <p className="mt-3 text-sm text-green-600">
            {successMessage}
          </p>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md bg-slate-200 text-slate-700 hover:bg-slate-300"
          >
            Cancel
          </button>

          <button
            onClick={handleUpload}
            className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}
