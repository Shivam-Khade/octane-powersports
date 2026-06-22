import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import { RowDataPacket } from "mysql2";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ error: "Email, OTP, and new password are required" }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    // Verify OTP
    const [otpRows] = await pool.query<RowDataPacket[]>(
      "SELECT otp, expires_at FROM email_otps WHERE email = ?",
      [email]
    );

    if (otpRows.length === 0) {
      return NextResponse.json({ error: "No verification code requested for this email" }, { status: 400 });
    }

    const otpData = otpRows[0];

    if (otpData.otp !== otp) {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 });
    }

    if (new Date() > new Date(otpData.expires_at)) {
      return NextResponse.json({ error: "Verification code has expired. Please request a new one." }, { status: 400 });
    }

    // OTP is valid, hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    const [updateResult] = await pool.query(
      "UPDATE users SET password = ? WHERE email = ?",
      [hashedPassword, email]
    );

    // Clear the OTP so it can't be reused
    await pool.query("DELETE FROM email_otps WHERE email = ?", [email]);

    return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
