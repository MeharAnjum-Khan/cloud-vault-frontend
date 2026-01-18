"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";

export default function RenameModal({ isOpen, onClose, onRenamed, item }) {
    const [newName, setNewName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (item) {
            setNewName(item.name);
        }
    }, [item]);

    if (!isOpen || !item) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newName.trim() || newName === item.name) return;

        setLoading(true);
        setError(null);

        try {
            const endpoint = item.type === "folder"
                ? `/folders/${item.id}/rename`
                : `/files/${item.id}/rename`;

            await api.put(endpoint, { newName });
            onRenamed(); // Refresh list
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
                <h2 className="text-xl font-bold mb-4 dark:text-white">Rename {item.type}</h2>

                {error && (
                    <div className="bg-red-100 text-red-600 p-2 rounded mb-3 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="w-full p-2 border rounded-lg mb-4 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
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
                            disabled={loading || !newName.trim()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? "Renaming..." : "Rename"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
