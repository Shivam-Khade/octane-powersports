import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import pool from "@/lib/db";
import PackagesClient from "./packages-client";
import { deletePackage } from "./actions";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminPackagesPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "admin") {
    redirect("/");
  }

  const [rows] = await pool.query(`
    SELECT p.*, pa.purchases, pa.revenue,
      (SELECT COUNT(*) FROM package_products pp WHERE pp.package_id = p.id) as product_count
    FROM packages p
    LEFT JOIN package_analytics pa ON p.id = pa.package_id
    ORDER BY p.id DESC
  `);
  
  const packages = (rows as any[]).map(r => ({ ...r }));

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-[#0a0a0a]">Package Deals</h1>
          <p className="text-gray-500">Manage bundle products and marketing packages.</p>
        </div>
      </div>

      <PackagesClient initialPackages={packages} deleteAction={deletePackage} />
    </div>
  );
}
