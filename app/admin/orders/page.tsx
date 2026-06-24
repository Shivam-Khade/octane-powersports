import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import pool from "@/lib/db";
import { revalidatePath } from "next/cache";
import OrdersClient from "./orders-client";

// --- SERVER ACTIONS ---
export async function updateOrderStatus(id: number, status: string) {
  "use server";
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");

  // Get order and user details
  const [orderRows] = await pool.query(`
    SELECT o.status, u.email, u.name 
    FROM orders o 
    LEFT JOIN users u ON o.user_id = u.id 
    WHERE o.id = ?
  `, [id]);
  const orderDetails = (orderRows as any[])[0];
  if (!orderDetails) return;

  const prevStatus = orderDetails.status;
  const customerEmail = orderDetails.email;
  const customerName = orderDetails.name || 'Customer';

  const [itemsRows] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [id]);
  const orderItems = itemsRows as any[];
  const productNames = orderItems.map((item: any) => item.product_name).join(", ");

  if (status === "Cancelled" && prevStatus !== "Cancelled") {
    // Restock items
    for (const item of orderItems) {
      await pool.query(
        "UPDATE products SET stockCount = stockCount + ? WHERE name = ?",
        [item.quantity, item.product_name]
      );
    }
  } else if (prevStatus === "Cancelled" && status !== "Cancelled") {
    // Deduct stock again if re-activating order
    for (const item of orderItems) {
      await pool.query(
        "UPDATE products SET stockCount = GREATEST(0, stockCount - ?) WHERE name = ?",
        [item.quantity, item.product_name]
      );
    }
  }

  await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);

  // Send Email Notification
  if (status !== prevStatus && customerEmail) {
    try {
      const { Resend } = await import('resend');
      if (process.env.RESEND_API_KEY) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        let statusMessage = '';
        let statusColor = '#000000';
        
        switch(status) {
          case 'Processing':
            statusMessage = 'Your order is currently being processed and will be shipped soon.';
            statusColor = '#f59e0b';
            break;
          case 'Shipped':
            statusMessage = 'Great news! Your order has been shipped and is on its way to you.';
            statusColor = '#3b82f6';
            break;
          case 'Delivered':
            statusMessage = 'Your order has been delivered. We hope you enjoy your new parts!';
            statusColor = '#10b981';
            break;
          case 'Cancelled':
            statusMessage = 'Your order has been cancelled.';
            statusColor = '#ef4444';
            break;
          default:
            statusMessage = `Your order status has been updated to: ${status}.`;
            statusColor = '#6b7280';
        }
        
        await resend.emails.send({
          from: 'Octane Powersports <onboarding@resend.dev>',
          to: customerEmail,
          subject: `Order Update: Your Octane Powersports Order #${id} is now ${status}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #ddd; border-radius: 8px;">
              <h2 style="color: #ff6b00; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-top: 0;">Order Status Update</h2>
              <p>Hi ${customerName},</p>
              <p>There is an update regarding your recent order <strong>#${id}</strong>.</p>
              <p style="margin-bottom: 20px; color: #555;"><strong>Items:</strong> ${productNames}</p>
              <div style="margin: 20px 0; padding: 15px; border-left: 4px solid ${statusColor}; background-color: #f9f9f9;">
                <h3 style="margin-top: 0; color: ${statusColor};">${status}</h3>
                <p style="margin-bottom: 0;">${statusMessage}</p>
              </div>
              <p style="margin-top: 30px; font-size: 14px; color: #777;">Thank you for shopping with Octane Powersports!</p>
            </div>
          `
        });
      }
    } catch (e) {
      console.error("Failed to send order status email:", e);
    }
  }
  revalidatePath('/', 'layout');
}

export default async function AdminOrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "admin") {
    redirect("/");
  }

  // Fetch orders with user details
  const [rows] = await pool.query(`
    SELECT o.*, u.name as customer_name, u.email as customer_email, u.phone as customer_phone
    FROM orders o 
    LEFT JOIN users u ON o.user_id = u.id 
    ORDER BY o.id DESC
  `);
  const orders = rows as any[];

  // Fetch items for these orders
  const [itemsRows] = await pool.query('SELECT * FROM order_items');
  const allItems = itemsRows as any[];

  // Fetch addresses
  const [addressRows] = await pool.query('SELECT * FROM addresses ORDER BY created_at DESC');
  const allAddresses = addressRows as any[];

  // Attach items and address to orders
  const ordersWithItems = orders.map(order => ({
    ...order,
    items: allItems.filter(item => item.order_id === order.id),
    address: allAddresses.find(addr => addr.user_id === order.user_id)
  }));

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-[#0a0a0a]">Orders</h1>
          <p className="text-gray-500">Manage customer orders and update shipping status.</p>
        </div>
      </div>

      <OrdersClient initialOrders={ordersWithItems} updateStatusAction={updateOrderStatus} />
    </div>
  );
}
