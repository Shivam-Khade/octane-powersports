import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM blogs');
    const articles = (rows as any[]).map(article => {
      const a = { ...article };
      // Boolean handling for MySQL tinyint
      if (typeof a.featured !== 'boolean') {
         a.featured = a.featured === 1;
      }
      return a;
    });
    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}
