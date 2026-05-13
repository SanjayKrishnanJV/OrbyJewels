"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export function MarkAsPaidButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleMarkPaid = async () => {
    if (!confirm("Mark this order as PAID? Do this only after verifying the UPI payment in your GPay/PhonePe app.")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: "PAID", status: "CONFIRMED" }),
      });
      if (!res.ok) throw new Error();
      toast.success("Order marked as Paid & Confirmed");
      router.refresh();
    } catch {
      toast.error("Failed to update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleMarkPaid}
      disabled={loading}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 transition-colors disabled:opacity-60"
    >
      {loading ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
      Mark as Paid
    </button>
  );
}
