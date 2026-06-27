import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import pool from "@/lib/db";
import BrandsClient from "./brands-client";
import { saveBrand, deleteBrand } from "./actions";

export default async function AdminBrandsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "admin") {
    redirect("/");
  }

  const [rows] = await pool.query('SELECT * FROM brands ORDER BY name ASC');
  const brands = rows as any[];

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-[#0a0a0a]">Brands Management</h1>
          <p className="text-gray-500">Add, update, and remove brands from the store.</p>
        </div>
      </div>

      <BrandsClient initialBrands={brands} saveAction={saveBrand} deleteAction={deleteBrand} />
    </div>
  );
}
