"use client";

import Link from "next/link";
import Image from "next/image";

const BLOG_POSTS = [
  {
    id: 1,
    title: "The Art & Science of Cold-Process Soap Curing",
    excerpt: "Discover why we cure our handcrafted bars for exactly six weeks, and how this slow process preserves the active botanical nutrients for your skin.",
    date: "June 12, 2026",
    category: "Craftsmanship",
    image: "https://images.unsplash.com/photo-1607006342445-360f141b0eba?q=80&w=600&auto=format&fit=crop",
    readTime: "5 min read"
  },
  {
    id: 2,
    title: "Why Magnesium is Your Skin's Ultimate Relaxer",
    excerpt: "An in-depth look at magnesium absorption through body care rituals. Learn how our Magnesium Muscle Relief Elixir helps soothe tired muscles naturally.",
    date: "June 08, 2026",
    category: "Herbal Remedies",
    image: "https://images.unsplash.com/photo-1546554137-f86b9593a222?q=80&w=600&auto=format&fit=crop",
    readTime: "4 min read"
  },
  {
    id: 3,
    title: "5 Active Botanicals to Restore a Damaged Skin Barrier",
    excerpt: "Redness, dry patches, and sensitivity? These five wild-harvested herbs and raw butter bases offer intense repair and natural protection.",
    date: "May 28, 2026",
    category: "Skin Health",
    image: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?q=80&w=600&auto=format&fit=crop",
    readTime: "6 min read"
  },
  {
    id: 4,
    title: "Neem & Tea Tree: Nature's Antifungal Powerhouse",
    excerpt: "Exploring the antibacterial properties of pure steam-distilled tea tree oil and organic neem leaf extracts for active and athletic lifestyles.",
    date: "May 15, 2026",
    category: "Ingredients",
    image: "https://images.unsplash.com/photo-1590439471364-192aa70c0c53?q=80&w=600&auto=format&fit=crop",
    readTime: "3 min read"
  }
];

export default function BlogIndex() {
  return (
    <div className="bg-background min-h-screen">
      {/* Blog Hero Header */}
      <section className="bg-[#e8f5e9]/50 py-16 lg:py-20 px-6 sm:px-12 lg:px-24 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold tracking-widest text-[#2d6a4f] uppercase block">
            ARAQ JOURNAL
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-semibold text-[#1e2521]">
            Botanical Chronicles
          </h1>
          <p className="text-[#5c6b62] text-sm sm:text-base max-w-lg mx-auto">
            Read about organic remedies, holistic skincare practices, and the craftsmanship behind our cold-process cures.
          </p>
        </div>
      </section>

      {/* Featured Post */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 py-12">
        <div className="bg-white border border-[#e0e7e2] rounded-3xl overflow-hidden grid lg:grid-cols-2 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="relative aspect-video lg:aspect-auto h-full min-h-[300px]">
            <Image
              src={BLOG_POSTS[0].image}
              alt={BLOG_POSTS[0].title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="p-8 sm:p-12 flex flex-col justify-center space-y-4">
            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider">
              <span className="text-[#2d6a4f] bg-[#e8f5e9] px-3 py-1 rounded-full">{BLOG_POSTS[0].category}</span>
              <span className="text-stone-400">{BLOG_POSTS[0].date}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-[#1e2521] hover:text-[#2d6a4f] transition-colors leading-tight">
              <Link href={`/blog/${BLOG_POSTS[0].id}`}>{BLOG_POSTS[0].title}</Link>
            </h2>
            <p className="text-[#5c6b62] text-sm leading-relaxed">{BLOG_POSTS[0].excerpt}</p>
            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-stone-400">{BLOG_POSTS[0].readTime}</span>
              <Link 
                href={`/blog/${BLOG_POSTS[0].id}`} 
                className="text-xs font-bold tracking-wider uppercase text-[#2d6a4f] hover:underline"
              >
                Read Article &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Posts */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 pb-20">
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {BLOG_POSTS.slice(1).map((post) => (
            <article 
              key={post.id} 
              className="bg-white border border-[#e0e7e2] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full"
            >
              <div className="relative aspect-video w-full">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider">
                    <span className="text-[#2d6a4f] bg-[#e8f5e9] px-2.5 py-0.5 rounded-full">{post.category}</span>
                    <span className="text-stone-400">{post.date}</span>
                  </div>
                  <h3 className="text-lg font-serif font-semibold text-[#1e2521] hover:text-[#2d6a4f] transition-colors line-clamp-2 leading-snug">
                    <Link href={`/blog/${post.id}`}>{post.title}</Link>
                  </h3>
                  <p className="text-[#5c6b62] text-xs leading-relaxed line-clamp-3">{post.excerpt}</p>
                </div>
                <div className="pt-2 flex items-center justify-between border-t border-[#e0e7e2]/65">
                  <span className="text-[10px] text-stone-400">{post.readTime}</span>
                  <Link 
                    href={`/blog/${post.id}`} 
                    className="text-xs font-bold tracking-wider uppercase text-[#2d6a4f] hover:underline"
                  >
                    Read Article &rarr;
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
