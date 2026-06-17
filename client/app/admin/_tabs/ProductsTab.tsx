"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, RefreshCw, Package } from "lucide-react";
import { useProducts, Product } from "@/context/ProductsContext";
import ImageUploader from "./ImageUploader";

interface Category { id: number; name: string; }
interface Props {
  categories: Category[];
  showToast: (msg: string, type: "success" | "error") => void;
}

export default function ProductsTab({ categories, showToast }: Props) {
  const { products, addProduct, updateProduct, deleteProduct, loading } = useProducts();
  const [view, setView] = useState<"list" | "form">("list");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "", price: "", originalPrice: "", category: "Body Care",
    image: "", images: [] as string[], description: "", stock: "100",
    mfgDate: "", expiryDate: ""
  });

  const catOptions = ["All", ...categories.map(c => c.name)];
  const avgPrice = products.length > 0 ? products.reduce((s, p) => s + p.price, 0) / products.length : 0;

  const filtered = products.filter(p => {
    const matchCat = filterCat === "All" || p.category === filterCat;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const resetForm = () => {
    setEditingId(null);
    setForm({
      name: "", price: "", originalPrice: "", category: "Body Care",
      image: "", images: [], description: "", stock: "100",
      mfgDate: "", expiryDate: ""
    });
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      name: p.name, price: p.price.toString(), originalPrice: p.originalPrice?.toString() ?? "",
      category: p.category, image: p.image, images: p.images || [], description: p.description,
      stock: (p as any).stock?.toString() ?? "100",
      mfgDate: p.mfgDate || "",
      expiryDate: p.expiryDate || ""
    });
    setView("form");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this product permanently?")) return;
    const ok = await deleteProduct(id);
    showToast(ok ? "Product deleted." : "Failed to delete.", ok ? "success" : "error");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return showToast("Product name is required.", "error");
    if (!form.price || parseFloat(form.price) <= 0) return showToast("Enter a valid price.", "error");
    if (!form.image.trim()) return showToast("Image URL or upload is required.", "error");
    if (!form.description.trim()) return showToast("Description is required.", "error");

    setSubmitting(true);
    const payload = {
      name: form.name, price: parseFloat(form.price),
      originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
      category: form.category, image: form.image, images: form.images, description: form.description,
      stock: parseInt(form.stock) || 100,
      mfgDate: form.mfgDate || undefined,
      expiryDate: form.expiryDate || undefined
    };
    const result = editingId !== null ? await updateProduct(editingId, payload) : await addProduct(payload);
    setSubmitting(false);

    if (result) {
      showToast(editingId !== null ? "Product updated!" : "Product added!", "success");
      resetForm(); setView("list");
    } else {
      showToast("Failed to save product.", "error");
    }
  };

  if (view === "form") {
    return (
      <div className="bg-white border border-[#e0e7e2] rounded-2xl p-6 shadow-sm max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-bold text-[#1e2521]">{editingId !== null ? "Edit Product" : "Add New Product"}</h2>
          <button onClick={() => { resetForm(); setView("list"); }} className="text-xs font-bold text-[#5c6b62] hover:text-[#2d6a4f] uppercase tracking-wider cursor-pointer">← Back</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="text-[10px] font-bold text-[#1e2521] tracking-widest uppercase block mb-1.5">Product Name *</label>
              <input type="text" placeholder="e.g. Activated Charcoal Detox Bar" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full rounded-xl border border-[#e0e7e2] px-4 py-2.5 text-sm focus:outline-none focus:border-[#2d6a4f]" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#1e2521] tracking-widest uppercase block mb-1.5">Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full rounded-xl border border-[#e0e7e2] px-4 py-2.5 text-sm focus:outline-none focus:border-[#2d6a4f] bg-white">
                {categories.map(c => <option key={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#1e2521] tracking-widest uppercase block mb-1.5">Stock Quantity</label>
              <input type="number" min="0" placeholder="100" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} className="w-full rounded-xl border border-[#e0e7e2] px-4 py-2.5 text-sm focus:outline-none focus:border-[#2d6a4f]" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#1e2521] tracking-widest uppercase block mb-1.5">Sale Price (₹) *</label>
              <input type="number" step="0.01" min="0" placeholder="12.00" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="w-full rounded-xl border border-[#e0e7e2] px-4 py-2.5 text-sm focus:outline-none focus:border-[#2d6a4f]" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#1e2521] tracking-widest uppercase block mb-1.5">Original Price (₹ optional)</label>
              <input type="number" step="0.01" min="0" placeholder="16.00" value={form.originalPrice} onChange={e => setForm(f => ({ ...f, originalPrice: e.target.value }))} className="w-full rounded-xl border border-[#e0e7e2] px-4 py-2.5 text-sm focus:outline-none focus:border-[#2d6a4f]" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <ImageUploader value={form.image} onChange={url => setForm(f => ({ ...f, image: url }))} label="Product Primary Image *" />
            
            {/* Additional Images Section */}
            <div className="border border-[#e0e7e2] rounded-xl p-4 bg-stone-50/30">
              <label className="text-[10px] font-bold text-[#1e2521] tracking-widest uppercase block mb-3">Additional Images (Product Gallery)</label>
              
              {/* List of uploaded additional images */}
              {form.images.length > 0 && (
                <div className="flex flex-wrap gap-2.5 mb-4">
                  {form.images.map((imgUrl, index) => (
                    <div key={index} className="relative w-14 h-14 rounded-xl border border-[#e0e7e2] bg-white overflow-hidden group">
                      <img src={imgUrl} alt={`gallery-${index}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== index) }))}
                        className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[9px] font-bold uppercase cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add new image helper */}
              <ImageUploader 
                value="" 
                onChange={url => {
                  if (url && !form.images.includes(url)) {
                    setForm(f => ({ ...f, images: [...f.images, url] }));
                  }
                }} 
                label="Upload/Add Image to Gallery" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-[10px] font-bold text-[#1e2521] tracking-widest uppercase block mb-1.5">Manufacturing Date (Mfg)</label>
              <input type="text" placeholder="e.g. Oct 2025" value={form.mfgDate} onChange={e => setForm(f => ({ ...f, mfgDate: e.target.value }))} className="w-full rounded-xl border border-[#e0e7e2] px-4 py-2.5 text-sm focus:outline-none focus:border-[#2d6a4f]" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#1e2521] tracking-widest uppercase block mb-1.5">Expiry Date</label>
              <input type="text" placeholder="e.g. Oct 2027" value={form.expiryDate} onChange={e => setForm(f => ({ ...f, expiryDate: e.target.value }))} className="w-full rounded-xl border border-[#e0e7e2] px-4 py-2.5 text-sm focus:outline-none focus:border-[#2d6a4f]" />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#1e2521] tracking-widest uppercase block mb-1.5">Description *</label>
            <textarea rows={4} placeholder="Describe ingredients, benefits, and skin applications..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full rounded-xl border border-[#e0e7e2] px-4 py-2.5 text-sm focus:outline-none focus:border-[#2d6a4f] resize-none" />
          </div>

          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={submitting} className="px-8 py-2.5 rounded-full bg-[#2d6a4f] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2d6a4f]/90 disabled:opacity-50 cursor-pointer transition-colors">
              {submitting ? "Saving..." : editingId !== null ? "Save Changes" : "Create Product"}
            </button>
            <button type="button" onClick={() => { resetForm(); setView("list"); }} className="px-8 py-2.5 rounded-full bg-white border border-[#e0e7e2] text-[#5c6b62] text-xs font-bold uppercase tracking-wider hover:bg-[#f1f5f2] cursor-pointer transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#e0e7e2] rounded-2xl overflow-hidden shadow-sm">
      <div className="p-5 border-b border-[#e0e7e2] flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <h2 className="text-base font-bold text-[#1e2521]">Product Catalog</h2>
          <p className="text-xs text-[#5c6b62]">{products.length} products · Avg. ₹{avgPrice.toFixed(2)}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="border border-[#e0e7e2] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#2d6a4f] w-44" />
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="border border-[#e0e7e2] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#2d6a4f] bg-white">
            {catOptions.map(c => <option key={c}>{c}</option>)}
          </select>
          <button onClick={() => { resetForm(); setView("form"); }} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2d6a4f] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2d6a4f]/90 cursor-pointer transition-colors shrink-0">
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#f1f5f2] border-b border-[#e0e7e2]">
              {["Product", "Category", "Price", "Stock", "Actions"].map(h => (
                <th key={h} className="p-4 text-[10px] font-bold text-[#5c6b62] tracking-widest uppercase whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e0e7e2]">
            {loading ? (
              <tr><td colSpan={5} className="text-center py-12 text-[#5c6b62] text-sm">
                <div className="flex items-center justify-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" /> Loading...</div>
              </td></tr>
            ) : filtered.length > 0 ? filtered.map(p => {
              const stock = (p as any).stock ?? 100;
              const stockColor = stock === 0 ? "text-red-600 bg-red-50" : stock < 10 ? "text-orange-600 bg-orange-50" : "text-green-700 bg-green-50";
              return (
                <tr key={p.id} className="hover:bg-[#fcfcfb] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg border border-[#e0e7e2] bg-white overflow-hidden flex items-center justify-center shrink-0">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-[#1e2521] line-clamp-1">{p.name}</p>
                        <p className="text-[10px] text-[#5c6b62] line-clamp-1">{p.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#e8f5e9] text-[#2d6a4f] uppercase tracking-wider">{p.category}</span>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-sm text-[#2d6a4f]">₹{p.price.toFixed(2)}</p>
                    {p.originalPrice && <p className="text-[10px] text-stone-400 line-through">₹{p.originalPrice.toFixed(2)}</p>}
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stockColor}`}>
                      {stock === 0 ? "Out of Stock" : stock < 10 ? `Low: ${stock}` : stock}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => startEdit(p)} className="p-1.5 text-[#5c6b62] hover:text-[#2d6a4f] hover:bg-[#e8f5e9] rounded-lg cursor-pointer"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 text-[#5c6b62] hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              );
            }) : (
              <tr><td colSpan={5} className="text-center py-12 text-[#5c6b62] text-sm">No products found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
