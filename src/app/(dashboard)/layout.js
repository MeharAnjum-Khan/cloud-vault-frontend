// PURPOSE:
// This layout wraps all dashboard-related pages.
// It defines the main Google Drive–style structure:
//
// Layout structure:
// ┌──────────────────────────────┐
// │ Sidebar (left)               │
// ├──────────────────────────────┤
// │ Top bar (top of main area)   │
// ├──────────────────────────────┤
// │ Page content (children)      │
// └──────────────────────────────┘
//
// This file is responsible ONLY for layout,
// not business logic.

"use client";

import React, { useState, createContext } from "react";
import "../globals.css";                   // Global styles (Tailwind, base styles)
import Sidebar from "./components/sidebar"; // Sidebar extracted into reusable component
import TopBar from "./components/topbar";
import { FolderProvider } from "./context/FolderContext";
import { UploadProvider } from "./context/UploadContext"; // ✅ ADDED

/* =====================================================
   Day 6: Search Context
   Allows any dashboard component to access searchQuery
   ===================================================== */
export const SearchContext = createContext("");

export default function DashboardLayout({ children }) {
  // Holds current search query typed in TopBar
  const [searchQuery, setSearchQuery] = useState("");

  return (
    /* =====================================================
       Day 6:
       Wrap dashboard with SearchContext provider
       ===================================================== */
    <SearchContext.Provider value={searchQuery}>
      <FolderProvider>
        <UploadProvider> {/* ✅ ADDED: Global Upload Provider */}
          <div className="flex h-screen bg-slate-50">

            {/* =====================================================
              SIDEBAR
              ===================================================== */}
            <Sidebar />

            {/* =====================================================
              MAIN CONTENT AREA
              ===================================================== */}
            <div className="flex-1 flex flex-col">

              {/* -----------------------------------------------------
                TOP BAR
                ----------------------------------------------------- */}
              <TopBar onSearch={setSearchQuery} />

              <main className="flex-1 overflow-y-auto p-6">
                {React.cloneElement(children, { searchQuery })}
              </main>

            </div>
          </div>
        </UploadProvider>
      </FolderProvider>
    </SearchContext.Provider>
  );
}