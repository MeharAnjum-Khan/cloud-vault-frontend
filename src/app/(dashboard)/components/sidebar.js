"use client";

/*
 PURPOSE:
 This Sidebar component is used inside the dashboard layout.
 It provides primary navigation similar to Google Drive:
 - My Files
 - Shared
 - Trash

 Enhancements added:
 - Active route highlighting
 - Uses Next.js Link for navigation
 - Clean, reusable component
*/

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Sidebar() {
  const pathname = usePathname();

  // Helper to check active route
  const isActive = (path) => pathname === path;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
      {/* Sidebar header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          {/* App logo */}
          <Image
            src="/logo.svg"
            alt="Cloud Vault Logo"
            width={28}
            height={28}
            className="h-7 w-7"
          />

          {/* App name */}
          <h1 className="text-xl font-semibold text-slate-800">
            Cloud Vault
          </h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <Link
          href="/dashboard"
          className={`block px-4 py-2 rounded-lg transition ${
            isActive("/dashboard")
              ? "bg-blue-50 text-blue-600 font-medium"
              : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          My Files
        </Link>

        <Link
          href="/dashboard/shared"
          className={`block px-4 py-2 rounded-lg transition ${
            isActive("/dashboard/shared")
              ? "bg-blue-50 text-blue-600 font-medium"
              : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          Shared
        </Link>

        <Link
          href="/dashboard/trash"
          className={`block px-4 py-2 rounded-lg transition ${
            isActive("/dashboard/trash")
              ? "bg-blue-50 text-blue-600 font-medium"
              : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          Trash
        </Link>
      </nav>

      {/* Logout section */}
      <div className="p-4 border-t border-slate-200">
        <button className="w-full px-4 py-2 text-sm rounded-lg text-red-600 hover:bg-red-50">
          Logout
        </button>
      </div>
    </aside>
  );
}
