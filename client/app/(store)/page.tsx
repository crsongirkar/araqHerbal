import CategoryGrid from "@/components/home/CategoryGrid";
import HeroCarousel from "@/components/home/HeroCarousel";
import PhilosophySection from "@/components/home/PhilosophySection";
import ProcessSection from "@/components/home/ProcessSection";
import ProductList from "@/components/home/ProductList";

export default function Home() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero Banner Carousel Section */}
      <div className="px-3 sm:px-4 pt-4 sm:pt-8 lg:pt-10">
        <HeroCarousel />
      </div>

      {/* Category Grid Section */}
      <CategoryGrid />

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 py-10 sm:py-16">
        <div className="text-center mx-auto mb-8 sm:mb-12 space-y-2">
          <span className="text-[11px] font-bold tracking-widest text-stone-400 uppercase">
            BEST SELLERS
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-semibold text-foreground">
            Herbal Elixir Collection
          </h2>
          <p className="text-muted-foreground text-xs sm:text-sm max-w-md mx-auto px-2">
            Explore our handcrafted remedies, carefully formulated with active botanicals to nourish and restore your skin.
          </p>
        </div>
        <ProductList />
      </section>

      {/* Philosophy Section */}
      <PhilosophySection />

      {/* Process Section */}
      <ProcessSection />
    </div>
  );
}
