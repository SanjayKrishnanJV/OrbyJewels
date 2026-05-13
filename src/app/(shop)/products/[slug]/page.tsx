export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { Metadata } from "next";
import { db } from "@/lib/db";
import { ProductDetail } from "@/components/product/ProductDetail";
import { ProductSection } from "@/components/home/ProductSection";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await db.product.findUnique({
    where: { slug },
    select: { name: true, shortDesc: true, metaTitle: true, metaDescription: true },
  });
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.metaTitle || product.name,
    description: product.metaDescription || product.shortDesc || undefined,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await db.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      category: true,
      subcategory: true,
      reviews: {
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      _count: { select: { reviews: true } },
    },
  });

  if (!product) notFound();

  // Related products
  const related = await db.product.findMany({
    where: {
      categoryId: product.categoryId,
      status: "ACTIVE",
      NOT: { id: product.id },
    },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      category: true,
      _count: { select: { reviews: true } },
    },
    take: 4,
  });

  return (
    <div>
      <ProductDetail product={product as Parameters<typeof ProductDetail>[0]["product"]} />

      {related.length > 0 && (
        <ProductSection
          label="You May Also Love"
          title="Related Pieces"
          products={related as Parameters<typeof ProductSection>[0]["products"]}
          viewAllLink={`/category/${product.category?.slug}`}
          viewAllText="View Collection"
          bgColor="bg-champagne-100"
        />
      )}
    </div>
  );
}
