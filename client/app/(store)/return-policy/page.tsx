"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, HelpCircle, Mail, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F8F5EE] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
        
        {/* Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-[#5c6b62] hover:text-[#2d6a4f] transition-all font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>

        {/* Header */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#2d6a4f]">
            CUSTOMER CARE
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[#1e2521]">
            Return & Refund Policy
          </h1>
          <p className="text-sm text-[#5c6b62] leading-relaxed max-w-2xl">
            We hold our handcrafted elixirs and cold-process soaps to the highest standards. If you are not completely satisfied with your purchase, we want to make it right.
          </p>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 gap-6">
          
          {/* Policy Card */}
          <Card className="border border-[#e0e7e2] shadow-sm rounded-3xl overflow-hidden bg-white">
            <CardContent className="p-6 sm:p-10 space-y-8">
              
              {/* Point 1 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#f1f7f3] flex items-center justify-center text-[#2d6a4f] shrink-0">
                  <RotateCcw className="h-5 w-5" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-[#1e2521]">
                    14-Day Return Window
                  </h3>
                  <p className="text-sm text-[#5c6b62] leading-relaxed">
                    You have 14 calendar days from the date of delivery to request a return for any item purchased directly from our online store. 
                  </p>
                </div>
              </div>

              {/* Point 2 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#f1f7f3] flex items-center justify-center text-[#2d6a4f] shrink-0">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-[#1e2521]">
                    Product Condition
                  </h3>
                  <p className="text-sm text-[#5c6b62] leading-relaxed">
                    Due to the personal and hygienic nature of body bars and botanical elixirs, products must be unused, in their original packaging, and in the same condition that you received them.
                  </p>
                </div>
              </div>

              {/* Point 3 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#f1f7f3] flex items-center justify-center text-[#2d6a4f] shrink-0">
                  <Truck className="h-5 w-5" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-[#1e2521]">
                    Return Shipping
                  </h3>
                  <p className="text-sm text-[#5c6b62] leading-relaxed">
                    Customers are responsible for paying the shipping costs for returning items. Original shipping charges are non-refundable. We recommend using a trackable shipping service.
                  </p>
                </div>
              </div>

              {/* Point 4 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#f1f7f3] flex items-center justify-center text-[#2d6a4f] shrink-0">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-[#1e2521]">
                    How to Initiate a Return
                  </h3>
                  <p className="text-sm text-[#5c6b62] leading-relaxed">
                    Simply send an email to <span className="font-semibold text-[#2d6a4f]">hello@araqherbal.com</span> with your Order ID and the reason for the return. Our customer care team will provide you with the return address and instructions.
                  </p>
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Damaged items or inquiries block */}
          <div className="bg-white rounded-3xl border border-[#e0e7e2] p-6 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-[#1e2521]">
                Did your order arrive damaged?
              </h3>
              <p className="text-sm text-[#5c6b62] leading-relaxed max-w-md">
                If items were damaged during transit, notify us within 48 hours of delivery. Email photo proof and we'll dispatch a replacement immediately.
              </p>
            </div>
            <a 
              href="mailto:hello@araqherbal.com" 
              className="inline-flex items-center gap-2 bg-[#2d6a4f] hover:bg-[#1f4735] text-white px-6 py-3.5 rounded-xl text-sm font-semibold transition-all shrink-0 cursor-pointer"
            >
              <Mail className="h-4 w-4" />
              <span>Contact Support</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
