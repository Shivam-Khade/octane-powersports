"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import pool from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteProduct(id: number) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");
  await pool.query('DELETE FROM products WHERE id = ?', [id]);
  revalidatePath('/admin/products');
  revalidatePath('/shop');
}

export async function saveProduct(data: any) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");

  const { id, name, slug, category, brand, price, rating, availability, badge, image, description, stockCount, compatibility, relatedThumbs, sku } = data;
  
  if (id) {
    await pool.query(`
      UPDATE products SET 
        name=?, slug=?, category=?, brand=?, price=?, rating=?, availability=?, badge=?, image=?, description=?, stockCount=?, compatibility=?, relatedThumbs=?, sku=?
      WHERE id=?
    `, [name, slug, category, brand, price, rating, availability, badge, image, description, stockCount ?? 10, JSON.stringify(compatibility || []), JSON.stringify(relatedThumbs || []), sku || null, id]);
  } else {
    await pool.query(`
      INSERT INTO products 
      (name, slug, category, brand, price, rating, availability, badge, image, description, stockCount, compatibility, specs, options, relatedThumbs, sku)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '[]', '[]', ?, ?)
    `, [name, slug, category, brand, price, rating || 5.0, availability || 'In Stock', badge || '', image, description || '', stockCount ?? 10, JSON.stringify(compatibility || []), JSON.stringify(relatedThumbs || []), sku || null]);
  }
  
  revalidatePath('/', 'layout');
}
