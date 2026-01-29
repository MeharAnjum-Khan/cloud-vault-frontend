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
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { HardDrive, Share2, Trash2, Plus, LogOut } from "lucide-react";
import UploadModel from "./uploadmodel";
import { useState } from "react";
import { useFolder } from "../context/FolderContext";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const { currentFolderId } = useFolder() || {};

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const isActive = (path) => pathname === path;

  const navItems = [
    { name: "My Drive", path: "/dashboard", icon: HardDrive },
    { name: "Shared with me", path: "/dashboard/shared", icon: Share2 },
    { name: "Trash", path: "/dashboard/trash", icon: Trash2 },
  ];

  return (
    <>
      <aside className="w-64 bg-[#f9fbfd] border-r border-slate-200 flex flex-col h-screen sticky top-0">
        {/* Sidebar header */}
        <div className="h-16 flex items-center px-6 mb-2">
          <Link href="/dashboard" className="flex items-center gap-3">
            <Image
              src="/logo.svg"
              alt="Cloud Vault Logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <h1 className="text-xl font-medium text-slate-700">
              Cloud Vault
            </h1>
          </Link>
        </div>

        {/* New Button Area */}
        <div className="px-4 mb-6">
          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center gap-3 px-5 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 text-slate-700 font-medium group"
          >
            <Plus className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
            <span>New</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-4 px-4 py-2.5 rounded-full transition-all duration-200 ${isActive(item.path)
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "text-slate-600 hover:bg-slate-200/50"
                }`}
            >
              <item.icon className={`w-5 h-5 ${isActive(item.path) ? "text-blue-700" : "text-slate-500"}`} />
              <span className="text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Logout section */}
        <div className="p-4 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-2.5 text-sm rounded-full text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <UploadModel
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        folderId={currentFolderId}
      />
    </>
  );
}
