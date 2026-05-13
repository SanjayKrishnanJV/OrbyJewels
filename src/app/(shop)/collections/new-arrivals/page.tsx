export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { ProductCard } from "@/components/product/ProductCard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Arrivals — Fresh from Our Ateliers | Orby Jewels",
};

export default async function NewArrivalsPage() {
  const products = await db.product.findMany({
    where: { status: "ACTIVE", isNewArrival: true },
    include: {
      images: { take: 2, orderBy: { sortOrder: "asc" } },
      category: true,
      _count: { select: { reviews: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 40,
  });

  return (
    <div className="min-h-screen bg-ivory-warm">
      <div className="relative h-56 bg-chocolate-950 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=1920')] bg-cover bg-center opacity-20" />
        <div className="relative text-center">
          <span className="text-xs tracking-[0.5em] text-gold-400 uppercase mb-3 block">Fresh Arrivals</span>
          <h1 className="font-playfair text-5xl text-champagne-100">New Arrivals</h1>
          <p className="text-champagne-300 mt-3">The latest additions to our curated collection</p>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-8 py-12">
        {products.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-playfair text-2xl text-chocolate-800">Coming Soon</p>
            <p className="text-nude-400 mt-2">Check back soon for our latest arrivals</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product as Parameters<typeof ProductCard>[0]["product"]} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
