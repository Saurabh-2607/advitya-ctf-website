"use client";

import { useState } from "react";
import { X, Save } from "lucide-react";

const initialForm = {
  name: "",
  author: "",
  description: "",
  category: "web",
  value: "",
};

export default function NewInstanceChall({ onClose, onCreated }) {
  const [formData, setFormData] = useState(initialForm);
  const [bundle, setBundle] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBundleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBundle(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bundle) {
      alert("ZIP bundle is required");
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      const fd = new FormData();
      fd.append("bundle", bundle);
      fd.append("metadata", JSON.stringify(formData));

      const res = await fetch("/api/admin/challenges/instance", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: fd,
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Upload failed");
      }

      onCreated();
      onClose();
    } catch (err) {
      alert(err.message || "Failed to upload instance challenge");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-neutral-800">
          <h2 className="text-xl font-bold text-white">
            Add Instance Challenge
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Name
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Challenge name"
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
                required
                placeholder="Author"
                className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-colors appearance-none"
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
                required
                min="1"
                placeholder="e.g. 100"
                className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Description (Markdown)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="6"
              placeholder="Write your challenge description here..."
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-colors resize-y font-mono"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Challenge Bundle (ZIP)
            </label>
            <div className="relative">
              <input
                type="file"
                accept=".zip"
                onChange={handleBundleChange}
                className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-neutral-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-neutral-700 file:text-white hover:file:bg-neutral-600 transition-colors"
              />
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Must contain a Dockerfile at root
            </p>
          </div>

          <div className="pt-4 border-t border-neutral-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2 bg-white text-black hover:bg-neutral-200 disabled:bg-neutral-600 disabled:cursor-not-allowed text-sm font-semibold rounded-lg transition-colors"
            >
              {submitting ? (
                "Uploading..."
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Create Instance Challenge
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
