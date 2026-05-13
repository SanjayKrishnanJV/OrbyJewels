export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { Plus } from "lucide-react";

export const metadata: Metadata = { title: "Categories — Admin | Orby Jewels" };

export default async function AdminCategoriesPage() {
  const categories = await db.category.findMany({
    include: {
      subcategories: true,
      _count: { select: { products: true } },
    },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-playfair text-3xl text-chocolate-950">Categories</h1>
          <p className="text-nude-500 mt-1">{categories.length} categories</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="flex items-center gap-2 px-5 py-3 bg-chocolate-950 text-champagne-100 text-sm font-medium hover:bg-chocolate-800 transition-colors"
        >
          <Plus size={16} />
          Add Category
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-lg border border-nude-100 overflow-hidden hover:shadow-luxury-sm transition-shadow">
            {cat.image && (
              <div className="relative h-40 bg-champagne-100">
                <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                <div className="absolute inset-0 bg-chocolate-950/30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h2 className="font-playfair text-2xl text-white">{cat.name}</h2>
                </div>
              </div>
            )}
            <div className="p-5">
              {!cat.image && (
                <h2 className="font-playfair text-xl text-chocolate-950 mb-2">{cat.name}</h2>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-nude-500">{cat._count.products} products</span>
                <span className="text-nude-500">{cat.subcategories.length} subcategories</span>
              </div>
              {cat.subcategories.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {cat.subcategories.slice(0, 4).map((sub) => (
                    <span key={sub.id} className="text-[10px] px-2 py-1 bg-champagne-100 text-nude-600">
                      {sub.name}
                    </span>
                  ))}
                  {cat.subcategories.length > 4 && (
                    <span className="text-[10px] px-2 py-1 bg-champagne-100 text-nude-400">
                      +{cat.subcategories.length - 4} more
                    </span>
                  )}
                </div>
              )}
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-nude-100">
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${cat.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                  {cat.isActive ? "Active" : "Inactive"}
                </span>
                <Link href={`/admin/categories/${cat.id}`} className="ml-auto text-xs text-gold-dark hover:underline">
                  Edit →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
