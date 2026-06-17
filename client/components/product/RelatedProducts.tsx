"use client";

import { useProducts } from "@/context/ProductsContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/home/ProductCard";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  rating?: number;
  reviewCount?: number;
}

interface RelatedProductsProps {
  product: Product;
}

export default function RelatedProducts({ product }: RelatedProductsProps) {
  const { products } = useProducts();

  const related = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  // Fallback to any products if no products match the same category
  const displayProducts = related.length > 0 
    ? related 
    : products.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-serif font-semibold text-[#1e2521]">Related Products</h2>
        <Button variant="ghost" asChild>
          <Link href="/shop" className="text-[#2d6a4f] hover:text-[#2d6a4f]/80 font-bold uppercase tracking-wider text-xs">
            View All
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {displayProducts.map((relatedProduct) => (
          <ProductCard key={relatedProduct.id} product={relatedProduct} />
        ))}
      </div>
    </div>
  );
}
