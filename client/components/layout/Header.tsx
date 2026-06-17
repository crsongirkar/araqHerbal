"use client";

import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import {
  Menu,
  Phone,
  Search,
  X,
  ShoppingCart,
  Heart,
  ChevronDown,
  User,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop", hasDropdown: true },
  { href: "/shop", label: "Product", hasDropdown: true },
  // { href: "/blog", label: "Blog" },
  // { href: "#", label: "Pages", hasDropdown: true },
  { href: "/contact", label: "Contact Us" },
];

const utilityLeft = [
  { href: "/tracking", label: "Online Tracking" },
  { href: "/return-policy", label: "Return Policy" },
];

const utilityRight = [
  { href: "/download", label: "Download App" },
  { href: "/language", label: "Language" },
];

export default function Header() {
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const cartCount = cart?.reduce((total, item) => total + item.quantity, 0) || 0;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchMobileOpen, setIsSearchMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const [categories, setCategories] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  const fetchNavData = useCallback(async () => {
    try {
      const [catRes, prodRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/products")
      ]);
      if (catRes.ok) {
        setCategories(await catRes.json());
      }
      if (prodRes.ok) {
        const prods = await prodRes.json();
        setFeaturedProducts(prods.slice(0, 3));
      }
    } catch (err) {
      console.error("Failed to fetch navigation data:", err);
    }
  }, []);

  const checkSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session");
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      }
    } catch (err) {
      console.error("Session check failed:", err);
    }
  }, []);

  useEffect(() => {
    checkSession();
    fetchNavData();
  }, [checkSession, fetchNavData, pathname]);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        setUser(null);
        setShowDropdown(false);
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = useCallback(() => setIsMobileMenuOpen((p) => !p), []);
  const isActive = (path: string) => pathname === path;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setIsMobileMenuOpen(false);
      setIsSearchMobileOpen(false);
    }
  };

  return (
    <>
      {/* ── All three tiers wrapped in one sticky container so they scroll together ── */}
      <div className="sticky top-0 z-40">
 
        {/* ── Tier 1: Utility Top Bar (desktop only) ── */}
        <div className="hidden lg:block bg-stone-50 border-b border-stone-200 text-[11px] text-[#5c6b62] font-semibold h-9">
          <div className="max-w-screen-xl mx-auto px-6 h-full flex items-center justify-between">
            <div className="flex items-center gap-6">
              {utilityLeft.map((item) => (
                <Link key={item.href} href={item.href} className="hover:text-[#2a7a4b] transition-colors py-2">
                  {item.label}
                </Link>
              ))}
            </div>
            {/* <div className="flex items-center gap-6">
              {utilityRight.map((item) => (
                <Link key={item.href} href={item.href} className="hover:text-[#2a7a4b] transition-colors py-2">
                  {item.label}
                </Link>
              ))}
            </div> */}
          </div>
        </div>
 
        {/* ── Tier 2: Logo + Search + Actions ── */}
        <header className="bg-white border-b border-stone-200">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 flex items-center gap-4 sm:gap-6 h-16 sm:h-[72px]">
            {isSearchMobileOpen ? (
              <form
                onSubmit={handleSearch}
                className="flex flex-1 items-center h-11 border border-stone-300 rounded-full overflow-hidden bg-stone-50 md:hidden"
              >
                <input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-[13px] text-stone-900 placeholder-stone-400 px-5 focus:outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  className="w-11 h-11 bg-[#2a7a4b] hover:bg-[#1f5e39] transition-colors flex items-center justify-center shrink-0"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4 text-white" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsSearchMobileOpen(false)}
                  className="w-11 h-11 text-stone-500 hover:text-stone-900 transition-colors flex items-center justify-center shrink-0 border-l border-stone-200"
                  aria-label="Close search"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <>
                {/* Logo */}
                <Link
                  href="/"
                  className="font-serif text-xl sm:text-[26px] tracking-[0.22em] text-stone-900 hover:opacity-80 transition-opacity shrink-0"
                  aria-label="ARAQ Home"
                >
                  ARAQ
                </Link>

                {/* Search bar — no category dropdown */}
                <form
                  onSubmit={handleSearch}
                  className="hidden md:flex flex-1 max-w-xl items-center h-11 border border-stone-300 rounded-full overflow-hidden bg-stone-50"
                >
                  <input
                    type="search"
                    placeholder="Write Keyword and Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent text-[13px] text-stone-900 placeholder-stone-400 px-5 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="w-11 h-11 bg-[#2a7a4b] hover:bg-[#1f5e39] transition-colors flex items-center justify-center shrink-0 rounded-r-full"
                    aria-label="Search"
                  >
                    <Search className="w-4 h-4 text-white" />
                  </button>
                </form>

                {/* Desktop actions */}
                <div className="hidden sm:flex items-center gap-1 ml-auto shrink-0">
                  {/* Account Dropdown / Login Link */}
                  {user ? (
                    <div className="relative">
                      <button
                        onClick={() => setShowDropdown((p) => !p)}
                        className="flex flex-col items-center gap-0.5 px-4 py-2 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                      >
                        <User className="w-5 h-5 text-[#2a7a4b]" />
                        <span className="text-[10px] font-semibold text-stone-500 tracking-wide flex items-center gap-0.5">
                          {user.name.split(" ")[0]} <ChevronDown className="w-2.5 h-2.5" />
                        </span>
                      </button>

                      {showDropdown && (
                        <div className="absolute right-0 mt-1.5 w-48 bg-white border border-stone-200 rounded-xl shadow-lg py-1.5 z-50">
                          <Link
                            href="/profile"
                            onClick={() => setShowDropdown(false)}
                            className="block px-4 py-2.5 text-xs font-semibold text-stone-700 hover:bg-emerald-50 hover:text-[#2a7a4b] transition-colors"
                          >
                            My Profile
                          </Link>
                          {user.role === "Administrator" && (
                            <Link
                              href="/admin"
                              onClick={() => setShowDropdown(false)}
                              className="block px-4 py-2.5 text-xs font-semibold text-stone-700 hover:bg-emerald-50 hover:text-[#2a7a4b] transition-colors"
                            >
                              Admin Panel
                            </Link>
                          )}
                          <button
                            onClick={handleLogout}
                            className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            Sign Out
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href="/auth"
                      className="flex flex-col items-center gap-0.5 px-4 py-2 rounded-lg hover:bg-stone-100 transition-colors"
                    >
                      <User className="w-5 h-5 text-stone-800" />
                      <span className="text-[10px] font-semibold text-stone-500 tracking-wide">
                        Sign In
                      </span>
                    </Link>
                  )}

                  <div className="w-px h-9 bg-stone-200 mx-1" />

                  <Link
                    href="/wishlist"
                    className="relative flex flex-col items-center gap-0.5 px-4 py-2 rounded-lg hover:bg-stone-100 transition-colors"
                  >
                    <span className="absolute top-1 right-3 bg-[#2a7a4b] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center font-mono">
                      {wishlist.length}
                    </span>
                    <Heart className="w-5 h-5 text-stone-800" />
                    <span className="text-[10px] font-semibold text-stone-500 tracking-wide">
                      Wishlist
                    </span>
                  </Link>

                  <div className="w-px h-9 bg-stone-200 mx-1" />

                  <Link
                    href="/cart"
                    className="relative flex flex-col items-center gap-0.5 px-4 py-2 rounded-lg hover:bg-stone-100 transition-colors"
                    aria-label={`Cart with ${cartCount} items`}
                  >
                    <span className="absolute top-1 right-3 bg-[#2a7a4b] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center font-mono">
                      {cartCount}
                    </span>
                    <ShoppingCart className="w-5 h-5 text-stone-800" />
                    <span className="text-[10px] font-semibold text-stone-500 tracking-wide">
                      Cart
                    </span>
                  </Link>
                </div>

                {/* Mobile: search + cart + hamburger */}
                <div className="flex items-center gap-2 ml-auto md:hidden">
                  <button
                    onClick={() => setIsSearchMobileOpen(true)}
                    className="p-2 text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
                    aria-label="Search"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                  <Link
                    href="/cart"
                    className="relative p-2 text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
                    aria-label={`Cart (${cartCount})`}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {cartCount > 0 && (
                      <span className="absolute top-0.5 right-0.5 bg-[#2a7a4b] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                  <button
                    onClick={toggleMobileMenu}
                    className="p-2 text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
                    aria-label="Open menu"
                    aria-expanded={isMobileMenuOpen}
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

         {/* ── Tier 3: Green Nav Bar (desktop only) ── */}
        <nav className="hidden lg:block bg-[#1a5c38]">
          <div className="max-w-screen-xl mx-auto px-6 flex items-center h-12">
            
            {/* Browse Categories with Hover Dropdown */}
            <div className="relative group h-full">
              <button className="flex items-center gap-2 px-5 h-full border-r border-white/20 text-white font-bold text-[12px] tracking-widest hover:bg-white/10 transition-colors shrink-0 cursor-pointer">
                <Menu className="w-4 h-4" />
                Browse Categories
              </button>
              
              <div className="absolute top-full left-0 mt-0 w-64 bg-white border border-stone-200 rounded-b-2xl shadow-xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 text-[#1e2521]">
                <div className="space-y-1">
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/shop?category=${encodeURIComponent(cat.name)}`}
                        className="block px-5 py-2 text-xs font-semibold text-stone-700 hover:bg-emerald-50 hover:text-[#2a7a4b] transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))
                  ) : (
                    ["Body Care", "Facial Care", "Hair Care", "Herbal Remedies"].map((cat) => (
                      <Link
                        key={cat}
                        href={`/shop?category=${encodeURIComponent(cat)}`}
                        className="block px-5 py-2 text-xs font-semibold text-stone-700 hover:bg-emerald-50 hover:text-[#2a7a4b] transition-colors"
                      >
                        {cat}
                      </Link>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center flex-1 px-2 h-full">
              {navItems.map((item) => (
                <div key={item.href + item.label} className="relative group h-full flex items-center">
                  <Link
                    href={item.href}
                    className={`flex items-center gap-1 px-4 h-full text-[12px] font-semibold tracking-wide transition-colors whitespace-nowrap ${
                      isActive(item.href)
                        ? "text-white bg-white/10"
                        : "text-white/85 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {item.label}
                    {item.hasDropdown && <ChevronDown className="w-3 h-3 opacity-70" />}
                  </Link>

                  {/* Dropdown Menu */}
                  {item.hasDropdown && (
                    <div className="absolute top-full left-0 mt-0 w-64 bg-white border border-stone-200 rounded-b-2xl shadow-xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 text-[#1e2521]">
                      {item.label === "Shop" && (
                        <div className="space-y-1">
                          {categories.length > 0 ? (
                            categories.map((cat) => (
                              <Link
                                key={cat.id}
                                href={`/shop?category=${encodeURIComponent(cat.name)}`}
                                className="block px-5 py-2 text-xs font-semibold text-stone-700 hover:bg-emerald-50 hover:text-[#2a7a4b] transition-colors"
                              >
                                {cat.name}
                              </Link>
                            ))
                          ) : (
                            ["Body Care", "Facial Care", "Hair Care", "Herbal Remedies"].map((cat) => (
                              <Link
                                key={cat}
                                href={`/shop?category=${encodeURIComponent(cat)}`}
                                className="block px-5 py-2 text-xs font-semibold text-stone-700 hover:bg-emerald-50 hover:text-[#2a7a4b] transition-colors"
                              >
                                {cat}
                              </Link>
                            ))
                          )}
                        </div>
                      )}

                      {item.label === "Product" && (
                        <div className="space-y-3 px-4 py-1">
                          <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest border-b pb-1.5 mb-2">
                            Featured Products
                          </p>
                          {featuredProducts.length > 0 ? (
                            featuredProducts.map((prod) => (
                              <Link
                                key={prod.id}
                                href={`/product/${prod.id}`}
                                className="flex items-center gap-3 group/item hover:opacity-90"
                              >
                                <div className="w-10 h-10 rounded-lg border border-stone-200 bg-white overflow-hidden shrink-0 flex items-center justify-center">
                                  <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-stone-800 line-clamp-1 group-hover/item:text-[#2a7a4b] transition-colors">{prod.name}</p>
                                  <p className="text-[10px] text-stone-500 font-semibold">₹{prod.price}</p>
                                </div>
                              </Link>
                            ))
                          ) : (
                            <p className="text-xs text-stone-500 py-1">No products loaded.</p>
                          )}
                        </div>
                      )}

                      {item.label === "Pages" && (
                        <div className="space-y-1">
                          <Link
                            href="/cart"
                            className="block px-5 py-2 text-xs font-semibold text-stone-700 hover:bg-emerald-50 hover:text-[#2a7a4b] transition-colors"
                          >
                            Shopping Cart ({cartCount})
                          </Link>
                          <Link
                            href="/wishlist"
                            className="block px-5 py-2 text-xs font-semibold text-stone-700 hover:bg-emerald-50 hover:text-[#2a7a4b] transition-colors"
                          >
                            My Wishlist
                          </Link>
                          <Link
                            href="/contact"
                            className="block px-5 py-2 text-xs font-semibold text-stone-700 hover:bg-emerald-50 hover:text-[#2a7a4b] transition-colors"
                          >
                            Contact Us
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 pl-6 border-l border-white/20 shrink-0">
              <div className="w-9 h-9 bg-white/15 rounded-full flex items-center justify-center">
                <Phone className="w-4 h-4 text-white" />
              </div>
              <div className="leading-tight">
                <p className="text-[10px] text-white/65">Hotline</p>
                <p className="text-[13px] font-bold font-mono text-white">1234567890</p>
              </div>
            </div>
          </div>
        </nav>

      </div>{/* end sticky wrapper */}

      {/* ── Mobile Overlay ── */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/45 z-50 lg:hidden backdrop-blur-sm"
          onClick={toggleMobileMenu}
        />
      )}

      {/* ── Mobile Drawer ── */}
      <div
        className={`fixed top-0 right-0 h-full w-[300px] sm:w-80 bg-white z-50 lg:hidden flex flex-col shadow-2xl transition-transform duration-300 ease-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="font-serif text-[20px] tracking-[0.2em] text-stone-900"
          >
            ARAQ
          </Link>
          <button
            onClick={toggleMobileMenu}
            className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 py-4 border-b border-stone-200">
          <form
            onSubmit={handleSearch}
            className="flex items-center border border-stone-300 rounded-xl overflow-hidden bg-stone-50 h-10"
          >
            <input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-[13px] px-4 focus:outline-none placeholder-stone-400"
            />
            <button
              type="submit"
              className="w-10 h-10 bg-[#2a7a4b] flex items-center justify-center shrink-0"
              aria-label="Search"
            >
              <Search className="w-3.5 h-3.5 text-white" />
            </button>
          </form>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-3">
          <p className="text-[9px] font-black text-stone-400 tracking-widest uppercase px-2 mb-2">
            Navigation
          </p>
          {navItems.map((item) => (
            <Link
              key={item.href + item.label}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold transition-colors ${
                isActive(item.href)
                  ? "bg-emerald-50 text-[#1a5c38] font-bold"
                  : "text-stone-500 hover:bg-stone-100 hover:text-stone-900"
              }`}
            >
              {item.label}
              {item.hasDropdown && <ChevronDown className="w-4 h-4 opacity-50" />}
            </Link>
          ))}

          <div className="mt-4 pt-4 border-t border-stone-200">
            <p className="text-[9px] font-black text-stone-400 tracking-widest uppercase px-2 mb-2">
              Account
            </p>
            {user ? (
              <>
                <div className="px-3 py-2 text-xs font-semibold text-[#2a7a4b]">
                  Hi, {user.name} ({user.role})
                </div>
                <Link
                  href="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-3 rounded-xl text-sm font-semibold text-stone-500 hover:bg-stone-100 hover:text-[#2a7a4b] transition-colors"
                >
                  My Profile
                </Link>
                {user.role === "Administrator" && (
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-3 rounded-xl text-sm font-semibold text-stone-500 hover:bg-stone-100 hover:text-[#2a7a4b] transition-colors"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left block px-3 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-3 rounded-xl text-sm font-semibold text-[#2a7a4b] font-bold hover:bg-stone-100 transition-colors"
              >
                Sign In / Register
              </Link>
            )}
            <Link
              href="/wishlist"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold text-stone-500 hover:bg-stone-100 hover:text-stone-900 transition-colors"
            >
              <span>♡ Wishlist</span>
              <span className="bg-[#1a5c38] text-white text-[9px] font-black px-2 py-0.5 rounded-full font-mono">
                {wishlist.length.toString().padStart(2, "0")}
              </span>
            </Link>
            <Link
              href="/cart"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold text-stone-500 hover:bg-stone-100 hover:text-stone-900 transition-colors"
            >
              <span>Cart</span>
              <span className="bg-[#1a5c38] text-white text-[9px] font-black px-2 py-0.5 rounded-full font-mono">
                {cartCount.toString().padStart(2, "0")}
              </span>
            </Link>
          </div>

          <div className="mt-4 pt-4 border-t border-stone-200">
            <p className="text-[9px] font-black text-stone-400 tracking-widest uppercase px-2 mb-2">
              More
            </p>
            {[...utilityLeft].map((item) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-3 rounded-xl text-sm font-semibold text-stone-500 hover:bg-stone-100 hover:text-stone-900 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="px-5 py-4 border-t border-stone-200 bg-stone-50 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#1a5c38] rounded-full flex items-center justify-center shrink-0">
            <Phone className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="leading-tight">
            <p className="text-[10px] text-stone-400">Hotline</p>
            <p className="text-[13px] font-bold font-mono text-stone-900">(555) 762-7724</p>
          </div>
        </div>
      </div>
    </>
  );
}