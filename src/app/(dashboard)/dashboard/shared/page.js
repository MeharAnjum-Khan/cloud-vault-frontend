/**
 * 📄 Shared Page
 *
 * Purpose:
 * - Displays a list of files that the user has shared via link.
 * - Uses the "FileGrid" component to reuse the existing UI style.
 */

"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import FileGrid from "../../components/filegrid";

export default function SharedPage() {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Reuse handlers (placeholders for now as we just want to view)
    const handleNavigate = () => { };
    const handleDelete = () => { };
    const handleRename = () => { };
    const handleRestore = () => { };

    useEffect(() => {
        const fetchSharedFiles = async () => {
            try {
                setLoading(true);
                // GET /api/files/shared (Endpoint we just added)
                const response = await api.get("/files/shared");
                setFiles(response.files || []);
            } catch (err) {
                console.error("Failed to fetch shared files:", err);
                setError("Failed to load shared files");
            } finally {
                setLoading(false);
            }
        };

        fetchSharedFiles();
    }, []);

    if (loading) {
        return (
            <div className="p-6">
                <p className="text-slate-500">Loading shared files...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold text-slate-800 mb-6">
                Shared by me
            </h1>

            {files.length === 0 ? (
               <div className="flex flex-col items-center justify-center mt-12 text-center">
                 <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-3xl">
                    🔗
               </div>
                  <h2 className="text-lg font-medium text-slate-700">
                     You haven&apos;t shared any files yet
                  </h2>
               </div>): (
                <FileGrid
                    files={files}
                    folders={[]} // No folders in shared view for now
                    onNavigate={handleNavigate}
                    onDelete={handleDelete}
                    onRename={handleRename}
                    onRestore={handleRestore}
                    isTrash={false}
                />
            )}
        </div>
    );
}
