import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import pool from "@/lib/db";
import { revalidatePath } from "next/cache";
import CategoriesClient from "./categories-client";

// --- SERVER ACTIONS ---
export async function deleteCategory(id: number) {
  "use server";
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");
  await pool.query('DELETE FROM categories WHERE id = ?', [id]);
  revalidatePath('/admin/categories');
  revalidatePath('/shop');
  revalidatePath('/');
}

export async function saveCategory(data: any) {
  "use server";
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");

  const { id, name, description, image, featured } = data;
  
  if (id) {
    await pool.query(`
      UPDATE categories SET 
        name=?, description=?, image=?, featured=?
      WHERE id=?
    `, [name, description || '', image || '', featured ? 1 : 0, id]);
  } else {
    await pool.query(`
      INSERT INTO categories (name, description, image, featured)
      VALUES (?, ?, ?, ?)
    `, [name, description || '', image || '', featured ? 1 : 0]);
  }
  
  revalidatePath('/admin/categories');
  revalidatePath('/shop');
  revalidatePath('/');
}

export default async function AdminCategoriesPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "admin") {
    redirect("/");
  }

  const [rows] = await pool.query('SELECT * FROM categories ORDER BY featured DESC, id DESC');
  const categories = rows as any[];

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-[#0a0a0a]">Categories</h1>
          <p className="text-gray-500">Manage shop categories and homepage featured collections.</p>
        </div>
      </div>

      <CategoriesClient initialCategories={categories} saveAction={saveCategory} deleteAction={deleteCategory} />
    </div>
  );
}
