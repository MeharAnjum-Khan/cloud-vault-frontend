// src/app/(dashboard)/components/filegrid.js

/**
 * PURPOSE:
 * Google Drive-style grid layout for files and folders
 * - Responsive grid (1-6 columns based on screen size)
 * - Card-based display
 */

"use client";

import File from "./file";

const FileGrid = ({ folders, files, onNavigate, onDelete, onRename, onRestore, isTrash, onPreview }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {folders.map((folder) => (
        <File
          key={`folder-${folder.id}`}
          item={{ ...folder, type: "folder" }}
          onNavigate={onNavigate}
          onDelete={onDelete}
          onRename={onRename}
          onRestore={onRestore}
          isTrash={isTrash}
        />
      ))}

      {files.map((file) => (
        <File
          key={`file-${file.id}`}
          item={{ ...file, type: "file" }}
          onNavigate={onNavigate}
          onDelete={onDelete}
          onRename={onRename}
          onRestore={onRestore}
          isTrash={isTrash}
          onPreview={onPreview}
        />
      ))}
    </div>
  );
};

export default FileGrid;