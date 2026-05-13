"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Phone, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Registration failed");
        return;
      }

      toast.success("Account created! Please sign in.");
      router.push("/login");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-8">
        <h1 className="font-playfair text-3xl text-chocolate-950 mb-2">Create Account</h1>
        <p className="text-nude-500 text-sm">Join the Orby Jewels family</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs tracking-widest uppercase text-nude-500 mb-2">Full Name</label>
          <div className="relative">
            <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-nude-400" />
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Your full name"
              className="input-luxury pl-11"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs tracking-widest uppercase text-nude-500 mb-2">Email Address</label>
          <div className="relative">
            <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-nude-400" />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
              className="input-luxury pl-11"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs tracking-widest uppercase text-nude-500 mb-2">Phone (Optional)</label>
          <div className="relative">
            <Phone size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-nude-400" />
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="input-luxury pl-11"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs tracking-widest uppercase text-nude-500 mb-2">Password</label>
          <div className="relative">
            <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-nude-400" />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              required
              minLength={8}
              placeholder="Min. 8 characters"
              className="input-luxury pl-11 pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-nude-400"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs tracking-widest uppercase text-nude-500 mb-2">Confirm Password</label>
          <div className="relative">
            <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-nude-400" />
            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
              className="input-luxury pl-11"
            />
          </div>
        </div>

        <p className="text-xs text-nude-400">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="text-gold-dark hover:underline">Terms</Link> and{" "}
          <Link href="/privacy" className="text-gold-dark hover:underline">Privacy Policy</Link>.
        </p>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-chocolate-950 text-champagne-100 text-sm font-medium tracking-[0.2em] uppercase hover:bg-chocolate-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
        >
          {isLoading && <Loader2 size={16} className="animate-spin" />}
          Create Account
        </button>
      </form>

      <p className="text-center text-sm text-nude-500 mt-8">
        Already have an account?{" "}
        <Link href="/login" className="text-gold-dark hover:text-gold-600 font-medium transition-colors">
          Sign In
        </Link>
      </p>
    </motion.div>
  );
}
