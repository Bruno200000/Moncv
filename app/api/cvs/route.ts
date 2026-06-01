import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { canUseTemplate } from '@/lib/cvTemplates';

// Lister tous les CVs de l'utilisateur connecté
export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { error: "Non autorisé. Veuillez vous connecter." },
        { status: 401 }
      );
    }

    const cvs = await db.getCVs(user.id);
    return NextResponse.json({ cvs });
  } catch (error) {
    console.error("Erreur de récupération des CVs:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la récupération des CVs." },
      { status: 500 }
    );
  }
}

// Créer un nouveau CV
export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { error: "Non autorisé. Veuillez vous connecter." },
        { status: 401 }
      );
    }

    let name = "Mon CV";
    let template = "classic";
    try {
      const body = await request.json();
      if (body.name) name = body.name;
      if (body.template) template = body.template;
    } catch (e) {
      // Ignorer si pas de corps JSON (par exemple création par défaut)
    }

    if (!canUseTemplate(user.plan, template)) {
      return NextResponse.json(
        { error: "Ce modele n'est pas inclus dans votre abonnement." },
        { status: 403 }
      );
    }

    const newCv = await db.createCV(user.id, name, template);

    return NextResponse.json({
      success: true,
      cv: newCv
    });
  } catch (error: any) {
    console.error("Erreur de création de CV:", error);
    return NextResponse.json(
      { error: error.message || "Une erreur est survenue lors de la création du CV." },
      { status: 400 } // Retourne 400 en cas de dépassement de limite
    );
  }
}
