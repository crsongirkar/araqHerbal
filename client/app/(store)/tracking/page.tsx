"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Box, CheckCircle2, Clock, Truck, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useProducts } from "@/context/ProductsContext";
import Image from "next/image";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface TrackedOrder {
  id: number;
  customerName: string;
  date: string;
  status: string; // Pending, Shipped, Delivered, Cancelled
  items: OrderItem[];
  total: number;
}

function TrackingContent() {
  const { products } = useProducts();
  const searchParams = useSearchParams();
  const paramId = searchParams.get("id");
  const paramEmail = searchParams.get("email");

  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [itemsExpanded, setItemsExpanded] = useState(false);

  // Auto-track if query parameters are present on load
  useEffect(() => {
    if (paramId && paramEmail) {
      setOrderId(paramId);
      setEmail(paramEmail);
      
      const autoTrack = async () => {
        setStatus("loading");
        setErrorMsg("");
        setOrder(null);
        try {
          const res = await fetch("/api/orders/track", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ orderId: paramId.trim(), email: paramEmail.trim() }),
          });
          const data = await res.json();
          if (res.ok) {
            setOrder(data);
            setStatus("success");
          } else {
            setErrorMsg(data.error || "Failed to find order details.");
            setStatus("error");
          }
        } catch (err) {
          setErrorMsg("A network error occurred. Please try again.");
          setStatus("error");
        }
      };
      autoTrack();
    }
  }, [paramId, paramEmail]);

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim() || !email.trim()) return;

    setStatus("loading");
    setErrorMsg("");
    setOrder(null);
    setItemsExpanded(false);

    try {
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId: orderId.trim(), email: email.trim() }),
      });

      const data = await res.json();
      if (res.ok) {
        setOrder(data);
        setStatus("success");
      } else {
        setErrorMsg(data.error || "Failed to find order details.");
        setStatus("error");
      }
    } catch (err) {
      setErrorMsg("A network error occurred. Please try again.");
      setStatus("error");
    }
  };

  const getStatusStep = (orderStatus: string) => {
    switch (orderStatus) {
      case "Pending": return 1;
      case "Shipped": return 2;
      case "Delivered": return 3;
      default: return 1;
    }
  };

  const currentStep = order ? getStatusStep(order.status) : 1;

  return (
    <div className="min-h-screen bg-[#F8F5EE] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-[#5c6b62] hover:text-[#2d6a4f] transition-all font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>

        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#2d6a4f]">
            Order Status
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[#1e2521]">
            Track Your Order
          </h1>
          <p className="text-sm text-[#5c6b62] max-w-md mx-auto leading-relaxed">
            Enter your 4-digit Order ID and your billing email address to check the live status of your shipment.
          </p>
        </div>

        {/* Main Card */}
        <Card className="border border-[#e0e7e2] shadow-sm rounded-3xl overflow-hidden bg-white">
          <CardContent className="p-6 sm:p-10">
            {/* Input Form */}
            <form onSubmit={handleTrackSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-end">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5c6b62] mb-2">
                  Order ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1001"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full bg-[#fcfcfb] rounded-xl border border-[#D8D2C4] px-4 py-3 text-sm outline-none focus:border-[#2d6a4f] transition-all placeholder:text-stone-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5c6b62] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#fcfcfb] rounded-xl border border-[#D8D2C4] px-4 py-3 text-sm outline-none focus:border-[#2d6a4f] transition-all placeholder:text-stone-400"
                  required
                />
              </div>

              <div className="sm:col-span-2 mt-2">
                <Button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full bg-[#2d6a4f] hover:bg-[#1f4735] text-white py-6 rounded-xl font-semibold uppercase tracking-wider text-xs transition-all cursor-pointer"
                >
                  {status === "loading" ? "Searching..." : "Track Order"}
                </Button>
              </div>
            </form>

            {/* Error Message */}
            {status === "error" && (
              <div className="mt-6 bg-red-50 text-red-700 text-sm font-medium px-4 py-3.5 rounded-xl border border-red-200">
                {errorMsg}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tracking Details Display */}
        {status === "success" && order && (
          <Card className="border border-[#e0e7e2] shadow-sm rounded-3xl overflow-hidden bg-white animate-in fade-in duration-300">
            <CardContent className="p-6 sm:p-10 space-y-10">
              
              {/* Summary Info */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-stone-100">
                <div>
                  <h3 className="text-lg font-bold text-[#1e2521]">
                    Order #{order.id}
                  </h3>
                  <p className="text-xs text-[#5c6b62] mt-1">
                    Placed on {order.date} • Customer: {order.customerName}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-[#5c6b62]">Total Amount</span>
                  <span className="text-xl font-bold text-[#2d6a4f] mt-0.5">
                    ₹{order.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Live Tracking Status Stepper */}
              {order.status === "Cancelled" ? (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                  <span className="text-red-700 font-semibold block text-base">
                    This order has been Cancelled
                  </span>
                  <p className="text-xs text-red-650 mt-1 max-w-md mx-auto leading-relaxed">
                    If this is unexpected, please contact our support team at hello@araqherbal.com or check your email for refund details.
                  </p>
                </div>
              ) : (
                <div className="relative py-4">
                  {/* Step connectors */}
                  <div className="absolute top-[34px] left-[15%] right-[15%] h-[2px] bg-stone-200 -z-10 hidden sm:block">
                    <div 
                      className="h-full bg-[#2d6a4f] transition-all duration-500" 
                      style={{ width: currentStep === 1 ? "0%" : currentStep === 2 ? "50%" : "100%" }}
                    />
                  </div>

                  {/* Steps */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                    
                    {/* Step 1: Processing */}
                    <div className="flex flex-row sm:flex-col items-center gap-4 sm:gap-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        currentStep >= 1 ? "bg-[#2d6a4f] text-white" : "bg-stone-100 text-stone-400"
                      }`}>
                        <Clock className="h-5 w-5" />
                      </div>
                      <div className="text-left sm:text-center">
                        <span className="text-xs font-semibold uppercase tracking-wider block text-[#1e2521]">
                          Processing
                        </span>
                        <span className="text-[11px] text-[#5c6b62]">
                          Order confirmed
                        </span>
                      </div>
                    </div>

                    {/* Step 2: Shipped */}
                    <div className="flex flex-row sm:flex-col items-center gap-4 sm:gap-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        currentStep >= 2 ? "bg-[#2d6a4f] text-white" : "bg-stone-100 text-stone-400"
                      }`}>
                        <Truck className="h-5 w-5" />
                      </div>
                      <div className="text-left sm:text-center">
                        <span className="text-xs font-semibold uppercase tracking-wider block text-[#1e2521]">
                          In Transit
                        </span>
                        <span className="text-[11px] text-[#5c6b62]">
                          Dispatched via partner
                        </span>
                      </div>
                    </div>

                    {/* Step 3: Delivered */}
                    <div className="flex flex-row sm:flex-col items-center gap-4 sm:gap-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        currentStep >= 3 ? "bg-[#2d6a4f] text-white" : "bg-stone-100 text-stone-400"
                      }`}>
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div className="text-left sm:text-center">
                        <span className="text-xs font-semibold uppercase tracking-wider block text-[#1e2521]">
                          Delivered
                        </span>
                        <span className="text-[11px] text-[#5c6b62]">
                          Arrived at destination
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* Items List */}
              <div className="space-y-4 pt-6 border-t border-stone-100">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5c6b62] block">
                  Items Summary
                </span>
                <div className="divide-y divide-[#e0e7e2]/50">
                  {(() => {
                    const displayedItems = itemsExpanded ? order.items : order.items.slice(0, 3);
                    const hasMoreItems = order.items.length > 3;

                    return (
                      <>
                        {displayedItems.map((item, idx) => {
                          const product = products.find(
                            (p) => Number(p.id) === Number(item.id) || p.name.toLowerCase() === item.name.toLowerCase()
                          );
                          const imageSrc = item.image || product?.image || "/images/NoImage.jpg";

                          return (
                            <div key={idx} className="flex justify-between items-center py-3.5 gap-4">
                              <div className="flex items-center gap-3 min-w-0">
                                {/* Small Product Image */}
                                <div className="relative w-12 h-12 shrink-0 rounded-xl overflow-hidden border border-stone-200/80 bg-stone-50">
                                  <Image
                                    src={imageSrc}
                                    alt={item.name}
                                    fill
                                    sizes="48px"
                                    className="object-cover"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <span className="text-sm font-bold text-[#1e2521] block truncate">
                                    {item.name}
                                  </span>
                                  <span className="text-xs text-stone-500 block mt-0.5">
                                    ₹{item.price.toFixed(2)} <span className="text-stone-400 font-normal">x {item.quantity}</span>
                                  </span>
                                </div>
                              </div>
                              <span className="text-sm font-semibold text-[#2d6a4f] shrink-0">
                                ₹{(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          );
                        })}

                        {hasMoreItems && (
                          <button
                            onClick={() => setItemsExpanded(!itemsExpanded)}
                            className="w-full text-center py-2.5 mt-2 text-[10px] font-bold uppercase tracking-wider text-stone-500 hover:text-[#2d6a4f] hover:bg-stone-50 transition-colors flex items-center justify-center gap-1 border-t border-stone-100 cursor-pointer"
                          >
                            {itemsExpanded ? "Show Less" : `Show All ${order.items.length} Items`}
                          </button>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>

            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}

export default function TrackingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F8F5EE] py-16 px-4 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-[#2d6a4f] animate-spin" />
        <p className="text-sm font-semibold text-stone-500">Loading live tracking details...</p>
      </div>
    }>
      <TrackingContent />
    </Suspense>
  );
}
