import { NextResponse } from 'next/server';
import { isAdminSession } from '@/lib/adminAuth';
import { db, type User } from '@/lib/db';

type Target = 'all' | 'free' | 'premium' | 'vip';

export async function POST(request: Request) {
  try {
    if (!(await isAdminSession())) {
      return NextResponse.json({ error: 'Acces admin requis.' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const subject = String(body.subject || '').trim();
    const message = String(body.message || '').trim();
    const target = String(body.target || 'all') as Target;
    const userId = typeof body.userId === 'string' ? body.userId : '';

    if (!subject || !message) {
      return NextResponse.json({ error: 'Sujet et message requis.' }, { status: 400 });
    }

    if (!['all', 'free', 'premium', 'vip'].includes(target)) {
      return NextResponse.json({ error: 'Cible invalide.' }, { status: 400 });
    }

    let users: User[] = [];
    if (userId) {
      const user = await db.getUserById(userId);
      users = user ? [user] : [];
    } else {
      users = (await db.getUsers()).filter((user) => target === 'all' || user.plan === target);
    }

    if (!users.length) {
      return NextResponse.json({ error: 'Aucun utilisateur trouve pour cette cible.' }, { status: 404 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM || 'MonCV <onboarding@resend.dev>';

    if (!apiKey) {
      return NextResponse.json({
        error: 'RESEND_API_KEY manquant. Configurez la cle avant les envois reels.',
        preview: { recipients: users.length, subject, message },
      }, { status: 503 });
    }

    const results = await Promise.allSettled(
      users.map((user) =>
        fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from,
            to: user.email,
            subject,
            text: message,
          }),
        })
      )
    );

    const sent = results.filter((result) => result.status === 'fulfilled' && result.value.ok).length;
    const failed = users.length - sent;

    return NextResponse.json({ success: true, sent, failed });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Impossible d envoyer le message.' },
      { status: 500 }
    );
  }
}
