"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

  if (slides.length === 0) return null;

  return (
    <div className="relative w-full max-w-7xl mx-auto mb-10 sm:mb-16 overflow-hidden rounded-2xl sm:rounded-3xl shadow-sm border border-[#e0e7e2]">
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
        {slides.map((slide) => (
          <div
          key={slide.id}
            className={`w-full shrink-0 flex flex-col md:flex-row items-center justify-between px-5 py-8 sm:p-12 lg:p-16 bg-gradient-to-br ${slide.bgClass || "from-stone-100 via-stone-50 to-stone-100/60"} min-h-[360px] sm:min-h-[480px] md:min-h-[520px] gap-6 md:gap-8`}
          >
            {/* Slide Content */}
            <div className="flex-1 space-y-4 sm:space-y-6 max-w-xl text-left z-10">
              <span className="inline-block text-[10px] sm:text-xs font-semibold tracking-widest text-[#2d6a4f] bg-[#e8f5e9] px-3 py-1 rounded-full">
                {slide.tagline}
              </span>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-serif text-[#1e2521] font-semibold leading-tight tracking-tight">
                {slide.title}
              </h2>
              <p className="text-[#5c6b62] text-sm sm:text-base max-w-md leading-relaxed line-clamp-3 sm:line-clamp-none">
                {slide.description}
              </p>
              <div className="pt-1">
                <Button size="lg" className="rounded-full px-6 sm:px-8 bg-[#2d6a4f] hover:bg-[#2d6a4f]/95 text-white font-medium shadow-md transition-all duration-300 hover:scale-[1.02] text-sm" asChild>
                  <Link href={slide.buttonLink || "/shop"}>
                    {slide.buttonText || "Shop Collection"}
                  </Link>
                </Button>
              </div>
            </div>

            {/* Slide Image — shown on all screen sizes */}
            <div className="flex-1 w-full flex justify-center items-center z-10">
              <div className="relative w-[220px] h-[220px] sm:w-[300px] sm:h-[300px] lg:w-[380px] lg:h-[380px] rounded-2xl overflow-hidden shadow-2xl border border-white/40 transform rotate-2 hover:rotate-0 transition-transform duration-500 bg-white">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 220px, (max-width: 1024px) 300px, 380px"
                  priority
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-white/80 hover:bg-white text-[#1e2521] hover:text-[#2d6a4f] shadow-lg border border-[#e0e7e2] transition-all hover:scale-105 cursor-pointer"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-white/80 hover:bg-white text-[#1e2521] hover:text-[#2d6a4f] shadow-lg border border-[#e0e7e2] transition-all hover:scale-105 cursor-pointer"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 transition-all rounded-full cursor-pointer ${
              currentSlide === index ? "w-8 bg-[#2d6a4f]" : "w-2 bg-stone-300"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
