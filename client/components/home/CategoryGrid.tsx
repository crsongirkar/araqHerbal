// "use client";

// import Image from "next/image";
// import Link from "next/link";

// const categories = [
//   {
//     name: "Body Care",
//     count: "3 Products",
//     image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=300&auto=format&fit=crop",
//     href: "/shop?category=Body Care",
//     bgColor: "bg-stone-100"
//   },
//   {
//     name: "Foot Care",
//     count: "2 Products",
//     image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=300&auto=format&fit=crop",
//     href: "/shop?category=Foot Care",
//     bgColor: "bg-stone-200/50"
//   },
//   {
//     name: "Skin Care",
//     count: "3 Products",
//     image: "https://images.unsplash.com/photo-1607006342445-360f141b0eba?q=80&w=300&auto=format&fit=crop",
//     href: "/shop?category=Skin Care",
//     bgColor: "bg-[#ece7dc]/40"
//   }
// ];

// export default function CategoryGrid() {
//   return (
//     <div className="max-w-7xl mx-auto mb-16 px-4">
//       <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
//         <div>
//           <span className="text-xs font-bold tracking-widest text-primary uppercase">Categories</span>
//           <h2 className="text-3xl font-serif font-semibold text-foreground mt-1">Explore Our Collections</h2>
//         </div>
//         <Link href="/shop" className="text-sm font-semibold text-primary hover:underline transition-all flex items-center gap-1 group">
//           View All Products 
//           <span className="transform group-hover:translate-x-1 transition-transform inline-block">→</span>
//         </Link>
//       </div>

//       <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-4xl mx-auto">
//         {categories.map((category) => (
//           <Link
//             key={category.name}
//             href={category.href}
//             className="group flex flex-col items-center text-center p-3 sm:p-6 rounded-2xl border border-border/40 bg-card hover:shadow-md hover:border-primary/25 transition-all duration-350"
//           >
//             <div className={`relative w-16 h-16 sm:w-28 sm:h-28 rounded-full overflow-hidden mb-3 sm:mb-4 ${category.bgColor} p-1 border border-border/30 group-hover:scale-105 transition-transform duration-350`}>
//               <div className="relative w-full h-full rounded-full overflow-hidden">
//                 <Image
//                   src={category.image}
//                   alt={category.name}
//                   fill
//                   className="object-cover"
//                   sizes="112px"
//                 />
//               </div>
//             </div>
//             <h3 className="font-semibold text-foreground text-xs sm:text-sm group-hover:text-primary transition-colors duration-200">
//               {category.name}
//             </h3>
//             <span className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">
//               {category.count}
//             </span>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }


"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  Leaf,
  Footprints,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const categories = [
  {
    name: "Body Care",
    count: "3 Products",
    icon: Leaf,
    href: "/shop?category=Body Care",
  },
  {
    name: "Foot Care",
    count: "2 Products",
    icon: Footprints,
    href: "/shop?category=Foot Care",
  },
  {
    name: "Skin Care",
    count: "3 Products",
    icon: Sparkles,
    href: "/shop?category=Skin Care",
  },
  {
    name: "Hair Care",
    count: "4 Products",
    icon: Leaf,
    href: "/shop?category=Hair Care",
  },
  {
    name: "Bath Care",
    count: "5 Products",
    icon: Sparkles,
    href: "/shop?category=Bath Care",
  },
  {
    name: "Wellness",
    count: "6 Products",
    icon: Leaf,
    href: "/shop?category=Wellness",
  },
];

export default function CategoryGrid() {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({
      left: -460,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({
      left: 460,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-white py-10 lg:py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 gap-4">
          <h2 className="text-2xl sm:text-3xl md:text-[38px] font-serif font-bold text-[#1D1D1D] leading-tight">
            Popular Category
          </h2>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              aria-label="Previous categories"
              onClick={scrollLeft}
              className="
                w-10 h-10 sm:w-12 sm:h-12
                rounded-full
                border
                border-[#E3E3E3]
                flex
                items-center
                justify-center
                text-[#333]
                hover:border-[#2F7A57]
                hover:text-[#2F7A57]
                transition-all
                duration-300
                cursor-pointer
              "
            >
              <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
            </button>

            <button
              aria-label="Next categories"
              onClick={scrollRight}
              className="
                w-10 h-10 sm:w-12 sm:h-12
                rounded-full
                border
                border-[#E3E3E3]
                flex
                items-center
                justify-center
                text-[#333]
                hover:border-[#2F7A57]
                hover:text-[#2F7A57]
                transition-all
                duration-300
                cursor-pointer
              "
            >
              <ChevronRight size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Category Slider */}
        <div className="relative">
          <div
            ref={sliderRef}
            className="
              flex
              gap-5
              overflow-x-auto
              md:overflow-x-hidden
              no-scrollbar
              scroll-smooth
            "
          >
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <Link
                  key={category.name}
                  href={category.href}
                  className="
                    shrink-0
                    w-[220px]
                    h-[200px]
                    rounded-[18px]
                    border
                    border-[#E7E7E7]
                    bg-white
                    flex
                    flex-col
                    items-center
                    justify-center
                    transition-all
                    duration-300
                    hover:border-[#2F7A57]
                    hover:shadow-sm
                  "
                >
                  {/* Icon Circle */}
                  <div
                    className="
                      w-[72px]
                      h-[72px]
                      rounded-full
                      bg-[#F5F7F5]
                      flex
                      items-center
                      justify-center
                      mb-5
                    "
                  >
                    <Icon
                      size={32}
                      strokeWidth={1.8}
                      className="text-[#2F7A57]"
                    />
                  </div>

                  {/* Category Name */}
                  <h3 className="text-[16px] font-semibold text-[#202020]">
                    {category.name}
                  </h3>

                  {/* Product Count */}
                  <p className="mt-2 text-[14px] text-[#7A7A7A]">
                    {category.count}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}


