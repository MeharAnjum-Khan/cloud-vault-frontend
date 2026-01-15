"use client";

/*
 PURPOSE:
 TopBar for dashboard pages.
 Displays:
 - Page title
 - Search input (UI only)
 - Upload button
 - User avatar placeholder

 This file is UI-only (no logic yet).
*/

import Image from "next/image";

export default function TopBar() {
  return (
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
          className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Right: Upload + Avatar */}
      <div className="flex items-center gap-4">
        <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
          Upload
        </button>

        {/* User avatar placeholder */}
        <div className="h-9 w-9 rounded-full bg-slate-300 flex items-center justify-center text-sm font-medium text-slate-700">
          U
        </div>
      </div>
    </header>
  );
}
