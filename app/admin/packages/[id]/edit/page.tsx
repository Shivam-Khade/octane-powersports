import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import pool from "@/lib/db";
import { savePackage, searchProducts, getPackage } from "../../actions";
import PackageForm from "@/components/admin/package-form";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function EditPackagePage({ params }: { params: { id: string } | Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "admin") {
    redirect("/");
  }

  const resolvedParams = await params;
  const packageData = await getPackage(parseInt(resolvedParams.id));

  if (!packageData) {
    redirect("/admin/packages");
  }

  const [bikeModelRows] = await pool.query(`
    SELECT * FROM bike_models 
    ORDER BY CASE WHEN brand = 'Universal' THEN 1 ELSE 0 END, brand ASC, series ASC, model ASC
  `);
  const bikeModelsData = (bikeModelRows as any[]).map(r => ({ ...r }));

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
      <div className="mb-8 flex justify-between items-center max-w-5xl mx-auto">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-[#0a0a0a]">Edit Package Deal</h1>
          <p className="text-gray-500 font-medium mt-1">Configure your bundle and adjust product pricing.</p>
        </div>
      </div>

      <PackageForm 
        bikeModels={structuredBikeModels}
        saveAction={savePackage}
        searchProducts={searchProducts}
        initialData={packageData} 
      />
    </div>
  );
}
