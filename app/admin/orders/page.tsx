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
  await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
  revalidatePath('/admin/orders');
  revalidatePath('/orders');
}

export default async function AdminOrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "admin") {
    redirect("/");
  }

  // Fetch orders with user details
  const [rows] = await pool.query(`
    SELECT o.*, u.name as customer_name, u.email as customer_email 
    FROM orders o 
    LEFT JOIN users u ON o.user_id = u.id 
    ORDER BY o.id DESC
  `);
  const orders = rows as any[];

  // Fetch items for these orders
  const [itemsRows] = await pool.query('SELECT * FROM order_items');
  const allItems = itemsRows as any[];

  // Attach items to orders
  const ordersWithItems = orders.map(order => ({
    ...order,
    items: allItems.filter(item => item.order_id === order.id)
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
