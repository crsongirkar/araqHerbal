"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, RefreshCw, FolderOpen, X } from "lucide-react";

interface Category { id: number; name: string; slug: string; description: string; productCount?: number; }

interface Props {
  categories: Category[];
  loading: boolean;
  onRefresh: () => void;
  showToast: (msg: string, type: "success" | "error") => void;
}

export default function CategoriesTab({ categories, loading, onRefresh, showToast }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editCat, setEditCat] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", description: "" });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  const openAdd = () => { setForm({ name: "", description: "" }); setEditCat(null); setShowForm(true); };
  const openEdit = (c: Category) => { setForm({ name: c.name, description: c.description }); setEditCat(c); setShowForm(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return showToast("Category name is required.", "error");
    setSaving(true);
    try {
      const method = editCat ? "PUT" : "POST";
      const body = editCat ? { id: editCat.id, ...form } : form;
      const res = await fetch("/api/categories", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      showToast(editCat ? "Category updated!" : "Category added!", "success");
      setShowForm(false);
      onRefresh();
    } catch (err: any) {
      showToast(err.message || "Failed to save.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (c: Category) => {
    if ((c.productCount ?? 0) > 0) {
      return showToast(`Cannot delete "${c.name}" — it has ${c.productCount} products. Reassign them first.`, "error");
    }
    if (!confirm(`Delete category "${c.name}"?`)) return;
    setDeleting(c.id);
    try {
      const res = await fetch(`/api/categories?id=${c.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      showToast("Category deleted.", "success");
      onRefresh();
    } catch {
      showToast("Failed to delete.", "error");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <>
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-[#e0e7e2] flex items-center justify-between">
              <h3 className="text-base font-bold text-[#1e2521]">{editCat ? "Edit Category" : "Add Category"}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-xl hover:bg-[#f1f5f2] cursor-pointer"><X className="w-4 h-4 text-[#5c6b62]" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-[#1e2521] tracking-widest uppercase block mb-1.5">Category Name *</label>
                <input type="text" placeholder="e.g. Gift Sets" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full rounded-xl border border-[#e0e7e2] px-4 py-2.5 text-sm focus:outline-none focus:border-[#2d6a4f]" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#1e2521] tracking-widest uppercase block mb-1.5">Description</label>
                <textarea rows={3} placeholder="Brief description of this category..." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="w-full rounded-xl border border-[#e0e7e2] px-4 py-2.5 text-sm focus:outline-none focus:border-[#2d6a4f] resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-full bg-[#2d6a4f] text-white text-xs font-bold uppercase tracking-wider disabled:opacity-50 cursor-pointer">{saving ? "Saving..." : editCat ? "Update" : "Add Category"}</button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-full border border-[#e0e7e2] text-[#5c6b62] text-xs font-bold uppercase tracking-wider cursor-pointer">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white border border-[#e0e7e2] rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-[#e0e7e2] flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#1e2521]">Product Categories</h2>
            <p className="text-xs text-[#5c6b62]">{categories.length} categories · Used as product filters in the storefront</p>
          </div>
          <button onClick={openAdd} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2d6a4f] text-white text-xs font-bold uppercase tracking-wider cursor-pointer">
            <Plus className="w-3.5 h-3.5" /> Add Category
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 gap-2 text-[#5c6b62]">
            <RefreshCw className="w-4 h-4 animate-spin" /><span className="text-sm">Loading...</span>
          </div>
        ) : (
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(c => (
              <div key={c.id} className="border border-[#e0e7e2] rounded-2xl p-5 hover:border-[#2d6a4f] transition-colors group">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#e8f5e9] flex items-center justify-center">
                    <FolderOpen className="w-5 h-5 text-[#2d6a4f]" />
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(c)} className="p-1.5 text-[#5c6b62] hover:text-[#2d6a4f] hover:bg-[#e8f5e9] rounded-lg cursor-pointer"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(c)} disabled={deleting === c.id} className="p-1.5 text-[#5c6b62] hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer disabled:opacity-50"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                <h3 className="font-bold text-[#1e2521] mb-0.5">{c.name}</h3>
                <p className="text-xs text-[#5c6b62] line-clamp-2 mb-3">{c.description || "No description"}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e8f5e9] text-[#2d6a4f]">{c.productCount ?? 0} products</span>
                  <span className="text-[10px] text-stone-400 font-mono">/{c.slug}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
