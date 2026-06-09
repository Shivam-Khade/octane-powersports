import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");

  if (!date) {
    return NextResponse.json({ error: "Date parameter is required" }, { status: 400 });
  }

  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT time_slot FROM service_bookings WHERE booking_date = ?",
      [date]
    );

    const bookedSlots = rows.map(row => row.time_slot);

    return NextResponse.json({ bookedSlots });
  } catch (error) {
    console.error("Availability GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
