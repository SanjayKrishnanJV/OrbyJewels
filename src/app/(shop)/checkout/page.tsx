"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Plus, ShieldCheck, Loader2, CheckCircle2, Copy, Smartphone } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import { Address } from "@/types";

type Step = "address" | "payment";

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const [step, setStep] = useState<Step>("address");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string>("");
  const [utrNumber, setUtrNumber] = useState("");
  const [submittingUtr, setSubmittingUtr] = useState(false);
  const [upiSettings, setUpiSettings] = useState({ upi_id: "", upi_name: "Orby Jewels", upi_qr_url: "" });
  const [newAddress, setNewAddress] = useState({
    name: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: ""
  });

  const subtotal = totalPrice();
  const shipping = subtotal > 5000 ? 0 : 99;
  const tax = Math.round(subtotal * 0.03);
  const total = subtotal + shipping + tax;

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login?callbackUrl=/checkout");
  }, [status, router]);

  useEffect(() => {
    if (items.length === 0 && !placedOrderId && status !== "loading") {
      router.push("/cart");
    }
  }, [items.length, placedOrderId, status, router]);

  useEffect(() => {
    if (session) {
      fetch("/api/addresses").then(r => r.json()).then((data) => {
        setAddresses(data);
        if (data.length > 0) {
          const def = data.find((a: Address) => a.isDefault) || data[0];
          setSelectedAddress(def.id);
        }
      }).catch(() => {});
    }
    fetch("/api/settings/payment").then(r => r.json()).then(setUpiSettings).catch(() => {});
  }, [session]);

  if (status === "loading" || (items.length === 0 && !placedOrderId)) {
    return (
      <div className="min-h-screen bg-ivory-warm flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-nude-400" />
      </div>
    );
  }

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newAddress, isDefault: addresses.length === 0 }),
      });
      if (res.ok) {
        const addr = await res.json();
        setAddresses(prev => [...prev, addr]);
        setSelectedAddress(addr.id);
        setShowAddAddress(false);
        setNewAddress({ name: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "" });
        toast.success("Address added");
      }
    } catch { toast.error("Failed to add address"); }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) { toast.error("Please select a delivery address"); return; }
    setIsPlacingOrder(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressId: selectedAddress,
          items: items.map(i => ({ productId: i.product.id, quantity: i.quantity })),
          paymentMethod: "UPI",
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || "Failed to create order");
        return;
      }
      const order = await res.json();
      setPlacedOrderId(order.id);
      setStep("payment");
    } catch { toast.error("Something went wrong"); }
    finally { setIsPlacingOrder(false); }
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(upiSettings.upi_id);
    toast.success("UPI ID copied!");
  };

  const handleConfirmPayment = async () => {
    setSubmittingUtr(true);
    try {
      await fetch(`/api/orders/${placedOrderId}/utr`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ utr: utrNumber }),
      });
      clearCart();
      toast.success("Order confirmed! We'll verify and dispatch soon.");
      router.push(`/orders/${placedOrderId}?success=true`);
    } catch { toast.error("Failed to submit. Please contact us."); }
    finally { setSubmittingUtr(false); }
  };

  const inputClass = "w-full px-3 py-2.5 border border-nude-200 text-sm text-chocolate-950 focus:outline-none focus:border-gold-500 transition-colors";

  return (
    <div className="min-h-screen bg-ivory-warm py-12">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <h1 className="font-playfair text-4xl text-chocolate-950 mb-8">Checkout</h1>

        {/* Step indicator */}
        <div className="flex items-center gap-4 mb-8">
          {(["address", "payment"] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              {i > 0 && <div className={`h-px w-12 ${step === "payment" ? "bg-chocolate-950" : "bg-nude-200"}`} />}
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-colors ${
                step === s ? "bg-chocolate-950 border-chocolate-950 text-champagne-100" :
                (s === "address" && step === "payment") ? "bg-green-500 border-green-500 text-white" :
                "border-nude-300 text-nude-400"
              }`}>
                {s === "address" && step === "payment" ? "✓" : i + 1}
              </div>
              <span className={`text-sm font-medium capitalize ${step === s ? "text-chocolate-950" : "text-nude-400"}`}>
                {s === "address" ? "Delivery" : "Payment"}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left panel */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {step === "address" && (
                <motion.div key="address" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="bg-white p-6">
                    <div className="flex items-center justify-between mb-5">
                      <h2 className="font-playfair text-xl text-chocolate-950 flex items-center gap-2">
                        <MapPin size={18} className="text-gold-dark" />
                        Delivery Address
                      </h2>
                      <button onClick={() => setShowAddAddress(!showAddAddress)} className="flex items-center gap-1.5 text-xs text-gold-dark hover:text-gold-600 transition-colors">
                        <Plus size={13} /> Add New
                      </button>
                    </div>

                    {showAddAddress && (
                      <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-6 p-4 bg-champagne-100 space-y-3" onSubmit={handleAddAddress}>
                        <p className="text-sm font-medium text-chocolate-950 mb-3">New Address</p>
                        <div className="grid grid-cols-2 gap-3">
                          <input placeholder="Full Name *" value={newAddress.name} onChange={e => setNewAddress({...newAddress, name: e.target.value})} required className={inputClass} />
                          <input placeholder="Phone *" value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} required className={inputClass} />
                          <input placeholder="Address Line 1 *" value={newAddress.line1} onChange={e => setNewAddress({...newAddress, line1: e.target.value})} required className={`${inputClass} col-span-2`} />
                          <input placeholder="Line 2 (optional)" value={newAddress.line2} onChange={e => setNewAddress({...newAddress, line2: e.target.value})} className={`${inputClass} col-span-2`} />
                          <input placeholder="City *" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} required className={inputClass} />
                          <input placeholder="State *" value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} required className={inputClass} />
                          <input placeholder="Pincode *" value={newAddress.pincode} onChange={e => setNewAddress({...newAddress, pincode: e.target.value})} required className={inputClass} />
                        </div>
                        <div className="flex gap-3">
                          <button type="submit" className="px-5 py-2 bg-chocolate-950 text-champagne-100 text-sm font-medium">Save Address</button>
                          <button type="button" onClick={() => setShowAddAddress(false)} className="px-5 py-2 border border-nude-200 text-sm text-chocolate-800">Cancel</button>
                        </div>
                      </motion.form>
                    )}

                    <div className="space-y-3">
                      {addresses.length === 0 ? (
                        <p className="text-nude-400 text-sm">No saved addresses. Add one above.</p>
                      ) : (
                        addresses.map(addr => (
                          <label key={addr.id} className={`flex gap-4 p-4 border cursor-pointer transition-colors ${selectedAddress === addr.id ? "border-gold-500 bg-champagne-50" : "border-nude-200 hover:border-nude-300"}`}>
                            <input type="radio" name="address" value={addr.id} checked={selectedAddress === addr.id} onChange={() => setSelectedAddress(addr.id)} className="mt-1 accent-gold-500" />
                            <div>
                              <p className="font-medium text-sm text-chocolate-950">{addr.name}</p>
                              <p className="text-xs text-nude-600 mt-0.5">{addr.phone}</p>
                              <p className="text-xs text-nude-500 mt-0.5">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}, {addr.city}, {addr.state} - {addr.pincode}</p>
                              {addr.isDefault && <span className="text-[10px] bg-champagne-200 text-gold-dark px-2 py-0.5 mt-1 inline-block">Default</span>}
                            </div>
                          </label>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Payment preview */}
                  <div className="bg-white p-6">
                    <h2 className="font-playfair text-xl text-chocolate-950 mb-3 flex items-center gap-2">
                      <Smartphone size={18} className="text-gold-dark" />
                      Payment Method
                    </h2>
                    <div className="flex items-center gap-3 p-4 bg-champagne-50 border border-nude-200">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-lg">₹</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-chocolate-950">UPI / QR Code Payment</p>
                        <p className="text-xs text-nude-500">Pay via GPay, PhonePe, Paytm, or any UPI app</p>
                      </div>
                      <CheckCircle2 size={18} className="text-green-500 ml-auto" />
                    </div>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder || !selectedAddress}
                    className="w-full py-4 bg-chocolate-950 text-champagne-100 text-sm font-medium tracking-widest uppercase hover:bg-chocolate-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {isPlacingOrder ? <><Loader2 size={16} className="animate-spin" /> Creating Order...</> : <>Proceed to Pay {formatPrice(total)}</>}
                  </button>
                </motion.div>
              )}

              {step === "payment" && (
                <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-6 md:p-8">
                  <div className="text-center mb-6">
                    <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle2 size={28} className="text-green-600" />
                    </div>
                    <h2 className="font-playfair text-2xl text-chocolate-950">Order Created!</h2>
                    <p className="text-nude-500 text-sm mt-1">Complete payment to confirm your order</p>
                  </div>

                  <div className="border border-nude-200 rounded-sm p-5 mb-6 space-y-3">
                    <p className="text-sm font-semibold text-chocolate-950 text-center">Pay {formatPrice(total)} to</p>

                    {/* QR Code */}
                    {upiSettings.upi_qr_url?.startsWith("http") ? (
                      <div className="flex justify-center">
                        <div className="relative w-48 h-48 border-4 border-nude-200">
                          <Image src={upiSettings.upi_qr_url} alt="UPI QR Code" fill unoptimized className="object-contain p-2" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <div className="w-48 h-48 bg-champagne-100 border-4 border-dashed border-nude-300 flex flex-col items-center justify-center text-nude-400 text-sm text-center p-4">
                          <Smartphone size={32} className="mb-2" />
                          <p>QR code not set</p>
                          <p className="text-xs mt-1">Admin: add QR URL in Settings</p>
                        </div>
                      </div>
                    )}

                    {/* UPI ID */}
                    <div className="flex items-center justify-center gap-3 mt-4 p-3 bg-champagne-50 border border-nude-200">
                      <div className="text-center">
                        <p className="text-xs text-nude-500 uppercase tracking-wider mb-1">UPI ID</p>
                        <p className="font-mono text-base font-semibold text-chocolate-950">
                          {upiSettings.upi_id || "Not configured"}
                        </p>
                        {upiSettings.upi_name && <p className="text-xs text-nude-500 mt-0.5">{upiSettings.upi_name}</p>}
                      </div>
                      {upiSettings.upi_id && (
                        <button onClick={copyUpiId} className="p-2 text-nude-400 hover:text-chocolate-950 transition-colors" title="Copy UPI ID">
                          <Copy size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Instructions */}
                  <ol className="list-decimal list-inside space-y-2 text-sm text-nude-600 mb-6 bg-champagne-50 p-4">
                    <li>Open GPay, PhonePe, Paytm or any UPI app</li>
                    <li>Scan the QR code above <span className="text-nude-400">or</span> enter the UPI ID manually</li>
                    <li>Pay exactly <strong className="text-chocolate-950">{formatPrice(total)}</strong></li>
                    <li>Note the <strong className="text-chocolate-950">UTR / Transaction ID</strong> from your payment app</li>
                    <li>Enter it below and click Confirm</li>
                  </ol>

                  {/* UTR input */}
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-nude-600 uppercase tracking-wider mb-2">
                      UTR / Transaction ID <span className="text-nude-400 normal-case font-normal">(optional but helps us verify faster)</span>
                    </label>
                    <input
                      type="text"
                      value={utrNumber}
                      onChange={e => setUtrNumber(e.target.value)}
                      placeholder="e.g. 426781234567 or T2506131234567890"
                      className="w-full px-4 py-3 border border-nude-200 text-sm focus:outline-none focus:border-chocolate-950 font-mono"
                    />
                  </div>

                  <button
                    onClick={handleConfirmPayment}
                    disabled={submittingUtr}
                    className="w-full py-4 bg-chocolate-950 text-champagne-100 text-sm font-medium tracking-widest uppercase hover:bg-chocolate-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {submittingUtr ? <><Loader2 size={16} className="animate-spin" /> Confirming...</> : "I've Completed Payment"}
                  </button>

                  <p className="text-center text-xs text-nude-400 mt-4">
                    Your order will be confirmed within 1–2 hours after payment verification.<br />
                    Questions? <a href={`https://wa.me/${upiSettings.upi_id ? "" : ""}`} className="text-gold-dark hover:underline">Contact us on WhatsApp</a>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Order Summary */}
          <div>
            <div className="bg-white p-6 sticky top-24">
              <h2 className="font-playfair text-xl text-chocolate-950 mb-5">Order Summary</h2>
              <div className="space-y-3 mb-5 max-h-60 overflow-y-auto">
                {items.map(item => {
                  const imgSrc = item.product.images?.[0]?.url;
                  const validSrc = imgSrc?.startsWith("http") ? imgSrc : "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200";
                  return (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-14 h-14 flex-shrink-0 bg-champagne-100">
                      <Image
                        src={validSrc}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-chocolate-950 line-clamp-2">{item.product.name}</p>
                      <p className="text-xs text-nude-400 mt-0.5">Qty: {item.quantity}</p>
                      <p className="text-xs font-semibold text-chocolate-950">{formatPrice(item.product.price * item.quantity)}</p>
                    </div>
                  </div>
                  );
                })}
              </div>

              <div className="space-y-2 border-t border-nude-100 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-nude-600">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-nude-600">Shipping</span>
                  <span className={shipping === 0 ? "text-green-600" : ""}>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-nude-600">GST (3%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between font-playfair text-xl border-t border-nude-100 pt-3 mt-3">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 mt-6 text-xs text-nude-400">
                <ShieldCheck size={13} />
                100% Secure UPI Payment
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
