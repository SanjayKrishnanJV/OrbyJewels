export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { Plus, Edit, Eye } from "lucide-react";
import { Metadata } from "next";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

export const metadata: Metadata = { title: "Products — Admin | Orby Jewels" };

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    include: {
      images: { take: 1, orderBy: { sortOrder: "asc" } },
      category: { select: { name: true } },
      _count: { select: { reviews: true, orderItems: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const STATUS_COLORS: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-700",
    INACTIVE: "bg-gray-100 text-gray-600",
    OUT_OF_STOCK: "bg-red-100 text-red-700",
    DRAFT: "bg-yellow-100 text-yellow-700",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-playfair text-3xl text-chocolate-950">Products</h1>
          <p className="text-nude-500 mt-1">{products.length} total products</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-5 py-3 bg-chocolate-950 text-champagne-100 text-sm font-medium hover:bg-chocolate-800 transition-colors"
        >
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-nude-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-champagne-100 border-b border-nude-200">
            <tr>
              {["Product", "Category", "Price", "Stock", "Status", "Sales", "Actions"].map((h) => (
                <th key={h} className="px-5 py-4 text-left text-xs font-semibold text-nude-600 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-nude-50">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-champagne-50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 bg-champagne-100 flex-shrink-0 overflow-hidden">
                      {product.images[0] && (
                        <Image src={product.images[0].url} alt={product.name} fill className="object-cover" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-chocolate-950 line-clamp-1">{product.name}</p>
                      <p className="text-xs text-nude-400">{product.sku}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-xs text-nude-600">{product.category?.name}</td>
                <td className="px-5 py-4">
                  <div>
                    <p className="text-sm font-medium text-chocolate-950">{formatPrice(product.price)}</p>
                    {product.comparePrice && (
                      <p className="text-xs text-nude-400 line-through">{formatPrice(product.comparePrice)}</p>
                    )}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className={`text-sm font-medium ${product.stock <= 5 ? "text-red-600" : "text-chocolate-950"}`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-semibold ${STATUS_COLORS[product.status]}`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-xs text-nude-600">{product._count.orderItems} sold</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/products/${product.slug}`}
                      target="_blank"
                      className="p-1.5 text-nude-400 hover:text-chocolate-800 transition-colors"
                    >
                      <Eye size={15} />
                    </Link>
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="p-1.5 text-nude-400 hover:text-gold-dark transition-colors"
                    >
                      <Edit size={15} />
                    </Link>
                    <DeleteProductButton id={product.id} name={product.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="text-center py-16">
            <p className="text-nude-400">No products yet</p>
            <Link href="/admin/products/new" className="text-gold-dark text-sm mt-2 inline-block hover:underline">
              Add your first product →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
