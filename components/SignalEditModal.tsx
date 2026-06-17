"use client";

import { useState, useEffect } from "react";
import { Signal } from "@/types";
type SignalCategory = string;
type SignalStrength = "weak" | "emerging" | "strong";
import { X } from "lucide-react";

const CATEGORIES: SignalCategory[] = [
  "ai", "vr-ar", "wearables", "biotech", "3d-printing",
  "robotics", "materials", "spatial-computing", "neurotech", "other",
];

const STRENGTHS: SignalStrength[] = ["weak", "emerging", "strong"];

interface Props {
  signal: Signal | null;
  onSave: (signal: Signal) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export function SignalEditModal({ signal, onSave, onDelete, onClose }: Props) {
  const [form, setForm] = useState<Signal | null>(null);

  useEffect(() => {
    setForm(signal);
  }, [signal]);

  if (!form) return null;

  const set = (key: keyof Signal, value: unknown) =>
    setForm((f) => f ? { ...f, [key]: value } : f);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-bold text-gray-900">
            {form.manual ? "Edit Signal" : "Signal Detail"}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Title</label>
            <input
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</label>
              <select
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={form.category}
                onChange={(e) => set("category", e.target.value as SignalCategory)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c.replace("-", " ")}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Strength</label>
              <select
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={form.strength}
                onChange={(e) => set("strength", e.target.value as SignalStrength)}
              >
                {STRENGTHS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Summary</label>
            <textarea
              rows={3}
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              value={form.summary}
              onChange={(e) => set("summary", e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Why it&apos;s emerging</label>
            <textarea
              rows={2}
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              value={form.why_emerging}
              onChange={(e) => set("why_emerging", e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Brand relevance</label>
            <textarea
              rows={2}
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              value={form.brand_relevance}
              onChange={(e) => set("brand_relevance", e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tags (comma separated)</label>
            <input
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={(form.tags ?? []).join(", ")}
              onChange={(e) => set("tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-6 border-t bg-gray-50 rounded-b-2xl">
          <button
            onClick={() => { onDelete(form.id); onClose(); }}
            className="text-sm text-red-500 hover:text-red-700 font-medium"
          >
            Delete signal
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={() => { onSave(form); onClose(); }}
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
            >
              Save signal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
