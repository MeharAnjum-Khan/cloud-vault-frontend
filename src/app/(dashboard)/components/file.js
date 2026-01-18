// src/app/(dashboard)/components/file.js

/**
 * PURPOSE:
 * This component represents a SINGLE file item in the UI.
 *
 * In very simple terms:
 * - Receives file data as props
 * - Displays file name, type, and size
 * - Does NOT fetch data
 * - Does NOT manage state
 *
 * Think of this as:
 * "One row / one card for one file"
 */

"use client";

const File = ({ file }) => {
  /**
   * `file` object comes from backend
   * Example:
   * {
   *   id,
   *   name,
   *   mime_type,
   *   size_bytes,
   *   created_at
   * }
   */

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-slate-50 transition">
      {/* ===============================
          FILE INFO
         =============================== */}
      <div className="flex flex-col">
        {/* File name */}
        <span className="font-medium text-slate-800">
          {file.name}
        </span>

        {/* File meta info */}
        <span className="text-sm text-slate-500">
          {file.mime_type} • {(file.size_bytes / 1024).toFixed(2)} KB
        </span>
      </div>

      {/* ===============================
          PLACEHOLDER FOR ACTIONS
          (Download / Delete later)
         =============================== */}
      <div className="text-sm text-slate-400">
        {/* Actions will be added in later days */}
      </div>
    </div>
  );
};

export default File;
