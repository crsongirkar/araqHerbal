"use client";

import { useState } from "react";
import { RefreshCw, Globe, Search } from "lucide-react";

interface SEO { title: string; description: string; keywords: string; }

interface Props {
  seo: SEO;
  loading: boolean;
  showToast: (msg: string, type: "success" | "error") => void;
}

export default function SEOTab({ seo: initialSeo, loading, showToast }: Props) {
  const [seo, setSeo] = useState<SEO>(initialSeo);
  const [saving, setSaving] = useState(false);

  // Sync when parent passes new data
  if (initialSeo !== seo && !saving) {
    setSeo(initialSeo);
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/seo", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(seo) });
      if (!res.ok) throw new Error();
      showToast("SEO settings saved!", "success");
    } catch {
      showToast("Failed to save SEO.", "error");
    } finally {
      setSaving(false);
    }
  };

  const titleLen = seo.title.length;
  const descLen = seo.description.length;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-white border border-[#e0e7e2] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-1">
          <Globe className="w-5 h-5 text-[#2d6a4f]" />
          <h2 className="text-base font-bold text-[#1e2521]">SEO & Metadata</h2>
        </div>
        <p className="text-xs text-[#5c6b62] mb-6">These settings control how your site appears in search engines like Google. Keep title under 60 chars and description under 160 chars.</p>

        {loading ? (
          <div className="flex items-center gap-2 text-[#5c6b62] py-8"><RefreshCw className="w-4 h-4 animate-spin" /><span className="text-sm">Loading...</span></div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-bold text-[#1e2521] tracking-widest uppercase">Page Title</label>
                <span className={`text-[10px] font-bold ${titleLen > 60 ? "text-red-500" : titleLen > 50 ? "text-orange-500" : "text-[#5c6b62]"}`}>{titleLen}/60</span>
              </div>
              <input type="text" value={seo.title} onChange={e => setSeo(p => ({ ...p, title: e.target.value }))} placeholder="e.g. ARAQ — Pure Herbal Soaps & Body Care" className={`w-full rounded-xl border px-4 py-3 text-sm focus:outline-none ${titleLen > 60 ? "border-red-300 focus:border-red-400" : "border-[#e0e7e2] focus:border-[#2d6a4f]"}`} />
              <p className="text-[10px] text-[#5c6b62] mt-1">Shown in browser tabs and Google search results.</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-bold text-[#1e2521] tracking-widest uppercase">Meta Description</label>
                <span className={`text-[10px] font-bold ${descLen > 160 ? "text-red-500" : descLen > 140 ? "text-orange-500" : "text-[#5c6b62]"}`}>{descLen}/160</span>
              </div>
              <textarea rows={4} value={seo.description} onChange={e => setSeo(p => ({ ...p, description: e.target.value }))} placeholder="Describe your store for search engines..." className={`w-full rounded-xl border px-4 py-3 text-sm focus:outline-none resize-none ${descLen > 160 ? "border-red-300 focus:border-red-400" : "border-[#e0e7e2] focus:border-[#2d6a4f]"}`} />
              <p className="text-[10px] text-[#5c6b62] mt-1">This appears as the excerpt under your title in Google. Aim for 120–160 characters.</p>
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#1e2521] tracking-widest uppercase block mb-1.5">Keywords (comma-separated)</label>
              <input type="text" value={seo.keywords} onChange={e => setSeo(p => ({ ...p, keywords: e.target.value }))} placeholder="herbal soaps, organic body bars, natural skincare..." className="w-full rounded-xl border border-[#e0e7e2] px-4 py-3 text-sm focus:outline-none focus:border-[#2d6a4f]" />
              <p className="text-[10px] text-[#5c6b62] mt-1">Less critical for modern SEO but still useful. Separate with commas.</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {seo.keywords.split(",").map(k => k.trim()).filter(Boolean).map(kw => (
                  <span key={kw} className="text-[10px] px-2 py-0.5 bg-[#e8f5e9] text-[#2d6a4f] rounded-full font-medium">{kw}</span>
                ))}
              </div>
            </div>

            {/* Google Preview */}
            <div className="border border-[#e0e7e2] rounded-2xl p-5 bg-white">
              <div className="flex items-center gap-2 mb-3">
                <Search className="w-3.5 h-3.5 text-[#5c6b62]" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#5c6b62]">Google Search Preview</p>
              </div>
              <div className="border border-gray-200 rounded-xl p-4 bg-white max-w-lg">
                <p className="text-xs text-green-700 mb-0.5 flex items-center gap-1">
                  <span className="w-4 h-4 rounded-full bg-gray-200 inline-block" />
                  araqherbal.com
                </p>
                <p className="text-[17px] text-blue-700 font-normal hover:underline line-clamp-1 leading-tight">{seo.title || "Your site title appears here"}</p>
                <p className="text-sm text-[#5c6b62] mt-1 line-clamp-2 leading-snug">{seo.description || "Your meta description will appear here as the search result snippet..."}</p>
              </div>
            </div>

            <button type="submit" disabled={saving} className="px-8 py-3 rounded-full bg-[#2d6a4f] text-white text-xs font-bold uppercase tracking-wider disabled:opacity-50 cursor-pointer transition-colors">
              {saving ? "Saving..." : "Save SEO Settings"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
