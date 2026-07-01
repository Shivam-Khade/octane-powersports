import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: { slug: string } | Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  try {
    const [packages] = await pool.query<RowDataPacket[]>(`
      SELECT p.* 
      FROM packages p
      WHERE p.slug = ? AND p.is_active = 1
    `, [resolvedParams.slug]);

    if (packages.length === 0) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    const pkg = packages[0];

    const [productsRows] = await pool.query<RowDataPacket[]>(`
      SELECT p.id, p.name, p.slug, p.price, p.image, p.stockCount, p.description, p.availability 
      FROM package_products pp
      JOIN products p ON pp.product_id = p.id
      WHERE pp.package_id = ?
      ORDER BY pp.sort_order ASC
    `, [pkg.id]);

    pkg.products = productsRows;

    const [bikeRows] = await pool.query<RowDataPacket[]>('SELECT bike_name FROM package_bikes WHERE package_id = ?', [pkg.id]);
    pkg.bikes = bikeRows.map(b => b.bike_name);

    return NextResponse.json(pkg);
  } catch (error) {
    console.error("Package GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
