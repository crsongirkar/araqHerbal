"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { CreditCard, Heart, Shield, Truck } from "lucide-react";
import Link from "next/link";
import { useProducts } from "@/context/ProductsContext";

export default function OrderSummary() {
  const { cart } = useCart();
  const { products } = useProducts();

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const hasOutOfStockItems = cart.some((item) => {
    const prod = products.find((p) => Number(p.id) === Number(item.id));
    const stock = prod ? (prod as any).stock ?? 0 : 0;
    return stock < item.quantity || stock === 0;
  });

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Order Summary</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Subtotal ({itemCount} items)
            </span>
            <span className="font-medium">₹{subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span className="font-medium">
              {shipping === 0 ? (
                <Badge variant="secondary" className="text-xs">
                  Free
                </Badge>
              ) : (
                `₹${shipping.toFixed(2)}`
              )}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax</span>
            <span className="font-medium">₹{tax.toFixed(2)}</span>
          </div>

          <Separator />

          <div className="flex justify-between">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-lg font-bold text-primary">
              ₹{total.toFixed(2)}
            </span>
          </div>
        </div>

        {shipping > 0 && (
          <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
            <p className="text-xs text-muted-foreground">
              Add ₹{(50 - subtotal).toFixed(2)} more to qualify!
            </p>
          </div>
        )}

        {hasOutOfStockItems && (
          <div className="p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
            <p className="text-xs font-semibold">
              Warning: Some items in your cart are out of stock or exceed available quantities. Please adjust quantities to continue.
            </p>
          </div>
        )}

        {hasOutOfStockItems ? (
          <Button
            size="lg"
            className="w-full bg-stone-100 border border-stone-300 text-stone-400 cursor-not-allowed hover:bg-stone-100 hover:text-stone-400 font-semibold text-xs uppercase tracking-wider py-5 flex items-center justify-center gap-2 rounded-full"
            disabled
          >
            <CreditCard className="h-4 w-4" />
            Proceed to Checkout
          </Button>
        ) : (
          <Button
            size="lg"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-xs py-5 cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2 rounded-full"
            asChild
          >
            <Link href="/checkout" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Proceed to Checkout
            </Link>
          </Button>
        )}

        <div className="space-y-3 pt-4 border-t border-border">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 text-green-500" />
            <span>Secure SSL checkout</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Truck className="h-4 w-4 text-blue-500" />
            <span>Free returns within 30 days</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Heart className="h-4 w-4 text-red-500" />
            <span>24/7 customer support</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
