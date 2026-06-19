"use client";

import CartItemList from "@/components/cart/CartItemList";
import EmptyCart from "@/components/cart/EmptyCart";
import OrderSummary from "@/components/cart/OrderSummary";
import Recommendations from "@/components/cart/Recommendations";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/context/ProductsContext";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function Cart() {
  const { cart } = useCart();
  const { refreshProducts } = useProducts();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  if (cart.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between mb-6 sm:mb-8 gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Shopping Cart</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <Button
          variant="ghost"
          asChild
          className="text-muted-foreground hover:text-foreground text-xs sm:text-sm shrink-0"
        >
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <CartItemList />
        </div>

        <div className="lg:col-span-1">
          <OrderSummary />
        </div>
      </div>

      {/* <Recommendations /> */}
    </div>
  );
}
