import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json({ success: true, message: "Déconnexion réussie." });
    
    // Supprimer le cookie de session en le mettant à expirer immédiatement
    response.cookies.set('moncv_session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0 // Expire immédiatement
    });

    return response;
  } catch (error) {
    console.error("Erreur de déconnexion:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la déconnexion." },
      { status: 500 }
    );
  }
}
