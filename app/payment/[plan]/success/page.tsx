"use client"

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CheckCircle2, Loader2, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const params = useParams();
  const plan = params.plan === 'premium' ? 'premium' : 'vip';
  const [error, setError] = useState('');

  useEffect(() => {
    const activateAndCreateCv = async () => {
      try {
        const upgradeRes = await fetch('/api/user/upgrade', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan }),
        });

        if (upgradeRes.status === 401) {
          router.replace(`/login?next=/payment/${plan}/success`);
          return;
        }

        const upgradeData = await upgradeRes.json();
        if (!upgradeRes.ok) {
          throw new Error(upgradeData.error || "Impossible d'activer votre forfait.");
        }

        const createRes = await fetch('/api/cvs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: plan === 'vip' ? 'Mon CV VIP' : 'Mon CV Premium' }),
        });
        const createData = await createRes.json();

        if (!createRes.ok) {
          throw new Error(createData.error || "Forfait activé, mais impossible de créer le CV.");
        }

        router.replace(`/builder/${createData.cv.id}`);
      } catch (err: any) {
        setError(err.message || "Une erreur est survenue après le paiement.");
      }
    };

    activateAndCreateCv();
  }, [plan, router]);

  return (
    <div className="min-h-screen bg-base-300 flex items-center justify-center p-6 text-base-content">
      <div className="max-w-md w-full rounded-2xl bg-base-200 border border-base-content/10 p-8 text-center shadow-2xl">
        {error ? (
          <>
            <ShieldAlert className="w-12 h-12 text-error mx-auto mb-4" />
            <h1 className="text-2xl font-black mb-2">Action requise</h1>
            <p className="text-sm text-base-content/65 mb-6">{error}</p>
            <Link href="/dashboard" className="btn btn-primary rounded-xl">
              Retour au tableau de bord
            </Link>
          </>
        ) : (
          <>
            <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-4" />
            <h1 className="text-2xl font-black mb-2">Paiement reçu</h1>
            <p className="text-sm text-base-content/65 mb-6">
              Activation de votre forfait et ouverture de la création de CV...
            </p>
            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
          </>
        )}
      </div>
    </div>
  );
}
