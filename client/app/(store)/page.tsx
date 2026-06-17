import CategoryGrid from "@/components/home/CategoryGrid";
import HeroCarousel from "@/components/home/HeroCarousel";
import PhilosophySection from "@/components/home/PhilosophySection";
import ProcessSection from "@/components/home/ProcessSection";
import ProductList from "@/components/home/ProductList";

export default function Home() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero Banner Carousel Section */}
      <div className="px-4 pt-6 sm:pt-8 lg:pt-10">
        <HeroCarousel />
      </div>

      {/* Category Grid Section */}
      <CategoryGrid />

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mx-auto mb-12 space-y-2">
          <span className="text-[11px] font-bold tracking-widest text-stone-400 uppercase">
            BEST SELLERS
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-foreground">
            Herbal Elixir Collection
          </h2>
          <p className="text-muted-foreground text-xs sm:text-sm max-w-md mx-auto">
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
