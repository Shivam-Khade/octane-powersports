import { ServiceClient } from "./service-client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export const metadata = {
  title: "Service Booking | Octane Powersports",
  description: "Book installation, fitment checks or maintenance support for your motorcycle."
};

export const dynamic = "force-dynamic";

export default async function ServiceBookingPage() {
  const session = await getServerSession(authOptions);
  
  let initialData = {
    name: "",
    email: "",
    phone: "",
    bikeModel: ""
  };

  if (session?.user?.email) {
    initialData.name = session.user.name || "";
    initialData.email = session.user.email || "";

    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        "SELECT phone, bike_garage FROM users WHERE email = ?",
        [session.user.email]
      );
      if (rows.length > 0) {
        initialData.phone = rows[0].phone || "";
        initialData.bikeModel = rows[0].bike_garage || "";
      }
    } catch (e) {
      console.error("Failed to fetch user profile for service booking", e);
    }
  }

  return <ServiceClient isAuthenticated={!!session} initialData={initialData} />;
}
