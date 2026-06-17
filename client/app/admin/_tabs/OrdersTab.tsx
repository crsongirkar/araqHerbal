"use client";

import { useState } from "react";
import { Search, RefreshCw, ChevronDown, X, Eye } from "lucide-react";

interface OrderItem { id: number; name: string; price: number; quantity: number; }
interface Order {
  id: number; customerName: string; customerEmail: string;
  items: OrderItem[]; subtotal: number; shipping: number; tax: number;
  total: number; date: string; status: string;
}

const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  Shipped: "bg-blue-50 text-blue-700 border-blue-200",
  Delivered: "bg-green-50 text-green-700 border-green-200",
  Cancelled: "bg-red-50 text-red-700 border-red-200",
};

interface Props {
  orders: Order[];
  loading: boolean;
  onStatusUpdate: (id: number, status: string) => void;
}

export default function OrdersTab({ orders, loading, onStatusUpdate }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);

  const filtered = orders.filter(o => {
    const matchSearch = o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toString().includes(search);
    const matchStatus = statusFilter === "All" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);

  return (
    <>
      {/* Order Detail Modal */}
      {detailOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#e0e7e2] flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-[#2d6a4f] uppercase tracking-widest">Order Details</p>
                <h3 className="text-lg font-bold text-[#1e2521]">Order #{detailOrder.id}</h3>
              </div>
              <button onClick={() => setDetailOrder(null)} className="p-2 rounded-xl hover:bg-[#f1f5f2] cursor-pointer"><X className="w-4 h-4 text-[#5c6b62]" /></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[10px] font-bold text-[#5c6b62] uppercase tracking-wider mb-0.5">Customer</p>
                  <p className="font-semibold text-[#1e2521]">{detailOrder.customerName}</p>
                  <p className="text-xs text-[#5c6b62]">{detailOrder.customerEmail}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#5c6b62] uppercase tracking-wider mb-0.5">Date</p>
                  <p className="font-semibold text-[#1e2521]">{detailOrder.date}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-[#5c6b62] uppercase tracking-wider mb-2">Items Ordered</p>
                <div className="space-y-2">
                  {detailOrder.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-[#f9fafb] rounded-xl">
                      <div>
                        <p className="text-sm font-semibold text-[#1e2521]">{item.name}</p>
                        <p className="text-xs text-[#5c6b62]">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-sm text-[#2d6a4f]">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-[#e0e7e2] pt-4 space-y-1.5">
                {[
                  { label: "Subtotal", value: detailOrder.subtotal },
                  { label: "Shipping", value: detailOrder.shipping },
                  { label: "Tax", value: detailOrder.tax },
                ].map(r => (
                  <div key={r.label} className="flex justify-between text-sm">
                    <span className="text-[#5c6b62]">{r.label}</span>
                    <span className="text-[#1e2521]">₹{r.value?.toFixed(2) ?? "0.00"}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-base border-t border-[#e0e7e2] pt-2 mt-2">
                  <span>Total</span>
                  <span className="text-[#2d6a4f]">₹{detailOrder.total.toFixed(2)}</span>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-[#5c6b62] uppercase tracking-wider mb-2">Update Status</p>
                <select
                  value={detailOrder.status}
                  onChange={e => {
                    onStatusUpdate(detailOrder.id, e.target.value);
                    setDetailOrder(prev => prev ? { ...prev, status: e.target.value } : null);
                  }}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-[#2d6a4f] ${STATUS_COLORS[detailOrder.status] || "border-[#e0e7e2]"}`}
                >
                  {["Pending", "Shipped", "Delivered", "Cancelled"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-[#e0e7e2] rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-[#e0e7e2] flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <h2 className="text-base font-bold text-[#1e2521]">Customer Orders</h2>
            <p className="text-xs text-[#5c6b62]">{orders.length} orders · Revenue: ₹{totalRevenue.toFixed(2)}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
              <input type="text" placeholder="Search orders..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 pr-4 py-2 border border-[#e0e7e2] rounded-xl text-xs focus:outline-none focus:border-[#2d6a4f] w-44" />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-[#e0e7e2] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#2d6a4f] bg-white">
              {["All", "Pending", "Shipped", "Delivered", "Cancelled"].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#f1f5f2] border-b border-[#e0e7e2]">
                {["Order", "Customer", "Items", "Total", "Date", "Status", ""].map(h => (
                  <th key={h} className="p-4 text-[10px] font-bold text-[#5c6b62] tracking-widest uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0e7e2]">
              {loading ? (
                <tr><td colSpan={7} className="text-center py-12">
                  <div className="flex items-center justify-center gap-2 text-[#5c6b62]"><RefreshCw className="w-4 h-4 animate-spin" /> Loading...</div>
                </td></tr>
              ) : filtered.map(o => (
                <tr key={o.id} className="hover:bg-[#fcfcfb] transition-colors">
                  <td className="p-4 font-mono text-xs font-bold text-[#2d6a4f]">#{o.id}</td>
                  <td className="p-4">
                    <p className="font-semibold text-sm text-[#1e2521]">{o.customerName}</p>
                    <p className="text-[10px] text-[#5c6b62]">{o.customerEmail}</p>
                  </td>
                  <td className="p-4 text-xs text-[#5c6b62]">{o.items.length} item{o.items.length !== 1 ? "s" : ""}</td>
                  <td className="p-4 font-bold text-sm">₹{o.total.toFixed(2)}</td>
                  <td className="p-4 text-xs text-[#5c6b62] whitespace-nowrap">{o.date}</td>
                  <td className="p-4">
                    <div className="relative inline-block">
                      <select
                        value={o.status}
                        onChange={e => onStatusUpdate(o.id, e.target.value)}
                        className={`text-[10px] font-bold pl-3 pr-7 py-1 rounded-full border cursor-pointer appearance-none focus:outline-none ${STATUS_COLORS[o.status] || "bg-gray-50 text-gray-700 border-gray-200"}`}
                      >
                        {["Pending", "Shipped", "Delivered", "Cancelled"].map(s => <option key={s}>{s}</option>)}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-60" />
                    </div>
                  </td>
                  <td className="p-4">
                    <button onClick={() => setDetailOrder(o)} className="p-1.5 text-[#5c6b62] hover:text-[#2d6a4f] hover:bg-[#e8f5e9] rounded-lg cursor-pointer" title="View details">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center py-12 text-[#5c6b62] text-sm">No orders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
