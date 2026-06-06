import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM addresses WHERE user_id = ? ORDER BY created_at DESC",
      [session.user.id]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Address GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { full_name, phone, address_line, city, postal_code } = await req.json();

    if (!full_name || !phone || !address_line || !city || !postal_code) {
      return NextResponse.json({ error: "All text address details are required" }, { status: 400 });
    }

    // Delete existing address to enforce single address policy
    await pool.query("DELETE FROM addresses WHERE user_id = ?", [session.user.id]);

    const [result] = await pool.query(
      "INSERT INTO addresses (user_id, full_name, phone, address_line, city, postal_code) VALUES (?, ?, ?, ?, ?, ?)",
      [session.user.id, full_name, phone, address_line, city, postal_code]
    );

    return NextResponse.json({ message: "Address updated successfully", id: (result as any).insertId }, { status: 201 });
  } catch (error) {
    console.error("Address POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
