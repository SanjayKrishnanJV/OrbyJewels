export const dynamic = "force-dynamic";

import { Metadata } from "next";
import { CategoryForm } from "@/components/admin/CategoryForm";

export const metadata: Metadata = { title: "Add Category — Admin | Orby Jewels" };

export default function NewCategoryPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-playfair text-3xl text-chocolate-950">Add Category</h1>
        <p className="text-nude-500 mt-1">Create a new product category</p>
      </div>
      <CategoryForm />
    </div>
  );
}
