"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Banner } from "@/types";

const DEFAULT_SLIDES = [
  {
    id: "1",
    title: "Timeless Elegance",
    subtitle: "New Collection 2024",
    description: "Discover our exquisite collection of handcrafted jewellery, designed for the modern woman who appreciates timeless beauty.",
    image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=1920&q=80",
    link: "/collections/new-arrivals",
    buttonText: "Explore Collection",
  },
  {
    id: "2",
    title: "Bridal Radiance",
    subtitle: "Your Perfect Moment",
    description: "Make your wedding unforgettable with our curated bridal jewellery collection, crafted for the most special days of your life.",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1920&q=80",
    link: "/category/rings",
    buttonText: "Shop Bridal",
  },
  {
    id: "3",
    title: "The Gold Standard",
    subtitle: "Hallmarked Excellence",
    description: "Every piece certified and hallmarked for purity. Our commitment to quality ensures your investment in beauty lasts generations.",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1920&q=80",
    link: "/category/necklaces",
    buttonText: "Discover More",
  },
];

interface HeroSectionProps {
  banners?: Banner[];
}

export function HeroSection({ banners }: HeroSectionProps) {
  const slides = banners && banners.length > 0 ? banners : DEFAULT_SLIDES;
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length, isAutoPlaying]);

  const prev = () => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  const next = () => {
    setCurrent((c) => (c + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const slide = slides[current] as typeof DEFAULT_SLIDES[0] & Banner;

  return (
    <section className="relative h-[85vh] min-h-[600px] overflow-hidden bg-chocolate-950">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority
            quality={90}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-chocolate-950/80 via-chocolate-950/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-chocolate-950/60 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative h-full max-w-screen-2xl mx-auto px-8 flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="max-w-2xl"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xs tracking-[0.5em] uppercase text-gold-400 mb-4 font-medium"
            >
              {slide.subtitle}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="font-playfair text-5xl md:text-7xl text-champagne-100 leading-tight mb-6"
            >
              {slide.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-champagne-300 text-lg leading-relaxed mb-10 max-w-lg"
            >
              {slide.description}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex items-center gap-6"
            >
              <Link
                href={slide.link || "/products"}
                className="group flex items-center gap-3 px-10 py-4 bg-gold-gradient text-chocolate-950 text-sm font-semibold tracking-[0.2em] uppercase hover:opacity-90 transition-opacity"
              >
                {slide.buttonText || "Shop Now"}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/products"
                className="text-champagne-300 text-sm tracking-widest uppercase border-b border-champagne-300/30 hover:border-champagne-300 hover:text-champagne-100 transition-all duration-300 pb-1"
              >
                View All
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => { setCurrent(i); setIsAutoPlaying(false); }}
              className={`transition-all duration-500 ${
                i === current
                  ? "w-10 h-1 bg-gold-400"
                  : "w-4 h-1 bg-champagne-300/40 hover:bg-champagne-300/60"
              }`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={prev}
            className="w-10 h-10 border border-champagne-300/30 text-champagne-300 hover:border-gold-400 hover:text-gold-400 flex items-center justify-center transition-all duration-300"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            className="w-10 h-10 border border-champagne-300/30 text-champagne-300 hover:border-gold-400 hover:text-gold-400 flex items-center justify-center transition-all duration-300"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Floating scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
      >
        <div className="w-px h-10 bg-gradient-to-b from-champagne-300/0 to-champagne-300/60" />
      </motion.div>
    </section>
  );
}
