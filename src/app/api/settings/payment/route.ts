import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const settings = await db.siteSettings.findMany({
    where: { key: { in: ["upi_id", "upi_name", "upi_qr_url", "whatsapp"] } },
  });
  const map = Object.fromEntries(settings.map(s => [s.key, s.value]));
  return NextResponse.json({
    upi_id: map.upi_id || "",
    upi_name: map.upi_name || "Orby Jewels",
    upi_qr_url: map.upi_qr_url || "",
    whatsapp: map.whatsapp || "",
  });
}
