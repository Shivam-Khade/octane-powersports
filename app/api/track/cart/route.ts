import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing product id or slug" }, { status: 400 });
    }

    if (isNaN(Number(id))) {
      await pool.query('UPDATE products SET cart_adds = cart_adds + 1 WHERE slug = ?', [id]);
    } else {
      await pool.query('UPDATE products SET cart_adds = cart_adds + 1 WHERE id = ?', [id]);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cart tracking error:", error);
    return NextResponse.json({ error: "Failed to track cart addition" }, { status: 500 });
  }
}
