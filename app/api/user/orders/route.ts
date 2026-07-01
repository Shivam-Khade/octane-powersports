import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { sendOrderConfirmationEmail, sendAdminOrderNotification, OrderDetails } from "@/lib/email";
import crypto from "node:crypto";

export const dynamic = "force-dynamic";
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

    if (orders.length > 0) {
      const orderIds = orders.map(order => order.id);
      
      // Fetch all items for these orders in a SINGLE query (resolves N+1 issue)
      const [allItems] = await pool.query<RowDataPacket[]>(
        `SELECT oi.*, p.image 
         FROM order_items oi 
         LEFT JOIN products p ON oi.product_name = p.name 
         WHERE oi.order_id IN (?)`,
        [orderIds]
      );
      
      // Map items back to their respective orders
      const itemsByOrderId = (allItems as any[]).reduce((acc, item) => {
        if (!acc[item.order_id]) acc[item.order_id] = [];
        acc[item.order_id].push(item);
        return acc;
      }, {} as Record<string, any[]>);

      for (const order of orders) {
        order.items = itemsByOrderId[order.id] || [];
      }
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

    // Verify Razorpay Signature for secure payments
    if (razorpay_payment_id && razorpay_order_id && razorpay_signature) {
      const secret = process.env.RAZORPAY_KEY_SECRET;
      if (!secret) {
        throw new Error("RAZORPAY_KEY_SECRET is not configured");
      }
      
      const generated_signature = crypto
        .createHmac("sha256", secret)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");

      if (generated_signature !== razorpay_signature) {
        return NextResponse.json({ error: "Payment verification failed: Invalid Signature" }, { status: 400 });
      }
    }

    // Insert order
    const [orderResult] = await pool.query(
      "INSERT INTO orders (user_id, total_amount, status, razorpay_payment_id, razorpay_order_id, razorpay_signature) VALUES (?, ?, ?, ?, ?, ?)",
      [session.user.id, total_amount, 'Pending', razorpay_payment_id || null, razorpay_order_id || null, razorpay_signature || null]
    );
    
    const orderId = (orderResult as any).insertId;

    // Verify stock availability (Race Condition Guard)
    for (const item of items) {
      const [stockRows] = await pool.query<RowDataPacket[]>(
        "SELECT stockCount FROM products WHERE name = ?",
        [item.product_name]
      );
      if (stockRows.length === 0 || stockRows[0].stockCount < item.quantity) {
        // Reverse order creation if stock fails
        await pool.query("DELETE FROM orders WHERE id = ?", [orderId]);
        return NextResponse.json(
          { error: `Sorry, ${item.product_name} is out of stock or does not have enough quantity available.` }, 
          { status: 400 }
        );
      }
    }

    // Insert items and deduct stock
    for (const item of items) {
      await pool.query(
        "INSERT INTO order_items (order_id, product_name, price, quantity, package_id, package_name) VALUES (?, ?, ?, ?, ?, ?)",
        [orderId, item.product_name, item.price, item.quantity, item.package_id || null, item.package_name || null]
      );
      await pool.query(
        "UPDATE products SET stockCount = GREATEST(0, stockCount - ?) WHERE name = ?",
        [item.quantity, item.product_name]
      );
    }

    // Update package analytics
    try {
      const packageIds = new Set(items.map((i: any) => i.package_id).filter(Boolean));
      for (const pid of packageIds) {
        const packageItems = items.filter((i: any) => i.package_id === pid);
        const revenue = packageItems.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
        
        await pool.query(
          "UPDATE package_analytics SET purchases = purchases + 1, revenue = revenue + ? WHERE package_id = ?",
          [revenue, pid]
        );
      }
    } catch (e) {
      console.error("Error updating package analytics:", e);
    }

    // Fetch user address for email
    let shippingAddress = "Address not provided";
    let customerPhone = "N/A";
    try {
      const [addressRows] = await pool.query<RowDataPacket[]>(
        "SELECT * FROM addresses WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
        [session.user.id]
      );
      if (addressRows.length > 0) {
        const addr = addressRows[0];
        shippingAddress = `${addr.full_name}\n${addr.address_line}\n${addr.city}, ${addr.postal_code}`;
        customerPhone = addr.phone || "N/A";
      }
    } catch (e) {
      console.error("Error fetching address for email:", e);
    }

    // Send emails asynchronously
    const orderDetails: OrderDetails = {
      orderId,
      customerName: session.user.name || "Customer",
      customerEmail: session.user.email || "",
      customerPhone,
      totalAmount: total_amount,
      paymentMethod: razorpay_payment_id ? "Razorpay" : "Unknown",
      paymentStatus: razorpay_payment_id ? "Paid" : "Pending",
      items,
      shippingAddress,
      orderTime: new Date().toISOString(),
    };

    if (orderDetails.customerEmail) {
      sendOrderConfirmationEmail(orderDetails.customerEmail, orderDetails).catch(e => console.error("Customer email error:", e));
    }
    sendAdminOrderNotification(orderDetails).catch(e => console.error("Admin email error:", e));

    return NextResponse.json({ message: "Order created successfully", orderId }, { status: 201 });
  } catch (error) {
    console.error("Orders POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
