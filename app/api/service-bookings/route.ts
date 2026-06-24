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
    const { name, phone, email, bikeModel, date, timeSlot, notes } = await req.json();

    if (!name || !phone || !bikeModel || !date || !timeSlot) {
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
      "INSERT INTO service_bookings (user_id, name, phone, email, bike_model, booking_date, time_slot, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [session.user.id, name, phone, email, bikeModel, date, timeSlot, notes || null]
    );

    // Send email notification to admin
    try {
      const { Resend } = await import('resend');
      if (process.env.RESEND_API_KEY) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@octanepowersports.com';
        
        await resend.emails.send({
          from: 'Octane Powersports <onboarding@resend.dev>',
          to: adminEmail,
          subject: `New Service Booking: ${bikeModel} on ${date}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #ddd; border-radius: 8px;">
              <h2 style="color: #ff6b00; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-top: 0;">New Service Booking Request</h2>
              <p>A new service appointment has been booked. Here are the details:</p>
              <table style="width: 100%; border-collapse: collapse; margin-top: 20px; text-align: left;">
                <tr>
                  <th style="padding: 10px; border-bottom: 1px solid #eee; width: 35%;">Name:</th>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">${name}</td>
                </tr>
                <tr>
                  <th style="padding: 10px; border-bottom: 1px solid #eee;">Phone:</th>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">${phone}</td>
                </tr>
                <tr>
                  <th style="padding: 10px; border-bottom: 1px solid #eee;">Email:</th>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">${email}</td>
                </tr>
                <tr>
                  <th style="padding: 10px; border-bottom: 1px solid #eee;">Bike Model:</th>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">${bikeModel}</td>
                </tr>
                <tr>
                  <th style="padding: 10px; border-bottom: 1px solid #eee;">Date:</th>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">${date}</td>
                </tr>
                <tr>
                  <th style="padding: 10px; border-bottom: 1px solid #eee;">Time Slot:</th>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">${timeSlot}</td>
                </tr>
                <tr>
                  <th style="padding: 10px; border-bottom: 1px solid #eee;">Additional Notes:</th>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">${notes || 'None'}</td>
                </tr>
              </table>
              <p style="margin-top: 30px; font-size: 14px; color: #777;">Please log in to the admin panel to manage this booking.</p>
            </div>
          `
        });
        console.log("Admin notification email sent successfully");
      } else {
        console.warn("RESEND_API_KEY is not set. Admin email notification skipped.");
      }
    } catch (emailError) {
      console.error("Failed to send booking notification email:", emailError);
      // We don't throw an error here to prevent failing the booking
    }

    return NextResponse.json({ message: "Booking created successfully", id: (result as any).insertId }, { status: 201 });
  } catch (error) {
    console.error("ServiceBookings POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
