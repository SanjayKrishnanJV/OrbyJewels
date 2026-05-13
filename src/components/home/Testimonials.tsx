"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Testimonial } from "@/types";

const DEFAULT_TESTIMONIALS = [
  {
    id: "1",
    name: "Ananya Krishnan",
    location: "Chennai",
    rating: 5,
    comment: "The Eternal Rose Diamond Ring exceeded all my expectations. The craftsmanship is extraordinary and the packaging was so luxurious. My partner was speechless!",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
  },
  {
    id: "2",
    name: "Meera Patel",
    location: "Mumbai",
    rating: 5,
    comment: "The Royal Pearl Necklace is absolutely stunning. The pearls have an incredible luster and the gold clasp is so delicate. Orby Jewels truly delivers luxury.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
  },
  {
    id: "3",
    name: "Priya Nair",
    location: "Bangalore",
    rating: 5,
    comment: "I gifted my mother the Heritage Bangle Set and she cried tears of joy. The craftsmanship is extraordinary. Every detail is perfect. Worth every rupee!",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150",
  },
  {
    id: "4",
    name: "Shreya Gupta",
    location: "Delhi",
    rating: 5,
    comment: "The Celestial Diamond Earrings are simply divine. I wore them to a wedding and received so many compliments. Orby Jewels is my go-to for fine jewellery.",
    avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150",
  },
];

interface TestimonialsProps {
  testimonials?: Testimonial[];
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  const items = testimonials && testimonials.length > 0 ? testimonials : DEFAULT_TESTIMONIALS;
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + items.length) % items.length);
  const next = () => setCurrent((c) => (c + 1) % items.length);

  return (
    <section className="py-28 bg-chocolate-950 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-gold-500/5 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-gold-500/5 translate-x-1/2 translate-y-1/2" />

      <div className="relative max-w-screen-2xl mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs tracking-[0.4em] text-gold-400 uppercase mb-3 block">
            Client Love
          </span>
          <h2 className="font-playfair text-4xl md:text-5xl text-champagne-100">
            What Our Customers Say
          </h2>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <Quote className="text-gold-500/40 mx-auto mb-6" size={48} />
              <p className="font-cormorant text-2xl md:text-3xl text-champagne-100 leading-relaxed mb-8 italic">
                &ldquo;{items[current].comment}&rdquo;
              </p>
              <div className="flex items-center justify-center gap-4">
                {items[current].avatar && (
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-gold-500/30">
                    <Image
                      src={items[current].avatar!}
                      alt={items[current].name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="text-left">
                  <p className="font-medium text-champagne-100">{items[current].name}</p>
                  {items[current].location && (
                    <p className="text-xs text-champagne-400">{items[current].location}</p>
                  )}
                  <div className="flex items-center gap-0.5 mt-1">
                    {Array.from({ length: items[current].rating }).map((_, i) => (
                      <Star key={i} size={12} fill="#D4AF37" className="text-gold-400" />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 mt-12">
            <button
              onClick={prev}
              className="w-10 h-10 border border-champagne-300/20 text-champagne-300 hover:border-gold-400 hover:text-gold-400 flex items-center justify-center transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`transition-all duration-300 h-1 ${
                    i === current ? "w-8 bg-gold-400" : "w-3 bg-champagne-300/30"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 border border-champagne-300/20 text-champagne-300 hover:border-gold-400 hover:text-gold-400 flex items-center justify-center transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Trust stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-16 border-t border-chocolate-800"
        >
          {[
            { number: "10,000+", label: "Happy Customers" },
            { number: "500+", label: "Unique Designs" },
            { number: "15+", label: "Years of Craft" },
            { number: "4.9★", label: "Average Rating" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-playfair text-3xl md:text-4xl text-gold-400 mb-2">{stat.number}</p>
              <p className="text-xs tracking-widest uppercase text-champagne-400">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
