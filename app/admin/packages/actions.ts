"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import pool from "@/lib/db";
import { revalidatePath } from "next/cache";
import { RowDataPacket } from "mysql2";

export async function deletePackage(id: number) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");
  await pool.query('DELETE FROM packages WHERE id = ?', [id]);
  revalidatePath('/admin/packages');
  revalidatePath('/packages');
}

function sanitizeSlug(s: string) {
  return (s || "").toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export async function savePackage(data: any) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");

  const {
    id, name, slug, description, banner, thumbnail, priority, is_active,
    start_date, end_date, discount_type, discount_value, seo_title, seo_description,
    products, bikes
  } = data;

  const cleanSlug = sanitizeSlug(slug);

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    let packageId = id;

    if (id) {
      await connection.query(`
        UPDATE packages SET 
          name=?, slug=?, description=?, banner=?, thumbnail=?, priority=?, is_active=?, 
          start_date=?, end_date=?, discount_type=?, discount_value=?, seo_title=?, seo_description=?
        WHERE id=?
      `, [
        name, cleanSlug, description, banner, thumbnail, priority || 0, is_active ? 1 : 0,
        start_date || null, end_date || null, discount_type || 'percentage', discount_value || 0,
        seo_title, seo_description, id
      ]);
    } else {
      const [result] = await connection.query(`
        INSERT INTO packages 
        (name, slug, description, banner, thumbnail, priority, is_active, start_date, end_date, discount_type, discount_value, seo_title, seo_description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        name, cleanSlug, description, banner, thumbnail, priority || 0, is_active ? 1 : 0,
        start_date || null, end_date || null, discount_type || 'percentage', discount_value || 0,
        seo_title, seo_description
      ]);
      packageId = (result as any).insertId;

      // Initialize analytics for new package
      await connection.query(`INSERT INTO package_analytics (package_id) VALUES (?)`, [packageId]);
    }

    // Update products
    await connection.query(`DELETE FROM package_products WHERE package_id=?`, [packageId]);
    if (products && products.length > 0) {
      const productValues = products.map((p: any, index: number) => [packageId, p.id, index]);
      await connection.query(`INSERT INTO package_products (package_id, product_id, sort_order) VALUES ?`, [productValues]);
    }

    // Update bikes
    await connection.query(`DELETE FROM package_bikes WHERE package_id=?`, [packageId]);
    if (bikes && bikes.length > 0) {
      const bikeValues = bikes.map((b: string) => [packageId, b]);
      await connection.query(`INSERT INTO package_bikes (package_id, bike_name) VALUES ?`, [bikeValues]);
    }

    await connection.commit();
    revalidatePath('/admin/packages');
    revalidatePath('/packages');
    revalidatePath('/');
    
    return { success: true };
  } catch (error: any) {
    await connection.rollback();
    if (error.code === 'ER_DUP_ENTRY') {
      return { success: false, error: "A package with this URL Slug already exists. Please use a unique slug." };
    }
    return { success: false, error: error.message || "Failed to save package" };
  } finally {
    connection.release();
  }
}

export async function getPackage(id: number) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");

  const [packageRows] = await pool.query<RowDataPacket[]>('SELECT * FROM packages WHERE id = ?', [id]);
  if (packageRows.length === 0) return null;
  const pkg = packageRows[0];

  const [productRows] = await pool.query<RowDataPacket[]>(`
    SELECT p.id, p.name, p.price, p.image, pp.sort_order 
    FROM package_products pp 
    JOIN products p ON pp.product_id = p.id 
    WHERE pp.package_id = ? 
    ORDER BY pp.sort_order
  `, [id]);
  
  const [bikeRows] = await pool.query<RowDataPacket[]>('SELECT bike_name FROM package_bikes WHERE package_id = ?', [id]);

  return {
    ...pkg,
    products: productRows,
    bikes: bikeRows.map(b => b.bike_name)
  };
}

export async function searchProducts(query: string) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");
  
  if (!query || query.length < 2) return [];

  const [rows] = await pool.query<RowDataPacket[]>(`
    SELECT id, name, price, image 
    FROM products 
    WHERE name LIKE ? 
    LIMIT 20
  `, [`%${query}%`]);

  return rows;
}
