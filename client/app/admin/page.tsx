"use client";

import { useProducts } from "@/context/ProductsContext";
import { useState, useEffect, useCallback } from "react";
import {
  ShoppingBag, ShoppingCart, Users, ImageIcon, Globe, Check, AlertCircle,
  X, DollarSign, Package, FolderOpen, FileText, Settings, BarChart2, RefreshCw,
  TrendingUp, ArrowUpRight,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

import ProductsTab from "./_tabs/ProductsTab";
import InventoryTab from "./_tabs/InventoryTab";
import OrdersTab from "./_tabs/OrdersTab";
import CustomersTab from "./_tabs/CustomersTab";
import CategoriesTab from "./_tabs/CategoriesTab";
import BannersTab from "./_tabs/BannersTab";
import BlogTab from "./_tabs/BlogTab";
import SEOTab from "./_tabs/SEOTab";
import SettingsTab from "./_tabs/SettingsTab";

type TabType = "overview" | "products" | "inventory" | "orders" | "customers" | "categories" | "banners" | "blog" | "seo" | "settings";

interface Order {
  id: number; customerName: string; customerEmail: string;
  items: { id: number; name: string; price: number; quantity: number }[];
  subtotal: number; shipping: number; tax: number; total: number; date: string; status: string;
}
interface User { id: number; name: string; email: string; role: string; joinDate: string; status: string; }
interface Banner { id: number; tagline: string; title: string; description: string; buttonText: string; buttonLink: string; image: string; bgClass: string; }
interface SEO { title: string; description: string; keywords: string; }
interface Category { id: number; name: string; slug: string; description: string; productCount?: number; }
interface Post { id: number; title: string; slug: string; excerpt: string; content: string; image: string; author: string; category: string; tags: string[]; status: "published" | "draft"; date: string; }

function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  return (
    <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl text-sm font-semibold border ${type === "success" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"}`}>
      {type === "success" ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
      <span>{message}</span>
      <button type="button" aria-label="Dismiss" onClick={onClose} className="ml-2 hover:opacity-70 cursor-pointer"><X className="w-3.5 h-3.5" /></button>
    </div>
  );
}

export default function AdminDashboard() {
  const { products } = useProducts();

  const { activeTab, setActiveTab, setCounts } = useAdmin();
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);

  const [banners, setBanners] = useState<Banner[]>([]);
  const [bannersLoading, setBannersLoading] = useState(true);

  const [seo, setSeo] = useState<SEO>({ title: "", description: "", keywords: "" });
  const [seoLoading, setSeoLoading] = useState(true);

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try { const r = await fetch("/api/orders"); if (r.ok) setOrders(await r.json()); } catch {} finally { setOrdersLoading(false); }
  }, []);

  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    try { const r = await fetch("/api/users"); if (r.ok) setUsers(await r.json()); } catch {} finally { setUsersLoading(false); }
  }, []);

  const fetchBanners = useCallback(async () => {
    setBannersLoading(true);
    try { const r = await fetch("/api/homepage"); if (r.ok) setBanners(await r.json()); } catch {} finally { setBannersLoading(false); }
  }, []);

  const fetchSeo = useCallback(async () => {
    setSeoLoading(true);
    try { const r = await fetch("/api/seo"); if (r.ok) setSeo(await r.json()); } catch {} finally { setSeoLoading(false); }
  }, []);

  const fetchCategories = useCallback(async () => {
    setCategoriesLoading(true);
    try { const r = await fetch("/api/categories"); if (r.ok) setCategories(await r.json()); } catch {} finally { setCategoriesLoading(false); }
  }, []);

  const fetchPosts = useCallback(async () => {
    setPostsLoading(true);
    try { const r = await fetch("/api/blog"); if (r.ok) setPosts(await r.json()); } catch {} finally { setPostsLoading(false); }
  }, []);

  useEffect(() => {
    fetchOrders(); fetchUsers(); fetchBanners(); fetchSeo(); fetchCategories(); fetchPosts();
  }, []);

  const handleUpdateOrderStatus = async (id: number, status: string) => {
    try {
      const res = await fetch("/api/orders", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
      if (res.ok) { setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o)); showToast("Order status updated!", "success"); }
      else showToast("Failed to update status.", "error");
    } catch { showToast("Network error.", "error"); }
  };

  // Stats
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === "Pending").length;
  const lowStockCount = products.filter(p => ((p as any).stock ?? 100) <= 10 && ((p as any).stock ?? 100) > 0).length;
  const outOfStockCount = products.filter(p => ((p as any).stock ?? 100) === 0).length;

  useEffect(() => {
    setCounts({
      products: products.length,
      inventory: outOfStockCount + lowStockCount,
      orders: orders.length,
      customers: users.length,
      categories: categories.length,
      blog: posts.length,
    });
  }, [products, outOfStockCount, lowStockCount, orders.length, users.length, categories.length, posts.length, setCounts]);

  const stats = [
    { label: "Revenue", value: `₹${totalRevenue.toFixed(2)}`, icon: <DollarSign className="w-4 h-4" />, color: "bg-green-50 text-green-600", sub: `${orders.length} orders`, tab: "orders" as TabType },
    { label: "Products", value: products.length, icon: <ShoppingBag className="w-4 h-4" />, color: "bg-blue-50 text-blue-600", sub: `${lowStockCount} low stock`, tab: "inventory" as TabType },
    { label: "Customers", value: users.filter(u => u.role === "Customer").length, icon: <Users className="w-4 h-4" />, color: "bg-purple-50 text-purple-600", sub: `${users.filter(u => u.status === "Active").length} active`, tab: "customers" as TabType },
    { label: "Pending Orders", value: pendingOrders, icon: <ShoppingCart className="w-4 h-4" />, color: "bg-orange-50 text-orange-600", sub: "need action", tab: "orders" as TabType },
  ];

  const tabs: { id: TabType; label: string; icon: React.ReactNode; badge?: number; group?: string }[] = [
    { id: "overview", label: "Overview", icon: <BarChart2 className="w-4 h-4" />, group: "main" },
    { id: "products", label: "Products", icon: <ShoppingBag className="w-4 h-4" />, badge: products.length, group: "catalog" },
    { id: "inventory", label: "Inventory", icon: <Package className="w-4 h-4" />, badge: outOfStockCount + lowStockCount > 0 ? outOfStockCount + lowStockCount : undefined, group: "catalog" },
    { id: "categories", label: "Categories", icon: <FolderOpen className="w-4 h-4" />, badge: categories.length, group: "catalog" },
    { id: "orders", label: "Orders", icon: <ShoppingCart className="w-4 h-4" />, badge: orders.length, group: "sales" },
    { id: "customers", label: "Customers", icon: <Users className="w-4 h-4" />, badge: users.length, group: "sales" },
    { id: "banners", label: "Banners", icon: <ImageIcon className="w-4 h-4" />, group: "content" },
    { id: "blog", label: "Blog", icon: <FileText className="w-4 h-4" />, badge: posts.length, group: "content" },
    { id: "seo", label: "SEO", icon: <Globe className="w-4 h-4" />, group: "content" },
    { id: "settings", label: "Settings", icon: <Settings className="w-4 h-4" />, group: "system" },
  ];

  const lowStockThreshold = 10; // Can be loaded from settings

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="mb-6">
        <p className="text-[10px] font-bold tracking-widest text-[#2d6a4f] uppercase">Control Panel</p>
        <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-[#1e2521] mt-1">Admin Dashboard</h1>
      </div>

      {/* ── OVERVIEW ── */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map(s => (
              <button key={s.label} type="button" onClick={() => setActiveTab(s.tab)} className="bg-white border border-[#e0e7e2] rounded-2xl p-5 flex items-center gap-4 shadow-sm cursor-pointer hover:shadow-md hover:border-[#2d6a4f]/30 transition-all text-left group">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.color}`}>{s.icon}</div>
                <div className="min-w-0">
                  <p className="text-[9px] font-bold text-stone-400 uppercase tracking-wider">{s.label}</p>
                  <p className="text-xl font-bold text-[#1e2521] leading-none mt-0.5">{s.value}</p>
                  <p className="text-[10px] text-[#5c6b62] mt-0.5">{s.sub}</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-stone-300 ml-auto shrink-0 group-hover:text-[#2d6a4f] transition-colors" />
              </button>
            ))}
          </div>

          {/* Alerts */}
          {(outOfStockCount > 0 || lowStockCount > 0) && (
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
              <h3 className="font-bold text-orange-800 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> Inventory Alerts
              </h3>
              <div className="space-y-1 text-sm text-orange-700">
                {outOfStockCount > 0 && <p>• <strong>{outOfStockCount} product{outOfStockCount !== 1 ? "s" : ""}</strong> are out of stock and need restocking.</p>}
                {lowStockCount > 0 && <p>• <strong>{lowStockCount} product{lowStockCount !== 1 ? "s" : ""}</strong> have low inventory (Less than {lowStockThreshold} units).</p>}
              </div>
              <button type="button" onClick={() => setActiveTab("inventory")} className="mt-3 text-xs font-bold text-orange-700 underline cursor-pointer">Go to Inventory →</button>
            </div>
          )}

          {/* Grid Row 2: Recent Orders + Recent Customers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Recent Orders */}
            <div className="bg-white border border-[#e0e7e2] rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#1e2521]">Recent Orders</h3>
                <button type="button" onClick={() => setActiveTab("orders")} className="text-[10px] text-[#2d6a4f] font-bold uppercase tracking-wider cursor-pointer">View all →</button>
              </div>
              {ordersLoading ? (
                <div className="flex items-center gap-2 text-[#5c6b62] py-4"><RefreshCw className="w-4 h-4 animate-spin" /><span className="text-sm">Loading...</span></div>
              ) : orders.length === 0 ? (
                <p className="text-sm text-[#5c6b62] py-4">No orders yet.</p>
              ) : (
                <div className="space-y-3">
                  {orders.slice(0, 5).map(o => (
                    <div key={o.id} className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#e8f5e9] text-[#2d6a4f] flex items-center justify-center font-bold text-[10px] shrink-0">{o.customerName[0]}</div>
                      <div className="flex-grow min-w-0">
                        <p className="text-sm font-semibold text-[#1e2521] line-clamp-1">{o.customerName}</p>
                        <p className="text-[10px] text-[#5c6b62]">{o.items.length} items · {o.date}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-sm text-[#2d6a4f]">₹{o.total.toFixed(2)}</p>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${o.status === "Delivered" ? "bg-green-100 text-green-700" : o.status === "Pending" ? "bg-yellow-100 text-yellow-700" : o.status === "Shipped" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"}`}>{o.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Customers */}
            <div className="bg-white border border-[#e0e7e2] rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#1e2521]">Recent Customers</h3>
                <button type="button" onClick={() => setActiveTab("customers")} className="text-[10px] text-[#2d6a4f] font-bold uppercase tracking-wider cursor-pointer">View all →</button>
              </div>
              {usersLoading ? (
                <div className="flex items-center gap-2 text-[#5c6b62] py-4"><RefreshCw className="w-4 h-4 animate-spin" /><span className="text-sm">Loading...</span></div>
              ) : users.length === 0 ? (
                <p className="text-sm text-[#5c6b62] py-4">No customers registered yet.</p>
              ) : (
                <div className="space-y-3">
                  {users.slice(0, 5).map(u => (
                    <div key={u.id} className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-[10px] shrink-0">{u.name ? u.name[0] : "C"}</div>
                      <div className="flex-grow min-w-0">
                        <p className="text-sm font-semibold text-[#1e2521] line-clamp-1">{u.name}</p>
                        <p className="text-[10px] text-[#5c6b62]">{u.email}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-semibold text-stone-500">{u.joinDate}</p>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${u.status === "Active" ? "bg-green-100 text-green-700" : "bg-stone-100 text-stone-500"}`}>{u.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Grid Row 3: Stock Alerts + Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
            {/* Stock Alerts */}
            <div className="bg-white border border-[#e0e7e2] rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#1e2521]">Stock Alerts</h3>
                <button type="button" onClick={() => setActiveTab("inventory")} className="text-[10px] text-[#2d6a4f] font-bold uppercase tracking-wider cursor-pointer">Manage Inventory →</button>
              </div>
              {products.filter(p => ((p as any).stock ?? 100) <= lowStockThreshold).length === 0 ? (
                <p className="text-sm text-green-600 bg-green-50/50 p-4 rounded-xl text-center font-semibold">✓ All products are fully stocked!</p>
              ) : (
                <div className="space-y-3">
                  {products.filter(p => ((p as any).stock ?? 100) <= lowStockThreshold).slice(0, 5).map(p => {
                    const stock = (p as any).stock ?? 100;
                    return (
                      <div key={p.id} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#e0e7e2] shrink-0 bg-white flex items-center justify-center">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="text-sm font-semibold text-[#1e2521] line-clamp-1">{p.name}</p>
                          <p className="text-[10px] text-[#5c6b62]">{p.category}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-[#2d6a4f]">₹{p.price.toFixed(2)}</p>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${stock === 0 ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"}`}>
                            {stock === 0 ? "Out of Stock" : `${stock} left`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-[#e0e7e2] rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#1e2521]">Quick Actions</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Add Product", tab: "products" as TabType, icon: <ShoppingBag className="w-4 h-4" />, color: "bg-blue-50 text-blue-600" },
                  { label: "Manage Stock", tab: "inventory" as TabType, icon: <Package className="w-4 h-4" />, color: "bg-orange-50 text-orange-600" },
                  { label: "View Orders", tab: "orders" as TabType, icon: <ShoppingCart className="w-4 h-4" />, color: "bg-purple-50 text-purple-600" },
                  { label: "Add Category", tab: "categories" as TabType, icon: <FolderOpen className="w-4 h-4" />, color: "bg-green-50 text-green-600" },
                  { label: "Edit Banners", tab: "banners" as TabType, icon: <ImageIcon className="w-4 h-4" />, color: "bg-pink-50 text-pink-600" },
                  { label: "Update SEO", tab: "seo" as TabType, icon: <Globe className="w-4 h-4" />, color: "bg-teal-50 text-teal-600" },
                  { label: "New Blog Post", tab: "blog" as TabType, icon: <FileText className="w-4 h-4" />, color: "bg-amber-50 text-amber-600" },
                  { label: "Settings", tab: "settings" as TabType, icon: <Settings className="w-4 h-4" />, color: "bg-stone-50 text-stone-600" },
                ].map(a => (
                  <button key={a.label} type="button" onClick={() => setActiveTab(a.tab)} className="flex items-center gap-2.5 p-3 rounded-xl border border-[#e0e7e2] hover:border-[#2d6a4f] hover:bg-[#e8f5e9]/40 cursor-pointer transition-all text-left group">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${a.color}`}>{a.icon}</div>
                    <span className="text-xs font-bold text-[#1e2521] group-hover:text-[#2d6a4f]">{a.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "products" && (
        <ProductsTab categories={categories} showToast={showToast} />
      )}

      {activeTab === "inventory" && (
        <InventoryTab lowStockThreshold={lowStockThreshold} showToast={showToast} />
      )}

      {activeTab === "orders" && (
        <OrdersTab orders={orders} loading={ordersLoading} onStatusUpdate={handleUpdateOrderStatus} />
      )}

      {activeTab === "customers" && (
        <CustomersTab users={users} loading={usersLoading} onRefresh={fetchUsers} showToast={showToast} />
      )}

      {activeTab === "categories" && (
        <CategoriesTab categories={categories} loading={categoriesLoading} onRefresh={fetchCategories} showToast={showToast} />
      )}

      {activeTab === "banners" && (
        <BannersTab banners={banners} loading={bannersLoading} onRefresh={fetchBanners} showToast={showToast} />
      )}

      {activeTab === "blog" && (
        <BlogTab posts={posts} loading={postsLoading} onRefresh={fetchPosts} showToast={showToast} />
      )}

      {activeTab === "seo" && (
        <SEOTab seo={seo} loading={seoLoading} showToast={showToast} />
      )}

      {activeTab === "settings" && (
        <SettingsTab showToast={showToast} />
      )}
    </div>
  );
}
