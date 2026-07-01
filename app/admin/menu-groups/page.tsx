import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import pool from "@/lib/db";
import { revalidatePath } from "next/cache";
import MenuGroupsClient from "./menu-groups-client";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function deleteMenuGroup(id: number) {
  "use server";
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");
  
  // Set categories belonging to this group to have null menu_group_id
  await pool.query('UPDATE categories SET menu_group_id = NULL WHERE menu_group_id = ?', [id]);
  await pool.query('DELETE FROM menu_groups WHERE id = ?', [id]);
  
  revalidatePath('/admin/menu-groups');
  revalidatePath('/admin/categories');
  revalidatePath('/');
}

export async function saveMenuGroup(data: any) {
  "use server";
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");

  const { id, name, sort_order } = data;
  const order = sort_order || 0;
  
  // Check if group name is unique
  let nameCheckQuery = 'SELECT id FROM menu_groups WHERE name = ?';
  let nameCheckParams: any[] = [name];
  if (id) {
    nameCheckQuery += ' AND id != ?';
    nameCheckParams.push(id);
  }
  
  const [existingName] = await pool.query(nameCheckQuery, nameCheckParams);
  if ((existingName as any[]).length > 0) {
    throw new Error(`A Menu Group with the name "${name}" already exists.`);
  }
  
  // Check if sort_order is unique
  let checkQuery = 'SELECT id FROM menu_groups WHERE sort_order = ?';
  let checkParams: any[] = [order];
  if (id) {
    checkQuery += ' AND id != ?';
    checkParams.push(id);
  }
  
  const [existing] = await pool.query(checkQuery, checkParams);
  if ((existing as any[]).length > 0) {
    throw new Error(`Sort order ${order} is already in use by another group. Please choose a unique number.`);
  }
  
  if (id) {
    await pool.query(`
      UPDATE menu_groups SET name=?, sort_order=? WHERE id=?
    `, [name, order, id]);
  } else {
    await pool.query(`
      INSERT INTO menu_groups (name, sort_order) VALUES (?, ?)
    `, [name, order]);
  }
  
  revalidatePath('/admin/menu-groups');
  revalidatePath('/admin/categories');
  revalidatePath('/');
}

export default async function AdminMenuGroupsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "admin") {
    redirect("/");
  }

  const [rows] = await pool.query('SELECT * FROM menu_groups ORDER BY sort_order ASC, name ASC');
  const groups = (rows as any[]).map(r => ({ ...r }));

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-[#0a0a0a]">Menu Groups</h1>
          <p className="text-gray-500">Manage top-level navigation categories for the frontend header.</p>
        </div>
      </div>

      <MenuGroupsClient initialGroups={groups} saveAction={saveMenuGroup} deleteAction={deleteMenuGroup} />
    </div>
  );
}
