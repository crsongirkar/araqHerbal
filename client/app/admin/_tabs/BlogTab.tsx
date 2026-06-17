"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, RefreshCw, X, Eye, EyeOff } from "lucide-react";
import ImageUploader from "./ImageUploader";

interface Post {
  id: number; title: string; slug: string; excerpt: string; content: string;
  image: string; author: string; category: string; tags: string[];
  status: "published" | "draft"; date: string;
}

interface Props {
  posts: Post[];
  loading: boolean;
  onRefresh: () => void;
  showToast: (msg: string, type: "success" | "error") => void;
}

const BLOG_CATEGORIES = ["Education", "Wellness", "Recipes", "News", "General"];

export default function BlogTab({ posts, loading, onRefresh, showToast }: Props) {
  const [view, setView] = useState<"list" | "form">("list");
  const [editPost, setEditPost] = useState<Post | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  const [form, setForm] = useState({
    title: "", slug: "", excerpt: "", content: "", image: "",
    author: "Admin", category: "General", tags: "", status: "draft" as "draft" | "published",
  });

  const openAdd = () => {
    setForm({ title: "", slug: "", excerpt: "", content: "", image: "", author: "Admin", category: "General", tags: "", status: "draft" });
    setEditPost(null); setView("form");
  };

  const openEdit = (p: Post) => {
    setForm({ title: p.title, slug: p.slug, excerpt: p.excerpt, content: p.content, image: p.image, author: p.author, category: p.category, tags: p.tags.join(", "), status: p.status });
    setEditPost(p); setView("form");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return showToast("Title is required.", "error");
    setSaving(true);
    try {
      const method = editPost ? "PUT" : "POST";
      const payload = {
        ...(editPost ? { id: editPost.id } : {}),
        ...form,
        tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      };
      const res = await fetch("/api/blog", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      showToast(editPost ? "Post updated!" : "Post published!", "success");
      setView("list"); onRefresh();
    } catch (err: any) {
      showToast(err.message || "Failed to save.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p: Post) => {
    if (!confirm(`Delete "${p.title}"?`)) return;
    setDeleting(p.id);
    try {
      const res = await fetch(`/api/blog?id=${p.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      showToast("Post deleted.", "success");
      onRefresh();
    } catch {
      showToast("Failed to delete.", "error");
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleStatus = async (p: Post) => {
    const newStatus = p.status === "published" ? "draft" : "published";
    try {
      const res = await fetch("/api/blog", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: p.id, status: newStatus }) });
      if (!res.ok) throw new Error();
      showToast(`Post ${newStatus === "published" ? "published" : "set to draft"}.`, "success");
      onRefresh();
    } catch {
      showToast("Failed to update.", "error");
    }
  };

  // Auto-generate slug from title
  const handleTitleChange = (title: string) => {
    const slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    setForm(f => ({ ...f, title, slug }));
  };

  if (view === "form") {
    return (
      <div className="bg-white border border-[#e0e7e2] rounded-2xl p-6 shadow-sm max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-bold text-[#1e2521]">{editPost ? "Edit Post" : "New Blog Post"}</h2>
          <button onClick={() => setView("list")} className="text-xs font-bold text-[#5c6b62] hover:text-[#2d6a4f] uppercase tracking-wider cursor-pointer">← Back</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-[10px] font-bold text-[#1e2521] tracking-widest uppercase block mb-1.5">Title *</label>
            <input type="text" placeholder="The Benefits of Natural Soap Making" value={form.title} onChange={e => handleTitleChange(e.target.value)} className="w-full rounded-xl border border-[#e0e7e2] px-4 py-2.5 text-sm focus:outline-none focus:border-[#2d6a4f]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-bold text-[#1e2521] tracking-widest uppercase block mb-1.5">Slug</label>
              <input type="text" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className="w-full rounded-xl border border-[#e0e7e2] px-4 py-2.5 text-xs font-mono focus:outline-none focus:border-[#2d6a4f]" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#1e2521] tracking-widest uppercase block mb-1.5">Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full rounded-xl border border-[#e0e7e2] px-4 py-2.5 text-sm focus:outline-none focus:border-[#2d6a4f] bg-white">
                {BLOG_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#1e2521] tracking-widest uppercase block mb-1.5">Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as any }))} className="w-full rounded-xl border border-[#e0e7e2] px-4 py-2.5 text-sm focus:outline-none focus:border-[#2d6a4f] bg-white">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-[#1e2521] tracking-widest uppercase block mb-1.5">Author</label>
            <input type="text" value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} className="w-full rounded-xl border border-[#e0e7e2] px-4 py-2.5 text-sm focus:outline-none focus:border-[#2d6a4f]" />
          </div>
          <ImageUploader value={form.image} onChange={url => setForm(f => ({ ...f, image: url }))} label="Featured Image" />
          <div>
            <label className="text-[10px] font-bold text-[#1e2521] tracking-widest uppercase block mb-1.5">Excerpt</label>
            <textarea rows={2} placeholder="Brief summary shown in blog listing..." value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} className="w-full rounded-xl border border-[#e0e7e2] px-4 py-2.5 text-sm focus:outline-none focus:border-[#2d6a4f] resize-none" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-[#1e2521] tracking-widest uppercase block mb-1.5">Content *</label>
            <textarea rows={10} placeholder="Full blog post content..." value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} className="w-full rounded-xl border border-[#e0e7e2] px-4 py-2.5 text-sm focus:outline-none focus:border-[#2d6a4f] resize-none font-mono" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-[#1e2521] tracking-widest uppercase block mb-1.5">Tags (comma-separated)</label>
            <input type="text" placeholder="soap, natural, wellness" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} className="w-full rounded-xl border border-[#e0e7e2] px-4 py-2.5 text-sm focus:outline-none focus:border-[#2d6a4f]" />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={saving} className="px-8 py-2.5 rounded-full bg-[#2d6a4f] text-white text-xs font-bold uppercase tracking-wider disabled:opacity-50 cursor-pointer">{saving ? "Saving..." : editPost ? "Update Post" : "Publish Post"}</button>
            <button type="button" onClick={() => setView("list")} className="px-8 py-2.5 rounded-full border border-[#e0e7e2] text-[#5c6b62] text-xs font-bold uppercase tracking-wider cursor-pointer">Cancel</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#e0e7e2] rounded-2xl overflow-hidden shadow-sm">
      <div className="p-5 border-b border-[#e0e7e2] flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-[#1e2521]">Blog Posts</h2>
          <p className="text-xs text-[#5c6b62]">{posts.length} posts · {posts.filter(p => p.status === "published").length} published</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2d6a4f] text-white text-xs font-bold uppercase tracking-wider cursor-pointer">
          <Plus className="w-3.5 h-3.5" /> New Post
        </button>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-12 gap-2 text-[#5c6b62]"><RefreshCw className="w-4 h-4 animate-spin" /><span>Loading...</span></div>
      ) : posts.length === 0 ? (
        <p className="text-center text-sm text-[#5c6b62] py-12">No posts yet. Click "New Post" to get started.</p>
      ) : (
        <div className="divide-y divide-[#e0e7e2]">
          {posts.map(p => (
            <div key={p.id} className="p-5 flex items-center gap-4 hover:bg-[#fcfcfb] transition-colors">
              {p.image && <img src={p.image} alt={p.title} className="w-16 h-12 rounded-xl object-cover border border-[#e0e7e2] shrink-0" />}
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${p.status === "published" ? "bg-green-100 text-green-700" : "bg-stone-100 text-stone-500"}`}>{p.status}</span>
                  <span className="text-[10px] text-[#5c6b62]">{p.category}</span>
                  <span className="text-[10px] text-stone-400">{p.date}</span>
                </div>
                <p className="font-semibold text-sm text-[#1e2521] line-clamp-1">{p.title}</p>
                <p className="text-xs text-[#5c6b62] line-clamp-1">{p.excerpt}</p>
                {p.tags.length > 0 && (
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {p.tags.slice(0, 4).map(t => <span key={t} className="text-[9px] px-1.5 py-0.5 bg-[#f1f5f2] text-[#5c6b62] rounded-md">#{t}</span>)}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => handleToggleStatus(p)} title={p.status === "published" ? "Set to Draft" : "Publish"} className="p-1.5 text-[#5c6b62] hover:text-[#2d6a4f] hover:bg-[#e8f5e9] rounded-lg cursor-pointer">
                  {p.status === "published" ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button onClick={() => openEdit(p)} className="p-1.5 text-[#5c6b62] hover:text-[#2d6a4f] hover:bg-[#e8f5e9] rounded-lg cursor-pointer"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(p)} disabled={deleting === p.id} className="p-1.5 text-[#5c6b62] hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer disabled:opacity-50"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
