export const dynamic = "force-dynamic";

import { ProductCard } from "@/components/product/ProductCard";
import { db } from "@/lib/db";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Jewellery Collections",
  description: "Browse our complete collection of luxury handcrafted jewellery — rings, necklaces, earrings, bracelets, and more.",
};

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    filter?: string;
    sort?: string;
    page?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getProducts(searchParams: any) {
  const { category, filter, sort, page = "1", search, minPrice, maxPrice } = searchParams;
  const pageNum = parseInt(page);
  const take = 24;
  const skip = (pageNum - 1) * take;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { status: "ACTIVE" };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { material: { contains: search, mode: "insensitive" } },
    ];
  }

  if (category) where.category = { slug: category };
  if (filter === "featured") where.isFeatured = true;
  if (filter === "new-arrivals") where.isNewArrival = true;
  if (filter === "bestseller") where.isBestSeller = true;
  if (filter === "trending") where.isTrending = true;

  if (minPrice || maxPrice) {
    where.price = {
      gte: minPrice ? parseFloat(minPrice) : undefined,
      lte: maxPrice ? parseFloat(maxPrice) : undefined,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let orderBy: any = { createdAt: "desc" };
  if (sort === "price-asc") orderBy = { price: "asc" };
  if (sort === "price-desc") orderBy = { price: "desc" };
  if (sort === "name") orderBy = { name: "asc" };

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        category: true,
        _count: { select: { reviews: true } },
      },
      orderBy,
      take,
      skip,
    }),
    db.product.count({ where }),
  ]);

  return { products, total, pages: Math.ceil(total / take) };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const { products, total, pages } = await getProducts(params);
  const currentPage = parseInt(params.page || "1");

  return (
    <div className="min-h-screen bg-ivory-warm">
      {/* Header */}
      <div className="bg-white border-b border-nude-100 py-12">
        <div className="max-w-screen-2xl mx-auto px-8">
          <h1 className="font-playfair text-4xl text-chocolate-950 mb-2">
            {params.filter === "featured" ? "Featured Collection" :
             params.filter === "new-arrivals" ? "New Arrivals" :
             params.filter === "bestseller" ? "Best Sellers" :
             params.search ? `Search: "${params.search}"` :
             "All Jewellery"}
          </h1>
          <p className="text-nude-500">{total} pieces</p>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-screen-2xl mx-auto px-8 py-12">
        {products.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-playfair text-2xl text-chocolate-800 mb-3">No products found</p>
            <p className="text-nude-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
            {products.map((product, i) => (
              <ProductCard
                key={product.id}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                product={product as any}
                index={i}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-16">
            {Array.from({ length: pages }).map((_, i) => (
              <a
                key={i}
                href={`/products?page=${i + 1}${params.filter ? `&filter=${params.filter}` : ""}${params.search ? `&search=${params.search}` : ""}`}
                className={`w-10 h-10 flex items-center justify-center text-sm transition-colors ${
                  currentPage === i + 1
                    ? "bg-chocolate-950 text-champagne-100"
                    : "border border-nude-200 text-chocolate-800 hover:border-chocolate-950"
                }`}
              >
                {i + 1}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
