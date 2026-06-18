"use client";

import { useRef, useState, useId } from "react";
import Image from "next/image";
import { Upload, Link, X, Loader2 } from "lucide-react";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUploader({ value, onChange, label = "Image" }: ImageUploaderProps) {
  const [mode, setMode] = useState<"url" | "upload">("url");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadId = useId();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Url = reader.result as string;
        onChange(base64Url);
        setUploading(false);
      };
      reader.onerror = () => {
        setError("Failed to read file");
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setError(err.message || "Upload failed");
      setUploading(false);
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <label className="text-[10px] font-bold text-[#1e2521] tracking-widest uppercase block mb-1.5">{label}</label>

      {/* Mode toggle */}
      <div className="flex gap-1 mb-2">
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`flex items-center gap-1 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors ${mode === "url" ? "bg-[#2d6a4f] text-white" : "bg-[#f1f5f2] text-[#5c6b62] hover:bg-[#e8f5e9]"}`}
        >
          <Link className="w-3 h-3" /> URL
        </button>
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`flex items-center gap-1 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors ${mode === "upload" ? "bg-[#2d6a4f] text-white" : "bg-[#f1f5f2] text-[#5c6b62] hover:bg-[#e8f5e9]"}`}
        >
          <Upload className="w-3 h-3" /> Upload
        </button>
      </div>

      {mode === "url" ? (
        <input
          type="text"
          placeholder="https://images.unsplash.com/..."
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full rounded-xl border border-[#e0e7e2] px-4 py-2.5 text-xs font-mono focus:outline-none focus:border-[#2d6a4f]"
        />
      ) : (
        <div>
          <input ref={inputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" id={uploadId} />
          <label
            htmlFor={uploadId}
            className={`flex items-center justify-center gap-2 w-full rounded-xl border-2 border-dashed py-4 cursor-pointer transition-colors ${uploading ? "border-[#2d6a4f] bg-[#e8f5e9]/40" : "border-[#e0e7e2] hover:border-[#2d6a4f] hover:bg-[#e8f5e9]/20"}`}
          >
            {uploading ? (
              <><Loader2 className="w-4 h-4 animate-spin text-[#2d6a4f]" /><span className="text-xs text-[#2d6a4f] font-semibold">Uploading...</span></>
            ) : (
              <><Upload className="w-4 h-4 text-[#5c6b62]" /><span className="text-xs text-[#5c6b62]">Click to upload image (max 5MB)</span></>
            )}
          </label>
          {error && <p className="text-[10px] text-red-600 mt-1">{error}</p>}
        </div>
      )}

      {/* Preview */}
      {value && (
        <div className="mt-2 flex items-center gap-2">
          <div className="relative w-14 h-14 rounded-lg border border-[#e0e7e2] bg-[#f9fafb] overflow-hidden">
            <img src={value} alt="preview" className="w-full h-full object-cover" />
          </div>
          <button type="button" onClick={() => onChange("")} className="text-[10px] text-red-500 flex items-center gap-1 hover:text-red-700 cursor-pointer">
            <X className="w-3 h-3" /> Remove
          </button>
        </div>
      )}
    </div>
  );
}
