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

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, User, LogOut, Settings, HelpCircle } from "lucide-react";
import { useFolder } from "../context/FolderContext";

export default function TopBar({ onSearch }) {
  // Controls upload modal visibility
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false); // Dropdown visibility
  const router = useRouter();
  const { currentFolderId } = useFolder() || {}; // ✅ ADDED: Get current folder (safe check)

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  // ===============================
  // Day 6: Search input local state
  // ===============================
  const [searchText, setSearchText] = useState("");

  // ===============================
  // Day 6: Sync search to URL
  // ===============================
  useEffect(() => {
    // ✅ NEW: If search is cleared, reset URL
    if (searchText.trim() === "") {
      router.push("/dashboard"); // 🔹 RESET SEARCH
      return;
    }

    router.push(`?q=${encodeURIComponent(searchText)}`);
  }, [searchText, router]);

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
    <header className="h-16 bg-[#f9fbfd] flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Left: Page title */}
      <div className="w-48">
        <h2 className="text-xl text-slate-700">
          Drive
        </h2>
      </div>

      {/* Center: Search bar */}
      <div className="flex-1 max-w-2xl px-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-600">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Search in Drive"
            value={searchText}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            className="w-full bg-slate-100 border-none rounded-xl py-2.5 pl-11 pr-4 text-slate-700 placeholder-slate-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all duration-200 outline-none"
          />
        </div>
      </div>

      {/* Right: Actions + Avatar */}
      <div className="flex items-center gap-2">
        <button className="p-2 text-slate-600 hover:bg-slate-200/50 rounded-full transition-colors">
          <HelpCircle className="w-6 h-6" />
        </button>
        <button className="p-2 text-slate-600 hover:bg-slate-200/50 rounded-full transition-colors">
          <Settings className="w-6 h-6" />
        </button>

        <div className="relative ml-2">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white ring-4 ring-blue-50 hover:ring-blue-100 transition-all"
          >
            <User className="w-6 h-6" />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 z-20 py-3 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-slate-100 flex flex-col items-center">
                  <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl mb-3">
                    <User className="w-8 h-8" />
                  </div>
                  <p className="text-lg font-medium text-slate-800">User accounts</p>
                  <p className="text-sm text-slate-500">user@example.com</p>
                </div>
                <div className="py-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-6 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <LogOut className="w-5 h-5 text-slate-500" />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
