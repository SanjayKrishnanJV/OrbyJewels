"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Award, Shield, Gem, Heart } from "lucide-react";

export function BrandStory() {
  return (
    <section className="py-28 bg-ivory-warm">
      <div className="max-w-screen-2xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative h-[500px] w-full">
              {/* Main image */}
              <div className="absolute left-0 top-0 w-[70%] h-[80%] overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800"
                  alt="Orby Jewels Craftsmanship"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Secondary image */}
              <div className="absolute right-0 bottom-0 w-[50%] h-[55%] overflow-hidden border-4 border-ivory-warm">
                <Image
                  src="https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600"
                  alt="Orby Jewels Detail"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white shadow-luxury p-5 text-center w-32">
                <p className="font-playfair text-2xl text-gold-dark">15+</p>
                <p className="text-[9px] tracking-widest uppercase text-nude-500 mt-0.5">Years of Artistry</p>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="section-label">Our Story</span>
            <h2 className="font-playfair text-4xl md:text-5xl text-chocolate-950 mb-6 leading-tight">
              Crafting Beauty,<br />
              <span className="gold-text">Celebrating Life</span>
            </h2>
            <p className="text-nude-700 leading-relaxed mb-5">
              Founded under the prestigious Nera Groups, Orby Jewels was born from a vision to
              bring museum-quality jewellery to every discerning woman. We believe that every
              piece of jewellery tells a story — of love, of celebration, of identity.
            </p>
            <p className="text-nude-700 leading-relaxed mb-10">
              Our master craftsmen, many with decades of experience, pour their hearts into
              each creation. From the initial sketch to the final polish, every step is executed
              with uncompromising attention to detail and the finest materials sourced ethically
              from around the world.
            </p>

            {/* Values */}
            <div className="grid grid-cols-2 gap-5 mb-10">
              {[
                { icon: Gem, title: "Premium Quality", desc: "Only the finest diamonds and gemstones" },
                { icon: Shield, title: "BIS Hallmarked", desc: "Certified purity you can trust" },
                { icon: Award, title: "Award Winning", desc: "Recognized for design excellence" },
                { icon: Heart, title: "Ethically Sourced", desc: "Responsible and sustainable" },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-champagne-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <item.icon size={15} className="text-gold-dark" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-chocolate-950">{item.title}</p>
                    <p className="text-xs text-nude-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/about"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-chocolate-950 text-champagne-100 text-sm font-medium tracking-[0.2em] uppercase hover:bg-chocolate-800 transition-colors"
            >
              Our Story
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
