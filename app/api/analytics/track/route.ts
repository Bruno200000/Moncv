import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { db } from '@/lib/db';

const ALLOWED_EVENTS = new Set([
  'page_view',
  'download',
  'cv_create',
  'cv_duplicate',
  'cv_delete',
  'upgrade_click',
  'template_select',
]);

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const type = String(body.type || '').trim();

    if (!ALLOWED_EVENTS.has(type)) {
      return NextResponse.json({ error: 'Evenement analytics invalide.' }, { status: 400 });
    }

    const user = await getSessionUser();
    const metadata = typeof body.metadata === 'object' && body.metadata !== null ? body.metadata : {};

    await db.trackAnalyticsEvent({
      userId: user?.id || null,
      cvId: typeof body.cvId === 'string' ? body.cvId : null,
      type,
      path: typeof body.path === 'string' ? body.path : null,
      metadata,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur analytics track:', error);
    return NextResponse.json({ error: 'Tracking impossible.' }, { status: 500 });
  }
}
