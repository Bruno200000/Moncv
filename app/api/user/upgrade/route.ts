import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { error: "Vous devez être connecté pour effectuer cette action." },
        { status: 401 }
      );
    }

    const { plan } = await request.json();

    if (!plan || !['free', 'premium', 'vip'].includes(plan)) {
      return NextResponse.json(
        { error: "Plan invalide." },
        { status: 400 }
      );
    }

    // Mettre à jour le plan de l'utilisateur dans la base
    const updatedUser = db.updateUserPlan(user.id, plan);

    return NextResponse.json({
      success: true,
      message: `Votre forfait a été mis à niveau avec succès vers le forfait ${plan.toUpperCase()} !`,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        plan: updatedUser.plan
      }
    });
  } catch (error: any) {
    console.error("Erreur de mise à niveau du forfait:", error);
    return NextResponse.json(
      { error: error.message || "Une erreur est survenue lors de la mise à niveau." },
      { status: 500 }
    );
  }
}
