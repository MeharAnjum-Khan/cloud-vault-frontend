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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-96 shadow-2xl">
                <h2 className="text-xl font-bold mb-4 dark:text-white">New Folder</h2>

                {error && (
                    <div className="bg-red-100 text-red-600 p-2 rounded mb-3 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Folder Name"
                        className="w-full p-2 border rounded-lg mb-4 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={folderName}
                        onChange={(e) => setFolderName(e.target.value)}
                        autoFocus
                    />

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !folderName.trim()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? "Creating..." : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
