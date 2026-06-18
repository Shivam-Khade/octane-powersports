import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM service_bookings WHERE user_id = ? ORDER BY booking_date DESC, created_at DESC",
      [session.user.id]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("ServiceBookings GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized. Please log in to book a service." }, { status: 401 });
  }

  try {
    const { name, phone, email, bikeModel, date, timeSlot, serviceType, notes } = await req.json();

    if (!name || !phone || !bikeModel || !date || !timeSlot || !serviceType) {
      return NextResponse.json({ error: "All required fields must be provided" }, { status: 400 });
    }

    // Check if the user already has an active booking
    const [activeBookings] = await pool.query<RowDataPacket[]>(
      "SELECT id FROM service_bookings WHERE user_id = ? AND status IN ('Pending', 'Confirmed')",
      [session.user.id]
    );

    if (activeBookings.length > 0) {
      return NextResponse.json({ error: "You already have an active appointment. Please wait until it is completed before booking another." }, { status: 400 });
    }

    // Server-side double check for slot availability
    const [existing] = await pool.query<RowDataPacket[]>(
      "SELECT id FROM service_bookings WHERE booking_date = ? AND time_slot = ?",
      [date, timeSlot]
    );

    if (existing.length > 0) {
      return NextResponse.json({ error: "This time slot is already booked for the selected date" }, { status: 400 });
    }

    const [result] = await pool.query(
      "INSERT INTO service_bookings (user_id, name, phone, email, bike_model, service_type, booking_date, time_slot, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [session.user.id, name, phone, email, bikeModel, serviceType, date, timeSlot, notes || null]
    );

    return NextResponse.json({ message: "Booking created successfully", id: (result as any).insertId }, { status: 201 });
  } catch (error) {
    console.error("ServiceBookings POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
