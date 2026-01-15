"use client";

// PURPOSE:
// This page displays the user's files and folders.
// It acts as the main "Drive screen" after login.

export default function DashboardPage() {
  // TEMPORARY UI-ONLY DATA
  // Later, this will be replaced by backend data
  const files = []; // empty array to show Empty State

  return (
    <div className="p-6">
      {/* Page title */}
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">
        Files
      </h1>

      {/* ================= EMPTY STATE ================= */}
      {/* This is shown when there are no files */}
      {files.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-24 text-center">
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
      )}

      {/* ================= FILES GRID ================= */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="border border-slate-200 rounded-lg p-4 bg-white hover:shadow-sm cursor-pointer">
            <div className="h-24 flex items-center justify-center bg-slate-100 rounded">
              📄
            </div>
            <p className="mt-2 text-sm text-slate-700 truncate">
              example.pdf
            </p>
          </div>

          <div className="border border-slate-200 rounded-lg p-4 bg-white hover:shadow-sm cursor-pointer">
            <div className="h-24 flex items-center justify-center bg-slate-100 rounded">
              📁
            </div>
            <p className="mt-2 text-sm text-slate-700 truncate">
              Documents
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
