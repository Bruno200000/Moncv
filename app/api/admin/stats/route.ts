import { NextResponse } from 'next/server';
import { isAdminSession } from '@/lib/adminAuth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    if (!(await isAdminSession())) {
      return NextResponse.json(
        { error: 'Accès admin requis.' },
        { status: 401 }
      );
    }

    return NextResponse.json({ stats: await db.getAdminStats() });
  } catch (error) {
    console.error('Erreur admin stats:', error);
    return NextResponse.json(
      { error: 'Impossible de charger les statistiques admin.' },
      { status: 500 }
    );
  }
}
