import { NextResponse } from 'next/server';
export async function POST() { return NextResponse.json({ message: 'Migration already complete.' }, { status: 200 }); }
