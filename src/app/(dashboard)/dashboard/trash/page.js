"use client";

import FileList from "../../components/filelist";

export default function TrashPage() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold text-slate-800 mb-6">
                Trash (Deleted Items)
            </h1>

            {/* List files with trash=true (isTrash prop) */}
            <FileList isTrash={true} />
        </div>
    );
}
