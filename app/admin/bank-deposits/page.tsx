import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import pool from "@/lib/db";
import BankDepositsClient from "./bank-deposits-client";
import { handleBankDepositAction } from "./actions";

export default async function AdminBankDepositsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "admin") {
    redirect("/");
  }

  // Fetch deposits with user and order details
  const [rows] = await pool.query(`
    SELECT 
      bd.*, 
      o.total_amount, 
      o.status as order_status, 
      u.name as customer_name, 
      u.email as customer_email,
      u.phone as customer_phone
    FROM bank_deposit_details bd
    JOIN orders o ON bd.order_id = o.id
    JOIN users u ON o.user_id = u.id
    ORDER BY bd.uploaded_at DESC
  `);
  
  const deposits = rows as any[];

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-[#0a0a0a]">Bank Deposits</h1>
          <p className="text-gray-500">Verify customer bank deposit payments.</p>
        </div>
      </div>

      <BankDepositsClient initialDeposits={deposits} handleAction={handleBankDepositAction} />
    </div>
  );
}
