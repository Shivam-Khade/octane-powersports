import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import pool from "@/lib/db";
import { revalidatePath } from "next/cache";
import SettingsClient from "./settings-client";
import bcrypt from "bcryptjs";

// --- SERVER ACTIONS ---
export async function updateAdminProfile(data: any) {
  "use server";
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");

  const { name, email, password, gridSettings } = data;
  const adminEmail = session.user.email; // get current email to find the user

  if (password && password.trim() !== "") {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'UPDATE users SET name = ?, email = ?, password = ? WHERE email = ?',
      [name, email, hashedPassword, adminEmail]
    );
  } else {
    await pool.query(
      'UPDATE users SET name = ?, email = ? WHERE email = ?',
      [name, email, adminEmail]
    );
  }
  
  if (gridSettings) {
    await pool.query(
      'INSERT INTO settings (key_name, value_data) VALUES (?, ?) ON DUPLICATE KEY UPDATE value_data = VALUES(value_data)',
      ['navigation_grid', JSON.stringify(gridSettings)]
    );
  }
  
  revalidatePath('/admin');
  return { success: true };
}

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "admin") {
    redirect("/");
  }

  // Fetch current user details
  const [rows] = await pool.query('SELECT name, email FROM users WHERE email = ?', [session.user.email]);
  const user = (rows as any[])[0];

  // Fetch grid settings
  const [settingsRows] = await pool.query('SELECT value_data FROM settings WHERE key_name = ?', ['navigation_grid']);
  const gridSettings = (settingsRows as any[])[0]?.value_data || { desktopColumns: 4, mobileColumns: 3 };

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tight text-[#0a0a0a]">Settings</h1>
        <p className="text-gray-500">Manage your administrator account and store preferences.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <h2 className="text-xl font-black uppercase mb-6 pb-4 border-b border-gray-100">Store Configurations</h2>
        <SettingsClient initialData={user} initialGridSettings={gridSettings} updateAction={updateAdminProfile} />
      </div>
    </div>
  );
}
