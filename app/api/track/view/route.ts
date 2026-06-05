import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { type, id } = await req.json();

    if (!type || !id) {
      return NextResponse.json({ error: "Missing type or id" }, { status: 400 });
    }

    if (type === "product") {
      await pool.query('UPDATE products SET views = views + 1 WHERE id = ?', [id]);
    } else if (type === "blog") {
      // If blogs use slug or id? Wait, blogs usually use slug or id. Let's assume slug or id.
      // We will check if it's a number. If not, it might be a slug.
      if (isNaN(Number(id))) {
        await pool.query('UPDATE blogs SET views = views + 1 WHERE slug = ?', [id]);
      } else {
        await pool.query('UPDATE blogs SET views = views + 1 WHERE id = ?', [id]);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("View tracking error:", error);
    return NextResponse.json({ error: "Failed to track view" }, { status: 500 });
  }
}
