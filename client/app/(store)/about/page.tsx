"use client";

import { Leaf, Award, ShieldCheck, Heart, Sparkles } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const values = [
    {
      icon: Leaf,
      title: "Cold-Process Method",
      desc: "Our soaps are made using the traditional cold-process method, which preserves the natural glycerin and therapeutic benefits of our organic plant oils.",
    },
    {
      icon: ShieldCheck,
      title: "Ingredient Purity",
      desc: "We strictly source raw, unrefined butters, mineral-rich salts, and pure essential oils. Zero synthetic fragrances, preservatives, or chemical fillers.",
    },
    {
      icon: Award,
      title: "Curing & Vaulting",
      desc: "Each bar undergoes a strict 4 to 6-week curing process in our humidity-controlled vaults, yielding a long-lasting, extra-mild, and creamy bar.",
    },
    {
      icon: Heart,
      title: "Sustainability Pledge",
      desc: "From ethically sourced botanicals to biodegradable, plastic-free packaging, we take full responsibility for our ecological footprint.",
    },
  ];

  return (
    <div className="bg-[#FCFCFB] text-[#1E2521] min-h-screen">
      {/* Hero Header */}
      <section className="bg-[#E8F5E9]/50 py-16 sm:py-24 px-4 sm:px-8 lg:px-24 border-b border-[#E0E7E2]">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-white border border-[#E5E0D4] rounded-full px-5 py-2 shadow-sm animate-fade-in">
            <Sparkles size={14} className="text-[#2D6A4F]" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#2D6A4F]">
              Our Craft & Story
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-semibold text-[#1E2521] leading-tight">
            Rooted in nature,
            <br />
            crafted for genuine wellness.
          </h1>
          <p className="text-[#5C6B62] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            At ARAQ, we believe that the purest skincare starts from the earth.
            We formulate premium, small-batch herbal remedies and cold-process
            soaps to honor traditional craftsmanship and nourish your skin.
          </p>
        </div>
      </section>

      {/* Brand Values Grid */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 py-20 sm:py-28">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <span className="text-[11px] font-bold tracking-widest text-[#2D6A4F] uppercase">
            THE ARAQ STANDARD
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-[#1E2521]">
            How We Do Things Differently
          </h2>
          <p className="text-[#5C6B62] text-sm leading-relaxed">
            We reject the shortcuts of modern mass production to focus on slow, 
            intentional craftsmanship that preserves the intelligence of natural ingredients.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-[#E0E7E2] rounded-3xl p-8 shadow-2xs hover:shadow-md hover:border-[#2D6A4F]/30 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] flex items-center justify-center mb-6">
                    <Icon size={22} className="text-[#2D6A4F]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#1E2521] mb-3">
                    {val.title}
                  </h3>
                  <p className="text-sm text-[#5C6B62] leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Detailed Story Section */}
      <section className="bg-[#F8F5EE] py-20 sm:py-28 px-6 sm:px-12 lg:px-24 border-y border-[#DDD8CC]">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1E2521]">
              The Traditional Cold-Process Method
            </h2>
            <p className="text-sm sm:text-base text-[#5C6B62] leading-relaxed">
              Unlike commercial soap bars that extract natural glycerin to sell separately, 
              our cold-process method leaves 100% of the nutrient-rich glycerin inside the soap. 
              We blend raw organic oils and unrefined plant butters with lye water at exact room temperatures. 
              This trigger saponification naturally, creating a creamy lather that deeply cleanses 
              without stripping your skin's protective lipid barrier.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1E2521]">
              Ingredient Purity & Ethical Sourcing
            </h2>
            <p className="text-sm sm:text-base text-[#5C6B62] leading-relaxed">
              Skincare goes deeper than just surface application. That's why every botanical, oil, and clay 
              we use is carefully vetted for absolute purity. From therapeutic-grade lavender essential oils 
              to wild-harvested Kokum butter from India, we partner with growers and suppliers who prioritize 
              sustainable farming and fair-trade principles. You will never find mineral oils, sulfates, parabens, 
              or synthetic fragrances inside any ARAQ product.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1E2521]">
              Curing & vaulting
            </h2>
            <p className="text-sm sm:text-base text-[#5C6B62] leading-relaxed">
              Good things take time. After molding and hand-cutting, our soap bars are transferred to our curing 
              vaults where they sit undisturbed for 4 to 6 weeks. Over this period, excess moisture slowly 
              evaporates, yielding an extremely hard, long-lasting bar with a mild, skin-compatible pH. 
              This curing process is what transforms normal soap into a luxurious skin elixir.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 text-center max-w-xl mx-auto px-6 space-y-6">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1E2521]">
          Ready to experience the ARAQ difference?
        </h2>
        <p className="text-sm text-[#5C6B62]">
          Discover our curated collection of organic body bars and targeted herbal remedies today.
        </p>
        <div className="pt-2">
          <Link
            href="/shop"
            className="inline-block bg-[#2D6A4F] text-white px-8 py-3.5 rounded-full text-sm font-semibold tracking-wider uppercase hover:bg-[#1F4C38] shadow-md transition-all hover:scale-[1.02] active:scale-95"
          >
            Shop All Products
          </Link>
        </div>
      </section>
    </div>
  );
}
