"use client";

import { useState, useEffect } from "react";

const WA_NUMBER = "919960361331"; // +91 9960361331
const WA_MESSAGE = "Hello ARAQ! 👋 I'd like to know more about your products.";

export default function WhatsAppFloat() {
  const [visible, setVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [pulse, setPulse] = useState(true);

  // Fade in after 1.5s
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(t);
  }, []);

  // Stop pulse ring after 4s
  useEffect(() => {
    const t = setTimeout(() => setPulse(false), 6000);
    return () => clearTimeout(t);
  }, []);

  const handleClick = () => {
    const encoded = encodeURIComponent(WA_MESSAGE);
    window.open(`https://wa.me/${WA_NUMBER}?text=${encoded}`, "_blank");
  };

  return (
    <div
      className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-5 z-[999] flex flex-col items-end gap-3 transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
      }`}
    >
      {/* Tooltip bubble */}
      <div
        className={`relative transition-all duration-300 ${
          showTooltip ? "opacity-100 translate-x-0 scale-100" : "opacity-0 translate-x-4 scale-95 pointer-events-none"
        }`}
      >
        <div className="bg-white rounded-2xl shadow-xl border border-[#e0e7e2] px-4 py-3 max-w-[200px] text-right">
          <p className="text-xs font-bold text-[#1e2521]">Chat with us! 💬</p>
          <p className="text-[10px] text-stone-400 mt-0.5 leading-snug">We reply instantly on WhatsApp</p>
        </div>
        {/* Arrow pointing right */}
        <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-b-[6px] border-l-[7px] border-t-transparent border-b-transparent border-l-white" />
      </div>

      {/* Main FAB button */}
      <button
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label="Chat on WhatsApp"
        className="relative group w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-2xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none"
        style={{ background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)" }}
      >
        {/* Pulse ring */}
        {pulse && (
          <>
            <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping" />
            <span className="absolute inset-[-4px] rounded-full bg-[#25D366]/20 animate-ping" style={{ animationDelay: "0.3s" }} />
          </>
        )}

        {/* WhatsApp SVG icon */}
        <svg
          viewBox="0 0 32 32"
          className="w-6 h-6 sm:w-7 sm:h-7 fill-white drop-shadow-sm"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16.004 0C7.164 0 0 7.163 0 16a15.93 15.93 0 0 0 2.138 7.99L.072 32l8.264-2.165A15.94 15.94 0 0 0 16.004 32C24.836 32 32 24.837 32 16S24.836 0 16.004 0zm0 29.292a13.23 13.23 0 0 1-6.74-1.845l-.483-.287-5.003 1.311 1.333-4.87-.316-.5A13.24 13.24 0 0 1 2.711 16c0-7.324 5.968-13.292 13.293-13.292 7.325 0 13.286 5.968 13.286 13.292 0 7.325-5.96 13.292-13.286 13.292zm7.285-9.957c-.4-.2-2.366-1.167-2.732-1.3-.367-.133-.633-.2-.9.2-.267.4-1.033 1.3-1.267 1.567-.233.267-.467.3-.867.1-.4-.2-1.687-.622-3.213-1.981-1.187-1.058-1.988-2.366-2.221-2.766-.233-.4-.025-.616.175-.815.18-.18.4-.467.6-.7.2-.233.267-.4.4-.667.133-.267.067-.5-.033-.7-.1-.2-.9-2.167-1.233-2.966-.325-.779-.656-.674-.9-.687-.233-.013-.5-.016-.767-.016-.267 0-.7.1-1.067.5-.367.4-1.4 1.367-1.4 3.332 0 1.966 1.434 3.867 1.634 4.134.2.267 2.821 4.305 6.833 6.034.955.412 1.7.658 2.282.843.959.305 1.832.262 2.521.159.769-.115 2.366-.967 2.7-1.9.333-.933.333-1.733.233-1.9-.099-.166-.366-.266-.766-.466z" />
        </svg>
      </button>
    </div>
  );
}
