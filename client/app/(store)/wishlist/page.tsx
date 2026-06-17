"use client";

import ProductCard from "@/components/home/ProductCard";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { Heart, ShoppingCart, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function WishlistPage() {
  const { wishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [addingAll, setAddingAll] = useState(false);

  const handleAddAllToCart = async () => {
    setAddingAll(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    // addToCart is async and checks login — await the first item to gate auth
    for (const item of wishlist) {
      await addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1,
      });
    }

    setAddingAll(false);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-6xl min-h-[70vh]">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e0e7e2] pb-6 mb-8">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild className="text-[#5c6b62]">
            <Link href="/shop"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <h1 className="text-3xl font-serif font-bold text-[#1e2521]">My Wishlist</h1>
        </div>

        {wishlist.length > 0 && (
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={clearWishlist}
              className="rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 text-xs px-4"
            >
              Clear All
            </Button>
            <Button
              size="sm"
              onClick={handleAddAllToCart}
              disabled={addingAll}
              className="rounded-full bg-[#2d6a4f] hover:bg-[#2d6a4f]/90 text-white font-bold text-xs px-5 cursor-pointer flex items-center gap-2"
            >
              {addingAll ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" />
                  Add All to Cart
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Wishlist Content */}
      {wishlist.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-[#e0e7e2] rounded-3xl bg-stone-50/50 space-y-5 max-w-md mx-auto">
          <div className="inline-flex w-16 h-16 rounded-full bg-[#e8f5e9] text-[#2d6a4f] items-center justify-center">
            <Heart className="w-8 h-8 text-[#2d6a4f]" />
          </div>
          <div className="space-y-2 px-4">
            <h2 className="text-lg font-serif font-bold text-[#1e2521]">Your wishlist is empty</h2>
            <p className="text-xs text-[#5c6b62]">
              Explore our range of cold-process soaps and botanical elixirs, and save your favorites here.
            </p>
          </div>
          <Button asChild className="rounded-full bg-[#2d6a4f] hover:bg-[#2d6a4f]/90 text-xs px-6 uppercase tracking-wider">
            <Link href="/shop">Browse Shop</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
}
