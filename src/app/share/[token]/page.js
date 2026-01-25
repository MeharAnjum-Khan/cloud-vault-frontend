// src/app/share/[token]/page.js
// This page handles PUBLIC shared links like:
// http://localhost:3000/share/<token>

"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useParams } from "next/navigation";


const SharePage = ({ params }) => {
  // `token` comes from the dynamic route folder [token]
  // Example URL: /share/abc123 → token = "abc123"
  const { token } = useParams();


  // UI states
  const [loading, setloading] = useState(true);
  const [error, seterror] = useState("");
  const [file, setfile] = useState(null);
  const [signedurl, setsignedurl] = useState("");
  const [permission, setpermission] = useState("view"); // add state for view

  // Fetch shared file info when page loads
  useEffect(() => {
    const fetchsharedfile = async () => {
      try {
        // Call BACKEND public API using the share token
        // This route does NOT require authentication
        const response = await api.get(`/files/share/${token}`);

        // Backend returns:
        // - file info
        // - signed URL for download/view
        setfile(response.file);
        setsignedurl(response.downloadUrl); // ✅ FIX: Use correct key from backend
        setpermission(response.permission); // updated API response handling
      } catch (err) {
        // Handles invalid / expired token
        seterror(
          err.message || "invalid or expired share link"
        );
      } finally {
        setloading(false);
      }
    };

    fetchsharedfile();
  }, [token]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-500">Loading shared file...</p>
      </div>
    );
  }

  // Error state (invalid / expired link)
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-slate-700 mb-2">
            Link error
          </h2>
          <p className="text-slate-500">{error}</p>
        </div>
      </div>
    );
  }

  // Success state (valid share link)
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-6 rounded-lg shadow-sm w-full max-w-md text-center">
        <div className="text-4xl mb-4">📄</div>

        {/* File name */}
        <h1 className="text-lg font-semibold text-slate-800 mb-1">
          {file.name}
        </h1>

        {/* File type */}
        <p className="text-sm text-slate-500 mb-4">
          {file.type}
        </p>

        {/* Permission indicator (READ-ONLY UI logic) */}
        {permission === "view" && (
          <p className="text-xs text-slate-500 mb-4">
            View-only access
          </p>
        )}

        {permission === "edit" && (
          <p className="text-xs text-green-600 mb-4">
            Edit access granted
          </p>
        )}

        {/* Secure signed download/view link */}
        <a
          href={signedurl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Download / View file
        </a>
      </div>
    </div>
  );
};

export default SharePage;
