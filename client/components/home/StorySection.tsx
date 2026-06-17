"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function StorySection() {
  return (
    <div className="max-w-7xl mx-auto mb-16 px-4">
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        {/* Left Side: Images Grid */}
        <div className="flex-1 w-full relative">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md transform -translate-y-4">
              <Image
                src="https://images.unsplash.com/photo-1628149455678-16f37bc392f4?q=80&w=400&auto=format&fit=crop"
                alt="Soap mold cutting"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 300px"
              />
            </div>
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md transform translate-y-4">
              <Image
                src="https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?q=80&w=400&auto=format&fit=crop"
                alt="Botanical ingredients"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 300px"
              />
            </div>
          </div>
          {/* Subtle floral shape or accent badge */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-semibold px-4 py-4 rounded-full shadow-lg z-10 w-24 h-24 flex flex-col items-center justify-center text-center leading-tight uppercase tracking-widest select-none">
            <span>Est.</span>
            <span className="text-base font-bold">2020</span>
          </div>
        </div>

        {/* Right Side: Text Story */}
        <div className="flex-1 space-y-6 text-left">
          <span className="text-xs font-bold tracking-widest text-primary uppercase">Our Craft</span>
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-foreground leading-tight">
            The Traditional Cold Process Method
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Unlike commercial soaps that extract natural glycerin and replace it with harsh synthetic lathering agents, our soaps are handmade using the traditional cold-process soapmaking method. 
          </p>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            We blend raw, organic plant oils with lye at precise temperatures, hand-stirring in dried lavender buds, healing clays, and wild essential oils. The mixture is then poured into wooden molds, hand-cut, and cured in a temperature-controlled vault for six weeks. This slow process results in a gentle, highly nourishing bar rich in natural skin-loving glycerin.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="rounded-full px-6 bg-primary hover:bg-primary/95 text-white" asChild>
              <Link href="/about">
                Our Story
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-6" asChild>
              <Link href="/contact">
                Visit Workshop
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
