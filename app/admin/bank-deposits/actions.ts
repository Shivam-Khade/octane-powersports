"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import pool from "@/lib/db";
import { revalidatePath } from "next/cache";
import { sendBankDepositRejectedEmail, sendOrderConfirmationEmail } from "@/lib/email";
import { RowDataPacket } from "mysql2";

export async function handleBankDepositAction(depositId: number, action: 'APPROVE' | 'REJECT', remarks: string = '') {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");
  
  // Get deposit and order details
  const [rows] = await pool.query<RowDataPacket[]>(`
    SELECT bd.*, o.user_id, o.total_amount, u.name as customerName, u.email as customerEmail
    FROM bank_deposit_details bd
    JOIN orders o ON bd.order_id = o.id
    JOIN users u ON o.user_id = u.id
    WHERE bd.id = ?
  `, [depositId]);
  
  const deposit = rows[0];
  if (!deposit) throw new Error("Deposit not found");

  if (deposit.verification_status !== 'PENDING') {
    throw new Error("This deposit has already been processed.");
  }

  const orderId = deposit.order_id;
  const adminId = session.user.id;
  
  // Fetch order items and address for emails
  const [itemsRows] = await pool.query<RowDataPacket[]>('SELECT * FROM order_items WHERE order_id = ?', [orderId]);
  const items = itemsRows as any[];
  
  let shippingAddress = "Address not provided";
  let customerPhone = "N/A";
  const [addressRows] = await pool.query<RowDataPacket[]>('SELECT * FROM addresses WHERE user_id = ? ORDER BY created_at DESC LIMIT 1', [deposit.user_id]);
  if (addressRows.length > 0) {
    shippingAddress = `${addressRows[0].full_name}\n${addressRows[0].address_line}\n${addressRows[0].city}, ${addressRows[0].postal_code}`;
    customerPhone = addressRows[0].phone || "N/A";
  }

  const orderDetails = {
    orderId,
    customerName: deposit.customerName || "Customer",
    customerEmail: deposit.customerEmail || "",
    customerPhone,
    totalAmount: deposit.total_amount,
    paymentMethod: "CASH_BANK_DEPOSIT",
    paymentStatus: action === 'APPROVE' ? "Paid" : "Rejected",
    items,
    shippingAddress,
    orderTime: new Date().toISOString(),
  };

  if (action === 'APPROVE') {
    // 1. Update deposit status
    await pool.query(
      `UPDATE bank_deposit_details SET verification_status = 'APPROVED', verified_by = ?, verified_at = NOW(), admin_remarks = ? WHERE id = ?`,
      [adminId, remarks || null, depositId]
    );

    // 2. Update order status
    await pool.query(
      `UPDATE orders SET status = 'Pending', payment_status = 'PAID' WHERE id = ?`,
      [orderId]
    );

    // 3. Deduct stock and update analytics (since we skipped this during creation)
    for (const item of items) {
      await pool.query(
        "UPDATE products SET stockCount = GREATEST(0, stockCount - ?) WHERE name = ?",
        [item.quantity, item.product_name]
      );
    }
    
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
      console.error("Error updating package analytics on approve:", e);
    }

    // 4. Send Order Confirmation Email
    if (orderDetails.customerEmail) {
      sendOrderConfirmationEmail(orderDetails.customerEmail, orderDetails).catch(e => console.error("Email error:", e));
    }
    
  } else if (action === 'REJECT') {
    // 1. Update deposit status
    await pool.query(
      `UPDATE bank_deposit_details SET verification_status = 'REJECTED', verified_by = ?, verified_at = NOW(), admin_remarks = ? WHERE id = ?`,
      [adminId, remarks || null, depositId]
    );

    // 2. Update order status to Cancelled and payment_status to REJECTED.
    await pool.query(
      `UPDATE orders SET status = 'Cancelled', payment_status = 'REJECTED' WHERE id = ?`,
      [orderId]
    );

    // 3. Send Rejection Email
    if (orderDetails.customerEmail) {
      sendBankDepositRejectedEmail(orderDetails.customerEmail, orderDetails, remarks).catch(e => console.error("Email error:", e));
    }
  }

  revalidatePath('/admin/bank-deposits', 'layout');
}
