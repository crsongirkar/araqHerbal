"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  ArrowLeft,
  ShieldAlert,
  Menu,
  X,
  LogOut,
  ShoppingBag,
  ShoppingCart,
  Users,
  Image as ImageIcon,
  Globe,
  BarChart2,
  FolderOpen,
  FileText,
  Settings,
  Package,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { AdminProvider, useAdmin } from "@/context/AdminContext";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminProvider>
  );
}

function AdminLayoutInner({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { activeTab, setActiveTab, counts } = useAdmin();

  const isLoginPage = pathname === "/admin/login";

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Prevent body scroll when sidebar open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  // Handle logout — calls API to clear cookie
  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  };

  // For login page, render bare children
  if (isLoginPage) return <>{children}</>;

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="px-5 py-6 border-b border-[#e0e7e2] flex items-center justify-between">
        <button onClick={() => { setActiveTab("overview"); setSidebarOpen(false); }} className="flex items-center gap-2.5 text-left cursor-pointer">
          <span className="w-8 h-8 rounded-xl bg-[#2d6a4f] text-white flex items-center justify-center font-bold text-sm shadow-sm">
            A
          </span>
          <span className="font-serif font-bold text-base text-[#1e2521] tracking-wider uppercase">
            Araq Admin
          </span>
        </button>
        {/* Close button — mobile only */}
        <button
          className="md:hidden text-[#5c6b62] hover:text-[#1e2521] p-1 cursor-pointer"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* Navigation Group */}
        <div>
          <p className="text-[9px] font-black text-[#9cad9e] uppercase tracking-widest px-4 mb-2">
            Navigation
          </p>
          <button
            onClick={() => { setActiveTab("overview"); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-left ${
              activeTab === "overview"
                ? "bg-[#e8f5e9] text-[#2d6a4f]"
                : "text-[#5c6b62] hover:bg-[#f1f5f2] hover:text-[#1e2521]"
            }`}
          >
            <BarChart2 className="w-4 h-4 shrink-0" />
            <span>Overview</span>
          </button>
        </div>

        {/* Catalog Group */}
        <div>
          <p className="text-[9px] font-black text-[#9cad9e] uppercase tracking-widest px-4 mb-2">
            Catalog
          </p>
          <button
            onClick={() => { setActiveTab("products"); setSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-left ${
              activeTab === "products"
                ? "bg-[#e8f5e9] text-[#2d6a4f]"
                : "text-[#5c6b62] hover:bg-[#f1f5f2] hover:text-[#1e2521]"
            }`}
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span>Products</span>
            </div>
            {counts.products > 0 && (
              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${activeTab === "products" ? "bg-[#2d6a4f] text-white" : "bg-[#e8f5e9] text-[#2d6a4f]"}`}>
                {counts.products}
              </span>
            )}
          </button>
          
          <button
            onClick={() => { setActiveTab("inventory"); setSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-left mt-1 ${
              activeTab === "inventory"
                ? "bg-[#e8f5e9] text-[#2d6a4f]"
                : "text-[#5c6b62] hover:bg-[#f1f5f2] hover:text-[#1e2521]"
            }`}
          >
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4 shrink-0" />
              <span>Inventory</span>
            </div>
            {counts.inventory > 0 && (
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-700">
                {counts.inventory}
              </span>
            )}
          </button>

          <button
            onClick={() => { setActiveTab("categories"); setSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-left mt-1 ${
              activeTab === "categories"
                ? "bg-[#e8f5e9] text-[#2d6a4f]"
                : "text-[#5c6b62] hover:bg-[#f1f5f2] hover:text-[#1e2521]"
            }`}
          >
            <div className="flex items-center gap-3">
              <FolderOpen className="w-4 h-4 shrink-0" />
              <span>Categories</span>
            </div>
            {counts.categories > 0 && (
              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${activeTab === "categories" ? "bg-[#2d6a4f] text-white" : "bg-[#e8f5e9] text-[#2d6a4f]"}`}>
                {counts.categories}
              </span>
            )}
          </button>
        </div>

        {/* Sales Group */}
        <div>
          <p className="text-[9px] font-black text-[#9cad9e] uppercase tracking-widest px-4 mb-2">
            Sales
          </p>
          <button
            onClick={() => { setActiveTab("orders"); setSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-left ${
              activeTab === "orders"
                ? "bg-[#e8f5e9] text-[#2d6a4f]"
                : "text-[#5c6b62] hover:bg-[#f1f5f2] hover:text-[#1e2521]"
            }`}
          >
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-4 h-4 shrink-0" />
              <span>Orders</span>
            </div>
            {counts.orders > 0 && (
              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${activeTab === "orders" ? "bg-[#2d6a4f] text-white" : "bg-[#e8f5e9] text-[#2d6a4f]"}`}>
                {counts.orders}
              </span>
            )}
          </button>

          <button
            onClick={() => { setActiveTab("customers"); setSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-left mt-1 ${
              activeTab === "customers"
                ? "bg-[#e8f5e9] text-[#2d6a4f]"
                : "text-[#5c6b62] hover:bg-[#f1f5f2] hover:text-[#1e2521]"
            }`}
          >
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4 shrink-0" />
              <span>Customers</span>
            </div>
            {counts.customers > 0 && (
              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${activeTab === "customers" ? "bg-[#2d6a4f] text-white" : "bg-[#e8f5e9] text-[#2d6a4f]"}`}>
                {counts.customers}
              </span>
            )}
          </button>
        </div>

        {/* Content Group */}
        <div>
          <p className="text-[9px] font-black text-[#9cad9e] uppercase tracking-widest px-4 mb-2">
            Content
          </p>
          <button
            onClick={() => { setActiveTab("banners"); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-left ${
              activeTab === "banners"
                ? "bg-[#e8f5e9] text-[#2d6a4f]"
                : "text-[#5c6b62] hover:bg-[#f1f5f2] hover:text-[#1e2521]"
            }`}
          >
            <ImageIcon className="w-4 h-4 shrink-0" />
            <span>Banners</span>
          </button>

          <button
            onClick={() => { setActiveTab("blog"); setSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-left mt-1 ${
              activeTab === "blog"
                ? "bg-[#e8f5e9] text-[#2d6a4f]"
                : "text-[#5c6b62] hover:bg-[#f1f5f2] hover:text-[#1e2521]"
            }`}
          >
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 shrink-0" />
              <span>Blog</span>
            </div>
            {counts.blog > 0 && (
              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${activeTab === "blog" ? "bg-[#2d6a4f] text-white" : "bg-[#e8f5e9] text-[#2d6a4f]"}`}>
                {counts.blog}
              </span>
            )}
          </button>

          <button
            onClick={() => { setActiveTab("seo"); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-left mt-1 ${
              activeTab === "seo"
                ? "bg-[#e8f5e9] text-[#2d6a4f]"
                : "text-[#5c6b62] hover:bg-[#f1f5f2] hover:text-[#1e2521]"
            }`}
          >
            <Globe className="w-4 h-4 shrink-0" />
            <span>SEO</span>
          </button>
        </div>

        {/* System Group */}
        <div>
          <p className="text-[9px] font-black text-[#9cad9e] uppercase tracking-widest px-4 mb-2">
            System
          </p>
          <button
            onClick={() => { setActiveTab("settings"); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-left ${
              activeTab === "settings"
                ? "bg-[#e8f5e9] text-[#2d6a4f]"
                : "text-[#5c6b62] hover:bg-[#f1f5f2] hover:text-[#1e2521]"
            }`}
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span>Settings</span>
          </button>
        </div>

        {/* Back Group */}
        <div className="pt-2 border-t border-[#e0e7e2]">
          <Link
            href="/"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-[#5c6b62] hover:bg-[#f1f5f2] hover:text-[#1e2521]"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span>Storefront</span>
          </Link>
        </div>
      </nav>

      {/* Profile / Logout footer */}
      <div className="p-4 border-t border-[#e0e7e2] space-y-3 bg-[#fcfcfb]">
        <div className="flex items-center gap-2.5 px-2 py-1">
          <div className="w-8 h-8 rounded-full bg-orange-100 text-[#f97316] flex items-center justify-center shrink-0">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#1e2521] truncate">Administrator</p>
            <p className="text-[10px] text-[#5c6b62]">Active Session</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 text-xs font-bold tracking-wider uppercase cursor-pointer transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Log Out
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-[#f5f7f5] font-sans">
      {/* ── Desktop Sidebar ── */}
      <aside className="w-64 bg-white border-r border-[#e0e7e2] hidden md:flex flex-col shrink-0 fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* ── Mobile Sidebar Overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Mobile Sidebar Drawer ── */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 bg-white border-r border-[#e0e7e2] flex flex-col z-50 md:hidden transition-transform duration-300 ease-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-64">
        {/* Top Header */}
        <header className="h-14 bg-white border-b border-[#e0e7e2] flex items-center justify-between px-4 sm:px-6 shrink-0 sticky top-0 z-20 shadow-sm shadow-black/[0.03]">
          {/* Mobile hamburger + brand */}
          <div className="flex items-center gap-3">
            <button
              className="md:hidden text-[#5c6b62] hover:text-[#1e2521] p-1.5 rounded-lg hover:bg-[#f1f5f2] cursor-pointer transition-colors"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button onClick={() => setActiveTab("overview")} className="md:hidden flex items-center gap-2 cursor-pointer">
              <span className="w-6 h-6 rounded-lg bg-[#2d6a4f] text-white flex items-center justify-center font-bold text-xs">
                A
              </span>
              <span className="font-serif font-bold text-sm text-[#1e2521] uppercase tracking-wider">
                Araq
              </span>
            </button>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-bold text-[#2d6a4f] bg-[#e8f5e9] px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
            <button
              onClick={handleLogout}
              className="md:hidden text-[10px] font-bold uppercase tracking-wider text-red-500 hover:text-red-700 cursor-pointer flex items-center gap-1.5 border border-red-200 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-3 h-3" />
              Logout
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-grow overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

