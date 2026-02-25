"use client";

import { useState } from "react";
import { X, Save } from "lucide-react";

export default function EditNormalChall({ challenge, onClose, onUpdated }) {
  const [formData, setFormData] = useState(challenge);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /* ---------- handlers ---------- */

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/admin/challenges/upload", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setFormData((prev) => ({ ...prev, file_url: data.url }));
    } catch (err) {
      alert(err.message || "File upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`/api/admin/challenges/${challenge._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      onUpdated?.(data.updatedChallenge);
      onClose();
    } catch (err) {
      alert(err.message || "Failed to update challenge");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-6 py-3 border-b border-neutral-800 shrink-0">
          <h2 className="text-base font-bold text-white">Edit Challenge</h2>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
              {/* Left Column: Metadata */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                      Name
                    </label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                      Author
                    </label>
                    <input
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 relative">
                    <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                      Category
                    </label>
                    <div className="relative">
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-colors appearance-none cursor-pointer"
                      >
                        {[
                          "web",
                          "OSINT",
                          "pwn",
                          "crypto",
                          "forensics",
                          "reverse",
                          "misc",
                        ].map((c) => (
                          <option key={c} value={c} className="bg-neutral-900">
                            {c}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-neutral-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                      Points
                    </label>
                    <input
                      type="number"
                      name="value"
                      value={formData.value}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Flag
                  </label>
                  <input
                    name="flag"
                    value={formData.flag}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-colors font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Upload File (Optional)
                  </label>

                  {formData.file_url && (
                    <div className="mb-4 p-3 bg-black/20 border border-neutral-800 rounded-lg text-xs break-all">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <span className="text-neutral-500 font-mono">Current File:</span>
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, file_url: "" }))}
                          className="text-red-400 hover:text-red-300 font-medium hover:underline"
                        >
                          Remove File
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                         <a
                          href={formData.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 hover:text-emerald-300 hover:underline truncate block"
                        >
                          {formData.file_url}
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4 items-center">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="block w-full text-sm text-neutral-400
                        file:mr-4 file:py-2.5 file:px-4
                        file:rounded-lg file:border-0
                        file:text-sm file:font-semibold
                        file:bg-neutral-800 file:text-neutral-300
                        hover:file:bg-neutral-700 transition-colors
                        cursor-pointer"
                    />
                    {uploading && (
                      <span className="text-xs text-blue-400 font-medium animate-pulse">
                        Uploading...
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-neutral-800/50 rounded-lg border border-neutral-800">
                  <input
                    type="checkbox"
                    name="visible"
                    checked={formData.visible}
                    onChange={handleInputChange}
                    id="visible-check-edit"
                    className="w-5 h-5 rounded bg-neutral-800 border-neutral-600 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-neutral-900"
                  />
                  <label htmlFor="visible-check-edit" className="text-sm font-medium text-white cursor-pointer select-none">
                    Make visible to participants immediately
                  </label>
                </div>
              </div>

              {/* Right Column: Description */}
              <div className="flex flex-col space-y-2 h-full">
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  Description (Markdown)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="flex-1 w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-colors resize-none font-mono min-h-[300px]"
                />
              </div>
            </div>
          </div>

          <div className="px-6 py-3 border-t border-neutral-800 bg-neutral-900 shrink-0 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-neutral-400 hover:text-white text-sm font-medium transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-500 text-sm font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              {submitting ? (
                <>Updating...</>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}