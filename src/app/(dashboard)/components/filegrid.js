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

// Import single file UI component
import File from "./file";

const FileGrid = ({ files }) => {
  /**
   * `files` is an array coming from FileList
   * Example:
   * [
   *   { id, name, mime_type, size_bytes, ... },
   *   ...
   * ]
   */

  return (
    <div className="grid grid-cols-1 gap-3">
      {files.map((file) => (
        <File
          key={file.id}   // React needs a unique key
          file={file}     // Passing single file to File component
        />
      ))}
    </div>
  );
};

export default FileGrid;
