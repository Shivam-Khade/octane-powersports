import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function POST(req: Request) {
  try {
    const { name, email, phone, password, otp } = await req.json();

    if (!name || !email || !phone || !password || !otp) {
      return NextResponse.json({ message: 'Missing required fields including OTP' }, { status: 400 });
    }

    // Check if user already exists
    const [existingUsers] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
    }

    // Verify OTP
    const [otpRows] = await pool.query<RowDataPacket[]>(
      'SELECT otp, expires_at FROM email_otps WHERE email = ?',
      [email]
    );

    if (otpRows.length === 0) {
      return NextResponse.json({ message: 'No OTP requested for this email. Please request a new OTP.' }, { status: 400 });
    }

    const otpRecord = otpRows[0];
    if (otpRecord.otp !== otp) {
      return NextResponse.json({ message: 'Invalid OTP provided' }, { status: 400 });
    }

    if (new Date(otpRecord.expires_at) < new Date()) {
      return NextResponse.json({ message: 'OTP has expired. Please request a new one.' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database (default role 'user')
    const [result] = await pool.query(
      'INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone, hashedPassword, 'user']
    );

    // Delete OTP after successful registration
    await pool.query('DELETE FROM email_otps WHERE email = ?', [email]);

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });

  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
