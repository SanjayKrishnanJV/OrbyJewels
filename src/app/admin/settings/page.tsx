export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { SiteSettingsForm } from "@/components/admin/SiteSettingsForm";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Settings — Admin | Orby Jewels" };

export default async function AdminSettingsPage() {
  const settings = await db.siteSettings.findMany();
  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-playfair text-3xl text-chocolate-950">Site Settings</h1>
        <p className="text-nude-500 mt-1">Manage your store configuration</p>
      </div>
      <SiteSettingsForm settings={settingsMap} />
    </div>
  );
}
