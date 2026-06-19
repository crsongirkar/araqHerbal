"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  User as UserIcon, 
  MapPin, 
  ShoppingBag, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  ChevronDown,
  Plus,
  Star,
  Pencil,
  Trash2,
  X,
  Truck
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/context/ProductsContext";
import Image from "next/image";

type TabType = "profile" | "address" | "orders";

const INDIAN_STATES = [
  "Andhra Pradesh","Assam","Bihar","Chhattisgarh","Delhi","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jammu & Kashmir","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Odisha","Punjab","Rajasthan",
  "Tamil Nadu","Telangana","Uttar Pradesh","Uttarakhand","West Bengal"
];

const STATE_CITIES: Record<string, string[]> = {
  "Andhra Pradesh": ["Visakhapatnam","Vijayawada","Guntur","Nellore","Tirupati","Kurnool","Rajahmundry","Kakinada","Kadapa","Anantapur"],
  "Assam": ["Guwahati","Dibrugarh","Silchar","Jorhat","Nagaon","Tinsukia","Tezpur"],
  "Bihar": ["Patna","Gaya","Bhagalpur","Muzaffarpur","Purnia","Darbhanga","Arrah","Begusarai"],
  "Chhattisgarh": ["Raipur","Bhilai","Bilaspur","Korba","Rajnandgaon","Jagdalpur"],
  "Delhi": ["New Delhi","North Delhi","South Delhi","East Delhi","West Delhi","Dwarka","Rohini"],
  "Goa": ["Panaji","Margao","Vasco da Gama","Mapusa","Ponda"],
  "Gujarat": ["Ahmedabad","Surat","Vadodara","Rajkot","Bhavnagar","Jamnagar","Gandhinagar","Junagadh","Anand","Navsari"],
  "Haryana": ["Gurugram","Faridabad","Panipat","Ambala","Karnal","Sonipat","Rohtak","Hisar"],
  "Himachal Pradesh": ["Shimla","Dharamshala","Solan","Mandi","Bilaspur","Kullu"],
  "Jammu & Kashmir": ["Srinagar","Jammu","Anantnag","Baramulla","Kathua"],
  "Jharkhand": ["Ranchi","Jamshedpur","Dhanbad","Bokaro","Deoghar","Hazaribagh"],
  "Karnataka": ["Bengaluru","Mysore","Hubli-Dharwad","Mangalore","Belgaum","Davanagere","Bellary","Gulbarga","Shimoga","Tumkur"],
  "Kerala": ["Kochi","Thiruvananthapuram","Kozhikode","Thrissur","Kollam","Alappuzha","Palakkad","Kannur"],
  "Madhya Pradesh": ["Indore","Bhopal","Jabalpur","Gwalior","Ujjain","Sagar","Dewas","Satna","Ratlam"],
  "Maharashtra": ["Mumbai","Pune","Nagpur","Thane","Nashik","Aurangabad","Solapur","Amravati","Kolhapur","Navi Mumbai","Akola","Jalgaon"],
  "Odisha": ["Bhubaneswar","Cuttack","Rourkela","Puri","Sambalpur","Balasore","Brahmapur"],
  "Punjab": ["Ludhiana","Amritsar","Jalandhar","Patiala","Bathinda","Hoshiarpur","Pathankot","Mohali"],
  "Rajasthan": ["Jaipur","Jodhpur","Udaipur","Kota","Bikaner","Ajmer","Bhilwara","Alwar","Sikar"],
  "Tamil Nadu": ["Chennai","Coimbatore","Madurai","Tiruchirappalli","Salem","Tiruppur","Erode","Vellore","Thoothukudi","Nagercoil"],
  "Telangana": ["Hyderabad","Warangal","Nizamabad","Karimnagar","Khammam","Ramagundam"],
  "Uttar Pradesh": ["Lucknow","Kanpur","Noida","Ghaziabad","Agra","Varanasi","Meerut","Allahabad","Bareilly","Aligarh","Moradabad","Gorakhpur"],
  "Uttarakhand": ["Dehradun","Haridwar","Haldwani","Roorkee","Rudrapur","Kashipur"],
  "West Bengal": ["Kolkata","Howrah","Durgapur","Asansol","Siliguri","Kharagpur","Bardhaman","Malda","Baharampur"]
};

interface Address {
  _id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

const emptyForm = { label: "Home", street: "", city: "", state: "", zipCode: "", country: "India", isDefault: false };

export default function ProfilePage() {
  const router = useRouter();
  const { products } = useProducts();
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [expandedOrders, setExpandedOrders] = useState<Record<number, boolean>>({});

  const toggleOrderItems = (orderId: number) => {
    setExpandedOrders(prev => ({ ...prev, [orderId]: !prev[orderId] }));
  };
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);

  const [sessionLoading, setSessionLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Profile tab
  const [name, setName] = useState("");
  const [phoneVal, setPhoneVal] = useState("");

  // Address book state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addrLoading, setAddrLoading] = useState(false);
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [editingAddr, setEditingAddr] = useState<Address | null>(null);
  const [addrForm, setAddrForm] = useState({ ...emptyForm });
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [addrSaving, setAddrSaving] = useState(false);

  const citiesOfState = addrForm.state ? STATE_CITIES[addrForm.state] || [] : [];

  useEffect(() => {
    async function getSession() {
      try {
        const res = await fetch("/api/auth/session", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setUser(data.user);
            setName(data.user.name || "");
            setPhoneVal(data.user.phone || "");
          } else {
            router.push("/auth");
          }
        } else {
          router.push("/auth");
        }
      } catch {
        router.push("/auth");
      } finally {
        setSessionLoading(false);
      }
    }
    getSession();
  }, [router]);

  // Fetch addresses when switching to address tab
  useEffect(() => {
    if (activeTab === "address" && user) {
      fetchAddresses();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, user]);

  const fetchAddresses = async () => {
    setAddrLoading(true);
    try {
      const res = await fetch("/api/auth/addresses", { cache: "no-store" });
      if (res.ok) setAddresses(await res.json());
    } catch {}
    finally { setAddrLoading(false); }
  };

  useEffect(() => {
    if (activeTab === "orders" && user) {
      async function getOrders() {
        setOrdersLoading(true);
        try {
          const res = await fetch("/api/auth/orders", { cache: "no-store" });
          if (res.ok) setOrders((await res.json()).sort((a: any, b: any) => b.id - a.id));
        } catch {}
        finally { setOrdersLoading(false); }
      }
      getOrders();
    }
  }, [activeTab, user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess(""); setSubmitLoading(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone: phoneVal })
      });
      if (res.ok) { const d = await res.json(); setUser(d.user); setSuccess("Profile updated successfully!"); }
      else { const d = await res.json(); setError(d.error || "Failed to update profile."); }
    } catch { setError("An error occurred."); }
    finally { setSubmitLoading(false); }
  };

  const openAddForm = () => {
    setEditingAddr(null);
    setAddrForm({ ...emptyForm });
    setError(""); setSuccess("");
    setShowAddrForm(true);
  };

  const openEditForm = (addr: Address) => {
    setEditingAddr(addr);
    setAddrForm({ label: addr.label, street: addr.street, city: addr.city, state: addr.state, zipCode: addr.zipCode, country: addr.country, isDefault: addr.isDefault });
    setError(""); setSuccess("");
    setShowAddrForm(true);
  };

  const closeForm = () => { setShowAddrForm(false); setEditingAddr(null); setAddrForm({ ...emptyForm }); setError(""); };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!addrForm.street.trim()) return setError("Street address is required.");
    if (!addrForm.state) return setError("Please select a state.");
    if (!addrForm.city) return setError("Please select a city.");
    if (!addrForm.zipCode.trim()) return setError("PIN code is required.");
    setAddrSaving(true);
    try {
      const url = editingAddr ? `/api/auth/addresses/${editingAddr._id}` : "/api/auth/addresses";
      const method = editingAddr ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(addrForm) });
      if (res.ok) {
        setAddresses(await res.json());
        setSuccess(editingAddr ? "Address updated!" : "New address added!");
        closeForm();
      } else {
        const d = await res.json();
        setError(d.error || "Failed to save address.");
      }
    } catch { setError("An error occurred."); }
    finally { setAddrSaving(false); }
  };

  const handleDeleteAddress = async (addrId: string) => {
    if (!confirm("Delete this address? This cannot be undone.")) return;
    setDeletingId(addrId);
    try {
      const res = await fetch(`/api/auth/addresses/${addrId}`, { method: "DELETE" });
      if (res.ok) { setAddresses(await res.json()); setSuccess("Address deleted."); }
      else setError("Failed to delete address.");
    } catch { setError("An error occurred."); }
    finally { setDeletingId(null); }
  };

  const handleSetDefault = async (addr: Address) => {
    try {
      const res = await fetch(`/api/auth/addresses/${addr._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ setDefault: true })
      });
      if (res.ok) { setAddresses(await res.json()); setSuccess("Default shipping address updated."); }
    } catch {}
  };

  if (sessionLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-stone-50">
        <Loader2 className="w-10 h-10 text-[#2a7a4b] animate-spin mb-4" />
        <p className="text-sm font-semibold text-stone-500">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Page Heading */}
        <div className="flex items-center justify-between border-b border-[#e0e7e2] pb-5">
          <div className="space-y-1">
            <h1 className="text-3xl font-serif font-bold text-[#1e2521]">My Account</h1>
            <p className="text-xs text-stone-500 font-medium">
              Logged in as: <span className="font-bold text-[#2d6a4f]">{user?.email}</span>
            </p>
          </div>
        </div>

        {/* Alerts */}
        {error && !showAddrForm && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm rounded-2xl flex items-center gap-3 font-medium">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" /> {error}
          </div>
        )}
        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm rounded-2xl flex items-center gap-3 font-medium">
            <CheckCircle2 className="w-5 h-5 text-[#2d6a4f] shrink-0" /> {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

          {/* Sidebar Nav */}
          <div className="bg-white border border-[#e0e7e2] rounded-3xl p-3 shadow-sm space-y-1.5 lg:col-span-1">
            {([
              { key: "profile", icon: <UserIcon className="w-4 h-4" />, label: "Update Profile" },
              { key: "address", icon: <MapPin className="w-4 h-4" />, label: "My Addresses" },
              { key: "orders",  icon: <ShoppingBag className="w-4 h-4" />, label: "Order History" },
            ] as const).map(t => (
              <button
                key={t.key}
                onClick={() => { setActiveTab(t.key); setError(""); setSuccess(""); setShowAddrForm(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === t.key ? "bg-[#2d6a4f] text-white shadow-sm" : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* Content Panel */}
          <div className="lg:col-span-3">

            {/* ── TAB 1: Profile ── */}
            {activeTab === "profile" && (
              <div className="bg-white border border-[#e0e7e2] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <h2 className="text-lg font-serif font-bold text-[#1e2521]">Profile Settings</h2>
                  <p className="text-xs text-stone-500 mt-1">Update your display name and contact details.</p>
                </div>
                <form onSubmit={handleUpdateProfile} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-[#1e2521] tracking-wider uppercase block mb-1.5">Full Name</label>
                      <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. ABc"
                        className="w-full rounded-xl border border-[#e0e7e2] px-4 py-2.5 text-xs focus:outline-none focus:border-[#2d6a4f] bg-stone-50/50" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#1e2521] tracking-wider uppercase block mb-1.5">Phone Number</label>
                      <input type="text" value={phoneVal} onChange={e => setPhoneVal(e.target.value)} placeholder="e.g. +91 1234567890"
                        className="w-full rounded-xl border border-[#e0e7e2] px-4 py-2.5 text-xs focus:outline-none focus:border-[#2d6a4f] bg-stone-50/50" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#1e2521] tracking-wider uppercase block mb-1.5 opacity-60">Email (Read-only)</label>
                    <input type="email" disabled value={user?.email}
                      className="w-full rounded-xl border border-[#e0e7e2] px-4 py-2.5 text-xs bg-stone-100 text-stone-500 cursor-not-allowed" />
                  </div>
                  <div className="pt-2">
                    <Button type="submit" disabled={submitLoading}
                      className="rounded-full bg-[#2d6a4f] hover:bg-[#2d6a4f]/90 text-white font-bold py-5 px-6 text-xs uppercase tracking-wider disabled:opacity-50 cursor-pointer">
                      {submitLoading ? <span className="flex items-center gap-2"><Loader2 className="w-3.5 h-3.5 animate-spin" />Saving...</span> : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* ── TAB 2: Address Book ── */}
            {activeTab === "address" && (
              <div className="bg-white border border-[#e0e7e2] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">

                {/* Header */}
                <div className="flex justify-between items-center flex-wrap gap-3 border-b border-[#e0e7e2]/60 pb-4">
                  <div>
                    <h2 className="text-lg font-serif font-bold text-[#1e2521]">My Addresses</h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {addresses.length} saved address{addresses.length !== 1 ? "es" : ""} · Your default address is used at checkout.
                    </p>
                  </div>
                  <button
                    onClick={openAddForm}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2d6a4f] hover:bg-[#2d6a4f]/90 text-white font-bold text-xs uppercase tracking-wider cursor-pointer shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add New Address
                  </button>
                </div>

                {/* Loading */}
                {addrLoading ? (
                  <div className="flex items-center justify-center py-10 gap-2 text-stone-500">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-xs">Loading addresses...</span>
                  </div>

                ) : addresses.length === 0 ? (
                  /* Empty state */
                  <div className="text-center py-14 border-2 border-dashed border-[#e0e7e2] rounded-2xl space-y-4">
                    <div className="inline-flex w-14 h-14 rounded-full bg-[#e8f5e9] text-[#2d6a4f] items-center justify-center">
                      <MapPin className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-stone-700">No addresses saved yet</p>
                      <p className="text-xs text-stone-400 mt-1">Add a shipping address to speed up checkout.</p>
                    </div>
                    <button
                      onClick={openAddForm}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2d6a4f] hover:bg-[#2d6a4f]/90 text-white font-bold text-xs uppercase tracking-wider cursor-pointer transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add First Address
                    </button>
                  </div>

                ) : (
                  /* Address Cards */
                  <div className="grid sm:grid-cols-2 gap-4">
                    {addresses.map(addr => (
                      <div
                        key={addr._id}
                        className={`relative rounded-2xl border p-5 space-y-3 transition-all ${
                          addr.isDefault
                            ? "border-[#2d6a4f]/40 bg-[#f8fcf9] shadow-sm ring-1 ring-[#2d6a4f]/15"
                            : "border-[#e0e7e2] bg-white hover:border-[#2d6a4f]/25 hover:shadow-sm"
                        }`}
                      >
                        {/* Label Row */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-stone-100 text-stone-600">
                            {addr.label}
                          </span>
                          {addr.isDefault && (
                            <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#2d6a4f]/10 text-[#2d6a4f]">
                              <Star className="w-2.5 h-2.5 fill-[#2d6a4f]" /> Default
                            </span>
                          )}
                        </div>

                        {/* Address Text */}
                        <div className="text-xs text-stone-700 space-y-0.5 leading-relaxed">
                          <p className="font-semibold text-[#1e2521]">{user?.name}</p>
                          <p>{addr.street}</p>
                          <p>{addr.city}, {addr.state} – {addr.zipCode}</p>
                          <p className="text-stone-400">{addr.country}</p>
                        </div>

                        {/* Action Row */}
                        <div className="flex items-center gap-2 pt-1 border-t border-[#e0e7e2]/60">
                          <button
                            onClick={() => openEditForm(addr)}
                            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#2d6a4f] hover:text-[#1a5c38] px-3 py-1.5 rounded-full bg-[#e8f5e9]/60 hover:bg-[#e8f5e9] transition-colors cursor-pointer"
                          >
                            <Pencil className="w-3 h-3" /> Edit
                          </button>

                          {!addr.isDefault && (
                            <button
                              onClick={() => handleSetDefault(addr)}
                              className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-500 hover:text-[#2d6a4f] px-3 py-1.5 rounded-full bg-stone-100 hover:bg-[#e8f5e9] transition-colors cursor-pointer"
                            >
                              <Star className="w-3 h-3" /> Set Default
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteAddress(addr._id)}
                            disabled={deletingId === addr._id}
                            className="ml-auto flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-red-500 hover:text-red-700 px-3 py-1.5 rounded-full bg-red-50/60 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-40"
                          >
                            {deletingId === addr._id
                              ? <Loader2 className="w-3 h-3 animate-spin" />
                              : <Trash2 className="w-3 h-3" />}
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── TAB 3: Order History ── */}
            {activeTab === "orders" && (
              <div className="bg-white border border-[#e0e7e2] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <h2 className="text-lg font-serif font-bold text-[#1e2521]">Order History</h2>
                  <p className="text-xs text-stone-500 mt-1">Track and inspect your past purchases.</p>
                </div>

                {ordersLoading ? (
                  <div className="flex flex-col items-center justify-center py-10 space-y-3">
                    <Loader2 className="w-8 h-8 text-[#2a7a4b] animate-spin" />
                    <p className="text-xs text-stone-500">Retrieving your orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-stone-200 rounded-2xl bg-stone-50/50 space-y-4">
                    <div className="inline-flex w-12 h-12 rounded-full bg-stone-100 text-stone-400 items-center justify-center">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-stone-700">No orders found</p>
                      <p className="text-xs text-stone-400">You haven&apos;t placed any orders with us yet.</p>
                    </div>
                    <Button asChild className="rounded-full bg-[#2d6a4f] hover:bg-[#2d6a4f]/90 text-xs px-5">
                      <Link href="/shop">Browse Shop</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-[#e0e7e2] rounded-2xl overflow-hidden shadow-sm">
                        <div className="bg-stone-50/70 border-b border-[#e0e7e2] px-4 py-3.5 sm:px-6 flex flex-wrap justify-between items-center gap-3">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Order ID</span>
                            <span className="font-mono text-xs font-bold text-stone-800">#{order.id}</span>
                          </div>
                          <div className="space-y-0.5 sm:text-right">
                            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Date Placed</span>
                            <span className="text-xs font-semibold text-stone-700">{order.date}</span>
                          </div>
                          <div className="space-y-0.5 sm:text-right">
                            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Total</span>
                            <span className="text-xs font-black text-[#2d6a4f]">₹{order.total.toFixed(2)}</span>
                          </div>
                          <span className={`inline-flex px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            order.status === "Pending"   ? "bg-orange-50 text-orange-600 border border-orange-200" :
                            order.status === "Shipped"   ? "bg-blue-50 text-blue-600 border border-blue-200" :
                            order.status === "Delivered" ? "bg-emerald-50 text-[#2d6a4f] border border-[#e0e7e2]" :
                                                          "bg-red-50 text-red-600 border border-red-200"
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="px-4 py-4 sm:px-6 divide-y divide-[#e0e7e2]/50 bg-white">
                          {(() => {
                            const isExpanded = expandedOrders[order.id] || false;
                            const displayedItems = isExpanded ? order.items : order.items?.slice(0, 3);
                            const hasMoreItems = order.items?.length > 3;

                            return (
                              <>
                                {displayedItems?.map((item: any, idx: number) => {
                                  const product = products.find(
                                    (p) => Number(p.id) === Number(item.id) || p.name.toLowerCase() === item.name.toLowerCase()
                                  );
                                  const imageSrc = item.image || product?.image || "/images/NoImage.jpg";

                                  return (
                                    <div key={idx} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                                      <div className="flex items-center gap-3 min-w-0">
                                        {/* Small Image */}
                                        <div className="relative w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-xl overflow-hidden border border-stone-200/80 bg-stone-50">
                                          <Image
                                            src={imageSrc}
                                            alt={item.name}
                                            fill
                                            sizes="(max-width: 640px) 48px, 56px"
                                            className="object-cover"
                                          />
                                        </div>
                                        
                                        {/* Product info */}
                                        <div className="min-w-0">
                                          <span className="font-bold text-stone-800 text-xs sm:text-sm block truncate hover:text-[#2d6a4f] transition-colors">
                                            {item.name}
                                          </span>
                                          <span className="text-stone-500 text-[10px] sm:text-xs block mt-0.5">
                                            ₹{item.price.toFixed(2)} <span className="text-stone-400 font-medium">x {item.quantity}</span>
                                          </span>
                                        </div>
                                      </div>
                                      
                                      {/* Item Subtotal */}
                                      <span className="font-semibold text-stone-700 text-xs sm:text-sm shrink-0">
                                        ₹{(item.price * item.quantity).toFixed(2)}
                                      </span>
                                    </div>
                                  );
                                })}

                                {hasMoreItems && (
                                  <button
                                    onClick={() => toggleOrderItems(order.id)}
                                    className="w-full text-center py-2.5 mt-2 text-[10px] font-bold uppercase tracking-wider text-stone-500 hover:text-[#2d6a4f] hover:bg-stone-50 transition-colors flex items-center justify-center gap-1 border-t border-[#e0e7e2]/30 cursor-pointer"
                                  >
                                    {isExpanded ? "Show Less" : `Show All ${order.items.length} Items`}
                                  </button>
                                )}

                                {/* Price Breakdown */}
                                <div className="pt-4 mt-3 border-t border-stone-100 space-y-2 text-xs">
                                  <div className="flex justify-between text-stone-500">
                                    <span>Subtotal:</span>
                                    <span className="font-semibold text-stone-700">₹{(order.subtotal || 0).toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between text-stone-500">
                                    <span>Shipping:</span>
                                    <span className="font-semibold text-stone-700">
                                      {order.shipping === 0 ? "FREE" : `₹${(order.shipping || 0).toFixed(2)}`}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-stone-500">
                                    <span>Estimated Tax (8%):</span>
                                    <span className="font-semibold text-stone-700">₹{(order.tax || 0).toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between text-stone-800 font-bold pt-2 border-t border-stone-100">
                                    <span>Total:</span>
                                    <span className="text-[#2d6a4f]">₹{(order.total || 0).toFixed(2)}</span>
                                  </div>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                        <div className="bg-stone-50/50 border-t border-[#e0e7e2] px-4 py-3 sm:px-6 flex justify-between items-center">
                          <span className="text-[10px] text-stone-400 font-medium">Click track to see live dispatch status</span>
                          <Link 
                            href={`/tracking?id=${order.id}&email=${user?.email}`}
                            className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#2d6a4f] hover:text-[#1a5c38] px-3.5 py-2 rounded-full bg-white border border-[#e0e7e2] hover:border-[#2d6a4f]/30 transition-all cursor-pointer shadow-sm"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            Track Order
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          Add / Edit Address Modal
      ══════════════════════════════════════ */}
      {showAddrForm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 py-6">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">

            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#e0e7e2] sticky top-0 bg-white rounded-t-3xl z-10">
              <div>
                <h3 className="text-base font-serif font-bold text-[#1e2521]">
                  {editingAddr ? "Edit Address" : "Add New Address"}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  {editingAddr ? "Update the details for this address." : "Fill in your shipping details below."}
                </p>
              </div>
              <button
                onClick={closeForm}
                className="p-2 rounded-xl hover:bg-stone-100 cursor-pointer text-stone-500 hover:text-stone-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveAddress} className="p-6 space-y-5">

              {/* Label Selector */}
              <div>
                <label className="text-[10px] font-bold text-[#1e2521] tracking-wider uppercase block mb-2">Address Label</label>
                <div className="flex gap-2 flex-wrap">
                  {["Home", "Work", "Other"].map(lbl => (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => setAddrForm(f => ({ ...f, label: lbl }))}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border cursor-pointer transition-all ${
                        addrForm.label === lbl
                          ? "bg-[#2d6a4f] text-white border-[#2d6a4f] shadow-sm"
                          : "bg-stone-50 text-stone-600 border-[#e0e7e2] hover:border-[#2d6a4f]/40"
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Street */}
              <div>
                <label className="text-[10px] font-bold text-[#1e2521] tracking-wider uppercase block mb-1.5">
                  Street Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={addrForm.street}
                  onChange={e => setAddrForm(f => ({ ...f, street: e.target.value }))}
                  placeholder="House No, Street, Area, Landmark"
                  className="w-full rounded-xl border border-[#e0e7e2] px-4 py-2.5 text-xs focus:outline-none focus:border-[#2d6a4f] bg-stone-50/50"
                />
              </div>

              {/* State + City */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-[#1e2521] tracking-wider uppercase block mb-1.5">
                    State <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={addrForm.state}
                      onChange={e => setAddrForm(f => ({ ...f, state: e.target.value, city: "" }))}
                      className="w-full rounded-xl border border-[#e0e7e2] px-4 py-2.5 text-xs focus:outline-none focus:border-[#2d6a4f] bg-stone-50/50 appearance-none"
                    >
                      <option value="">Select State</option>
                      {INDIAN_STATES.map(st => <option key={st} value={st}>{st}</option>)}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#1e2521] tracking-wider uppercase block mb-1.5">
                    City <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={addrForm.city}
                      disabled={!addrForm.state}
                      onChange={e => setAddrForm(f => ({ ...f, city: e.target.value }))}
                      className="w-full rounded-xl border border-[#e0e7e2] px-4 py-2.5 text-xs focus:outline-none focus:border-[#2d6a4f] bg-stone-50/50 disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed appearance-none"
                    >
                      <option value="">Select City</option>
                      {citiesOfState.map(ct => <option key={ct} value={ct}>{ct}</option>)}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* PIN + Country */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-[#1e2521] tracking-wider uppercase block mb-1.5">
                    PIN Code <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={addrForm.zipCode}
                    onChange={e => setAddrForm(f => ({ ...f, zipCode: e.target.value.replace(/\D/g, "").slice(0, 6) }))}
                    placeholder="e.g. 411047"
                    className="w-full rounded-xl border border-[#e0e7e2] px-4 py-2.5 text-xs focus:outline-none focus:border-[#2d6a4f] bg-stone-50/50"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#1e2521] tracking-wider uppercase block mb-1.5 opacity-60">Country</label>
                  <input type="text" disabled value="India"
                    className="w-full rounded-xl border border-[#e0e7e2] px-4 py-2.5 text-xs bg-stone-100 text-stone-500 cursor-not-allowed" />
                </div>
              </div>

              {/* Set as Default */}
              <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-xl border border-[#e0e7e2] hover:border-[#2d6a4f]/30 transition-colors">
                <input
                  type="checkbox"
                  checked={addrForm.isDefault}
                  onChange={e => setAddrForm(f => ({ ...f, isDefault: e.target.checked }))}
                  className="w-4 h-4 accent-[#2d6a4f] cursor-pointer"
                />
                <div>
                  <p className="text-xs font-semibold text-stone-700 group-hover:text-[#2d6a4f] transition-colors">Set as default shipping address</p>
                  <p className="text-[10px] text-stone-400 mt-0.5">This address will be pre-filled at checkout</p>
                </div>
              </label>

              {/* Form Error */}
              {error && (
                <p className="text-xs text-red-600 font-medium flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
                </p>
              )}

              {/* Submit + Cancel */}
              <div className="flex gap-3 pt-1">
                <Button
                  type="submit"
                  disabled={addrSaving}
                  className="flex-1 rounded-full bg-[#2d6a4f] hover:bg-[#2d6a4f]/90 text-white font-bold py-5 text-xs uppercase tracking-wider cursor-pointer disabled:opacity-50 shadow-md"
                >
                  {addrSaving
                    ? <span className="flex items-center gap-2"><Loader2 className="w-3.5 h-3.5 animate-spin" />Saving...</span>
                    : editingAddr ? "Update Address" : "Save Address"}
                </Button>
                <Button
                  type="button"
                  onClick={closeForm}
                  className="rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-5 px-5 text-xs uppercase tracking-wider cursor-pointer border border-stone-200"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
