"use client";

import { useState } from "react";
import { Search, Plus, Edit2, Trash2, RefreshCw, X } from "lucide-react";

interface User { id: number; name: string; email: string; role: string; joinDate: string; status: string; }

const STATUS_COLORS: Record<string, string> = {
  Active: "bg-green-50 text-green-700 border-green-200",
  Suspended: "bg-red-50 text-red-700 border-red-200",
};

interface Props {
  users: User[];
  loading: boolean;
  onRefresh: () => void;
  showToast: (msg: string, type: "success" | "error") => void;
}

export default function CustomersTab({ users, loading, onRefresh, showToast }: Props) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  const [form, setForm] = useState({ name: "", email: "", role: "Customer", status: "Active" });

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "All" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const openAdd = () => { setForm({ name: "", email: "", role: "Customer", status: "Active" }); setEditUser(null); setShowForm(true); };
  const openEdit = (u: User) => { setForm({ name: u.name, email: u.email, role: u.role, status: u.status }); setEditUser(u); setShowForm(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return showToast("Name and email are required.", "error");

    setSaving(true);
    try {
      const method = editUser ? "PUT" : "POST";
      const body = editUser ? { id: editUser.id, ...form } : form;
      const res = await fetch("/api/users", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      showToast(editUser ? "User updated!" : "User added!", "success");
      setShowForm(false);
      onRefresh();
    } catch (err: any) {
      showToast(err.message || "Failed to save user.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/users?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      showToast("User deleted.", "success");
      onRefresh();
    } catch {
      showToast("Failed to delete user.", "error");
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleStatus = async (u: User) => {
    const newStatus = u.status === "Active" ? "Suspended" : "Active";
    try {
      const res = await fetch("/api/users", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: u.id, status: newStatus }) });
      if (!res.ok) throw new Error();
      showToast(`User ${newStatus.toLowerCase()}.`, "success");
      onRefresh();
    } catch {
      showToast("Failed to update status.", "error");
    }
  };

  return (
    <>
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-[#e0e7e2] flex items-center justify-between">
              <h3 className="text-base font-bold text-[#1e2521]">{editUser ? "Edit Customer" : "Add Customer"}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-xl hover:bg-[#f1f5f2] cursor-pointer"><X className="w-4 h-4 text-[#5c6b62]" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {[
                { label: "Full Name *", key: "name", type: "text", placeholder: "Jane Smith" },
                { label: "Email Address *", key: "email", type: "email", placeholder: "jane@example.com" },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-[10px] font-bold text-[#1e2521] tracking-widest uppercase block mb-1.5">{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} className="w-full rounded-xl border border-[#e0e7e2] px-4 py-2.5 text-sm focus:outline-none focus:border-[#2d6a4f]" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-[#1e2521] tracking-widest uppercase block mb-1.5">Role</label>
                  <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} className="w-full rounded-xl border border-[#e0e7e2] px-4 py-2.5 text-sm focus:outline-none focus:border-[#2d6a4f] bg-white">
                    <option>Customer</option>
                    <option>Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#1e2521] tracking-widest uppercase block mb-1.5">Status</label>
                  <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className="w-full rounded-xl border border-[#e0e7e2] px-4 py-2.5 text-sm focus:outline-none focus:border-[#2d6a4f] bg-white">
                    <option>Active</option>
                    <option>Suspended</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-full bg-[#2d6a4f] text-white text-xs font-bold uppercase tracking-wider disabled:opacity-50 cursor-pointer">{saving ? "Saving..." : editUser ? "Update" : "Add Customer"}</button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-full border border-[#e0e7e2] text-[#5c6b62] text-xs font-bold uppercase tracking-wider cursor-pointer">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white border border-[#e0e7e2] rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-[#e0e7e2] flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <h2 className="text-base font-bold text-[#1e2521]">Customers</h2>
            <p className="text-xs text-[#5c6b62]">{users.length} total · {users.filter(u => u.status === "Active").length} active · {users.filter(u => u.role === "Customer").length} customers</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
              <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 pr-4 py-2 border border-[#e0e7e2] rounded-xl text-xs focus:outline-none focus:border-[#2d6a4f] w-44" />
            </div>
            <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="border border-[#e0e7e2] rounded-xl px-3 py-2 text-xs focus:outline-none bg-white">
              {["All", "Customer", "Administrator"].map(r => <option key={r}>{r}</option>)}
            </select>
            <button onClick={openAdd} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2d6a4f] text-white text-xs font-bold uppercase tracking-wider cursor-pointer shrink-0">
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#f1f5f2] border-b border-[#e0e7e2]">
                {["User", "Role", "Joined", "Status", "Actions"].map(h => (
                  <th key={h} className="p-4 text-[10px] font-bold text-[#5c6b62] tracking-widest uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0e7e2]">
              {loading ? (
                <tr><td colSpan={5} className="text-center py-12">
                  <div className="flex items-center justify-center gap-2 text-[#5c6b62]"><RefreshCw className="w-4 h-4 animate-spin" /> Loading...</div>
                </td></tr>
              ) : filtered.map(u => (
                <tr key={u.id} className="hover:bg-[#fcfcfb] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#e8f5e9] text-[#2d6a4f] flex items-center justify-center font-bold text-xs shrink-0">
                        {u.name[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-[#1e2521]">{u.name}</p>
                        <p className="text-[10px] text-[#5c6b62]">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 uppercase tracking-wider">{u.role}</span>
                  </td>
                  <td className="p-4 text-xs text-[#5c6b62] whitespace-nowrap">{u.joinDate}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleStatus(u)}
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider cursor-pointer ${STATUS_COLORS[u.status] || ""}`}
                    >
                      {u.status}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(u)} className="p-1.5 text-[#5c6b62] hover:text-[#2d6a4f] hover:bg-[#e8f5e9] rounded-lg cursor-pointer"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(u.id, u.name)} disabled={deleting === u.id} className="p-1.5 text-[#5c6b62] hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer disabled:opacity-50"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={5} className="text-center py-12 text-[#5c6b62] text-sm">No customers found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
