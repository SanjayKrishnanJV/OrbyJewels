"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  Phone,
  LogOut,
  Package,
  MapPin,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { cn } from "@/lib/utils";

const categories = [
  {
    name: "Rings",
    slug: "rings",
    subcategories: ["Solitaire Rings", "Engagement Rings", "Wedding Bands", "Statement Rings"],
  },
  {
    name: "Necklaces",
    slug: "necklaces",
    subcategories: ["Diamond Necklaces", "Gold Chains", "Pearl Necklaces"],
  },
  {
    name: "Earrings",
    slug: "earrings",
    subcategories: ["Stud Earrings", "Drop Earrings", "Hoop Earrings"],
  },
  {
    name: "Bracelets",
    slug: "bracelets",
    subcategories: ["Tennis Bracelets", "Charm Bracelets"],
  },
  { name: "Bangles", slug: "bangles", subcategories: [] },
  { name: "Pendants", slug: "pendants", subcategories: [] },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();
  const totalItems = useCartStore((s) => s.totalItems);
  const wishlistItems = useWishlistStore((s) => s.items);
  const openCart = useCartStore((s) => s.openCart);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-chocolate-950 text-champagne-100 text-xs py-2 px-4 text-center tracking-widest">
        <span>FREE SHIPPING ON ORDERS ABOVE ₹5,000 &nbsp;|&nbsp; CERTIFIED JEWELLERY &nbsp;|&nbsp; EASY RETURNS</span>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-500",
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-luxury-sm border-b border-nude-200"
            : "bg-ivory-DEFAULT border-b border-nude-100"
        )}
      >
        {/* Main navbar */}
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 text-chocolate-950"
              onClick={() => setIsMobileOpen(true)}
            >
              <Menu size={24} />
            </button>

            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <div className="flex flex-col items-center">
                <span className="font-playfair text-2xl font-bold tracking-[0.15em] text-chocolate-950">
                  ORBY
                </span>
                <span className="text-[9px] tracking-[0.4em] text-gold-dark uppercase font-medium -mt-1">
                  JEWELS
                </span>
                <span className="text-[7px] tracking-[0.2em] text-nude-600 -mt-0.5">
                  UNDER NERA GROUPS
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {categories.map((cat) => (
                <div
                  key={cat.slug}
                  className="relative"
                  onMouseEnter={() => setActiveCategory(cat.slug)}
                  onMouseLeave={() => setActiveCategory(null)}
                >
                  <Link
                    href={`/category/${cat.slug}`}
                    className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-chocolate-800 hover:text-gold-dark tracking-wide transition-colors duration-200"
                  >
                    {cat.name}
                    {cat.subcategories.length > 0 && (
                      <ChevronDown size={14} className="opacity-60" />
                    )}
                  </Link>

                  {/* Mega dropdown */}
                  <AnimatePresence>
                    {activeCategory === cat.slug && cat.subcategories.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 w-48 bg-white shadow-luxury border border-nude-100 py-2 z-50"
                      >
                        {cat.subcategories.map((sub) => (
                          <Link
                            key={sub}
                            href={`/category/${cat.slug}?subcategory=${sub.toLowerCase().replace(/ /g, "-")}`}
                            className="block px-5 py-2.5 text-sm text-chocolate-800 hover:text-gold-dark hover:bg-champagne-100 transition-colors duration-150"
                          >
                            {sub}
                          </Link>
                        ))}
                        <div className="border-t border-nude-100 mt-1 pt-1">
                          <Link
                            href={`/category/${cat.slug}`}
                            className="block px-5 py-2.5 text-sm font-medium text-gold-dark hover:bg-champagne-100 transition-colors duration-150"
                          >
                            View All {cat.name}
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
              <Link
                href="/collections/new-arrivals"
                className="px-4 py-2 text-sm font-medium text-gold-dark tracking-wide hover:text-gold-600 transition-colors duration-200"
              >
                New Arrivals
              </Link>
            </nav>

            {/* Action icons */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 text-chocolate-800 hover:text-gold-dark transition-colors duration-200"
              >
                <Search size={20} />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-2.5 text-chocolate-800 hover:text-gold-dark transition-colors duration-200"
              >
                <Heart size={20} />
                {mounted && wishlistItems.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-gold-500 text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative p-2.5 text-chocolate-800 hover:text-gold-dark transition-colors duration-200"
              >
                <ShoppingBag size={20} />
                {mounted && totalItems() > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-chocolate-950 text-champagne-100 text-[10px] rounded-full flex items-center justify-center font-medium">
                    {totalItems()}
                  </span>
                )}
              </button>

              {/* User */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="p-2.5 text-chocolate-800 hover:text-gold-dark transition-colors duration-200"
                >
                  <User size={20} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-full w-52 bg-white shadow-luxury border border-nude-100 py-2 z-50"
                      onMouseLeave={() => setUserMenuOpen(false)}
                    >
                      {session ? (
                        <>
                          <div className="px-5 py-3 border-b border-nude-100">
                            <p className="text-xs text-nude-500">Welcome back,</p>
                            <p className="text-sm font-medium text-chocolate-950 truncate">
                              {session.user?.name || session.user?.email}
                            </p>
                          </div>
                          {session.user?.role === "ADMIN" && (
                            <Link
                              href="/admin/dashboard"
                              className="flex items-center gap-3 px-5 py-2.5 text-sm text-chocolate-800 hover:bg-champagne-100 hover:text-gold-dark transition-colors"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              <Package size={15} />
                              Admin Panel
                            </Link>
                          )}
                          <Link
                            href="/account"
                            className="flex items-center gap-3 px-5 py-2.5 text-sm text-chocolate-800 hover:bg-champagne-100 hover:text-gold-dark transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <User size={15} />
                            My Account
                          </Link>
                          <Link
                            href="/orders"
                            className="flex items-center gap-3 px-5 py-2.5 text-sm text-chocolate-800 hover:bg-champagne-100 hover:text-gold-dark transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Package size={15} />
                            My Orders
                          </Link>
                          <Link
                            href="/account/addresses"
                            className="flex items-center gap-3 px-5 py-2.5 text-sm text-chocolate-800 hover:bg-champagne-100 hover:text-gold-dark transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <MapPin size={15} />
                            Addresses
                          </Link>
                          <div className="border-t border-nude-100 mt-1 pt-1">
                            <button
                              onClick={() => signOut()}
                              className="flex items-center gap-3 px-5 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full transition-colors"
                            >
                              <LogOut size={15} />
                              Sign Out
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <Link
                            href="/login"
                            className="block px-5 py-2.5 text-sm text-chocolate-800 hover:bg-champagne-100 hover:text-gold-dark transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            Sign In
                          </Link>
                          <Link
                            href="/register"
                            className="block px-5 py-2.5 text-sm font-medium text-gold-dark hover:bg-champagne-100 transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            Create Account
                          </Link>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* WhatsApp */}
              <a
                href="https://wa.me/918547858420"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex p-2.5 text-chocolate-800 hover:text-green-600 transition-colors duration-200"
                title="Chat on WhatsApp"
              >
                <Phone size={20} />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-chocolate-950/70 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              className="w-full max-w-2xl bg-white shadow-luxury"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSearch} className="flex items-center">
                <Search className="ml-5 text-nude-400 flex-shrink-0" size={20} />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for jewellery..."
                  className="flex-1 px-4 py-5 text-lg text-chocolate-950 placeholder:text-nude-300 bg-transparent outline-none font-poppins"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="p-5 text-nude-400 hover:text-chocolate-950 transition-colors"
                >
                  <X size={20} />
                </button>
              </form>
              <div className="px-5 pb-4">
                <p className="text-xs text-nude-400 tracking-wider">
                  POPULAR: Diamond Rings, Gold Necklaces, Pearl Earrings
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[70] bg-chocolate-950/70"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 z-[80] w-80 bg-white shadow-luxury overflow-y-auto"
            >
              <div className="flex items-center justify-between p-5 border-b border-nude-100">
                <div>
                  <p className="font-playfair text-xl font-bold text-chocolate-950">ORBY JEWELS</p>
                  <p className="text-[9px] tracking-widest text-nude-500">UNDER NERA GROUPS</p>
                </div>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 text-chocolate-800"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="p-4">
                {categories.map((cat) => (
                  <div key={cat.slug} className="mb-1">
                    <Link
                      href={`/category/${cat.slug}`}
                      className="flex items-center justify-between py-3 px-2 text-chocolate-800 font-medium border-b border-nude-50 hover:text-gold-dark transition-colors"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      {cat.name}
                    </Link>
                    {cat.subcategories.length > 0 && (
                      <div className="pl-4 py-1">
                        {cat.subcategories.map((sub) => (
                          <Link
                            key={sub}
                            href={`/category/${cat.slug}?subcategory=${sub.toLowerCase().replace(/ /g, "-")}`}
                            className="block py-2 text-sm text-nude-600 hover:text-gold-dark transition-colors"
                            onClick={() => setIsMobileOpen(false)}
                          >
                            {sub}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <Link
                  href="/collections/new-arrivals"
                  className="block py-3 px-2 text-gold-dark font-medium"
                  onClick={() => setIsMobileOpen(false)}
                >
                  New Arrivals
                </Link>
              </nav>

              <div className="p-4 border-t border-nude-100">
                {session ? (
                  <div className="space-y-2">
                    <Link href="/account" className="flex items-center gap-3 py-2 text-sm text-chocolate-800" onClick={() => setIsMobileOpen(false)}>
                      <User size={16} /> My Account
                    </Link>
                    <Link href="/orders" className="flex items-center gap-3 py-2 text-sm text-chocolate-800" onClick={() => setIsMobileOpen(false)}>
                      <Package size={16} /> My Orders
                    </Link>
                    <button onClick={() => signOut()} className="flex items-center gap-3 py-2 text-sm text-red-600">
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link href="/login" className="block w-full text-center py-3 border border-chocolate-950 text-chocolate-950 text-sm font-medium tracking-wider" onClick={() => setIsMobileOpen(false)}>
                      SIGN IN
                    </Link>
                    <Link href="/register" className="block w-full text-center py-3 bg-chocolate-950 text-champagne-100 text-sm font-medium tracking-wider" onClick={() => setIsMobileOpen(false)}>
                      CREATE ACCOUNT
                    </Link>
                  </div>
                )}
              </div>

              <div className="p-4 bg-champagne-100">
                <p className="text-xs text-nude-500 mb-1">Need help?</p>
                <a href="tel:+918547858420" className="flex items-center gap-2 text-sm text-chocolate-950 font-medium">
                  <Phone size={14} />
                  +91 85478 58420
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
