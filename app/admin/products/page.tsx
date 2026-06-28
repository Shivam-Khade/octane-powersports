import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import pool from "@/lib/db";
import { revalidatePath } from "next/cache";
import ProductsClient from "./products-client";

import { deleteProduct, saveProduct } from "./actions";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "admin") {
    redirect("/");
  }

  const [rows] = await pool.query('SELECT * FROM products ORDER BY id DESC');
  const products = (rows as any[]).map(r => ({ ...r }));

  const [categoryRows] = await pool.query('SELECT * FROM categories ORDER BY name ASC');
  const categories = (categoryRows as any[]).map(r => ({ ...r }));

  const [brandRows] = await pool.query('SELECT name FROM brands ORDER BY name ASC');
  const brands = (brandRows as any[]).map(r => ({ brand: r.name }));

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-[#0a0a0a]">Products Management</h1>
          <p className="text-gray-500">Add, update, and remove products from the store.</p>
        </div>
      </div>

      <ProductsClient initialProducts={products} categories={categories} brands={brands} saveAction={saveProduct} deleteAction={deleteProduct} />
    </div>
  );
}
