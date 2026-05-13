export const dynamic = "force-dynamic";

import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { ProductSection } from "@/components/home/ProductSection";
import { BrandStory } from "@/components/home/BrandStory";
import { Testimonials } from "@/components/home/Testimonials";
import { db } from "@/lib/db";

async function getHomeData() {
  try {
    const [products, categories, testimonials, banners] = await Promise.all([
      db.product.findMany({
        where: { status: "ACTIVE" },
        include: {
          images: { orderBy: { sortOrder: "asc" } },
          category: true,
          _count: { select: { reviews: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
      db.category.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        take: 6,
      }),
      db.testimonial.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        take: 6,
      }),
      db.banner.findMany({
        where: { isActive: true, position: "hero" },
        orderBy: { sortOrder: "asc" },
      }),
    ]);
    return { products, categories, testimonials, banners };
  } catch {
    return { products: [], categories: [], testimonials: [], banners: [] };
  }
}

export default async function HomePage() {
  const { products, categories, testimonials, banners } = await getHomeData();

  const featured = products.filter((p) => p.isFeatured);
  const newArrivals = products.filter((p) => p.isNewArrival);
  const bestSellers = products.filter((p) => p.isBestSeller);
  const trending = products.filter((p) => p.isTrending);

  return (
    <>
      <HeroSection banners={banners as Parameters<typeof HeroSection>[0]["banners"]} />

      <FeaturedCategories categories={categories as Parameters<typeof FeaturedCategories>[0]["categories"]} />

      {/* Featured */}
      <ProductSection
        label="Handpicked"
        title="Featured Collection"
        subtitle="Our most beloved pieces, chosen for their exceptional beauty and craftsmanship"
        products={featured.length > 0 ? (featured as Parameters<typeof ProductSection>[0]["products"]) : (products.slice(0, 8) as Parameters<typeof ProductSection>[0]["products"])}
        viewAllLink="/products?filter=featured"
        viewAllText="View Featured"
      />

      {/* Brand story */}
      <BrandStory />

      {/* New arrivals */}
      <ProductSection
        label="Just Arrived"
        title="New Arrivals"
        subtitle="Fresh from our ateliers — be the first to own these exquisite new creations"
        products={(newArrivals.length > 0 ? newArrivals : products.slice(0, 8)) as Parameters<typeof ProductSection>[0]["products"]}
        viewAllLink="/collections/new-arrivals"
        viewAllText="All New Arrivals"
        bgColor="bg-champagne-100"
      />

      {/* Testimonials */}
      <Testimonials testimonials={testimonials as Parameters<typeof Testimonials>[0]["testimonials"]} />

      {/* Best sellers */}
      <ProductSection
        label="Customer Favourites"
        title="Best Sellers"
        subtitle="The pieces our customers love most — timeless designs that never go out of style"
        products={(bestSellers.length > 0 ? bestSellers : products.slice(0, 8)) as Parameters<typeof ProductSection>[0]["products"]}
        viewAllLink="/products?filter=bestseller"
        viewAllText="All Best Sellers"
      />

      {/* Promotional Banner */}
      <section className="relative py-24 overflow-hidden bg-nude-200">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=1920')] bg-cover bg-center opacity-10" />
        <div className="relative max-w-screen-2xl mx-auto px-8 text-center">
          <span className="text-xs tracking-[0.5em] text-gold-dark uppercase mb-4 block">Limited Time</span>
          <h2 className="font-playfair text-4xl md:text-6xl text-chocolate-950 mb-4">
            Exclusive Members Offer
          </h2>
          <p className="text-nude-700 text-lg mb-8 max-w-lg mx-auto">
            Join our inner circle and enjoy 10% off your first order, early access to new collections, and exclusive events.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/register"
              className="px-10 py-4 bg-chocolate-950 text-champagne-100 text-sm font-medium tracking-[0.2em] uppercase hover:bg-chocolate-800 transition-colors"
            >
              Become a Member
            </a>
            <a
              href="/products"
              className="px-10 py-4 border border-chocolate-950 text-chocolate-950 text-sm font-medium tracking-[0.2em] uppercase hover:bg-chocolate-950 hover:text-champagne-100 transition-colors"
            >
              Shop Now
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
