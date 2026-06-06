import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import pool from "@/lib/db";
import { revalidatePath } from "next/cache";
import ProductsClient from "./products-client";

// --- SERVER ACTIONS ---
export async function deleteProduct(id: number) {
  "use server";
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");
  await pool.query('DELETE FROM products WHERE id = ?', [id]);
  revalidatePath('/admin/products');
  revalidatePath('/shop');
}

export async function saveProduct(data: any) {
  "use server";
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");

  const { id, name, slug, category, brand, price, rating, availability, badge, image, description } = data;
  
  if (id) {
    await pool.query(`
      UPDATE products SET 
        name=?, slug=?, category=?, brand=?, price=?, rating=?, availability=?, badge=?, image=?, description=?
      WHERE id=?
    `, [name, slug, category, brand, price, rating, availability, badge, image, description, id]);
  } else {
    await pool.query(`
      INSERT INTO products 
      (name, slug, category, brand, price, rating, availability, badge, image, description, compatibility, specs, options, relatedThumbs)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '[]', '[]', '[]', '[]')
    `, [name, slug, category, brand, price, rating || 5.0, availability || 'In Stock', badge || '', image, description || '']);
  }
  
  revalidatePath('/admin/products');
  revalidatePath('/shop');
}

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "admin") {
    redirect("/");
  }

  const [rows] = await pool.query('SELECT * FROM products ORDER BY id DESC');
  const products = rows as any[];

  const [categoryRows] = await pool.query('SELECT * FROM categories ORDER BY name ASC');
  const categories = categoryRows as any[];

  const [brandRows] = await pool.query('SELECT DISTINCT brand FROM products WHERE brand IS NOT NULL AND brand != "" ORDER BY brand ASC');
  const dbBrands = (brandRows as any[]).map(r => r.brand);
  
  const popularBrands = [
    "Aprilia", "Benelli", "BMW Motorrad", "Ducati", "Harley-Davidson", 
    "Honda", "Indian Motorcycle", "Kawasaki", "KTM", "MV Agusta", 
    "Royal Enfield", "Suzuki", "Triumph", "Yamaha"
  ];

  const allBrands = Array.from(new Set([...popularBrands, ...dbBrands])).sort();
  const brands = allBrands.map(b => ({ brand: b }));

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
