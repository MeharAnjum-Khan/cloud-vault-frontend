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

const File = ({ item, onNavigate, onDelete, onRename, onRestore, isTrash }) => {
  const isFolder = item.type === "folder";

  const handleWrapperClick = () => {
    if (isFolder && !isTrash && onNavigate) {
      onNavigate(item);
    }
  };

  return (
    <div
      className={`flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-slate-50 transition cursor-pointer`}
      onClick={handleWrapperClick}
    >
      <div className="flex items-center gap-4">
        <div className="text-2xl">
          {isFolder ? "📁" : "📄"}
        </div>

        <div className="flex flex-col">
          <span className="font-medium text-slate-800">
            {item.name}
          </span>
          <span className="text-sm text-slate-500">
            {isFolder
              ? "Folder"
              : `${item.mime_type || 'File'} • ${(item.size_bytes / 1024).toFixed(2)} KB`
            }
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
        {isTrash ? (
          <button
            onClick={() => onRestore(item, item.type)}
            className="p-2 text-green-600 hover:bg-green-50 rounded"
            title="Restore"
          >
            Restore
          </button>
        ) : (
          <>
            <button
              onClick={() => onRename(item)}
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
              title="Rename"
            >
              ✏️
            </button>
            <button
              onClick={() => onDelete(item, item.type)}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
              title="Delete"
            >
              🗑️
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default File;
