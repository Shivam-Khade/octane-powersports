import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE stockCount > 0');
    // Ensure JSON fields are parsed correctly
    const products = (rows as any[]).map(product => {
      const p = { ...product };
      ['compatibility', 'specs', 'options', 'relatedThumbs'].forEach(field => {
        if (typeof p[field] === 'string') {
          try {
            p[field] = JSON.parse(p[field]);
          } catch (e) {
            // ignore
          }
        }
      });
      // also ensure rating and price are numbers
      p.rating = Number(p.rating);
      p.price = Number(p.price);
      p.stockCount = Number(p.stockCount);
      if (typeof p.brand === 'string') {
        const uniqueBrands = Array.from(new Set(p.brand.split(',').map((b: string) => b.trim())));
        p.brand = uniqueBrands.join(', ');
      }
      return p;
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
