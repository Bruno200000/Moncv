import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, signToken } from '@/lib/auth';
import { isAdminCredentials, signAdminToken } from '@/lib/adminAuth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Veuillez remplir tous les champs." },
        { status: 400 }
      );
    }

    const emailLower = email.toLowerCase().trim();

    if (isAdminCredentials(emailLower, password)) {
      const response = NextResponse.json({
        success: true,
        admin: true,
        redirectTo: '/admin',
      });

      response.cookies.set('moncv_admin', signAdminToken(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 8,
      });

      return response;
    }

    const user = db.getUserByEmail(emailLower);

    if (!user) {
      return NextResponse.json(
        { error: "Identifiants incorrects." },
        { status: 401 }
      );
    }

    // Vérifier le mot de passe
    const passwordHash = hashPassword(password);
    if (user.passwordHash !== passwordHash) {
      return NextResponse.json(
        { error: "Identifiants incorrects." },
        { status: 401 }
      );
    }

    // Créer la session
    const token = signToken({ userId: user.id, email: user.email });

    // Créer la réponse et attacher le cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        plan: user.plan
      }
    });

    // Configurer le cookie de session
    response.cookies.set('moncv_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 jours
    });

    return response;
  } catch (error) {
    console.error("Erreur de connexion:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la connexion." },
      { status: 500 }
    );
  }
}
