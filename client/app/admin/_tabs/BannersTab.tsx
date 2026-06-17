"use client";

import { useState } from "react";
import { Edit2, RefreshCw, Plus, Trash2, X, GripVertical } from "lucide-react";
import ImageUploader from "./ImageUploader";

interface Banner {
  id: number; tagline: string; title: string; description: string;
  buttonText: string; buttonLink: string; image: string; bgClass: string;
}

const BG_OPTIONS = [
  "from-stone-900 via-stone-800 to-stone-700",
  "from-green-950 via-green-900 to-emerald-800",
  "from-slate-900 via-slate-800 to-slate-700",
  "from-amber-950 via-amber-900 to-amber-800",
  "from-teal-950 via-teal-900 to-teal-800",
];

interface Props {
  banners: Banner[];
  loading: boolean;
  onRefresh: () => void;
  showToast: (msg: string, type: "success" | "error") => void;
}

export default function BannersTab({ banners: initialBanners, loading, onRefresh, showToast }: Props) {
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [saving, setSaving] = useState(false);
  const [addingNew, setAddingNew] = useState(false);

  // Sync if parent passes new banners
  if (initialBanners !== banners && !editingBanner) {
    setBanners(initialBanners);
  }

  const newBannerTemplate = (): Banner => ({
    id: Date.now(),
    tagline: "NEW ARRIVAL",
    title: "Your Slide Title",
    description: "Describe your product or promotion here.",
    buttonText: "Shop Now",
    buttonLink: "/shop",
    image: "",
    bgClass: BG_OPTIONS[0],
  });

  const saveBanners = async (updated: Banner[]) => {
    setSaving(true);
    try {
      const res = await fetch("/api/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error();
      setBanners(updated);
      setEditingBanner(null);
      setAddingNew(false);
      showToast("Banners saved!", "success");
    } catch {
      showToast("Failed to save banners.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleSave = () => {
    if (!editingBanner) return;
    const updated = addingNew
      ? [...banners, editingBanner]
      : banners.map(b => b.id === editingBanner.id ? editingBanner : b);
    saveBanners(updated);
  };

  const handleDelete = (id: number) => {
    if (!confirm("Delete this banner slide?")) return;
    const updated = banners.filter(b => b.id !== id);
    saveBanners(updated);
  };

  const openAdd = () => {
    setEditingBanner(newBannerTemplate());
    setAddingNew(true);
  };

  return (
    <div className="space-y-5">
      <div className="bg-white border border-[#e0e7e2] rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-bold text-[#1e2521]">Homepage Banner Slides</h2>
          <button onClick={openAdd} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2d6a4f] text-white text-xs font-bold uppercase tracking-wider cursor-pointer">
            <Plus className="w-3.5 h-3.5" /> Add Slide
          </button>
        </div>
        <p className="text-xs text-[#5c6b62] mb-5">Manage hero carousel slides shown on the homepage. Upload or link images, update copy and CTA buttons.</p>

        {loading ? (
          <div className="flex items-center justify-center py-12 gap-2 text-[#5c6b62]">
            <RefreshCw className="w-4 h-4 animate-spin" /><span className="text-sm">Loading...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {banners.map((b, idx) => (
              <div key={b.id} className="border border-[#e0e7e2] rounded-2xl overflow-hidden">
                <div className="flex items-center gap-4 p-4">
                  <div className="text-[#5c6b62] shrink-0 cursor-grab"><GripVertical className="w-4 h-4" /></div>
                  <div className="relative w-20 h-16 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-[#e0e7e2]">
                    {b.image ? <img src={b.image} alt={b.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[9px] text-stone-400 font-bold">NO IMAGE</div>}
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-[10px] font-bold text-[#2d6a4f] uppercase tracking-widest">{b.tagline}</p>
                    <p className="font-semibold text-sm text-[#1e2521] line-clamp-1">{b.title}</p>
                    <p className="text-[10px] text-[#5c6b62] line-clamp-1">{b.description}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => { setEditingBanner({ ...b }); setAddingNew(false); }} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#e0e7e2] text-xs font-bold text-[#5c6b62] hover:border-[#2d6a4f] hover:text-[#2d6a4f] hover:bg-[#e8f5e9]/40 cursor-pointer">
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button onClick={() => handleDelete(b.id)} className="p-2 text-[#5c6b62] hover:text-red-600 hover:bg-red-50 rounded-xl cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {editingBanner?.id === b.id && !addingNew && (
                  <BannerForm banner={editingBanner} onChange={setEditingBanner} onSave={handleSave} onCancel={() => setEditingBanner(null)} saving={saving} />
                )}
              </div>
            ))}

            {banners.length === 0 && <p className="text-center text-sm text-[#5c6b62] py-8">No banner slides yet. Click "Add Slide" to create one.</p>}
          </div>
        )}
      </div>

      {/* Add new slide panel */}
      {addingNew && editingBanner && (
        <div className="bg-white border border-[#2d6a4f] rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[#e0e7e2] flex items-center justify-between">
            <h3 className="font-bold text-[#1e2521] text-sm">New Slide</h3>
            <button onClick={() => { setAddingNew(false); setEditingBanner(null); }} className="p-1.5 rounded-lg hover:bg-[#f1f5f2] cursor-pointer"><X className="w-4 h-4 text-[#5c6b62]" /></button>
          </div>
          <BannerForm banner={editingBanner} onChange={setEditingBanner} onSave={handleSave} onCancel={() => { setAddingNew(false); setEditingBanner(null); }} saving={saving} />
        </div>
      )}
    </div>
  );
}

function BannerForm({ banner, onChange, onSave, onCancel, saving }: {
  banner: Banner; onChange: (b: Banner) => void;
  onSave: () => void; onCancel: () => void; saving: boolean;
}) {
  return (
    <div className="border-t border-[#e0e7e2] p-5 bg-[#f9fafb] space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: "Tagline", field: "tagline", placeholder: "e.g. 100% ORGANIC" },
          { label: "Button Text", field: "buttonText", placeholder: "e.g. Shop Now" },
          { label: "Button Link", field: "buttonLink", placeholder: "/shop" },
        ].map(f => (
          <div key={f.field}>
            <label className="text-[10px] font-bold text-[#1e2521] tracking-widest uppercase block mb-1.5">{f.label}</label>
            <input type="text" placeholder={f.placeholder} value={(banner as any)[f.field]} onChange={e => onChange({ ...banner, [f.field]: e.target.value })} className="w-full rounded-xl border border-[#e0e7e2] px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[#2d6a4f]" />
          </div>
        ))}
        <div>
          <label className="text-[10px] font-bold text-[#1e2521] tracking-widest uppercase block mb-1.5">Background Style</label>
          <select value={banner.bgClass} onChange={e => onChange({ ...banner, bgClass: e.target.value })} className="w-full rounded-xl border border-[#e0e7e2] px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[#2d6a4f]">
            {["from-stone-900 via-stone-800 to-stone-700", "from-green-950 via-green-900 to-emerald-800", "from-slate-900 via-slate-800 to-slate-700", "from-amber-950 via-amber-900 to-amber-800", "from-teal-950 via-teal-900 to-teal-800"].map(bg => (
              <option key={bg} value={bg}>{bg.split(" ")[0].replace("from-", "").replace(/-\d+/, "").toUpperCase()}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="text-[10px] font-bold text-[#1e2521] tracking-widest uppercase block mb-1.5">Slide Title</label>
        <input type="text" value={banner.title} onChange={e => onChange({ ...banner, title: e.target.value })} className="w-full rounded-xl border border-[#e0e7e2] px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[#2d6a4f]" />
      </div>
      <div>
        <label className="text-[10px] font-bold text-[#1e2521] tracking-widest uppercase block mb-1.5">Description</label>
        <textarea rows={2} value={banner.description} onChange={e => onChange({ ...banner, description: e.target.value })} className="w-full rounded-xl border border-[#e0e7e2] px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[#2d6a4f] resize-none" />
      </div>
      <ImageUploader value={banner.image} onChange={url => onChange({ ...banner, image: url })} label="Banner Image" />
      <div className="flex gap-3">
        <button onClick={onSave} disabled={saving} className="px-6 py-2.5 rounded-full bg-[#2d6a4f] text-white text-xs font-bold uppercase tracking-wider disabled:opacity-50 cursor-pointer">{saving ? "Saving..." : "Save Banner"}</button>
        <button onClick={onCancel} className="px-6 py-2.5 rounded-full border border-[#e0e7e2] text-[#5c6b62] text-xs font-bold uppercase tracking-wider cursor-pointer">Cancel</button>
      </div>
    </div>
  );
}
