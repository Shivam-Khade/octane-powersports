import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import pool from "@/lib/db";
import { revalidatePath } from "next/cache";
import CategoriesClient from "./categories-client";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

  const { id, name, description, image, featured, menu_group_id } = data;
  
  // Check if category name is unique
  let nameCheckQuery = 'SELECT id FROM categories WHERE name = ?';
  let nameCheckParams: any[] = [name];
  if (id) {
    nameCheckQuery += ' AND id != ?';
    nameCheckParams.push(id);
  }
  
  const [existingName] = await pool.query(nameCheckQuery, nameCheckParams);
  if ((existingName as any[]).length > 0) {
    throw new Error(`A category with the name "${name}" already exists.`);
  }
  
  if (id) {
    await pool.query(`
      UPDATE categories SET 
        name=?, description=?, image=?, featured=?, menu_group_id=?
      WHERE id=?
    `, [name, description || '', image || '', featured ? 1 : 0, menu_group_id || null, id]);
  } else {
    await pool.query(`
      INSERT INTO categories (name, description, image, featured, menu_group_id)
      VALUES (?, ?, ?, ?, ?)
    `, [name, description || '', image || '', featured ? 1 : 0, menu_group_id || null]);
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

  const [rows] = await pool.query(`
    SELECT categories.*, menu_groups.name as menu_group_name 
    FROM categories 
    LEFT JOIN menu_groups ON categories.menu_group_id = menu_groups.id 
    ORDER BY featured DESC, categories.id DESC
  `);
  const categories = (rows as any[]).map(r => ({ ...r }));

  const [groupRows] = await pool.query('SELECT * FROM menu_groups ORDER BY sort_order ASC, name ASC');
  const menuGroups = (groupRows as any[]).map(r => ({ ...r }));

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-[#0a0a0a]">Categories</h1>
          <p className="text-gray-500">Manage shop categories and homepage featured collections.</p>
        </div>
      </div>

      <CategoriesClient initialCategories={categories} menuGroups={menuGroups} saveAction={saveCategory} deleteAction={deleteCategory} />
    </div>
  );
}
