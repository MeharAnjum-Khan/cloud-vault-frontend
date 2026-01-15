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

import "../globals.css";           // Global styles (Tailwind, base styles)
import Sidebar from "./components/sidebar"; // Sidebar extracted into reusable component
import TopBar from "./components/topbar";


export default function DashboardLayout({ children }) {
  return (
    // Root container
    // - flex: horizontal layout
    // - h-screen: full viewport height
    // - bg-slate-50: light dashboard background
    <div className="flex h-screen bg-slate-50">

      {/* =====================================================
          SIDEBAR
          =====================================================
          Contains:
          - App logo & name
          - Navigation buttons
          - Logout button
          Implemented as a separate component
      */}
      <Sidebar />

      {/* =====================================================
          MAIN CONTENT AREA
          =====================================================
          This section contains:
          - Top bar (header)
          - Dynamic page content (children)
      */}
      <div className="flex-1 flex flex-col">

        {/* -----------------------------------------------------
            TOP BAR
            -----------------------------------------------------
            Appears at the top of every dashboard page.
            Later can include:
            - Search bar
            - User profile menu
        */}
        <TopBar />
       

        {/* -----------------------------------------------------
            PAGE CONTENT
            -----------------------------------------------------
            This is where individual dashboard pages render:
            - Files list
            - Folder views
            - Trash
        */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>

      </div>
    </div>
  );
}
