"use client";

import { useCart } from "@/context/CartContext";
import { useProducts } from "@/context/ProductsContext";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2, CreditCard, ArrowLeft, Loader2, MessageCircle, X } from "lucide-react";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { refreshProducts } = useProducts();
  const router = useRouter();

  // ── Submission guard refs: prevent any double-submit ──
  const isSubmittingRef = useRef(false);  // blocks double order creation
  const whatsappConfirmShownRef = useRef(false);  // focus event fires only once
  const whatsappPopupTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [successOrder, setSuccessOrder] = useState<any>(null);
  const [error, setError] = useState("");

  const [user, setUser] = useState<any>(null);
  const [hasSavedAddress, setHasSavedAddress] = useState(false);


  const [showWhatsappConfirm, setShowWhatsappConfirm] = useState(false);
  const [whatsappOrderSnapshot, setWhatsappOrderSnapshot] = useState<any>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setUser(data.user);
            if (data.user.name) {
              const parts = data.user.name.split(" ");
              setFirstName(parts[0] || "");
              setLastName(parts.slice(1).join(" ") || "");
            }
            if (data.user.email) {
              setEmail(data.user.email);
            }
            if (data.user.phone) {
              setPhone(data.user.phone);
            }
            const addr = data.user.address;
            if (addr && (addr.street || addr.city || addr.zipCode)) {
              setHasSavedAddress(true);
              setAddress(addr.street ? addr.street.replace(" | ", ", ") : "");
              setCity(addr.city || "");
              setZipCode(addr.zipCode || "");
            }
          }
        }
      } catch (err) {
        console.error("Failed to check session:", err);
      }
    }
    checkSession();
  }, []);

  useEffect(() => {
    // Show the WhatsApp confirmation popup only ONCE when window regains focus
    const handleFocus = () => {
      if (whatsappOrderSnapshot && !whatsappConfirmShownRef.current) {
        whatsappConfirmShownRef.current = true;
        setShowWhatsappConfirm(true);
      }
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [whatsappOrderSnapshot]);

  const handleClearAddress = () => {
    setAddress("");
    setCity("");
    setZipCode("");
  };

  const handleUseSavedAddress = () => {
    if (user && user.address) {
      const addr = user.address;
      setAddress(addr.street ? addr.street.replace(" | ", ", ") : "");
      setCity(addr.city || "");
      setZipCode(addr.zipCode || "");
    }
  };

  const validateForm = () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim() || !address.trim() || !city.trim() || !zipCode.trim()) {
      setError("Please complete all shipping address fields.");
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      return false;
    }

    // Phone number validation (10 digits, optional +91 or 91 prefix)
    const phoneRegex = /^(?:\+91|91)?[6-9]\d{9}$/;
    if (!phoneRegex.test(phone.trim())) {
      setError("Please enter a valid 10-digit phone number.");
      return false;
    }

    // PIN code validation (6 digits)
    const pinRegex = /^\d{6}$/;
    if (!pinRegex.test(zipCode.trim())) {
      setError("Please enter a valid 6-digit PIN code.");
      return false;
    }

    setError("");
    return true;
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const openWhatsAppMessage = (order: any, isWhatsAppOrder: boolean) => {
    const itemsText = order.items
      .map((item: any) => `- ${item.name} x ${item.quantity} (₹${item.price.toFixed(2)} each)`)
      .join("\n");

    const paymentType = isWhatsAppOrder ? "WhatsApp Request (Pending)" : "Paid Online (Prepaid) 💳";

    const message =
`Hello ARAQ! 👋 I've placed an order:

*🛒 Order Details*
━━━━━━━━━━━━━━━━━━━━━
*Order ID:* #${order.id}
*Customer:* ${order.customerName}
*Email:* ${order.customerEmail}
*Phone:* ${order.customerPhone}
*Payment Method:* ${paymentType}
━━━━━━━━━━━━━━━━━━━━━

*📦 Items Ordered:*
${itemsText}

━━━━━━━━━━━━━━━━━━━━━
*💰 Order Summary:*
Subtotal: ₹${order.subtotal.toFixed(2)}
Shipping: ${order.shipping === 0 ? "FREE 🎉" : `₹${order.shipping.toFixed(2)}`}
Tax: ₹${order.tax.toFixed(2)}
*Total: ₹${order.total.toFixed(2)}*
━━━━━━━━━━━━━━━━━━━━━

Please confirm my order. Thank you! 🌿`;

    const encodedText = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919960361331?text=${encodedText}`;
    window.open(whatsappUrl, "_blank");
  };

  const processDirectOrder = async (paymentId?: string) => {
    // Guard: prevent duplicate order creation from Razorpay callback firing multiple times
    if (isSubmittingRef.current) {
      console.warn("processDirectOrder: submission already in progress, ignoring.");
      setLoading(false);
      return;
    }
    isSubmittingRef.current = true;
    try {
      const orderPayload = {
        customerName: `${firstName} ${lastName}`,
        customerEmail: email,
        customerPhone: phone,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        subtotal,
        shipping,
        tax,
        total,
        paymentMethod: paymentId ? "Razorpay Online" : "Online Fallback",
        paymentId: paymentId || "FALLBACK_DIRECT"
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (res.ok) {
        const orderData = await res.json();
        setSuccessOrder(orderData);
        clearCart();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to process order. Please try again.");
        isSubmittingRef.current = false; // allow retry on error
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Check your network.");
      isSubmittingRef.current = false; // allow retry on error
    } finally {
      setLoading(false);
    }
  };

  const handlePayOnline = async () => {
    if (!validateForm()) return;
    setLoading(true);
    setError("");

    const isScriptLoaded = await loadRazorpayScript();

    if (!isScriptLoaded || !(window as any).Razorpay) {
      console.warn("Razorpay SDK failed to load. Falling back to direct order confirmation.");
      await processDirectOrder();
      return;
    }

    try {
      const options = {
        key: "rzp_test_T3QHGDeb3QU0jo",
        amount: Math.round(total * 100),
        currency: "INR",
        name: "ARAQ Herbal",
        description: "Order Payment",
        prefill: {
          name: `${firstName} ${lastName}`,
          email: email,
          contact: phone
        },
        theme: {
          color: "#2d6a4f"
        },
        handler: async function (response: any) {
          await processDirectOrder(response.razorpay_payment_id);
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        console.error("Razorpay Payment Failed:", response ? response.error : null);
        const errorDetail = response && response.error ? response.error.description : "";
        setError(`Payment failed: ${errorDetail || "Transaction failed."} Please try again.`);
        setLoading(false);
      });
      rzp.open();
    } catch (err: any) {
      console.error("Failed to initialize Razorpay checkout:", err);
      await processDirectOrder();
    }
  };

  const handleWhatsappOrder = () => {
    if (!validateForm()) return;

    const snapshot = {
      customerName: `${firstName} ${lastName}`,
      customerEmail: email,
      customerPhone: phone,
      address, city, zipCode,
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      subtotal,
      shipping,
      tax,
      total
    };
    setWhatsappOrderSnapshot(snapshot);
    // Reset the "shown once" guard for this new WhatsApp order session
    whatsappConfirmShownRef.current = false;

    // Build message template
    const itemsText = cart
      .map(item => `- ${item.name} x ${item.quantity} (₹${item.price.toFixed(2)} each)`)
      .join("\n");

    const message =
`Hello ARAQ! 👋 I'd like to place an order:

*🛒 Order Details*
━━━━━━━━━━━━━━━━━━━━━
*Customer:* ${firstName} ${lastName}
*Email:* ${email}
*Phone:* ${phone}
*Address:* ${address}, ${city} - ${zipCode}
━━━━━━━━━━━━━━━━━━━━━

*📦 Items Ordered:*
${itemsText}

━━━━━━━━━━━━━━━━━━━━━
*💰 Order Summary:*
Subtotal: ₹${subtotal.toFixed(2)}
Shipping: ${shipping === 0 ? "FREE 🎉" : `₹${shipping.toFixed(2)}`}
Tax: ₹${tax.toFixed(2)}
*Total: ₹${total.toFixed(2)}*
━━━━━━━━━━━━━━━━━━━━━

Please confirm my order. Thank you! 🌿`;

    const encodedText = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919960361331?text=${encodedText}`;

    window.open(whatsappUrl, "_blank");

    // Show popup after 3s as a fallback (in case focus event doesn't fire)
    // Clear any previous timeout first
    if (whatsappPopupTimeoutRef.current) clearTimeout(whatsappPopupTimeoutRef.current);
    whatsappPopupTimeoutRef.current = setTimeout(() => {
      if (!whatsappConfirmShownRef.current) {
        whatsappConfirmShownRef.current = true;
        setShowWhatsappConfirm(true);
      }
    }, 3000);
  };

  // User confirms they placed the order on WhatsApp
  const handleWhatsappConfirmYes = async () => {
    // Guard: prevent double-click / double submission
    if (isSubmittingRef.current || !whatsappOrderSnapshot) return;
    isSubmittingRef.current = true;
    setConfirmLoading(true);

    // Capture snapshot and clear state BEFORE the API call so the
    // focus event handler cannot trigger another submission
    const snapshot = { ...whatsappOrderSnapshot };
    setWhatsappOrderSnapshot(null);
    setShowWhatsappConfirm(false);
    // Cancel the 3-second fallback timeout if it hasn't fired yet
    if (whatsappPopupTimeoutRef.current) {
      clearTimeout(whatsappPopupTimeoutRef.current);
      whatsappPopupTimeoutRef.current = null;
    }

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(snapshot),
      });

      if (res.ok) {
        const orderData = await res.json();
        setSuccessOrder(orderData);
        clearCart();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to record order. Please try again.");
        // Restore snapshot so user can try again
        setWhatsappOrderSnapshot(snapshot);
        isSubmittingRef.current = false;
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Check your network.");
      // Restore snapshot so user can try again
      setWhatsappOrderSnapshot(snapshot);
      isSubmittingRef.current = false;
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleWhatsappConfirmNo = () => {
    setShowWhatsappConfirm(false);
    setWhatsappOrderSnapshot(null);
    whatsappConfirmShownRef.current = false;
    if (whatsappPopupTimeoutRef.current) {
      clearTimeout(whatsappPopupTimeoutRef.current);
      whatsappPopupTimeoutRef.current = null;
    }
    // Cart stays intact, user can continue browsing
  };

  if (successOrder) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-background px-4 sm:px-6">
        <div className="max-w-md w-full bg-white border border-[#e0e7e2] rounded-3xl p-8 text-center shadow-sm space-y-6">
          <div className="inline-flex w-16 h-16 rounded-full bg-[#e8f5e9] text-[#2d6a4f] items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-serif font-bold text-[#1e2521]">Thank you for your order!</h1>
            <p className="text-xs text-[#5c6b62]">We&apos;ve received your order and will start preparing it shortly.</p>
          </div>

          <div className="bg-[#f1f5f2] rounded-2xl p-4 text-left border border-[#e0e7e2]/70 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-stone-400">Order ID:</span>
              <span className="font-mono font-bold text-[#1e2521]">#{successOrder.id}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-stone-400">Total Charged:</span>
              <span className="font-bold text-[#2d6a4f]">₹{successOrder.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-stone-400">Status:</span>
              <span className="font-bold text-orange-500 uppercase tracking-widest text-[9px]">{successOrder.status}</span>
            </div>
          </div>

          <div className="pt-2 space-y-3">
            <Button
              variant="outline"
              className="w-full rounded-full border-[#2d6a4f] text-[#2d6a4f] hover:bg-stone-50 font-bold py-6 text-xs uppercase tracking-wider cursor-pointer"
              asChild
            >
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-6xl">

      {/* WhatsApp Order Confirmation Popup */}
      {showWhatsappConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 space-y-6 border border-[#e0e7e2] animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#25D366]/10 flex items-center justify-center shrink-0">
                <MessageCircle className="w-7 h-7 text-[#25D366]" />
              </div>
              <div>
                <h2 className="text-lg font-serif font-bold text-[#1e2521] leading-tight">
                  Did you send the order on WhatsApp?
                </h2>
                <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                  We&apos;ll only record your order in our system if you successfully sent the message.
                </p>
              </div>
              <button
                onClick={handleWhatsappConfirmNo}
                className="ml-auto p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Order Summary Preview */}
            <div className="bg-[#f8fcf9] border border-[#e0e7e2] rounded-2xl p-4 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500">Customer</span>
                <span className="font-semibold text-[#1e2521]">{whatsappOrderSnapshot?.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Items</span>
                <span className="font-semibold text-[#1e2521]">{cart.length} item{cart.length !== 1 ? "s" : ""}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#e0e7e2]">
                <span className="font-bold text-[#1e2521]">Total</span>
                <span className="font-black text-[#2d6a4f] text-sm">₹{whatsappOrderSnapshot?.total?.toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                type="button"
                onClick={handleWhatsappConfirmNo}
                disabled={confirmLoading}
                className="flex-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-5 text-xs uppercase tracking-wider cursor-pointer border border-stone-200 disabled:opacity-50"
              >
                No, I Didn&apos;t
              </Button>
              <Button
                type="button"
                onClick={handleWhatsappConfirmYes}
                disabled={confirmLoading}
                className="flex-1 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold py-5 text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
              >
                {confirmLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Recording...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Yes, I Ordered!
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <Button variant="ghost" size="icon" asChild className="text-[#5c6b62] shrink-0">
          <Link href="/cart"><ArrowLeft className="w-5 h-5" /></Link>
        </Button>
        <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-[#1e2521]">Checkout</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 items-start">
        {/* Form billing details */}
        <form onSubmit={(e) => e.preventDefault()} className="lg:col-span-2 space-y-8">
          {/* Shipping Section */}
          <div className="bg-white border border-[#e0e7e2] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-2 border-b border-[#e0e7e2]/60 pb-3">
              <h2 className="text-lg font-serif font-semibold text-[#1e2521]">1. Shipping Information</h2>
              {hasSavedAddress && (
                <div className="flex gap-2">
                  {address || city || zipCode ? (
                    <button
                      type="button"
                      onClick={handleClearAddress}
                      className="text-[10px] font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100/60 px-3.5 py-1.5 rounded-full transition-all cursor-pointer uppercase tracking-wider"
                    >
                      Add Another Address
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleUseSavedAddress}
                      className="text-[10px] font-bold text-[#2d6a4f] hover:text-[#1a5c38] bg-[#e8f5e9] hover:bg-[#e8f5e9]/80 px-3.5 py-1.5 rounded-full transition-all cursor-pointer uppercase tracking-wider"
                    >
                      Use Saved Address
                    </button>
                  )}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-[#1e2521] tracking-wider uppercase block mb-1.5">First Name</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Chinmay"
                  className="w-full rounded-xl border border-[#e0e7e2] px-4 py-2.5 text-xs focus:outline-none focus:border-[#2d6a4f]"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#1e2521] tracking-wider uppercase block mb-1.5">Last Name</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Kumar"
                  className="w-full rounded-xl border border-[#e0e7e2] px-4 py-2.5 text-xs focus:outline-none focus:border-[#2d6a4f]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-[#1e2521] tracking-wider uppercase block mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. user@example.com"
                  className="w-full rounded-xl border border-[#e0e7e2] px-4 py-2.5 text-xs focus:outline-none focus:border-[#2d6a4f]"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#1e2521] tracking-wider uppercase block mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9+]/g, "");
                    if (val.length <= 10) setPhone(val);
                  }}
                  placeholder="e.g. 1234567890"
                  className="w-full rounded-xl border border-[#e0e7e2] px-4 py-2.5 text-xs focus:outline-none focus:border-[#2d6a4f]"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#1e2521] tracking-wider uppercase block mb-1.5">Street Address</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 123 Botanical Ave"
                className="w-full rounded-xl border border-[#e0e7e2] px-4 py-2.5 text-xs focus:outline-none focus:border-[#2d6a4f]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-[#1e2521] tracking-wider uppercase block mb-1.5">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Mumbai"
                  className="w-full rounded-xl border border-[#e0e7e2] px-4 py-2.5 text-xs focus:outline-none focus:border-[#2d6a4f]"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#1e2521] tracking-wider uppercase block mb-1.5">PIN Code</label>
                <input
                  type="text"
                  required
                  value={zipCode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    if (val.length <= 6) setZipCode(val);
                  }}
                  placeholder="e.g. 400001"
                  className="w-full rounded-xl border border-[#e0e7e2] px-4 py-2.5 text-xs focus:outline-none focus:border-[#2d6a4f]"
                />
              </div>
            </div>
          </div>


          <div className="flex flex-col sm:flex-row gap-4">
            {/* Pay Online */}
            <Button
              type="button"
              disabled={loading || cart.length === 0}
              onClick={handlePayOnline}
              className="flex-1 rounded-full bg-[#2d6a4f] hover:bg-[#2d6a4f]/95 text-white font-bold py-6 text-xs uppercase tracking-wider disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  Pay Online (₹{total.toFixed(2)})
                </>
              )}
            </Button>

            {/* Order via WhatsApp — just opens WA, no DB write yet */}
            <Button
              type="button"
              disabled={loading || cart.length === 0}
              onClick={handleWhatsappOrder}
              className="flex-1 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold py-6 text-xs uppercase tracking-wider disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              Order via WhatsApp
            </Button>
          </div>
        </form>

        {/* Sidebar Summary */}
        <div className="bg-white border border-[#e0e7e2] rounded-3xl p-6 shadow-sm sticky top-4 space-y-6">
          <h2 className="text-base font-bold text-[#1e2521]">Review Your Order</h2>
          
           <div className="space-y-4 max-h-[200px] overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-xs gap-3">
                <div className="min-w-0">
                  <span className="font-semibold text-[#1e2521] block truncate">{item.name}</span>
                  <span className="text-stone-400 block mt-0.5">Qty: {item.quantity}</span>
                </div>
                <span className="font-bold text-[#1e2521] shrink-0">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-[#e0e7e2] pt-4 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-[#5c6b62]">Subtotal:</span>
              <span className="font-semibold text-[#1e2521]">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#5c6b62]">Shipping:</span>
              <span className="font-semibold text-[#1e2521]">
                {shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#5c6b62]">Estimated Tax (8%):</span>
              <span className="font-semibold text-[#1e2521]">₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm border-t border-[#e0e7e2] pt-3">
              <span className="font-bold text-[#1e2521]">Order Total:</span>
              <span className="font-bold text-[#2d6a4f] text-base">₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
