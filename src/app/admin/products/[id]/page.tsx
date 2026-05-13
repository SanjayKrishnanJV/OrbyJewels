export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { ProductForm } from "@/components/admin/ProductForm";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Edit Product — Admin | Orby Jewels" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    db.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        tags: { include: { tag: true } },
        category: true,
        subcategory: true,
      },
    }),
    db.category.findMany({
      where: { isActive: true },
      include: { subcategories: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!product) notFound();

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-playfair text-3xl text-chocolate-950">Edit Product</h1>
        <p className="text-nude-500 mt-1">{product.name}</p>
      </div>
      <ProductForm
        product={product as Parameters<typeof ProductForm>[0]["product"]}
        categories={categories as Parameters<typeof ProductForm>[0]["categories"]}
      />
    </div>
  );
}
