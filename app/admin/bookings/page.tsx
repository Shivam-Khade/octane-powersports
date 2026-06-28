import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import pool from "@/lib/db";
import { revalidatePath } from "next/cache";
import BookingsClient from "./bookings-client";

// --- SERVER ACTIONS ---
export async function deleteBooking(id: number) {
  "use server";
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");
  await pool.query('DELETE FROM service_bookings WHERE id = ?', [id]);
  revalidatePath('/admin/bookings');
}

export async function bulkDeleteBookings(ids: number[]) {
  "use server";
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");
  if (ids.length === 0) return;
  const placeholders = ids.map(() => '?').join(',');
  await pool.query(`DELETE FROM service_bookings WHERE id IN (${placeholders})`, ids);
  revalidatePath('/admin/bookings');
}

export default async function AdminBookingsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "admin") {
    redirect("/");
  }

  const [rows] = await pool.query('SELECT * FROM service_bookings ORDER BY booking_date ASC');
  const bookings = (rows as any[]).map(r => ({ ...r }));

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-[#0a0a0a]">Service Bookings</h1>
          <p className="text-gray-500">Manage incoming service and repair requests.</p>
        </div>
      </div>

      <BookingsClient initialBookings={bookings} deleteAction={deleteBooking} bulkDeleteAction={bulkDeleteBookings} />
    </div>
  );
}
