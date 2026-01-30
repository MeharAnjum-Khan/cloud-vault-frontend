"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/api";
import {
    CloudUpload,
    CheckCircle2,
    AlertCircle,
    Loader2,
    X
} from "lucide-react";

const UploadContext = createContext(null);

export const useUpload = () => {
    const context = useContext(UploadContext);
    if (!context) throw new Error("useUpload must be used within an UploadProvider");
    return context;
};

export const UploadProvider = ({ children }) => {
    const [uploadQueue, setUploadQueue] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // 🔹 Handle File Upload Logic (Centralized)
    const uploadFiles = async (files, folderId = null) => {
        const newUploads = Array.from(files).map(file => ({
            name: file.name,
            progress: 0,
            status: 'uploading'
        }));

        setUploadQueue(prev => [...prev, ...newUploads]);

        for (const file of files) {
            const formData = new FormData();
            formData.append("file", file);
            if (folderId) formData.append("folder_id", folderId);

            try {
                await api.post("/files/upload", formData, {
                    onUploadProgress: (progressEvent) => {
                        if (progressEvent.total) {
                            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            setUploadQueue(prev => prev.map(item =>
                                item.name === file.name ? { ...item, progress: percent } : item
                            ));
                        }
                    }
                });

                // Mark as success
                setUploadQueue(prev => prev.map(item =>
                    item.name === file.name ? { ...item, status: 'success', progress: 100 } : item
                ));

                // Remove after 3 seconds
                setTimeout(() => {
                    setUploadQueue(prev => prev.filter(item => item.name !== file.name));
                }, 3000);

                // Trigger refresh in FileList
                setRefreshTrigger(prev => prev + 1);

            } catch (error) {
                console.error("Upload failed:", error);
                setUploadQueue(prev => prev.map(item =>
                    item.name === file.name ? { ...item, status: 'error' } : item
                ));
                // Remove error after 5 seconds
                setTimeout(() => {
                    setUploadQueue(prev => prev.filter(item => item.name !== file.name));
                }, 5000);
            }
        }
    };

    // 🔹 Global Drag-and-Drop Listeners
    useEffect(() => {
        const handleDragOver = (e) => {
            e.preventDefault();
            setIsDragging(true);
        };

        const handleDrop = (e) => {
            e.preventDefault();
            setIsDragging(false);
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                uploadFiles(files);
            }
        };

        const handleDragLeave = (e) => {
            if (e.clientY <= 0 || e.clientX <= 0 || e.clientX >= window.innerWidth || e.clientY >= window.innerHeight) {
                setIsDragging(false);
            }
        };

        window.addEventListener("dragover", handleDragOver);
        window.addEventListener("drop", handleDrop);
        window.addEventListener("dragleave", handleDragLeave);

        return () => {
            window.removeEventListener("dragover", handleDragOver);
            window.removeEventListener("drop", handleDrop);
            window.removeEventListener("dragleave", handleDragLeave);
        };
    }, []);

    return (
        <UploadContext.Provider value={{ uploadFiles, refreshTrigger }}>
            {children}

            {/* 🔹 Drag Overlay */}
            {isDragging && (
                <div className="fixed inset-0 bg-indigo-600/10 backdrop-blur-md border-[6px] border-dashed border-indigo-500/50 z-[999] flex items-center justify-center pointer-events-none transition-all duration-300">
                    <div className="bg-white p-12 rounded-3xl shadow-2xl text-center scale-110 animate-in zoom-in-95 duration-300 flex flex-col items-center">
                        <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-6">
                            <CloudUpload size={48} className="animate-bounce" />
                        </div>
                        <p className="text-indigo-600 font-bold text-3xl mb-2">Drop to Upload</p>
                        <p className="text-slate-500 font-medium">Release files to start the transfer</p>
                    </div>
                </div>
            )}

            {/* 🔹 Progress Toast */}
            {uploadQueue.length > 0 && (
                <div className="fixed bottom-6 right-6 bg-white shadow-2xl rounded-2xl w-80 z-[1000] border border-slate-200 overflow-hidden animate-in slide-in-from-right duration-500">
                    <div className="bg-white border-b border-slate-100 px-5 py-4 flex justify-between items-center">
                        <h4 className="font-semibold text-sm flex items-center gap-2 text-slate-700">
                            {uploadQueue.some(i => i.status === 'uploading') ? (
                                <Loader2 size={16} className="animate-spin text-indigo-500" />
                            ) : (
                                <CheckCircle2 size={16} className="text-green-500" />
                            )}
                            Upload Progress
                        </h4>
                        <button
                            onClick={() => setUploadQueue([])}
                            className="p-1 hover:bg-slate-50 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                        >
                            <X size={14} />
                        </button>
                    </div>
                    <div className="max-h-72 overflow-y-auto p-4 bg-slate-50/50">
                        {uploadQueue.map((item, idx) => (
                            <div key={idx} className="mb-4 last:mb-0 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="truncate w-44 text-slate-700 text-xs font-semibold" title={item.name}>
                                        {item.name}
                                    </span>
                                    {item.status === 'success' ? (
                                        <CheckCircle2 size={14} className="text-green-500" />
                                    ) : item.status === 'error' ? (
                                        <AlertCircle size={14} className="text-red-500" />
                                    ) : (
                                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                                            {item.progress}%
                                        </span>
                                    )}
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-300 ${item.status === 'error' ? 'bg-red-500' :
                                            item.status === 'success' ? 'bg-green-500' : 'bg-indigo-600'
                                            }`}
                                        style={{ width: `${item.progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </UploadContext.Provider>
    );
};
