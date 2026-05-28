import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const user = await getSessionUser();
    
    if (!user) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    // Calculer le nombre de CVs existants
    const cvs = db.getCVs(user.id);
    const cvsCount = cvs.length;

    // Déterminer la limite de CVs en fonction du plan
    let limit = 3;
    if (user.plan === 'premium') {
      limit = 10;
    } else if (user.plan === 'vip') {
      limit = 9999; // Illimité
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        cvsCount,
        limit
      }
    });
  } catch (error) {
    console.error("Erreur de récupération de session:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la vérification de session." },
      { status: 500 }
    );
  }
}
