import pool from "@/lib/db";
import { AnalyticsClient } from "./analytics-client";

export const metadata = {
  title: "Analytics - Admin | Octane"
};

export default async function AnalyticsPage() {
  // Fetch Products
  const [productsRows] = await pool.query('SELECT name, views, cart_adds FROM products ORDER BY views DESC LIMIT 1000');
  const products = (productsRows as any[]).map(row => ({
    name: row.name,
    views: Number(row.views) || 0,
    cartAdds: Number(row.cart_adds) || 0
  }));

  // Fetch Articles
  const [articlesRows] = await pool.query('SELECT title as name, views FROM blogs ORDER BY views DESC LIMIT 1000');
  const articles = (articlesRows as any[]).map(row => ({
    name: row.name,
    views: Number(row.views) || 0
  }));

  // Fetch Service Booking Breakdown
  const [bookingStatsRows] = await pool.query('SELECT status as name, COUNT(*) as value FROM service_bookings GROUP BY status ORDER BY value DESC');
  const bookingStats = (bookingStatsRows as any[]).map(row => ({
    name: row.name || 'Other',
    value: Number(row.value) || 0
  }));

  // Render client component with data
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-black uppercase tracking-tight text-[#0a0a0a]">Analytics Overview</h1>
        <p className="text-gray-500 mt-1">Deep dive into store performance and user engagement.</p>
      </div>

      <AnalyticsClient 
        products={products}
        articles={articles}
        bookingStats={bookingStats}
      />
    </div>
  );
}
