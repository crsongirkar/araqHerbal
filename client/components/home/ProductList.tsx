"use client";

import { useProducts } from "@/context/ProductsContext";
import ProductCard from "./ProductCard";

export default function ProductList() {
  const { products, loading } = useProducts();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-[#2d6a4f] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm text-[#5c6b62]">Loading our collection...</p>
      </div>
    );
  }

  // Show first 6 products as featured on the home screen
  const featuredProducts = products.slice(0, 6);

  return (
    <div className="grid gap-3 sm:gap-6 grid-cols-1 min-[380px]:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
      {featuredProducts.length > 0 ? (
        featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No products found
          </h3>
          <p className="text-[#5c6b62] mb-4">
            Try adjusting your filters or check back later.
          </p>
        </div>
      )}
    </div>
  );
}
