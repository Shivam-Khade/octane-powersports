import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT brand, series, model FROM bike_models 
      WHERE brand != 'Universal'
      ORDER BY brand ASC, series ASC, model ASC
    `);

    // Format into nested object
    const bikeData: Record<string, Record<string, Record<string, string[]>>> = {};

    for (const row of rows) {
      if (!bikeData[row.brand]) {
        bikeData[row.brand] = {};
      }
      
      const cleanSeries = row.series.replace(/\sSeries$/i, "");
      
      if (!bikeData[row.brand][cleanSeries]) {
        bikeData[row.brand][cleanSeries] = {};
      }
      if (!bikeData[row.brand][cleanSeries][row.model]) {
        bikeData[row.brand][cleanSeries][row.model] = [];
      }
    }

    return NextResponse.json(bikeData);
  } catch (error) {
    console.error("Error fetching bike models:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
