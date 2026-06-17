"use client";

import { useState } from "react";
import { useProducts, Product } from "@/context/ProductsContext";
import { RefreshCw, AlertTriangle, Package, CheckCircle, XCircle } from "lucide-react";

interface Props {
  lowStockThreshold: number;
  showToast: (msg: string, type: "success" | "error") => void;
}

export default function InventoryTab({ lowStockThreshold, showToast }: Props) {
  const { products, updateProduct, loading } = useProducts();
  const [editingStock, setEditingStock] = useState<Record<number, string>>({});
  const [saving, setSaving] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "low" | "out">("all");

  const withStock = products.map(p => ({ ...p, stock: (p as any).stock ?? 100 }));

  const filtered = withStock.filter(p => {
    if (filter === "low") return p.stock > 0 && p.stock <= lowStockThreshold;
    if (filter === "out") return p.stock === 0;
    return true;
  });

  const outOfStock = withStock.filter(p => p.stock === 0).length;
  const lowStock = withStock.filter(p => p.stock > 0 && p.stock <= lowStockThreshold).length;
  const inStock = withStock.filter(p => p.stock > lowStockThreshold).length;

  const handleStockSave = async (p: Product & { stock: number }) => {
    const val = editingStock[p.id];
    if (val === undefined) return;
    const newStock = parseInt(val);
    if (isNaN(newStock) || newStock < 0) return showToast("Enter a valid stock number.", "error");

    setSaving(p.id);
    const ok = await updateProduct(p.id, { stock: newStock } as any);
    setSaving(null);

    if (ok) {
      showToast("Stock updated!", "success");
      setEditingStock(prev => { const n = { ...prev }; delete n[p.id]; return n; });
    } else {
      showToast("Failed to update stock.", "error");
    }
  };

  const stockColor = (stock: number) => {
    if (stock === 0) return { row: "bg-red-50/40", badge: "bg-red-100 text-red-700", label: "Out of Stock" };
    if (stock <= lowStockThreshold) return { row: "bg-orange-50/40", badge: "bg-orange-100 text-orange-700", label: "Low Stock" };
    return { row: "", badge: "bg-green-100 text-green-700", label: "In Stock" };
  };

  return (
    <div className="space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "In Stock", value: inStock, icon: <CheckCircle className="w-4 h-4" />, color: "bg-green-50 text-green-600", filter: "all" as const },
          { label: "Low Stock", value: lowStock, icon: <AlertTriangle className="w-4 h-4" />, color: "bg-orange-50 text-orange-600", filter: "low" as const },
          { label: "Out of Stock", value: outOfStock, icon: <XCircle className="w-4 h-4" />, color: "bg-red-50 text-red-600", filter: "out" as const },
        ].map(s => (
          <button key={s.label} onClick={() => setFilter(filter === s.filter && s.filter !== "all" ? "all" : s.filter)} className={`bg-white border rounded-2xl p-4 flex items-center gap-3 shadow-sm cursor-pointer transition-all hover:shadow-md text-left ${filter === s.filter ? "border-[#2d6a4f]" : "border-[#e0e7e2]"}`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${s.color}`}>{s.icon}</div>
            <div>
              <p className="text-[9px] font-bold text-stone-400 uppercase tracking-wider">{s.label}</p>
              <p className="text-xl font-bold text-[#1e2521]">{s.value}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-[#e0e7e2] rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-[#e0e7e2]">
          <h2 className="text-base font-bold text-[#1e2521]">Inventory Levels</h2>
          <p className="text-xs text-[#5c6b62]">Low stock threshold: {lowStockThreshold} units. Update stock directly from the table.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#f1f5f2] border-b border-[#e0e7e2]">
                {["Product", "Category", "Price", "Current Stock", "Update Stock", "Status"].map(h => (
                  <th key={h} className="p-4 text-[10px] font-bold text-[#5c6b62] tracking-widest uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0e7e2]">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-12">
                  <div className="flex items-center justify-center gap-2 text-[#5c6b62]"><RefreshCw className="w-4 h-4 animate-spin" /> Loading...</div>
                </td></tr>
              ) : filtered.map(p => {
                const sc = stockColor(p.stock);
                const editing = editingStock[p.id] !== undefined;
                return (
                  <tr key={p.id} className={`hover:bg-[#fcfcfb] transition-colors ${sc.row}`}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-9 h-9 rounded-lg object-cover border border-[#e0e7e2]" />
                        <p className="font-semibold text-sm text-[#1e2521] line-clamp-1 max-w-[180px]">{p.name}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e8f5e9] text-[#2d6a4f]">{p.category}</span>
                    </td>
                    <td className="p-4 font-bold text-sm text-[#2d6a4f]">₹{p.price.toFixed(2)}</td>
                    <td className="p-4 font-bold text-sm text-[#1e2521]">{p.stock}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="number" min="0"
                          value={editing ? editingStock[p.id] : p.stock}
                          onChange={e => setEditingStock(prev => ({ ...prev, [p.id]: e.target.value }))}
                          className="w-20 border border-[#e0e7e2] rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-[#2d6a4f]"
                        />
                        {editing && (
                          <button
                            onClick={() => handleStockSave(p)}
                            disabled={saving === p.id}
                            className="px-3 py-1.5 rounded-lg bg-[#2d6a4f] text-white text-[10px] font-bold uppercase cursor-pointer disabled:opacity-50"
                          >
                            {saving === p.id ? "..." : "Save"}
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${sc.badge}`}>{sc.label}</span>
                    </td>
                  </tr>
                );
              })}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-[#5c6b62] text-sm">No products match this filter.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
