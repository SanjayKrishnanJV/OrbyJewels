export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import Image from "next/image";
import { Metadata } from "next";
import { BannerActions } from "@/components/admin/BannerActions";
import { Plus } from "lucide-react";

export const metadata: Metadata = { title: "Banners — Admin | Orby Jewels" };

export default async function AdminBannersPage() {
  const banners = await db.banner.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-playfair text-3xl text-chocolate-950">Banners</h1>
          <p className="text-nude-500 mt-1">{banners.length} banners</p>
        </div>
        <BannerActions mode="create" />
      </div>

      <div className="space-y-4">
        {banners.map((banner) => (
          <div key={banner.id} className="bg-white rounded-lg border border-nude-100 overflow-hidden flex items-center gap-6 p-4">
            <div className="relative w-40 h-20 bg-champagne-100 flex-shrink-0 overflow-hidden rounded">
              {banner.image && (
                <Image src={banner.image} alt={banner.title} fill className="object-cover" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-chocolate-950">{banner.title}</h3>
              {banner.subtitle && <p className="text-sm text-nude-500 mt-0.5">{banner.subtitle}</p>}
              {banner.link && <p className="text-xs text-nude-400 mt-1 truncate">{banner.link}</p>}
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${banner.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                {banner.isActive ? "Active" : "Inactive"}
              </span>
              <span className="text-xs text-nude-400">Sort: {banner.sortOrder}</span>
              <BannerActions mode="edit" banner={banner} />
            </div>
          </div>
        ))}
        {banners.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg border border-nude-100">
            <p className="text-nude-400">No banners yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
