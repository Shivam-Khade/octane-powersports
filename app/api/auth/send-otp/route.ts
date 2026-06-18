import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { sendOTPEmail } from "@/lib/email";
import { RowDataPacket } from "mysql2";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if user already exists
    const [existingUsers] = await pool.query<RowDataPacket[]>(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "Email already registered. Please login." }, { status: 400 });
    }

    // Check OTP request count
    const [existingOtpRows] = await pool.query<RowDataPacket[]>(
      "SELECT request_count FROM email_otps WHERE email = ?",
      [email]
    );

    let currentCount = 0;
    if (existingOtpRows.length > 0) {
      currentCount = existingOtpRows[0].request_count;
      // if (currentCount >= 3) {
      //   return NextResponse.json({ error: "Maximum OTP requests reached. Please try again later or contact support." }, { status: 429 });
      // }
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store/Update OTP
    if (existingOtpRows.length > 0) {
      await pool.query(
        "UPDATE email_otps SET otp = ?, expires_at = DATE_ADD(NOW(), INTERVAL 10 MINUTE), request_count = request_count + 1 WHERE email = ?",
        [otp, email]
      );
    } else {
      await pool.query(
        "INSERT INTO email_otps (email, otp, expires_at, request_count) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE), 1)",
        [email, otp]
      );
    }

    // Send Email
    const result = await sendOTPEmail(email, otp);
    console.log("Resend API Response:", result);
    
    if (!result.success) {
      console.error("Resend API Error details:", result.error);
      return NextResponse.json({ error: "Failed to send OTP email. Please check the email address." }, { status: 500 });
    }

    return NextResponse.json({ message: "OTP sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
