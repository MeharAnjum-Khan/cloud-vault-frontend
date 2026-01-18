// src/app/(dashboard)/components/filegrid.js

/**
 * PURPOSE:
 * This component is responsible for displaying
 * a COLLECTION of files in a grid or list layout.
 *
 * In very simple terms:
 * - Receives an array of files as props
 * - Loops through the files
 * - Uses <File /> component to render each file
 *
 * This keeps UI clean and modular.
 */

"use client";

import File from "./file";

const FileGrid = ({ folders, files, onNavigate, onDelete, onRename, onRestore, isTrash }) => {
  return (
    <div className="grid grid-cols-1 gap-3">
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
        />
      ))}
    </div>
  );
};

export default FileGrid;
