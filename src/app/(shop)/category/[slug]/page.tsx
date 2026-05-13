export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/product/ProductCard";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string; subcategory?: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await db.category.findUnique({ where: { slug } });
  if (!category) return { title: "Category Not Found" };
  return { title: `${category.name} Jewellery Collection — Orby Jewels`, description: category.description || undefined };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const { sort, subcategory } = await searchParams;

  const category = await db.category.findUnique({
    where: { slug },
    include: {
      subcategories: { where: { isActive: true } },
    },
  });

  if (!category || !category.isActive) notFound();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let orderBy: any = { createdAt: "desc" };
  if (sort === "price-asc") orderBy = { price: "asc" };
  if (sort === "price-desc") orderBy = { price: "desc" };
  if (sort === "name") orderBy = { name: "asc" };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {
    categoryId: category.id,
    status: "ACTIVE",
  };

  if (subcategory) {
    where.subcategory = { slug: subcategory };
  }

  const products = await db.product.findMany({
    where,
    include: {
      images: { take: 2, orderBy: { sortOrder: "asc" } },
      category: true,
      _count: { select: { reviews: true } },
    },
    orderBy,
    take: 40,
  });

  return (
    <div className="min-h-screen bg-ivory-warm">
      {/* Hero */}
      <div className="relative h-64 bg-chocolate-950 overflow-hidden">
        {category.image && (
          <Image src={category.image} alt={category.name} fill className="object-cover opacity-40" />
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xs tracking-[0.5em] text-gold-400 uppercase mb-3">Collection</span>
          <h1 className="font-playfair text-5xl text-champagne-100">{category.name}</h1>
          {category.description && (
            <p className="text-champagne-300 mt-3 max-w-md">{category.description}</p>
          )}
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-8 py-12">
        {/* Subcategory filters */}
        {category.subcategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <Link
              href={`/category/${slug}`}
              className={`px-5 py-2 text-sm font-medium transition-all ${!subcategory ? "bg-chocolate-950 text-champagne-100" : "border border-nude-200 text-chocolate-800 hover:border-chocolate-950"}`}
            >
              All {category.name}
            </Link>
            {category.subcategories.map((sub) => (
              <Link
                key={sub.id}
                href={`/category/${slug}?subcategory=${sub.slug}`}
                className={`px-5 py-2 text-sm font-medium transition-all ${subcategory === sub.slug ? "bg-chocolate-950 text-champagne-100" : "border border-nude-200 text-chocolate-800 hover:border-chocolate-950"}`}
              >
                {sub.name}
              </Link>
            ))}
          </div>
        )}

        {/* Sort */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-nude-500 text-sm">{products.length} pieces</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-nude-500">Sort by:</span>
            {[
              { value: "", label: "Newest" },
              { value: "price-asc", label: "Price: Low to High" },
              { value: "price-desc", label: "Price: High to Low" },
              { value: "name", label: "Name A-Z" },
            ].map((option) => (
              <Link
                key={option.value}
                href={`/category/${slug}?sort=${option.value}${subcategory ? `&subcategory=${subcategory}` : ""}`}
                className={`px-3 py-1.5 text-xs font-medium transition-all ${(!sort && !option.value) || sort === option.value ? "bg-chocolate-950 text-champagne-100" : "border border-nude-200 text-chocolate-800 hover:border-chocolate-950"}`}
              >
                {option.label}
              </Link>
            ))}
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-playfair text-2xl text-chocolate-800 mb-3">No products found</p>
            <p className="text-nude-400">Try a different filter or explore other collections</p>
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
