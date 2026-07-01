import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { packageId, action } = await req.json();

    if (!packageId || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const validActions = ['views', 'clicks', 'adds_to_cart'];
    if (!validActions.includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    await pool.query(
      `UPDATE package_analytics SET ${action} = ${action} + 1 WHERE package_id = ?`,
      [packageId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Package analytics error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
