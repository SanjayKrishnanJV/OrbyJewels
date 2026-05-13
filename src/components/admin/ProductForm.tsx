"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, X, Loader2, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { slugify } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  subcategories: { id: string; name: string }[];
}

interface ProductFormProps {
  categories: Category[];
  product?: {
    id: string;
    name: string;
    slug: string;
    sku: string;
    description: string;
    shortDesc?: string | null;
    price: number;
    comparePrice?: number | null;
    stock: number;
    status: string;
    isFeatured: boolean;
    isNewArrival: boolean;
    isBestSeller: boolean;
    isTrending: boolean;
    categoryId: string;
    subcategoryId?: string | null;
    material?: string | null;
    purity?: string | null;
    stoneType?: string | null;
    stoneWeight?: number | null;
    metalWeight?: number | null;
    gender?: string | null;
    occasion?: string | null;
    images: { id: string; url: string; isPrimary: boolean }[];
  };
}

export function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!product;
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [images, setImages] = useState<{ url: string; isPrimary: boolean; id?: string }[]>(
    product?.images || []
  );

  const [form, setForm] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    sku: product?.sku || "",
    description: product?.description || "",
    shortDesc: product?.shortDesc || "",
    price: product?.price?.toString() || "",
    comparePrice: product?.comparePrice?.toString() || "",
    stock: product?.stock?.toString() || "0",
    status: product?.status || "ACTIVE",
    isFeatured: product?.isFeatured || false,
    isNewArrival: product?.isNewArrival || false,
    isBestSeller: product?.isBestSeller || false,
    isTrending: product?.isTrending || false,
    categoryId: product?.categoryId || "",
    subcategoryId: product?.subcategoryId || "",
    material: product?.material || "",
    purity: product?.purity || "",
    stoneType: product?.stoneType || "",
    stoneWeight: product?.stoneWeight?.toString() || "",
    metalWeight: product?.metalWeight?.toString() || "",
    gender: product?.gender || "Women",
    occasion: product?.occasion || "",
  });

  const selectedCategory = categories.find((c) => c.id === form.categoryId);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm({ ...form, [name]: (e.target as HTMLInputElement).checked });
    } else {
      if (name === "name" && !isEdit) {
        setForm({ ...form, name: value, slug: slugify(value) });
      } else {
        setForm({ ...form, [name]: value });
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploadingImage(true);
    try {
      for (const file of Array.from(files)) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64 = reader.result as string;
          const res = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: base64 }),
          });
          if (res.ok) {
            const { url } = await res.json();
            setImages((prev) => [
              ...prev,
              { url, isPrimary: prev.length === 0 },
            ]);
          } else {
            // Fallback: use blob URL for demo
            const url = URL.createObjectURL(file);
            setImages((prev) => [...prev, { url, isPrimary: prev.length === 0 }]);
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      toast.error("Image upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (i: number) => {
    setImages((prev) => {
      const updated = prev.filter((_, idx) => idx !== i);
      if (updated.length > 0 && !updated.some((img) => img.isPrimary)) {
        updated[0].isPrimary = true;
      }
      return updated;
    });
  };

  const setPrimary = (i: number) => {
    setImages((prev) => prev.map((img, idx) => ({ ...img, isPrimary: idx === i })));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.categoryId) {
      toast.error("Please fill required fields");
      return;
    }
    setIsLoading(true);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : null,
        stock: parseInt(form.stock),
        stoneWeight: form.stoneWeight ? parseFloat(form.stoneWeight) : null,
        metalWeight: form.metalWeight ? parseFloat(form.metalWeight) : null,
        subcategoryId: form.subcategoryId || null,
        images: images.map((img) => ({ url: img.url, isPrimary: img.isPrimary })),
      };

      const url = isEdit ? `/api/products/${product!.id}` : "/api/products";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(isEdit ? "Product updated!" : "Product created!");
        router.push("/admin/products");
        router.refresh();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to save product");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full px-3 py-2.5 border border-nude-200 rounded-sm text-sm text-chocolate-950 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors bg-white";
  const labelClass = "block text-xs font-medium text-nude-600 uppercase tracking-wider mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic info */}
          <div className="bg-white rounded-lg border border-nude-100 p-6">
            <h2 className="font-semibold text-chocolate-950 mb-5">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={labelClass}>Product Name *</label>
                <input name="name" value={form.name} onChange={handleChange} required className={inputClass} placeholder="Eternal Rose Diamond Ring" />
              </div>
              <div>
                <label className={labelClass}>Slug</label>
                <input name="slug" value={form.slug} onChange={handleChange} className={inputClass} placeholder="auto-generated" />
              </div>
              <div>
                <label className={labelClass}>SKU *</label>
                <input name="sku" value={form.sku} onChange={handleChange} required className={inputClass} placeholder="OJ-RNG-001" />
              </div>
              <div>
                <label className={labelClass}>Price (₹) *</label>
                <input name="price" type="number" value={form.price} onChange={handleChange} required min="0" step="0.01" className={inputClass} placeholder="85000" />
              </div>
              <div>
                <label className={labelClass}>Compare Price (₹)</label>
                <input name="comparePrice" type="number" value={form.comparePrice} onChange={handleChange} min="0" step="0.01" className={inputClass} placeholder="95000" />
              </div>
              <div>
                <label className={labelClass}>Stock Quantity</label>
                <input name="stock" type="number" value={form.stock} onChange={handleChange} min="0" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Status</label>
                <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="DRAFT">Draft</option>
                  <option value="OUT_OF_STOCK">Out of Stock</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Short Description</label>
                <input name="shortDesc" value={form.shortDesc} onChange={handleChange} className={inputClass} placeholder="Brief description for cards" />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Full Description *</label>
                <textarea name="description" value={form.description} onChange={handleChange} required rows={5} className={`${inputClass} resize-none`} placeholder="Detailed product description..." />
              </div>
            </div>
          </div>

          {/* Jewellery specs */}
          <div className="bg-white rounded-lg border border-nude-100 p-6">
            <h2 className="font-semibold text-chocolate-950 mb-5">Jewellery Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "material", label: "Material", placeholder: "18K Rose Gold" },
                { name: "purity", label: "Purity", placeholder: "18K (75%)" },
                { name: "stoneType", label: "Stone Type", placeholder: "Diamond" },
                { name: "occasion", label: "Occasion", placeholder: "Engagement, Wedding" },
              ].map((field) => (
                <div key={field.name}>
                  <label className={labelClass}>{field.label}</label>
                  <input name={field.name} value={form[field.name as keyof typeof form] as string} onChange={handleChange} className={inputClass} placeholder={field.placeholder} />
                </div>
              ))}
              <div>
                <label className={labelClass}>Stone Weight (ct)</label>
                <input name="stoneWeight" type="number" value={form.stoneWeight} onChange={handleChange} step="0.01" min="0" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Metal Weight (g)</label>
                <input name="metalWeight" type="number" value={form.metalWeight} onChange={handleChange} step="0.01" min="0" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Gender</label>
                <select name="gender" value={form.gender} onChange={handleChange} className={inputClass}>
                  <option value="Women">Women</option>
                  <option value="Men">Men</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg border border-nude-100 p-6">
            <h2 className="font-semibold text-chocolate-950 mb-5">Product Images</h2>
            <div className="flex flex-wrap gap-3 mb-4">
              {images.map((img, i) => (
                <div key={i} className="relative group">
                  <div className={`relative w-24 h-24 overflow-hidden ${img.isPrimary ? "ring-2 ring-gold-500" : "ring-1 ring-nude-200"}`}>
                    <Image src={img.url} alt="" fill className="object-cover" />
                  </div>
                  {img.isPrimary && (
                    <span className="absolute bottom-0 left-0 right-0 bg-gold-500 text-[9px] text-center text-chocolate-950 font-bold py-0.5">
                      PRIMARY
                    </span>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                    {!img.isPrimary && (
                      <button type="button" onClick={() => setPrimary(i)} className="text-[9px] bg-white text-chocolate-950 px-1.5 py-1 font-bold">
                        SET PRIMARY
                      </button>
                    )}
                    <button type="button" onClick={() => removeImage(i)} className="w-6 h-6 bg-red-500 text-white flex items-center justify-center rounded-full">
                      <X size={12} />
                    </button>
                  </div>
                </div>
              ))}

              <label className="w-24 h-24 border-2 border-dashed border-nude-200 flex flex-col items-center justify-center cursor-pointer hover:border-gold-500 transition-colors">
                {uploadingImage ? (
                  <Loader2 size={20} className="animate-spin text-nude-400" />
                ) : (
                  <>
                    <Plus size={20} className="text-nude-400" />
                    <span className="text-[10px] text-nude-400 mt-1">Add Image</span>
                  </>
                )}
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
            <p className="text-xs text-nude-400">Upload product images. First image will be primary. Click to set any image as primary.</p>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Category */}
          <div className="bg-white rounded-lg border border-nude-100 p-6">
            <h2 className="font-semibold text-chocolate-950 mb-5">Category</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Category *</label>
                <select name="categoryId" value={form.categoryId} onChange={handleChange} required className={inputClass}>
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              {selectedCategory && selectedCategory.subcategories.length > 0 && (
                <div>
                  <label className={labelClass}>Subcategory</label>
                  <select name="subcategoryId" value={form.subcategoryId} onChange={handleChange} className={inputClass}>
                    <option value="">None</option>
                    {selectedCategory.subcategories.map((sub) => (
                      <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Visibility */}
          <div className="bg-white rounded-lg border border-nude-100 p-6">
            <h2 className="font-semibold text-chocolate-950 mb-5">Visibility</h2>
            <div className="space-y-3">
              {[
                { name: "isFeatured", label: "Featured Product" },
                { name: "isNewArrival", label: "New Arrival" },
                { name: "isBestSeller", label: "Best Seller" },
                { name: "isTrending", label: "Trending" },
              ].map((field) => (
                <label key={field.name} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name={field.name}
                    checked={form[field.name as keyof typeof form] as boolean}
                    onChange={handleChange}
                    className="w-4 h-4 accent-gold-500"
                  />
                  <span className="text-sm text-chocolate-800">{field.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 px-8 py-3.5 bg-chocolate-950 text-champagne-100 text-sm font-medium hover:bg-chocolate-800 transition-colors disabled:opacity-60"
        >
          {isLoading && <Loader2 size={16} className="animate-spin" />}
          {isEdit ? "Update Product" : "Create Product"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3.5 border border-nude-200 text-chocolate-800 text-sm hover:border-chocolate-950 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
