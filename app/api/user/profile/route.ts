import { NextResponse } from 'next/server';
import { getSessionUser, hashPassword, signToken } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Non authentifie.' }, { status: 401 });
    }

    const cvs = await db.getCVs(user.id);
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        createdAt: user.createdAt,
        cvsCount: cvs.length,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Impossible de charger le profil.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Non authentifie.' }, { status: 401 });
    }

    const body = await request.json();
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');

    if (!name || name.length < 2) {
      return NextResponse.json({ error: 'Le nom doit contenir au moins 2 caracteres.' }, { status: 400 });
    }

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email invalide.' }, { status: 400 });
    }

    if (password && password.length < 6) {
      return NextResponse.json({ error: 'Le mot de passe doit contenir au moins 6 caracteres.' }, { status: 400 });
    }

    const updatedUser = await db.updateUserProfile(user.id, {
      name,
      email,
      passwordHash: password ? hashPassword(password) : undefined,
    });

    const response = NextResponse.json({
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        plan: updatedUser.plan,
        createdAt: updatedUser.createdAt,
      },
    });

    response.cookies.set('moncv_session', signToken({ userId: updatedUser.id, email: updatedUser.email }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Impossible de modifier le profil.' },
      { status: 500 }
    );
  }
}
