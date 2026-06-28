import pool from "@/lib/db";
import { UsersClient } from "./users-client";
import { RowDataPacket } from "mysql2";

export const metadata = {
  title: "Manage Users - Admin Dashboard"
};

export default async function AdminUsersPage() {
  const [rows] = await pool.query<RowDataPacket[]>(`
    SELECT 
      u.id, 
      u.name, 
      u.email, 
      u.phone, 
      u.role, 
      u.created_at,
      MAX(a.address_line) as address_line,
      MAX(a.city) as city,
      MAX(a.postal_code) as postal_code
    FROM users u
    LEFT JOIN addresses a ON u.id = a.user_id
    GROUP BY u.id
    ORDER BY u.created_at DESC
  `);

  const users = (rows as any[]).map(row => ({
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    role: row.role,
    created_at: row.created_at,
    address_line: row.address_line,
    city: row.city,
    postal_code: row.postal_code
  }));

  return (
    <div className="p-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-[#0a0a0a]">Users</h1>
          <p className="text-gray-500 mt-1">Manage registered users and view their details.</p>
        </div>
      </div>
      <UsersClient users={users} />
    </div>
  );
}

