import { NextResponse } from 'next/server';
import { isAdminSession } from '@/lib/adminAuth';
import { db } from '@/lib/db';

export async function GET() {
  if (!(await isAdminSession())) {
    return NextResponse.json(
      { error: 'Accès admin requis.' },
      { status: 401 }
    );
  }

  return NextResponse.json({ stats: db.getAdminStats() });
}
