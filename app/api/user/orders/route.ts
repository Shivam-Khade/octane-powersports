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
    const [orders] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
      [session.user.id]
    );

    // Fetch items for each order
    for (const order of orders) {
      const [items] = await pool.query<RowDataPacket[]>(
        "SELECT * FROM order_items WHERE order_id = ?",
        [order.id]
      );
      order.items = items;
    }

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Orders GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { total_amount, items, razorpay_payment_id, razorpay_order_id, razorpay_signature } = await req.json();

    if (!total_amount || !items || items.length === 0) {
      return NextResponse.json({ error: "Invalid order data" }, { status: 400 });
    }

    // Insert order
    const [orderResult] = await pool.query(
      "INSERT INTO orders (user_id, total_amount, status, razorpay_payment_id, razorpay_order_id, razorpay_signature) VALUES (?, ?, ?, ?, ?, ?)",
      [session.user.id, total_amount, 'Pending', razorpay_payment_id || null, razorpay_order_id || null, razorpay_signature || null]
    );
    
    const orderId = (orderResult as any).insertId;

    // Insert items
    for (const item of items) {
      await pool.query(
        "INSERT INTO order_items (order_id, product_name, price, quantity) VALUES (?, ?, ?, ?)",
        [orderId, item.product_name, item.price, item.quantity]
      );
    }

    return NextResponse.json({ message: "Order created successfully", orderId }, { status: 201 });
  } catch (error) {
    console.error("Orders POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
