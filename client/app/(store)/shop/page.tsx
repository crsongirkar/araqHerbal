"use client";

import ProductCard from "@/components/home/ProductCard";
import { useProducts } from "@/context/ProductsContext";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get("category");
  const searchQuery = searchParams.get("search");

  const { products, loading, refreshProducts } = useProducts();

  useEffect(() => {
    refreshProducts();
  }, [categoryFilter, searchQuery, refreshProducts]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#2d6a4f] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-[#5c6b62]">Loading collection...</span>
        </div>
      </div>
    );
  }

  // Dynamically compute unique categories from current products
  const allCategories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));

  // Filter products by category and search queries
  const filteredProducts = products.filter((p) => {
    const matchesCategory = !categoryFilter || p.category === categoryFilter;
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Header */}
      <section className="bg-[#e8f5e9]/50 py-10 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <span className="text-[10px] font-bold tracking-widest text-[#2d6a4f] uppercase block mb-2">
            HERBAL REMEDIES
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-[#1e2521] mb-3">
            {searchQuery 
              ? `Results for "${searchQuery}"` 
              : categoryFilter || "All Products"}
          </h1>
          <p className="text-[#5c6b62] text-sm sm:text-base max-w-lg">
            {searchQuery
              ? `Found ${filteredProducts.length} herbal remedies matching your search terms.`
              : categoryFilter
              ? `Explore our curated ${categoryFilter.toLowerCase()} collection — handcrafted with organic botanicals.`
              : "Browse our complete line of cold-process herbal elixirs, body bars, and botanical remedies."}
          </p>
        </div>
      </section>

      {/* Category Filter Bar */}
      <section className="border-b border-[#e0e7e2] bg-white sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-24 py-3 sm:py-4 flex items-center gap-2 overflow-x-auto w-full max-w-full no-scrollbar">
          <a
            href="/shop"
            className={`text-xs font-bold tracking-wider uppercase px-4 py-2 rounded-full border transition-colors whitespace-nowrap flex-shrink-0 ${
              !categoryFilter
                ? "bg-[#2d6a4f] text-white border-[#2d6a4f]"
                : "bg-transparent text-[#5c6b62] border-[#e0e7e2] hover:border-[#2d6a4f] hover:text-[#2d6a4f]"
            }`}
          >
            All
          </a>
          {allCategories.map((cat) => (
            <a
              key={cat}
              href={`/shop?category=${encodeURIComponent(cat)}`}
              className={`text-xs font-bold tracking-wider uppercase px-4 py-2 rounded-full border transition-colors whitespace-nowrap flex-shrink-0 ${
                categoryFilter === cat
                  ? "bg-[#2d6a4f] text-white border-[#2d6a4f]"
                  : "bg-transparent text-[#5c6b62] border-[#e0e7e2] hover:border-[#2d6a4f] hover:text-[#2d6a4f]"
              }`}
            >
              {cat}
            </a>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-24 py-8 sm:py-12">
        {filteredProducts.length > 0 ? (
          <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-serif font-semibold text-foreground mb-2">
              No products found
            </h3>
            <p className="text-[#5c6b62] text-sm mb-6">
              We couldn&apos;t find any products matching your criteria.
            </p>
            <a
              href="/shop"
              className="text-xs font-bold tracking-wider uppercase px-6 py-3 rounded-full bg-[#2d6a4f] text-white hover:bg-[#2d6a4f]/90 transition-colors"
            >
              View All Products
            </a>
          </div>
        )}
      </section>
    </div>
  );
}

export default function Shop() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#2d6a4f] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
