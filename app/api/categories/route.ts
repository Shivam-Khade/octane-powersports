import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM categories ORDER BY featured DESC, name ASC");
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("Categories fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
