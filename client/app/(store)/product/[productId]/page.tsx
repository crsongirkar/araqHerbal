"use client";

import Features from "@/components/product/Features";
import ProductBreadcrumb from "@/components/product/ProductBreadcrumb";
import ProductNotFound from "@/components/product/ProductNotFound";
import RelatedProducts from "@/components/product/RelatedProducts";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/context/ProductsContext";
import { useWishlist } from "@/context/WishlistContext";
import { cn } from "@/lib/utils";
import {
  Check,
  Heart,
  Minus,
  Plus,
  Share2,
  ShoppingCart,
  Star,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Product() {
  const { addToCart } = useCart();
  const { products, loading, refreshProducts } = useProducts();
  const { productId } = useParams();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    refreshProducts();
  }, [productId, refreshProducts]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#2d6a4f] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const product = products.find((p) => p.id === parseInt(productId as string));

  if (!product) {
    return <ProductNotFound />;
  }

  const handleAddToCart = async () => {
    setIsAdding(true);

    await new Promise((resolve) => setTimeout(resolve, 300));

    // addToCart is async (checks session); call once with full quantity instead of looping
    await addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
    });

    setIsAdding(false);
    setJustAdded(true);

    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => router.push("/cart"), 500);
  };

  const handleQuantityChange = (type: "increment" | "decrement") => {
    const maxStock = (product as any).stock ?? 100;
    if (type === "increment") {
      setQuantity((prev) => Math.min(maxStock, prev + 1));
    } else if (type === "decrement" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const originalPrice = product.originalPrice || product.price * 1.25;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ProductBreadcrumb />

      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        <div className="space-y-4">
          {(() => {
            const allImages = [product.image, ...(product.images || [])].filter(Boolean);

            return (
              <div className="flex flex-col md:flex-row gap-4 items-start w-full max-w-[600px] mx-auto">
                {/* Thumbnails strip (vertical on desktop, horizontal on mobile) */}
                {allImages.length > 1 && (
                  <div className="flex flex-row md:flex-col gap-2 order-2 md:order-1 overflow-x-auto md:overflow-x-visible w-full md:w-auto pb-2 md:pb-0 scrollbar-none justify-start shrink-0">
                    {allImages.map((imgUrl, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImageIdx(index)}
                        onMouseEnter={() => setActiveImageIdx(index)}
                        className={cn(
                          "w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 overflow-hidden bg-white shrink-0 transition-all cursor-pointer relative",
                          activeImageIdx === index ? "border-[#2d6a4f] shadow-sm scale-102" : "border-[#e0e7e2] hover:border-[#2d6a4f]/55"
                        )}
                      >
                        <Image
                          src={imgUrl}
                          alt={`${product.name} gallery ${index}`}
                          fill
                          sizes="64px"
                          className="object-contain p-1"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Main active image */}
                <div className="flex-1 rounded-2xl bg-white border border-[#e0e7e2] shadow-sm overflow-hidden p-6 w-full flex items-center justify-center order-1 md:order-2 aspect-square relative min-h-[300px] sm:min-h-[400px]">
                  <Image
                    src={allImages[activeImageIdx] || "/images/NoImage.jpg"}
                    alt={product.name}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="object-contain p-4 rounded-2xl mix-blend-multiply"
                  />
                </div>
              </div>
            );
          })()}
        </div>

        <div className="space-y-6">
          {product.category && (
            <span className="inline-block text-xs font-bold tracking-widest text-[#2d6a4f] uppercase bg-[#e8f5e9] px-3 py-1 rounded-full">
              {product.category}
            </span>
          )}
          <h1 className="text-3xl lg:text-4xl font-serif font-semibold text-[#1e2521] mb-2">
            {product.name}
          </h1>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1 text-[#f97316]">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={cn(
                    "h-4 w-4",
                    i < Math.floor(product.rating || 5) ? "fill-current" : "text-stone-300"
                  )} 
                />
              ))}
            </div>
            <span className="text-sm text-[#5c6b62]">
              ({(product.rating || 5.0).toFixed(1)}) • {product.reviewCount || 48} reviews
            </span>
          </div>

          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-3xl font-bold text-[#2d6a4f]">
              ₹{product.price.toFixed(2)}
            </span>
            <span className="text-lg text-stone-400 line-through">
              ₹{originalPrice.toFixed(2)}
            </span>
            {((product as any).stock ?? 100) === 0 ? (
              <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full uppercase tracking-wider">
                Out of Stock
              </span>
            ) : ((product as any).stock ?? 100) <= 10 ? (
              <span className="text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-full uppercase tracking-wider">
                Only {((product as any).stock ?? 100)} left
              </span>
            ) : (
              <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full uppercase tracking-wider">
                In Stock
              </span>
            )}
          </div>

          <p className="text-[#5c6b62] leading-relaxed">
            {product.description}
          </p>

          {/* Mfg and Expiry Details */}
          {(product.mfgDate || product.expiryDate) && (
            <div className="bg-[#fcfcfb] border border-[#e0e7e2] rounded-2xl p-4 grid grid-cols-2 gap-4 text-xs shadow-sm">
              {product.mfgDate && (
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Mfg. Date</span>
                  <span className="font-semibold text-stone-800">{product.mfgDate}</span>
                </div>
              )}
              {product.expiryDate && (
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Expiry Date</span>
                  <span className="font-semibold text-stone-800">{product.expiryDate}</span>
                </div>
              )}
            </div>
          )}

          <Separator />

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#1e2521] mb-2 block">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-[#e0e7e2] rounded-lg bg-white">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange("decrement")}
                    disabled={quantity <= 1 || ((product as any).stock ?? 100) === 0}
                    className="h-10 w-10 rounded-r-none text-[#5c6b62] cursor-pointer"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 min-w-[60px] text-center font-medium text-[#1e2521]">
                    {((product as any).stock ?? 100) === 0 ? 0 : quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange("increment")}
                    disabled={quantity >= ((product as any).stock ?? 100) || ((product as any).stock ?? 100) === 0}
                    className="h-10 w-10 rounded-l-none text-[#5c6b62] cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex flex-row gap-3 pt-2">
              <Button
                className={cn(
                  "flex-1 h-12 transition-all duration-300 rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider",
                  ((product as any).stock ?? 100) === 0
                    ? "bg-stone-200 border border-stone-300 text-stone-500 cursor-not-allowed hover:bg-stone-200 hover:text-stone-500"
                    : justAdded
                    ? "bg-green-600 text-white hover:bg-green-600"
                    : "bg-[#2d6a4f] text-white hover:bg-[#2d6a4f]/90"
                )}
                onClick={handleAddToCart}
                disabled={isAdding || ((product as any).stock ?? 100) === 0}
              >
                {((product as any).stock ?? 100) === 0 ? (
                  <span>Out of Stock</span>
                ) : isAdding ? (
                  <div className="flex items-center gap-1.5 justify-center">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Adding...</span>
                  </div>
                ) : justAdded ? (
                  <div className="flex items-center gap-1.5 justify-center">
                    <Check className="h-4 w-4" />
                    <span>Added!</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 justify-center">
                    <ShoppingCart className="h-4 w-4" />
                    <span>Add to Cart</span>
                  </div>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={handleBuyNow}
                disabled={((product as any).stock ?? 100) === 0}
                className={cn(
                  "flex-1 h-12 rounded-full border-[#2d6a4f] text-[#2d6a4f] hover:bg-[#e8f5e9] font-bold text-xs sm:text-sm uppercase tracking-wider",
                  ((product as any).stock ?? 100) === 0 && "border-stone-300 text-stone-400 cursor-not-allowed hover:bg-transparent"
                )}
              >
                Buy Now
              </Button>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => product && toggleWishlist(product)}
                className={cn(
                  "text-[#5c6b62] hover:text-[#2d6a4f]",
                  isInWishlist(product.id) && "text-[#f97316] hover:text-[#f97316]"
                )}
              >
                <Heart
                  className={cn("h-4 w-4 mr-2", isInWishlist(product.id) && "fill-current")}
                />
                {isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-[#5c6b62] hover:text-[#2d6a4f]"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Features />

      <RelatedProducts product={product} />
    </div>
  );
}
