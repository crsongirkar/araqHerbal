"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// Default slides fallback
const DEFAULT_SLIDES = [
  {
    id: 1,
    tagline: "100% ORGANIC & HANDCRAFTED",
    title: "Herbal Elixirs & Botanical Remedies",
    description: "Infused with organic plant oils, raw mineral salts, and therapeutic essential oils. Hand-poured in small batches for genuine wellness.",
    buttonText: "Shop Collection",
    buttonLink: "/shop",
    image: "https://images.unsplash.com/photo-1607006342445-360f141b0eba?q=80&w=600&auto=format&fit=crop",
    bgClass: "from-stone-100 via-stone-50 to-stone-100/60"
  },
  {
    id: 2,
    tagline: "SKIN BARRIER REPAIR",
    title: "Kokum Butter Intense Repair",
    description: "An intensive moisturizing bar crafted with pure wild-harvested Kokum butter to deeply hydrate and repair dry, compromised skin.",
    buttonText: "View Repair Bar",
    buttonLink: "/product/2",
    image: "https://images.unsplash.com/photo-1605264964528-06403738d6df?q=80&w=600&auto=format&fit=crop",
    bgClass: "from-stone-50 via-stone-100 to-stone-50"
  },
  {
    id: 3,
    tagline: "TARGETED RELAXATION",
    title: "Magnesium Muscle Relief Elixir",
    description: "Melt away muscle tension and physical stress with raw magnesium chloride, Epsom salts, and calming wild lavender essential oils.",
    buttonText: "Explore Muscle Relief",
    buttonLink: "/product/1",
    image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=600&auto=format&fit=crop",
    bgClass: "from-stone-100 via-stone-50 to-stone-100/50"
  }
];

export default function HeroCarousel() {
  const [slides, setSlides] = useState(DEFAULT_SLIDES);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  const fetchSlides = async () => {
    try {
      const res = await fetch("/api/homepage");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setSlides(data);
        }
      }
    } catch (error) {
      console.error("Failed to load carousel slides:", error);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const isDarkBg = (bgClass?: string) => {
    if (!bgClass) return false;
    return bgClass.includes("-900") || 
           bgClass.includes("-950") || 
           bgClass.includes("-800") || 
           bgClass.includes("-700") || 
           bgClass.includes("-600");
  };

  if (slides.length === 0) return null;

  return (
    <div 
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="relative w-full max-w-7xl mx-auto mb-10 sm:mb-16 overflow-hidden rounded-2xl sm:rounded-3xl shadow-sm border border-[#e0e7e2]"
    >
      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none text-[#2d6a4f]" 
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: "20px 20px"
        }}
      />

      {/* Slide Container */}
      <div 
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => {
          const isDark = isDarkBg(slide.bgClass);
          const hasGradient = slide.bgClass && (slide.bgClass.includes("from-") || slide.bgClass.includes("to-") || slide.bgClass.includes("via-"));
          
          return (
            <div
              key={slide.id}
              className={`w-full shrink-0 flex flex-col md:flex-row items-center justify-between px-5 py-8 sm:p-12 lg:p-16 ${hasGradient ? "bg-gradient-to-br" : ""} ${slide.bgClass || "bg-gradient-to-br from-stone-100 via-stone-50 to-stone-100/60"} min-h-[540px] sm:min-h-[480px] md:min-h-[520px] gap-6 md:gap-8`}
            >
              {/* Slide Content */}
              <div className="w-full md:flex-1 space-y-4 sm:space-y-6 max-w-xl text-left z-10">
                <span className={`inline-block text-[10px] sm:text-xs font-semibold tracking-widest px-3 py-1 rounded-full ${
                  isDark 
                    ? "text-emerald-300 bg-white/10" 
                    : "text-[#2d6a4f] bg-[#e8f5e9]"
                }`}>
                  {slide.tagline}
                </span>
                <h2 className={`text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-serif font-semibold leading-tight tracking-tight ${
                  isDark ? "text-white" : "text-[#1e2521]"
                }`}>
                  {slide.title}
                </h2>
                <p className={`text-sm sm:text-base max-w-md leading-relaxed line-clamp-3 sm:line-clamp-none ${
                  isDark ? "text-stone-300" : "text-[#5c6b62]"
                }`}>
                  {slide.description}
                </p>
                <div className="pt-1">
                  <Button size="lg" className={`rounded-full px-6 sm:px-8 font-medium shadow-md transition-all duration-300 hover:scale-[1.02] text-sm ${
                    isDark 
                      ? "bg-white text-[#1e2521] hover:bg-stone-100" 
                      : "bg-[#2d6a4f] text-white hover:bg-[#2d6a4f]/95"
                  }`} asChild>
                    <Link href={slide.buttonLink || "/shop"}>
                      {slide.buttonText || "Shop Collection"}
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Slide Image — shown on all screen sizes */}
              <div className="w-full md:flex-1 flex justify-center items-center z-10">
                <div className={`relative w-full max-w-[240px] aspect-square sm:max-w-[340px] lg:max-w-[420px] rounded-2xl overflow-hidden shadow-xl bg-white transition-all duration-300 ${
                  isDark ? "border border-white/10 shadow-black/40" : "border border-stone-200/60"
                }`}>
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 240px, (max-width: 1024px) 340px, 420px"
                    priority
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>


      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => {
          const slide = slides[index];
          const isDark = slide && isDarkBg(slide.bgClass);
          
          return (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 transition-all rounded-full cursor-pointer ${
                currentSlide === index 
                  ? `w-8 ${isDark ? "bg-white" : "bg-[#2d6a4f]"}` 
                  : `w-2 ${isDark ? "bg-white/40" : "bg-stone-300"}`
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
}
