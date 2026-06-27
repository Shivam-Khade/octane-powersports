"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import pool from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteBrand(id: number) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");
  await pool.query('DELETE FROM brands WHERE id = ?', [id]);
  revalidatePath('/admin/brands');
  revalidatePath('/', 'layout');
}

export async function saveBrand(data: any) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");

  const { id, name } = data;
  
  if (id) {
    await pool.query(`
      UPDATE brands SET name=? WHERE id=?
    `, [name, id]);
  } else {
    await pool.query(`
      INSERT INTO brands (name) VALUES (?)
    `, [name]);
  }
  
  revalidatePath('/admin/brands');
  revalidatePath('/', 'layout');
}
