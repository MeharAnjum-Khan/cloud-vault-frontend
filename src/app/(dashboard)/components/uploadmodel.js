// PURPOSE:
// Reusable upload modal UI (Google Drive–style)
// UI only – no backend logic yet

export default function UploadModel({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-slate-800">
            Upload files
          </h2>

          {/* Close button with red hover */}
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-full
                       text-slate-600 hover:bg-red-500 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {/* File input */}
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg p-6 cursor-pointer hover:bg-slate-50">
          <input type="file" className="hidden" multiple />
          <div className="text-3xl mb-2">📤</div>
          <p className="text-sm text-slate-600">
            Click to select files
          </p>
        </label>

        {/* Footer */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md bg-slate-200 text-slate-700 hover:bg-slate-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
