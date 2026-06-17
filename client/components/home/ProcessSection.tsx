"use client";

const steps = [
  { num: "01", title: "SOURCE", desc: "Premium natural oils, butters, and botanicals from trusted suppliers." },
  { num: "02", title: "BLEND", desc: "Each ingredient measured and blended by hand to precise formulations." },
  { num: "03", title: "PROCESS", desc: "Cold-process method preserves the integrity of every natural ingredient." },
  { num: "04", title: "CURE", desc: "Products cured over weeks, allowing them to reach their full potential." },
  { num: "05", title: "DELIVER", desc: "A luxuriously smooth, skin-loving product ready for your daily ritual." },
];

export default function ProcessSection() {
  return (
    <section className="w-full bg-white py-20 lg:py-28 px-6 sm:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-14">
          <span className="text-[11px] font-semibold tracking-widest text-stone-400 uppercase block mb-2">
            From Nature to You
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-medium text-[#121312]">
            Our Process
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={[
                "flex flex-col gap-4 py-4",
                // desktop: right border + padding
                idx < steps.length - 1
                  ? "md:border-r md:border-stone-200 md:pr-8"
                  : "",
                idx > 0 ? "md:pl-8" : "",
                // mobile/tablet: bottom border
                idx < steps.length - 1
                  ? "border-b border-stone-200 md:border-b-0"
                  : "",
                // tablet 2-col: left border on even items
                idx % 2 === 1 ? "sm:border-l sm:border-stone-200 sm:pl-8 md:pl-8" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span className="text-5xl font-serif text-stone-200 leading-none select-none">
                {step.num}
              </span>
              <h3 className="text-[11px] font-semibold tracking-widest text-[#121312] uppercase">
                {step.title}
              </h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}