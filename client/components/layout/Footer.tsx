"use client";

import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Check,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Footer() {
  const [emailVal, setEmailVal] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubscribeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailVal.trim()) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: emailVal.trim() }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "Thank you for subscribing!");
        setEmailVal("");
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to subscribe. Please try again.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("An error occurred. Please check your internet connection.");
    }
  };

  const footerSections = [
    {
      title: "COLLECTIONS",
      links: [
        { href: "/shop?category=Body Care", label: "Body Care" },
        { href: "/shop?category=Foot Care", label: "Foot Care" },
        { href: "/shop?category=Skin Care", label: "Skin Care" },
        { href: "/shop", label: "All Products" },
        { href: "/", label: "Gift Assortments" },
      ],
    },
    {
      title: "THE CRAFT",
      links: [
        { href: "/about", label: "Cold-Process Method" },
        { href: "/about", label: "Ingredient Purity" },
        { href: "/about", label: "Curing & Vaulting" },
        { href: "/about", label: "Sustainability Pledge" },
        { href: "/", label: "Cruelty-Free Commitment" },
      ],
    },
    {
      title: "CUSTOMER CARE",
      links: [
        { href: "/contact", label: "Contact Us" },
        { href: "/", label: "Shipping & Returns" },
        { href: "/", label: "FAQs" },
        { href: "/", label: "Store Locator" },
        { href: "/", label: "Skin Consultations" },
      ],
    },
    {
      title: "COMPANY",
      links: [
        { href: "/about", label: "Our Story" },
        // { href: "/contact", label: "Visit Workshop" },
        // { href: "/", label: "Careers" },
        // { href: "/blog", label: "Herbal Journal" },
        // { href: "/", label: "Wholesale Portal" },
      ],
    },
  ];

  const socialLinks = [
    { href: "#", icon: Facebook, label: "Facebook" },
    { href: "#", icon: Instagram, label: "Instagram" },
    { href: "#", icon: Twitter, label: "Twitter" },
  ];

  return (
    <footer className="bg-[#F8F5EE] text-[#1A1A1A] border-t border-[#DDD8CC] pt-12 sm:pt-20 pb-8 sm:pb-10 px-4 sm:px-8 lg:px-24">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Newsletter Section */}
        <div className="bg-white rounded-[32px] p-5 sm:p-8 md:p-10 border border-[#E5E0D4] shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-xs font-semibold tracking-[0.2em] text-[#2F5D50] uppercase block mb-3">
              JOIN OUR CIRCLE
            </span>

            <h3 className="text-2xl md:text-3xl font-serif font-semibold text-[#1A1A1A] leading-tight">
              Discover herbal wellness, seasonal collections &
              exclusive offers.
            </h3>

            <p className="mt-3 text-sm text-[#6B7280] leading-relaxed">
              Be the first to know about new product launches, handcrafted
              collections, skincare rituals, and exclusive member offers.
            </p>
          </div>

          <div className="w-full lg:max-w-md">
            {status === "success" ? (
              <div className="bg-[#E8F5E9] text-[#2E7D32] px-6 py-4 rounded-full text-sm font-medium flex items-center justify-center gap-2 border border-[#C8E6C9] transition-all duration-300">
                <Check className="h-5 w-5 shrink-0" />
                <span>{message}</span>
              </div>
            ) : (
              <div>
                <form
                  onSubmit={handleSubscribeSubmit}
                  className="flex items-center bg-[#F7F7F5] rounded-full border border-[#D8D2C4] px-2 py-2 focus-within:border-[#2F5D50] transition-all"
                >
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={emailVal}
                    onChange={(e) => setEmailVal(e.target.value)}
                    className="flex-1 bg-transparent px-4 text-sm outline-none placeholder:text-[#9CA3AF] min-w-0"
                    required
                    disabled={status === "loading"}
                  />

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="bg-[#2F5D50] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[#1F453B] transition-all disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    {status === "loading" ? "Subscribing..." : "Subscribe"}
                  </button>
                </form>
                {status === "error" && (
                  <p className="mt-2 text-xs text-red-650 px-4 font-medium">
                    {message}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Main Footer */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="text-3xl sm:text-4xl font-serif font-semibold tracking-[0.3em] text-[#2F5D50]"
            >
              ARAQ
            </Link>

            <p className="mt-6 text-[#6B7280] text-sm leading-7 max-w-sm">
              Crafting pure herbal elixirs, natural body bars, and skin
              remedies. Made in small batches using ethically sourced
              botanicals, organic oils, and traditional cold-curing methods.
            </p>

            <div className="mt-8 space-y-4 text-sm text-[#4B5563]">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-[#2F5D50] mt-1 shrink-0" />
                <span>
                  
                  <br />
                 
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-[#2F5D50]" />
                <span></span>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-[#2F5D50]" />
                <span></span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-4 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {footerSections.map((section, idx) => (
              <div key={idx}>
                <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2F5D50] mb-5">
                  {section.title}
                </h4>

                <ul className="space-y-3">
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <Link
                        href={link.href}
                        className="
                          text-sm
                          text-[#6B7280]
                          hover:text-[#2F5D50]
                          transition-all
                          duration-200
                          hover:translate-x-1
                          inline-block
                        "
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="pt-8 border-t border-[#DDD8CC] flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="text-sm text-[#6B7280] text-center md:text-left">
            © 2026 Araq. All rights reserved.
            <span className="hidden sm:inline mx-3 text-[#C5C0B5]">•</span>
            Crafted with care by
            <a
              href="https://steady-parfait-58ebee.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 font-semibold text-[#2F5D50] hover:text-[#1F453B]"
            >
              Chinmay Songirkar
            </a>
          </div>

          <div className="flex items-center gap-3">
            {socialLinks.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="
                  w-10
                  h-10
                  rounded-full
                  bg-white
                  border
                  border-[#D8D2C4]
                  flex
                  items-center
                  justify-center
                  text-[#2F5D50]
                  hover:bg-[#2F5D50]
                  hover:text-white
                  hover:border-[#2F5D50]
                  transition-all
                  duration-300
                "
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
