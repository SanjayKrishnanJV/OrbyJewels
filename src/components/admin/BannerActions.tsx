"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

type Banner = {
  id: string;
  title: string;
  subtitle: string | null;
  image: string | null;
  link: string | null;
  isActive: boolean;
  sortOrder: number;
};

type Props =
  | { mode: "create" }
  | { mode: "edit"; banner: Banner };

export function BannerActions(props: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isEdit = props.mode === "edit";
  const banner = isEdit ? props.banner : null;

  const [form, setForm] = useState({
    title: banner?.title || "",
    subtitle: banner?.subtitle || "",
    image: banner?.image || "",
    link: banner?.link || "",
    isActive: banner?.isActive ?? true,
    sortOrder: banner?.sortOrder ?? 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(isEdit ? `/api/admin/banners/${banner!.id}` : "/api/admin/banners", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success(isEdit ? "Banner updated" : "Banner created");
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("Failed to save banner");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!banner || !confirm("Delete this banner?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/banners/${banner.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Banner deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete banner");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setOpen(true)}
          className={isEdit
            ? "p-1.5 text-nude-400 hover:text-gold-dark transition-colors"
            : "flex items-center gap-2 px-5 py-3 bg-chocolate-950 text-champagne-100 text-sm font-medium hover:bg-chocolate-800 transition-colors"
          }
        >
          {isEdit ? <Edit size={15} /> : <><Plus size={16} /> Add Banner</>}
        </button>
        {isEdit && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-1.5 text-nude-400 hover:text-red-500 transition-colors disabled:opacity-50"
          >
            {deleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
          </button>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-chocolate-950/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="font-playfair text-xl text-chocolate-950 mb-5">
              {isEdit ? "Edit Banner" : "Add Banner"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-nude-500 uppercase tracking-wider mb-1">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  className="input-luxury"
                />
              </div>
              <div>
                <label className="block text-xs text-nude-500 uppercase tracking-wider mb-1">Subtitle</label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  className="input-luxury"
                />
              </div>
              <div>
                <label className="block text-xs text-nude-500 uppercase tracking-wider mb-1">Image URL</label>
                <input
                  type="url"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="input-luxury"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-xs text-nude-500 uppercase tracking-wider mb-1">Link</label>
                <input
                  type="text"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  className="input-luxury"
                  placeholder="/products or /category/rings"
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-xs text-nude-500 uppercase tracking-wider mb-1">Sort Order</label>
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
                    id="isActive"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="w-4 h-4 accent-chocolate-950"
                  />
                  <label htmlFor="isActive" className="text-sm text-chocolate-800">Active</label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 py-3 border border-nude-200 text-chocolate-800 text-sm hover:bg-champagne-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-chocolate-950 text-champagne-100 text-sm hover:bg-chocolate-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 size={14} className="animate-spin" />}
                  {isEdit ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
