"use client";

// PURPOSE:
// This page displays the user's files and folders.
// It acts as the main "Drive screen" after login.

/* ===================== */
/* ✅ ADDED IMPORT       */
/* ===================== */
import FileList from "../components/filelist";

export default function DashboardPage() {
  return (
    <div className="p-6">
      {/* Page title */}
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">
        Files
      </h1>

      {/* ===================== */}
      {/* ✅ ADDED: REAL FILES */}
      {/* ===================== */}
      {/* This component fetches files from backend and displays them */}
      <FileList />
    </div>
  );
}
