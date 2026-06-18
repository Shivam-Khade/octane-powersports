import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import pool from "@/lib/db";
import { saveProduct } from "../../actions";
import ProductForm from "@/components/admin/product-form";

export default async function EditProductPage({ params }: { params: { id: string } | Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "admin") {
    redirect("/");
  }

  const resolvedParams = await params;

  const [productRows] = await pool.query('SELECT * FROM products WHERE id = ?', [resolvedParams.id]);
  const products = productRows as any[];

  if (!products || products.length === 0) {
    redirect("/admin/products");
  }

  const product = products[0];

  const [categoryRows] = await pool.query('SELECT * FROM categories ORDER BY name ASC');
  const categories = categoryRows as any[];

  const [brandRows] = await pool.query('SELECT DISTINCT brand FROM products WHERE brand IS NOT NULL AND brand != "" ORDER BY brand ASC');
  const dbBrands = (brandRows as any[]).map(r => r.brand);
  
  const popularBrands = [
    "Aprilia", "Benelli", "BMW Motorrad", "Ducati", "Harley-Davidson", 
    "Honda", "Indian Motorcycle", "Kawasaki", "KTM", "MV Agusta", 
    "Royal Enfield", "Suzuki", "Triumph", "Yamaha", "Akrapovic"
  ];

  const allBrands = Array.from(new Set([...popularBrands, ...dbBrands])).sort();
  const brands = allBrands.map(b => ({ brand: b }));

  const [bikeModelRows] = await pool.query(`
    SELECT * FROM bike_models 
    ORDER BY CASE WHEN brand = 'Universal' THEN 1 ELSE 0 END, brand ASC, series ASC, model ASC
  `);
  const bikeModelsData = bikeModelRows as any[];

  const structuredBikeModels: any[] = [];
  const brandMap = new Map();
  for (const row of bikeModelsData) {
    if (!brandMap.has(row.brand)) {
      const brandObj = { brand: row.brand, series: [] };
      brandMap.set(row.brand, brandObj);
      structuredBikeModels.push(brandObj);
    }
    const brandObj = brandMap.get(row.brand);
    
    let seriesObj = brandObj.series.find((s: any) => s.name === row.series);
    if (!seriesObj) {
      seriesObj = { name: row.series, models: [] };
      brandObj.series.push(seriesObj);
    }
    
    if (!seriesObj.models.includes(row.model)) {
      seriesObj.models.push(row.model);
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-[#0a0a0a]">Edit Product</h1>
          <p className="text-gray-500">Update the product information below.</p>
        </div>
      </div>

      <ProductForm 
        categories={categories} 
        brands={brands} 
        bikeModels={structuredBikeModels}
        saveAction={saveProduct} 
        initialData={product} 
      />
    </div>
  );
}
