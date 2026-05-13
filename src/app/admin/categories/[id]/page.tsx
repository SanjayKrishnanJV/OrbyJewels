export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Edit Category — Admin | Orby Jewels" };

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const category = await db.category.findUnique({
    where: { id },
    include: { subcategories: true },
  });

  if (!category) notFound();

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-playfair text-3xl text-chocolate-950">Edit Category</h1>
        <p className="text-nude-500 mt-1">{category.name}</p>
      </div>
      <CategoryForm category={category} />
    </div>
  );
}
