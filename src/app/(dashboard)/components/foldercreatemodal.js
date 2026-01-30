"use client";
import { useState } from "react";
import api from "@/lib/api";

export default function FolderCreateModal({ isOpen, onClose, onFolderCreated, parentId }) {
    const [folderName, setFolderName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!folderName.trim()) return;

        setLoading(true);
        setError(null);

        try {
            await api.post("/folders", {
                name: folderName,
                parent_id: parentId || null
            });
            setFolderName("");
            onFolderCreated(); // Refresh list
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[200] p-4 animate-in fade-in duration-300">
            <div className="bg-white p-8 rounded-3xl w-full max-w-sm shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
                <h2 className="text-2xl font-bold mb-6 text-slate-800">New Folder</h2>

                {error && (
                    <div className="bg-red-100 text-red-600 p-2 rounded mb-3 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="relative mb-8">
                        <input
                            type="text"
                            placeholder="Folder Name"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 placeholder:text-slate-400"
                            value={folderName}
                            onChange={(e) => setFolderName(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 text-slate-500 font-medium hover:bg-slate-50 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !folderName.trim()}
                            className="px-8 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 disabled:opacity-50 shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
                        >
                            {loading ? "Creating..." : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
