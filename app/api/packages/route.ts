import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const bikeName = searchParams.get('bike');

  try {
    let query = `
      SELECT p.* 
      FROM packages p
      WHERE p.is_active = 1 
      AND (p.start_date IS NULL OR p.start_date <= NOW())
      AND (p.end_date IS NULL OR p.end_date >= NOW())
    `;
    const params: any[] = [];

    if (bikeName) {
      query += ` AND p.id IN (SELECT package_id FROM package_bikes WHERE bike_name = ?)`;
      params.push(bikeName);
    }

    query += ` ORDER BY p.priority DESC, p.created_at DESC`;

    const [packages] = await pool.query<RowDataPacket[]>(query, params);

    // Fetch products for all fetched packages
    if (packages.length > 0) {
      const packageIds = packages.map(p => p.id);
      const [productsRows] = await pool.query<RowDataPacket[]>(`
        SELECT pp.package_id, p.id, p.name, p.slug, p.price, p.image, p.stockCount 
        FROM package_products pp
        JOIN products p ON pp.product_id = p.id
        WHERE pp.package_id IN (?)
        ORDER BY pp.sort_order ASC
      `, [packageIds]);

      const productsByPackageId = (productsRows as any[]).reduce((acc, row) => {
        if (!acc[row.package_id]) acc[row.package_id] = [];
        acc[row.package_id].push(row);
        return acc;
      }, {});

      for (const pkg of packages) {
        pkg.products = productsByPackageId[pkg.id] || [];
      }
    }

    return NextResponse.json(packages);
  } catch (error) {
    console.error("Packages GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
