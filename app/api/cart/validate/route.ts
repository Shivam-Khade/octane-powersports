import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { items } = await req.json();
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ validItems: [] });
    }

    const slugs = items.map((item: any) => item.id);
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT slug, stockCount FROM products WHERE slug IN (?)",
      [slugs]
    );

    const stockMap = new Map();
    (rows as any[]).forEach(row => {
      stockMap.set(row.slug, row.stockCount);
    });

    // An item is valid if it exists in the DB and has enough stock
    const validItems = items.filter((item: any) => {
      const stock = stockMap.get(item.id);
      return stock !== undefined && stock >= item.quantity;
    });

    return NextResponse.json({ validItems });
  } catch (error) {
    console.error("Cart validation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
