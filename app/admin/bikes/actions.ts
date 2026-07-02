"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import pool from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function addBikeModel(brand: string, series: string, model: string = "") {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");

  try {
    const [existing] = await pool.query('SELECT 1 FROM bike_models WHERE brand = ? AND series = ? AND model = ?', [brand, series, model]);
    if ((existing as any[]).length === 0) {
      await pool.query('INSERT INTO bike_models (brand, series, model) VALUES (?, ?, ?)', [brand, series, model]);
      revalidatePath('/admin/bikes');
      revalidatePath('/admin/products');
      return { success: true };
    }
    return { success: false, error: "Already exists" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateBikeCompatibility(bikeModelName: string, selectedProductIds: number[]) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");

  try {
    const [rows] = await pool.query('SELECT id, compatibility FROM products');
    const products = rows as { id: number, compatibility: any }[];

    for (const product of products) {
      let compArray = [];
      try {
        if (typeof product.compatibility === 'string') {
          compArray = JSON.parse(product.compatibility);
        } else if (Array.isArray(product.compatibility)) {
          compArray = product.compatibility;
        }
      } catch(e) {
        compArray = [];
      }
      
      const isSelected = selectedProductIds.includes(product.id);
      const hasModel = compArray.includes(bikeModelName);

      let changed = false;
      if (isSelected && !hasModel) {
        compArray.push(bikeModelName);
        changed = true;
      } else if (!isSelected && hasModel) {
        compArray = compArray.filter((m: string) => m !== bikeModelName);
        changed = true;
      }

      if (changed) {
        await pool.query('UPDATE products SET compatibility = ? WHERE id = ?', [JSON.stringify(compArray), product.id]);
      }
    }

    revalidatePath('/admin/bikes');
    revalidatePath('/admin/products');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteBikeModel(brand: string, series: string, model: string = "") {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");

  try {
    if (model) {
      await pool.query('DELETE FROM bike_models WHERE brand = ? AND series = ? AND model = ?', [brand, series, model]);
    } else {
      await pool.query('DELETE FROM bike_models WHERE brand = ? AND series = ?', [brand, series]);
    }
    
    revalidatePath('/admin/bikes');
    revalidatePath('/admin/products');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
