// src/app/(dashboard)/components/sharemodal.js

"use client";

import { useState } from "react";
import api from "@/lib/api";

const ShareModal = ({ file, onclose }) => {
  const [permission, setpermission] = useState("view");
  const [loading, setloading] = useState(false);
  const [sharelink, setsharelink] = useState("");

  const createsharelink = async () => {
    try {
      setloading(true);

      const response = await api.post(`/files/${file.id}/share`, {
        permission
      });

      setsharelink(
        response.sharelink.replace("undefined", window.location.origin)
      );
    } catch (error) {
      alert(error.message || "failed to create share link");
    } finally {
      setloading(false);
    }
  };

  const copylink = () => {
    navigator.clipboard.writeText(sharelink);
    alert("link copied");
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Share file
        </h2>

        <p className="text-sm text-slate-500 mb-4">
          {file.name}
        </p>

        <label className="block text-sm text-slate-600 mb-2">
          Permission
        </label>

        <select
          value={permission}
          onChange={(e) => setpermission(e.target.value)}
          className="w-full border rounded p-2 mb-4"
        >
          <option value="view">View only</option>
          <option value="edit">Edit</option>
        </select>

        {!sharelink ? (
          <button
            onClick={createsharelink}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create link"}
          </button>
        ) : (
          <div className="space-y-2">
            <input
              value={sharelink}
              readOnly
              className="w-full border rounded p-2 text-sm"
            />
            <button
              onClick={copylink}
              className="w-full bg-slate-100 py-2 rounded hover:bg-slate-200"
            >
              Copy link
            </button>
          </div>
        )}

        <button
          onClick={onclose}
          className="mt-4 w-full text-slate-500 hover:text-slate-700 text-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ShareModal;
