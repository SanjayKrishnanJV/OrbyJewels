export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { ProductCard } from "@/components/product/ProductCard";
import { Metadata } from "next";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return { title: q ? `Search: "${q}" — Orby Jewels` : "Search — Orby Jewels" };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;

  const products = q
    ? await db.product.findMany({
        where: {
          status: "ACTIVE",
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { material: { contains: q, mode: "insensitive" } },
            { stoneType: { contains: q, mode: "insensitive" } },
            { category: { name: { contains: q, mode: "insensitive" } } },
          ],
        },
        include: {
          images: { take: 2, orderBy: { sortOrder: "asc" } },
          category: true,
          _count: { select: { reviews: true } },
        },
        take: 40,
      })
    : [];

  return (
    <div className="min-h-screen bg-ivory-warm py-12">
      <div className="max-w-screen-2xl mx-auto px-8">
        <div className="mb-10">
          <h1 className="font-playfair text-3xl text-chocolate-950">
            {q ? `Search results for "${q}"` : "Search Jewellery"}
          </h1>
          {q && (
            <p className="text-nude-500 mt-1">
              {products.length} {products.length === 1 ? "result" : "results"} found
            </p>
          )}
        </div>

        {!q && (
          <div className="text-center py-24">
            <p className="text-nude-400 text-lg">Enter a search term to find jewellery</p>
          </div>
        )}

        {q && products.length === 0 && (
          <div className="text-center py-24">
            <p className="font-playfair text-2xl text-chocolate-800 mb-3">No results found</p>
            <p className="text-nude-400 mb-6">Try searching for "diamond ring" or "gold necklace"</p>
          </div>
        )}

        {products.length > 0 && (
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
