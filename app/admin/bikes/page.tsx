import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import pool from "@/lib/db";
import BikesTreeClient from "./bikes-client";
import { addBikeModel, updateBikeCompatibility, deleteBikeModel } from "./actions";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BikesAdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "admin") {
    redirect("/");
  }

  // Fetch bikes data
  const [bikeModelRows] = await pool.query(`
    SELECT * FROM bike_models 
    ORDER BY CASE WHEN brand = 'Universal' THEN 1 ELSE 0 END, brand ASC, series ASC, model ASC
  `);
  const rawBikeModelsData = (bikeModelRows as any[]).map(r => ({ ...r }));

  const structuredBikeModels: any[] = [];
  const brandMap = new Map();

  for (const row of rawBikeModelsData) {
    if (!brandMap.has(row.brand)) {
      const brandObj = { brand: row.brand, series: [] };
      brandMap.set(row.brand, brandObj);
      structuredBikeModels.push(brandObj);
    }
    const brandObj = brandMap.get(row.brand);
    
    if (!row.series) continue;

    let seriesObj = brandObj.series.find((s: any) => s.name === row.series);
    if (!seriesObj) {
      seriesObj = { name: row.series, models: [] };
      brandObj.series.push(seriesObj);
    }
    
    if (row.model && !seriesObj.models.includes(row.model)) {
      seriesObj.models.push(row.model);
    }
  }

  // sort structuredBikeModels
  structuredBikeModels.sort((a, b) => {
    if (a.brand === 'Universal') return 1;
    if (b.brand === 'Universal') return -1;
    return a.brand.localeCompare(b.brand);
  });

  // products
  const [productRows] = await pool.query('SELECT id, name, image, compatibility FROM products ORDER BY name ASC');
  const products = (productRows as any[]).map(r => {
    let comp = [];
    try {
      comp = typeof r.compatibility === 'string' ? JSON.parse(r.compatibility) : (r.compatibility || []);
    } catch(e) {}
    return { ...r, compatibility: comp };
  });

  return (
    <div className="p-8 bg-[#f8f8f8] min-h-screen">
      <div className="mb-8 max-w-5xl mx-auto">
        <h1 className="text-3xl font-black uppercase tracking-tight text-[#0a0a0a]">Bikes Management</h1>
        <p className="text-gray-500 mt-2">Manage the hierarchy of brands, series, and bike models, and assign compatible products.</p>
      </div>

      <BikesTreeClient 
        bikeModels={structuredBikeModels} 
        products={products}
        addBikeAction={addBikeModel}
        updateCompatibilityAction={updateBikeCompatibility}
        deleteBikeAction={deleteBikeModel}
      />
    </div>
  );
}
