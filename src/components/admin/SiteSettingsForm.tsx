"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface SiteSettingsFormProps {
  settings: Record<string, string>;
}

export function SiteSettingsForm({ settings: initialSettings }: SiteSettingsFormProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        toast.success("Settings saved!");
      } else {
        toast.error("Failed to save settings");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full px-3 py-2.5 border border-nude-200 rounded-sm text-sm text-chocolate-950 focus:outline-none focus:border-gold-500 transition-colors bg-white";
  const labelClass = "block text-xs font-medium text-nude-600 uppercase tracking-wider mb-1.5";

  const settingGroups = [
    {
      title: "Brand Information",
      fields: [
        { key: "site_name", label: "Site Name", placeholder: "Orby Jewels" },
        { key: "site_tagline", label: "Tagline", placeholder: "Where Elegance Meets Artistry" },
        { key: "brand_under", label: "Brand Group", placeholder: "Under Nera Groups" },
      ],
    },
    {
      title: "Contact Details",
      fields: [
        { key: "contact_email", label: "Contact Email", placeholder: "hello@orbyjewels.com" },
        { key: "contact_phone", label: "Phone Number", placeholder: "+91 98765 43210" },
        { key: "whatsapp", label: "WhatsApp Number", placeholder: "+91 98765 43210" },
        { key: "address", label: "Store Address", placeholder: "123, Luxury Lane..." },
      ],
    },
    {
      title: "Social Media",
      fields: [
        { key: "instagram", label: "Instagram URL", placeholder: "https://instagram.com/orbyjewels" },
        { key: "facebook", label: "Facebook URL", placeholder: "https://facebook.com/orbyjewels" },
      ],
    },
    {
      title: "Shipping & Tax",
      fields: [
        { key: "shipping_charge", label: "Shipping Charge (₹)", placeholder: "99" },
        { key: "free_shipping_above", label: "Free Shipping Above (₹)", placeholder: "5000" },
        { key: "tax_rate", label: "Tax Rate (%)", placeholder: "3" },
      ],
    },
    {
      title: "UPI Payment",
      fields: [
        { key: "upi_id", label: "UPI ID (e.g. yourname@gpay)", placeholder: "orbyjewels@okicici" },
        { key: "upi_name", label: "Display Name on UPI", placeholder: "Orby Jewels" },
        { key: "upi_qr_url", label: "QR Code Image URL", placeholder: "https://res.cloudinary.com/..." },
      ],
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {settingGroups.map((group) => (
        <div key={group.title} className="bg-white rounded-lg border border-nude-100 p-6">
          <h2 className="font-semibold text-chocolate-950 mb-5">{group.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {group.fields.map((field) => (
              <div key={field.key}>
                <label className={labelClass}>{field.label}</label>
                <input
                  value={settings[field.key] || ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className={inputClass}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        type="submit"
        disabled={isLoading}
        className="flex items-center gap-2 px-8 py-3.5 bg-chocolate-950 text-champagne-100 text-sm font-medium hover:bg-chocolate-800 transition-colors disabled:opacity-60"
      >
        {isLoading && <Loader2 size={16} className="animate-spin" />}
        Save Settings
      </button>
    </form>
  );
}
