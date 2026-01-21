"use client";

/*
 PURPOSE:
 TopBar for dashboard pages.
 Displays:
 - Page title
 - Search input
 - Upload button
 - User avatar placeholder
*/

import { useState } from "react";
import UploadModel from "./uploadmodel";

export default function TopBar({ onSearch }) {
  // Controls upload modal visibility
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // ===============================
  // Day 6: Search input local state
  // ===============================
  const [searchText, setSearchText] = useState("");

  // Called whenever user types in search bar
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    onSearch(value); // send search text upward
  };

  // Optional: handle Enter key (UX consistency)
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch(searchText);
    }
  };

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">

        {/* Left: Page title */}
        <h2 className="text-lg font-medium text-slate-800">
          My Drive
        </h2>

        {/* Center: Search bar */}
        <div className="flex-1 max-w-md mx-6">
          <input
            type="text"
            placeholder="Search in CloudVault"
            value={searchText}
            onChange={handleSearchChange}   // Day 6
            onKeyDown={handleKeyDown}       // Day 6
            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Right: Upload + Avatar */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsUploadOpen(true)}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Upload
          </button>

          <div className="h-9 w-9 rounded-full bg-slate-300 flex items-center justify-center text-sm font-medium text-slate-700">
            U
          </div>
        </div>
      </header>

      {/* Upload modal */}
      <UploadModel
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />
    </>
  );
}
