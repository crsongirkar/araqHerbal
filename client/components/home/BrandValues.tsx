"use client";

import { Feather, Leaf, Recycle, Sparkles } from "lucide-react";

const values = [
  {
    icon: Leaf,
    title: "100% Organic & Raw",
    description: "Formulated with extra virgin olive oil, cold-pressed coconut oil, raw shea butter, and pure therapeutic essential oils."
  },
  {
    icon: Sparkles,
    title: "Cold Process Cured",
    description: "Slow-cured for 6 weeks to naturally preserve glycerin, yielding a deeply moisturizing, long-lasting bar."
  },
  {
    icon: Recycle,
    title: "Zero Waste & Cruelty Free",
    description: "Biodegradable formulas packaged in 100% plastic-free, FSC-certified recycled paper wrappers. Vegan-friendly."
  },
  {
    icon: Feather,
    title: "Artisan Handcrafted",
    description: "Hand-blended, hand-poured, and hand-cut in small batches by passionate artisans in our botanical workshop."
  }
];

export default function BrandValues() {
  return (
    <div className="max-w-7xl mx-auto mb-16 px-4">
      <div className="bg-primary/5 rounded-3xl p-8 sm:p-12 border border-primary/10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold tracking-widest text-primary uppercase">Why Suds & Bloom?</span>
          <h2 className="text-3xl font-serif font-semibold text-foreground mt-1">Nourishing Your Skin & The Earth</h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex flex-col items-center text-center space-y-3 p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/60">
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-foreground text-base">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
