"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { Product } from "@/types";

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  label?: string;
  products: Product[];
  viewAllLink?: string;
  viewAllText?: string;
  tabs?: { label: string; filter: (p: Product) => boolean }[];
  bgColor?: string;
}

export function ProductSection({
  title,
  subtitle,
  label,
  products,
  viewAllLink = "/products",
  viewAllText = "View All",
  tabs,
  bgColor = "bg-white",
}: ProductSectionProps) {
  const [activeTab, setActiveTab] = useState(0);
  const displayProducts = tabs ? products.filter(tabs[activeTab].filter) : products;

  return (
    <section className={`py-24 ${bgColor}`}>
      <div className="max-w-screen-2xl mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6"
        >
          <div>
            {label && <span className="section-label">{label}</span>}
            <h2 className="font-playfair text-3xl md:text-5xl text-chocolate-950">{title}</h2>
            {subtitle && (
              <p className="text-nude-600 mt-3 max-w-lg leading-relaxed">{subtitle}</p>
            )}
          </div>
          {viewAllLink && (
            <Link
              href={viewAllLink}
              className="group flex items-center gap-2 text-sm font-medium tracking-widest uppercase text-chocolate-950 border-b border-chocolate-950 pb-1 hover:text-gold-dark hover:border-gold-dark transition-all duration-300 flex-shrink-0"
            >
              {viewAllText}
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </motion.div>

        {/* Tabs */}
        {tabs && (
          <div className="flex items-center gap-1 mb-10 border-b border-nude-100">
            {tabs.map((tab, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`relative px-6 py-3 text-sm font-medium tracking-wide transition-colors duration-200 ${
                  activeTab === i
                    ? "text-chocolate-950"
                    : "text-nude-500 hover:text-chocolate-800"
                }`}
              >
                {tab.label}
                {activeTab === i && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500"
                  />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Products grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {displayProducts.slice(0, 8).map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {displayProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-nude-400">No products found in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
}
