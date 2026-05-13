export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { ProductForm } from "@/components/admin/ProductForm";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Add Product — Admin | Orby Jewels" };

export default async function NewProductPage() {
  const categories = await db.category.findMany({
    where: { isActive: true },
    include: { subcategories: true },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-playfair text-3xl text-chocolate-950">Add New Product</h1>
        <p className="text-nude-500 mt-1">Create a new jewellery listing</p>
      </div>
      <ProductForm categories={categories as Parameters<typeof ProductForm>[0]["categories"]} />
    </div>
  );
}
