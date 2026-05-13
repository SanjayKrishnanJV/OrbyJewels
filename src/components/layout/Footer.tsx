"use client";

import Link from "next/link";
import { Instagram, Facebook, Youtube, Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-chocolate-950 text-champagne-200">
      {/* Newsletter */}
      <div className="border-b border-chocolate-800">
        <div className="max-w-screen-2xl mx-auto px-8 py-14">
          <div className="max-w-xl mx-auto text-center">
            <p className="text-xs tracking-[0.4em] text-gold-400 mb-3 uppercase">Exclusive Access</p>
            <h3 className="font-playfair text-3xl text-champagne-100 mb-3">
              Join the Inner Circle
            </h3>
            <p className="text-champagne-300 text-sm mb-8">
              Subscribe for early access to new collections, exclusive offers, and jewellery styling tips.
            </p>
            <form className="flex gap-2 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 bg-chocolate-800 border border-chocolate-700 text-champagne-100 placeholder:text-chocolate-400 text-sm focus:outline-none focus:border-gold-500 transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gold-gradient text-chocolate-950 text-sm font-semibold tracking-wider uppercase hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-screen-2xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <p className="font-playfair text-3xl font-bold tracking-[0.15em] text-champagne-100">
                ORBY
              </p>
              <p className="text-[10px] tracking-[0.5em] text-gold-400 uppercase">JEWELS</p>
              <p className="text-[8px] tracking-[0.3em] text-chocolate-400 mt-0.5">UNDER NERA GROUPS</p>
            </div>
            <p className="text-champagne-300 text-sm leading-relaxed mb-6 max-w-sm">
              Where elegance meets artistry. Every piece at Orby Jewels is a testament to
              exceptional craftsmanship, curated for the discerning modern woman.
            </p>
            {/* Social */}
            <div className="flex gap-4">
              <a
                href="https://instagram.com/orbyjewels"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-chocolate-700 flex items-center justify-center text-champagne-300 hover:text-gold-400 hover:border-gold-400 transition-all duration-300"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://facebook.com/orbyjewels"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-chocolate-700 flex items-center justify-center text-champagne-300 hover:text-gold-400 hover:border-gold-400 transition-all duration-300"
              >
                <Facebook size={16} />
              </a>
              <a
                href="https://youtube.com/@orbyjewels"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-chocolate-700 flex items-center justify-center text-champagne-300 hover:text-gold-400 hover:border-gold-400 transition-all duration-300"
              >
                <Youtube size={16} />
              </a>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-xs tracking-[0.3em] uppercase text-gold-400 mb-6 font-medium">
              Collections
            </h4>
            <ul className="space-y-3">
              {[
                { name: "Rings", href: "/category/rings" },
                { name: "Necklaces", href: "/category/necklaces" },
                { name: "Earrings", href: "/category/earrings" },
                { name: "Bracelets", href: "/category/bracelets" },
                { name: "Bangles", href: "/category/bangles" },
                { name: "Pendants", href: "/category/pendants" },
                { name: "New Arrivals", href: "/collections/new-arrivals" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-champagne-300 text-sm hover:text-gold-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-xs tracking-[0.3em] uppercase text-gold-400 mb-6 font-medium">
              Help & Info
            </h4>
            <ul className="space-y-3">
              {[
                { name: "About Us", href: "/about" },
                { name: "Contact Us", href: "/contact" },
                { name: "FAQs", href: "/faqs" },
                { name: "Shipping Policy", href: "/shipping" },
                { name: "Return Policy", href: "/returns" },
                { name: "Privacy Policy", href: "/privacy" },
                { name: "Terms & Conditions", href: "/terms" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-champagne-300 text-sm hover:text-gold-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs tracking-[0.3em] uppercase text-gold-400 mb-6 font-medium">
              Contact
            </h4>
            <div className="space-y-4">
              <div className="flex gap-3">
                <Phone size={15} className="text-gold-400 flex-shrink-0 mt-0.5" />
                <div>
                  <a href="tel:+919876543210" className="text-champagne-300 text-sm hover:text-gold-400 transition-colors block">
                    +91 98765 43210
                  </a>
                  <p className="text-chocolate-400 text-xs mt-0.5">Mon–Sat, 10am–7pm</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Mail size={15} className="text-gold-400 flex-shrink-0 mt-0.5" />
                <a href="mailto:hello@orbyjewels.com" className="text-champagne-300 text-sm hover:text-gold-400 transition-colors">
                  hello@orbyjewels.com
                </a>
              </div>
              <div className="flex gap-3">
                <MapPin size={15} className="text-gold-400 flex-shrink-0 mt-0.5" />
                <p className="text-champagne-300 text-sm leading-relaxed">
                  123, Luxury Lane,<br />
                  Bandra West, Mumbai — 400050
                </p>
              </div>
            </div>

            {/* Trust badges */}
            <div className="mt-8 pt-6 border-t border-chocolate-800">
              <p className="text-xs tracking-wider text-chocolate-400 mb-3">CERTIFIED & TRUSTED</p>
              <div className="flex flex-wrap gap-2">
                {["BIS Hallmark", "GIA Certified", "ISO 9001"].map((badge) => (
                  <span key={badge} className="text-[10px] px-2 py-1 border border-chocolate-700 text-champagne-400 tracking-wider">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-chocolate-800">
        <div className="max-w-screen-2xl mx-auto px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-chocolate-400 text-xs text-center md:text-left">
              &copy; <span suppressHydrationWarning>{new Date().getFullYear()}</span> Orby Jewels. All rights reserved. Part of Nera Groups.
            </p>
            <div className="flex items-center gap-4 text-chocolate-500 text-xs">
              <span>Secured by SSL</span>
              <span>|</span>
              <span>Made in India</span>
              <span>|</span>
              <span>CIN: U12345MH2024</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
