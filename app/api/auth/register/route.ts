import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, signToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Veuillez remplir tous les champs requis." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Le mot de passe doit comporter au moins 6 caractères." },
        { status: 400 }
      );
    }

    const emailLower = email.toLowerCase().trim();
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await db.getUserByEmail(emailLower);
    if (existingUser) {
      return NextResponse.json(
        { error: "Cet email est déjà enregistré." },
        { status: 400 }
      );
    }

    // Hacher le mot de passe
    const passwordHash = hashPassword(password);

    // Créer l'utilisateur
    const newUser = await db.createUser({
      name,
      email: emailLower,
      passwordHash
    });

    // Créer la session
    const token = signToken({ userId: newUser.id, email: newUser.email });

    // Créer la réponse et attacher le cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        plan: newUser.plan
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
  } catch (error: any) {
    console.error("Erreur d'inscription:", error);
    return NextResponse.json(
      { error: error.message || "Une erreur est survenue lors de l'inscription." },
      { status: 500 }
    );
  }
}
