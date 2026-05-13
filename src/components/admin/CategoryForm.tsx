"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

type Subcategory = { id: string; name: string; slug: string };
type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  isActive: boolean;
  sortOrder: number;
  subcategories: Subcategory[];
};

export function CategoryForm({ category }: { category?: Category }) {
  const router = useRouter();
  const isEdit = !!category;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: category?.name || "",
    slug: category?.slug || "",
    description: category?.description || "",
    image: category?.image || "",
    isActive: category?.isActive ?? true,
    sortOrder: category?.sortOrder ?? 0,
  });
  const [subcategories, setSubcategories] = useState<{ name: string; slug: string }[]>(
    category?.subcategories.map((s) => ({ name: s.name, slug: s.slug })) || []
  );
  const [newSub, setNewSub] = useState({ name: "", slug: "" });

  const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const handleNameChange = (name: string) => {
    setForm({ ...form, name, slug: isEdit ? form.slug : slugify(name) });
  };

  const addSubcategory = () => {
    if (!newSub.name.trim()) return;
    setSubcategories([...subcategories, { name: newSub.name, slug: newSub.slug || slugify(newSub.name) }]);
    setNewSub({ name: "", slug: "" });
  };

  const removeSubcategory = (i: number) => {
    setSubcategories(subcategories.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(isEdit ? `/api/admin/categories/${category!.id}` : "/api/admin/categories", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, subcategories }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed");
      }
      toast.success(isEdit ? "Category updated" : "Category created");
      router.push("/admin/categories");
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="bg-white rounded-lg border border-nude-100 p-6 space-y-5">
        <div>
          <label className="block text-xs text-nude-500 uppercase tracking-wider mb-1.5">Category Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
            className="input-luxury"
            placeholder="e.g. Rings"
          />
        </div>
        <div>
          <label className="block text-xs text-nude-500 uppercase tracking-wider mb-1.5">Slug *</label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            required
            className="input-luxury font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-nude-500 uppercase tracking-wider mb-1.5">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="input-luxury resize-none"
          />
        </div>
        <div>
          <label className="block text-xs text-nude-500 uppercase tracking-wider mb-1.5">Image URL</label>
          <input
            type="url"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            className="input-luxury"
            placeholder="https://..."
          />
        </div>
        <div className="flex items-center gap-6">
          <div className="flex-1">
            <label className="block text-xs text-nude-500 uppercase tracking-wider mb-1.5">Sort Order</label>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
              className="input-luxury"
            />
          </div>
          <div className="flex items-center gap-2 mt-5">
            <input
              type="checkbox"
              id="catActive"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="w-4 h-4 accent-chocolate-950"
            />
            <label htmlFor="catActive" className="text-sm text-chocolate-800">Active</label>
          </div>
        </div>
      </div>

      {/* Subcategories */}
      <div className="bg-white rounded-lg border border-nude-100 p-6">
        <h2 className="font-semibold text-chocolate-950 mb-4">Subcategories</h2>
        <div className="space-y-2 mb-4">
          {subcategories.map((sub, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-champagne-50 rounded">
              <span className="flex-1 text-sm text-chocolate-800">{sub.name}</span>
              <span className="text-xs font-mono text-nude-400">{sub.slug}</span>
              <button type="button" onClick={() => removeSubcategory(i)} className="text-nude-400 hover:text-red-500 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newSub.name}
            onChange={(e) => setNewSub({ name: e.target.value, slug: slugify(e.target.value) })}
            placeholder="Subcategory name"
            className="input-luxury flex-1"
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSubcategory())}
          />
          <button
            type="button"
            onClick={addSubcategory}
            className="px-4 py-3 bg-champagne-100 text-chocolate-800 hover:bg-champagne-200 transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border border-nude-200 text-chocolate-800 text-sm hover:bg-champagne-100 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-chocolate-950 text-champagne-100 text-sm hover:bg-chocolate-800 transition-colors disabled:opacity-60 flex items-center gap-2"
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          {isEdit ? "Update Category" : "Create Category"}
        </button>
      </div>
    </form>
  );
}
