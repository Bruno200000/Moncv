import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { canUseTemplate } from '@/lib/cvTemplates';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// Récupérer un CV spécifique
export async function GET(request: Request, { params }: RouteContext) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { error: "Non autorisé. Veuillez vous connecter." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const cv = await db.getCV(id);

    if (!cv) {
      return NextResponse.json(
        { error: "CV introuvable." },
        { status: 404 }
      );
    }

    if (cv.userId !== user.id) {
      return NextResponse.json(
        { error: "Accès refusé. Ce CV ne vous appartient pas." },
        { status: 403 }
      );
    }

    return NextResponse.json({ cv });
  } catch (error) {
    console.error("Erreur lors de la récupération du CV:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la récupération du CV." },
      { status: 500 }
    );
  }
}

// Mettre à jour un CV
export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { error: "Non autorisé. Veuillez vous connecter." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    if (body.template && !canUseTemplate(user.plan, body.template)) {
      return NextResponse.json(
        { error: "Ce modele n'est pas inclus dans votre abonnement." },
        { status: 403 }
      );
    }

    // Filtre les champs modifiables
    const allowedFields = {
      name: body.name,
      personalDetails: body.personalDetails,
      experiences: body.experiences,
      educations: body.educations,
      languages: body.languages,
      skills: body.skills,
      hobbies: body.hobbies,
      theme: body.theme,
      template: body.template,
      fontSize: body.fontSize,
    };

    const updatedCv = await db.updateCV(user.id, id, allowedFields);

    return NextResponse.json({
      success: true,
      cv: updatedCv
    });
  } catch (error: unknown) {
    console.error("Erreur lors de la mise à jour du CV:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Une erreur est survenue lors de la mise à jour." },
      { status: 400 }
    );
  }
}

// Supprimer un CV
export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { error: "Non autorisé. Veuillez vous connecter." },
        { status: 401 }
      );
    }

    const { id } = await params;
    await db.deleteCV(user.id, id);

    return NextResponse.json({
      success: true,
      message: "CV supprimé avec succès."
    });
  } catch (error: unknown) {
    console.error("Erreur lors de la suppression du CV:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Une erreur est survenue lors de la suppression." },
      { status: 400 }
    );
  }
}
