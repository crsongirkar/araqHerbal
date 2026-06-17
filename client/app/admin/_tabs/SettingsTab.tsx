"use client";

import { useState, useEffect } from "react";
import { RefreshCw, Store, DollarSign, Truck, Share2, Save } from "lucide-react";
import ImageUploader from "./ImageUploader";

interface Settings {
  storeName: string; storeTagline: string; storeEmail: string;
  storePhone: string; storeAddress: string; currency: string;
  currencySymbol: string; taxRate: number; shippingFee: number;
  freeShippingThreshold: number; lowStockThreshold: number;
  logo: string; favicon: string;
  socialInstagram: string; socialFacebook: string; socialTwitter: string;
}

interface Props {
  showToast: (msg: string, type: "success" | "error") => void;
}

export default function SettingsTab({ showToast }: Props) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<"store" | "pricing" | "social">("store");

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(d => { setSettings(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const res = await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
      if (!res.ok) throw new Error();
      showToast("Settings saved!", "success");
    } catch {
      showToast("Failed to save settings.", "error");
    } finally {
      setSaving(false);
    }
  };

  const set = (key: keyof Settings, val: any) => setSettings(prev => prev ? { ...prev, [key]: val } : prev);

  if (loading) return (
    <div className="flex items-center justify-center py-16 gap-2 text-[#5c6b62]"><RefreshCw className="w-4 h-4 animate-spin" /><span>Loading settings...</span></div>
  );

  if (!settings) return <p className="text-sm text-red-600">Failed to load settings.</p>;

  const sections = [
    { id: "store" as const, label: "Store Info", icon: <Store className="w-4 h-4" /> },
    { id: "pricing" as const, label: "Pricing & Shipping", icon: <DollarSign className="w-4 h-4" /> },
    { id: "social" as const, label: "Social & Media", icon: <Share2 className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-3xl space-y-5">
      {/* Section nav */}
      <div className="flex gap-2">
        {sections.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors ${activeSection === s.id ? "bg-[#2d6a4f] text-white" : "bg-white border border-[#e0e7e2] text-[#5c6b62] hover:bg-[#e8f5e9]"}`}>
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      <div className="bg-white border border-[#e0e7e2] rounded-2xl p-6 shadow-sm">
        {activeSection === "store" && (
          <div className="space-y-5">
            <h2 className="text-base font-bold text-[#1e2521] mb-4">Store Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { label: "Store Name", key: "storeName" as const, type: "text", placeholder: "ARAQ Herbal" },
                { label: "Tagline", key: "storeTagline" as const, type: "text", placeholder: "Pure. Natural. Handcrafted." },
                { label: "Email Address", key: "storeEmail" as const, type: "email", placeholder: "hello@yourstore.com" },
                { label: "Phone Number", key: "storePhone" as const, type: "text", placeholder: "+1 (555) 000-0000" },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-[10px] font-bold text-[#1e2521] tracking-widest uppercase block mb-1.5">{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={settings[f.key] as string} onChange={e => set(f.key, e.target.value)} className="w-full rounded-xl border border-[#e0e7e2] px-4 py-2.5 text-sm focus:outline-none focus:border-[#2d6a4f]" />
                </div>
              ))}
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold text-[#1e2521] tracking-widest uppercase block mb-1.5">Store Address</label>
                <input type="text" placeholder="123 Main St, City, State 12345" value={settings.storeAddress} onChange={e => set("storeAddress", e.target.value)} className="w-full rounded-xl border border-[#e0e7e2] px-4 py-2.5 text-sm focus:outline-none focus:border-[#2d6a4f]" />
              </div>
            </div>
            <ImageUploader value={settings.logo} onChange={url => set("logo", url)} label="Store Logo" />
          </div>
        )}

        {activeSection === "pricing" && (
          <div className="space-y-5">
            <h2 className="text-base font-bold text-[#1e2521] mb-4">Pricing & Shipping</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { label: "Currency Code", key: "currency" as const, placeholder: "INR", type: "text" },
                { label: "Currency Symbol", key: "currencySymbol" as const, placeholder: "₹", type: "text" },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-[10px] font-bold text-[#1e2521] tracking-widest uppercase block mb-1.5">{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={settings[f.key] as string} onChange={e => set(f.key, e.target.value)} className="w-full rounded-xl border border-[#e0e7e2] px-4 py-2.5 text-sm focus:outline-none focus:border-[#2d6a4f]" />
                </div>
              ))}
              {[
                { label: "Tax Rate (%)", key: "taxRate" as const, placeholder: "8", note: "e.g. 0.08 for 8%" },
                { label: "Shipping Fee (₹)", key: "shippingFee" as const, placeholder: "50.00" },
                { label: "Free Shipping Threshold (₹)", key: "freeShippingThreshold" as const, placeholder: "500" },
                { label: "Low Stock Alert (units)", key: "lowStockThreshold" as const, placeholder: "10" },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-[10px] font-bold text-[#1e2521] tracking-widest uppercase block mb-1.5">{f.label}</label>
                  <input type="number" step="0.01" min="0" placeholder={f.placeholder} value={settings[f.key] as number} onChange={e => set(f.key, parseFloat(e.target.value) || 0)} className="w-full rounded-xl border border-[#e0e7e2] px-4 py-2.5 text-sm focus:outline-none focus:border-[#2d6a4f]" />
                  {f.note && <p className="text-[10px] text-[#5c6b62] mt-1">{f.note}</p>}
                </div>
              ))}
            </div>
            <div className="p-4 bg-[#e8f5e9]/40 rounded-xl border border-[#e0e7e2]">
              <p className="text-xs text-[#2d6a4f] font-semibold mb-1">Current configuration:</p>
              <p className="text-xs text-[#5c6b62]">Shipping: {settings.currencySymbol}{settings.shippingFee} · Free over {settings.currencySymbol}{settings.freeShippingThreshold} · Tax: {(settings.taxRate * 100).toFixed(1)}% · Low stock alert at {settings.lowStockThreshold} units</p>
            </div>
          </div>
        )}

        {activeSection === "social" && (
          <div className="space-y-5">
            <h2 className="text-base font-bold text-[#1e2521] mb-4">Social Media & Branding</h2>
            {[
              { label: "Instagram URL", key: "socialInstagram" as const, placeholder: "https://instagram.com/yourstore" },
              { label: "Facebook URL", key: "socialFacebook" as const, placeholder: "https://facebook.com/yourstore" },
              { label: "Twitter / X URL", key: "socialTwitter" as const, placeholder: "https://twitter.com/yourstore" },
            ].map(f => (
              <div key={f.key}>
                <label className="text-[10px] font-bold text-[#1e2521] tracking-widest uppercase block mb-1.5">{f.label}</label>
                <input type="url" placeholder={f.placeholder} value={settings[f.key] as string} onChange={e => set(f.key, e.target.value)} className="w-full rounded-xl border border-[#e0e7e2] px-4 py-2.5 text-sm focus:outline-none focus:border-[#2d6a4f]" />
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-[#e0e7e2]">
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-8 py-3 rounded-full bg-[#2d6a4f] text-white text-xs font-bold uppercase tracking-wider disabled:opacity-50 cursor-pointer transition-colors">
            <Save className="w-3.5 h-3.5" />
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
