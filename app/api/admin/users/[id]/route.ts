import { NextResponse } from 'next/server';
import { isAdminSession } from '@/lib/adminAuth';
import { db } from '@/lib/db';

type Params = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: Params) {
  try {
    if (!(await isAdminSession())) {
      return NextResponse.json({ error: 'Acces admin requis.' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const plan = body.plan;

    if (!['free', 'premium', 'vip'].includes(plan)) {
      return NextResponse.json({ error: 'Plan invalide.' }, { status: 400 });
    }

    const user = await db.updateUserPlan(id, plan);
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Impossible de modifier l utilisateur.' },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    if (!(await isAdminSession())) {
      return NextResponse.json({ error: 'Acces admin requis.' }, { status: 401 });
    }

    const { id } = await params;
    await db.deleteUser(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Impossible de supprimer l utilisateur.' },
      { status: 500 }
    );
  }
}
