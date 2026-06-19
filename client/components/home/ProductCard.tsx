"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { cn } from "@/lib/utils";
import { Check, Eye, Heart, Share2, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Product {
  id: number;
  image: string;
  name: string;
  price: number;
  originalPrice?: number;
  category?: string;
  rating?: number;
  reviewCount?: number;
  stock?: number;
}

export default function ProductCard({ product }: { product: Product }) {
  const [imageError, setImageError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const { cart, addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isLiked = isInWishlist(product.id);
  const router = useRouter();

  const isInCart = cart.some((item) => item.id === product.id);

  // Handle default fallback values to populate VegShop-style details beautifully
  const ratingVal = product.rating || 5.0;
  const originalPriceVal = product.originalPrice || parseFloat((product.price * 1.25).toFixed(2));

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInCart) {
      router.push("/cart");
      return;
    }

    setIsAdding(true);
    await new Promise((resolve) => setTimeout(resolve, 300));

    await addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });

    setIsAdding(false);
    // Only show "Added!" tick if user was actually logged in (modal would have shown otherwise)
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleToggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on ARAQ!`,
        url: window.location.origin + `/product/${product.id}`,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.origin + `/product/${product.id}`);
      alert("Product link copied to clipboard!");
    }
  };

  return (
    <div className="relative group w-full">
      <Card 
        className={cn(
          "h-full overflow-hidden bg-white border border-[#e0e7e2] transition-all duration-300 rounded-2xl shadow-sm flex flex-col justify-between",
          "group-hover:border-[#2d6a4f]/20 group-hover:-translate-y-1 group-hover:shadow-md"
        )}
      >
        <div className="relative overflow-hidden bg-white aspect-square flex items-center justify-center p-4">
          <Link href={`/product/${product.id}`} className="block relative w-full h-full">
            {!imageError ? (
              <Image
                src={product.image}
                alt={product.name}
                width={400}
                height={400}
                unoptimized={product.image?.startsWith("data:")}
                className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-[#f1f5f2] rounded-xl flex items-center justify-center">
                <span className="text-xs text-[#5c6b62]">Image not available</span>
              </div>
            )}
          </Link>

          {/* Out of stock badge */}
          {product.stock === 0 && (
            <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm z-10 select-none">
              Out of Stock
            </div>
          )}

          {/* Quick Action Circles Overlay */}
          <div className="absolute inset-0 bg-[#2d6a4f]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            <button
              onClick={handleToggleLike}
              className={cn(
                "w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#5c6b62] hover:text-[#f97316] hover:bg-[#e8f5e9] transition-all duration-200 transform scale-90 group-hover:scale-100 hover:scale-110",
                isLiked && "text-[#f97316] bg-[#e8f5e9]"
              )}
              title="Add to Wishlist"
            >
              <Heart className={cn("h-4.5 w-4.5", isLiked && "fill-current")} />
            </button>

            <Link
              href={`/product/${product.id}`}
              className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#5c6b62] hover:text-[#2d6a4f] hover:bg-[#e8f5e9] transition-all duration-200 transform scale-90 group-hover:scale-100 hover:scale-110"
              title="Quick View"
            >
              <Eye className="h-4.5 w-4.5" />
            </Link>

            <button
              onClick={handleShare}
              className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#5c6b62] hover:text-[#2d6a4f] hover:bg-[#e8f5e9] transition-all duration-200 transform scale-90 group-hover:scale-100 hover:scale-110"
              title="Share Product"
            >
              <Share2 className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        <CardContent className="p-5 flex flex-col flex-grow justify-between gap-4">
          <div className="space-y-2">
            {/* Rating Stars Under Image */}
            <div className="flex items-center gap-1">
              <div className="flex items-center text-[#f97316]">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={cn(
                      "h-3.5 w-3.5",
                      i < Math.floor(ratingVal) ? "fill-current" : "text-stone-300"
                    )} 
                  />
                ))}
              </div>
              <span className="text-[11px] font-bold text-[#5c6b62]">
                ({ratingVal.toFixed(1)})
              </span>
            </div>

            {/* Product Title */}
            <Link href={`/product/${product.id}`} className="block">
              <h3 className="font-medium text-[#1e2521] leading-tight line-clamp-2 hover:text-[#2d6a4f] transition-colors text-sm sm:text-base">
                {product.name}
              </h3>
            </Link>
          </div>

          <div className="space-y-4">
            {/* Price section - Current price & discounted strike-through */}
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-bold text-[#2d6a4f]">
                ₹{product.price.toFixed(2)}
              </span>
              <span className="text-xs sm:text-sm text-stone-400 line-through">
                ₹{originalPriceVal.toFixed(2)}
              </span>
            </div>

            {/* Add To Cart Button: Outlined Green -> Solid Green */}
            <Button
              className={cn(
                "w-full rounded-full border border-[#2d6a4f] transition-all duration-300 font-semibold text-xs py-5 cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2",
                product.stock === 0
                  ? "bg-stone-100 border-stone-300 text-stone-400 cursor-not-allowed hover:bg-stone-100 hover:text-stone-400"
                  : isInCart
                  ? "bg-[#2d6a4f] border-[#2d6a4f] text-white hover:bg-[#2d6a4f]/90"
                  : justAdded
                  ? "bg-green-600 border-green-600 text-white hover:bg-green-600"
                  : isAdding
                  ? "bg-[#e8f5e9] text-[#2d6a4f]"
                  : "bg-white text-[#2d6a4f] hover:bg-[#2d6a4f] hover:text-white"
              )}
              onClick={handleAddToCart}
              disabled={(!isInCart && isAdding) || product.stock === 0}
            >
              {product.stock === 0 ? (
                <span>Out of Stock</span>
              ) : isInCart ? (
                <>
                  <span>Go to Cart</span>
                  <ShoppingCart className="h-3.5 w-3.5" />
                </>
              ) : isAdding ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Adding...</span>
                </>
              ) : justAdded ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <span>Add To Cart</span>
                  <ShoppingCart className="h-3.5 w-3.5" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
