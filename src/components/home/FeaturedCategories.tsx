"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Category } from "@/types";

const DEFAULT_CATEGORIES = [
  { id: "1", name: "Rings", slug: "rings", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600", description: "Exquisite rings" },
  { id: "2", name: "Necklaces", slug: "necklaces", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600", description: "Elegant necklaces" },
  { id: "3", name: "Earrings", slug: "earrings", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600", description: "Stunning earrings" },
  { id: "4", name: "Bracelets", slug: "bracelets", image: "https://images.unsplash.com/photo-1573408301185-9519f94a81d2?w=600", description: "Beautiful bracelets" },
  { id: "5", name: "Bangles", slug: "bangles", image: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600", description: "Traditional bangles" },
  { id: "6", name: "Pendants", slug: "pendants", image: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=600", description: "Delicate pendants" },
];

interface FeaturedCategoriesProps {
  categories?: Category[];
}

export function FeaturedCategories({ categories }: FeaturedCategoriesProps) {
  const cats = categories && categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  return (
    <section className="py-24 bg-ivory-warm">
      <div className="max-w-screen-2xl mx-auto px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="section-header"
        >
          <span className="section-label">Explore</span>
          <h2 className="section-title">Shop by Collection</h2>
          <p className="section-subtitle">
            From delicate everyday pieces to statement jewellery for your most special moments
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {cats.slice(0, 6).map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link href={`/category/${cat.slug}`} className="group block">
                <div className="relative aspect-square overflow-hidden bg-champagne-100 mb-3">
                  <Image
                    src={cat.image || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400"}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-chocolate-950/0 group-hover:bg-chocolate-950/20 transition-colors duration-500" />
                  <div className="absolute inset-0 flex items-end p-4">
                    <div className="w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <span className="text-[10px] tracking-widest uppercase text-champagne-100 font-medium bg-chocolate-950/60 px-3 py-1.5 backdrop-blur-sm">
                        Explore
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="font-playfair text-sm text-chocolate-950 group-hover:text-gold-dark transition-colors">
                    {cat.name}
                  </h3>
                  {(cat as typeof DEFAULT_CATEGORIES[0]).description && (
                    <p className="text-[10px] text-nude-500 mt-0.5">
                      {(cat as typeof DEFAULT_CATEGORIES[0]).description}
                    </p>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
