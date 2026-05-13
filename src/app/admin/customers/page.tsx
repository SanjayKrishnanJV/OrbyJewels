export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/utils";
import { Metadata } from "next";
import { UserBlockButton } from "@/components/admin/UserBlockButton";

export const metadata: Metadata = { title: "Customers — Admin | Orby Jewels" };

export default async function AdminCustomersPage() {
  const customers = await db.user.findMany({
    where: { role: "CUSTOMER" },
    include: {
      _count: { select: { orders: true } },
      orders: {
        where: { paymentStatus: "PAID" },
        select: { total: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-playfair text-3xl text-chocolate-950">Customers</h1>
        <p className="text-nude-500 mt-1">{customers.length} total customers</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-nude-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-champagne-100 border-b border-nude-200">
            <tr>
              {["Customer", "Email", "Phone", "Orders", "Total Spent", "Joined", "Status", "Actions"].map((h) => (
                <th key={h} className="px-5 py-4 text-left text-xs font-semibold text-nude-600 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-nude-50">
            {customers.map((customer) => {
              const totalSpent = customer.orders.reduce((acc, o) => acc + o.total, 0);
              return (
                <tr key={customer.id} className="hover:bg-champagne-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-champagne-200 flex items-center justify-center text-chocolate-950 font-semibold text-sm">
                        {customer.name?.charAt(0) || customer.email?.charAt(0)}
                      </div>
                      <p className="text-sm font-medium text-chocolate-950">{customer.name || "—"}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs text-nude-600">{customer.email}</td>
                  <td className="px-5 py-4 text-xs text-nude-600">{customer.phone || "—"}</td>
                  <td className="px-5 py-4 text-xs text-chocolate-950 font-medium">{customer._count.orders}</td>
                  <td className="px-5 py-4 text-xs font-medium text-chocolate-950">{formatPrice(totalSpent)}</td>
                  <td className="px-5 py-4 text-xs text-nude-500">{formatDate(customer.createdAt)}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-medium ${customer.isBlocked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                      {customer.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <UserBlockButton id={customer.id} isBlocked={customer.isBlocked} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {customers.length === 0 && (
          <div className="text-center py-16">
            <p className="text-nude-400">No customers yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
