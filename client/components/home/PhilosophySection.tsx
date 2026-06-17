"use client";

import { Leaf, Sparkles } from "lucide-react";

export default function PhilosophySection() {
  const ingredients = [
    {
      name: "Magnesium Chloride",
      desc: "Promotes relaxation and recovery.",
    },
    {
      name: "Shea Butter",
      desc: "Deep nourishment for healthy skin.",
    },
    {
      name: "Coconut Oil",
      desc: "Natural hydration and softness.",
    },
    {
      name: "Tea Tree Oil",
      desc: "Purifying and protective care.",
    },
    {
      name: "Aloe Vera",
      desc: "Cooling and soothing relief.",
    },
    {
      name: "Kokum Butter",
      desc: "Intensive repair and restoration.",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#F8F5EE] py-24 lg:py-32">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-24 w-96 h-96 bg-[#2F5D50]/10 rounded-full blur-[140px]" />

        <div className="absolute -bottom-24 right-0 w-[30rem] h-[30rem] bg-[#D8E2DA] rounded-full blur-[160px]" />

        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-[#EAE5D9] rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-20">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* LEFT SIDE */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white border border-[#E5E0D4] rounded-full px-5 py-2 shadow-sm">
              <Sparkles size={14} className="text-[#2F5D50]" />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#2F5D50]">
                Our Philosophy
              </span>
            </div>

            <h2 className="mt-8 text-4xl md:text-5xl lg:text-6xl font-serif font-semibold leading-[1.1] text-[#1A1A1A]">
              Rooted in nature,
              <br />
              crafted with care.
            </h2>

            <p className="mt-8 text-base md:text-lg leading-8 text-[#6B7280] max-w-xl">
              Every ARAQ creation begins with a belief that nature provides
              everything required for genuine wellness. We carefully select
              botanicals, mineral-rich ingredients, and traditional remedies
              known for their purity, effectiveness, and timeless benefits.
            </p>

            <p className="mt-5 text-base md:text-lg leading-8 text-[#6B7280] max-w-xl">
              Every ingredient is chosen with intention — no unnecessary
              fillers, no shortcuts, and no compromises on quality.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mt-10 max-w-md">
              <div className="bg-white border border-[#E5E0D4] rounded-3xl p-5 shadow-sm">
                <h3 className="text-3xl font-bold text-[#2F5D50]">
                  100%
                </h3>
                <p className="mt-1 text-sm text-[#6B7280]">
                  Naturally Derived
                </p>
              </div>

              <div className="bg-white border border-[#E5E0D4] rounded-3xl p-5 shadow-sm">
                <h3 className="text-3xl font-bold text-[#2F5D50]">
                  0%
                </h3>
                <p className="mt-1 text-sm text-[#6B7280]">
                  Synthetic Fillers
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="grid sm:grid-cols-2 gap-5">
            {ingredients.map((item, index) => (
              <div
                key={index}
                className="
                  group
                  bg-white
                  border
                  border-[#E5E0D4]
                  rounded-[28px]
                  p-6
                  hover:-translate-y-2
                  hover:shadow-2xl
                  hover:border-[#2F5D50]
                  transition-all
                  duration-300
                  cursor-pointer
                "
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#2F5D50]/10 flex items-center justify-center">
                    <Leaf
                      size={20}
                      className="text-[#2F5D50]"
                    />
                  </div>

                  <span className="text-xs font-bold tracking-wider text-[#B8B8B8]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
                  {item.name}
                </h3>

                <p className="text-sm leading-7 text-[#6B7280]">
                  {item.desc}
                </p>

                <div className="mt-5 h-[2px] w-0 bg-[#2F5D50] group-hover:w-full transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

