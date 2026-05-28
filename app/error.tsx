"use client"
import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertOctagon, RotateCcw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Erreur globale capturée:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-base-300 flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Decorative Glow background */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-error/10 blur-[120px] pointer-events-none" />

      <div className="card max-w-lg w-full bg-base-200 border border-base-content/10 shadow-2xl p-8 rounded-2xl text-center z-10">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-error/10 text-error rounded-full animate-pulse">
            <AlertOctagon className="w-12 h-12" />
          </div>
        </div>

        <h1 className="text-2xl font-black mb-3">Une erreur inattendue est survenue</h1>
        <p className="text-sm text-base-content/60 mb-6 leading-relaxed">
          Nous nous excusons pour ce désagrément. L&apos;application a rencontré un problème lors du chargement des composants requis.
        </p>

        {error.message && (
          <div className="bg-base-300 p-4 rounded-xl text-left font-mono text-xs text-error/85 mb-6 overflow-auto max-h-[150px] border border-error/5">
            <strong>Détails de l&apos;erreur :</strong>
            <p className="mt-1 break-all">{error.message}</p>
            {error.digest && <p className="mt-1 text-[10px] text-base-content/30">Digest: {error.digest}</p>}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => reset()}
            className="btn btn-primary flex-1 bg-gradient-to-r from-primary to-secondary text-primary-content border-none rounded-xl normal-case"
          >
            <RotateCcw className="w-4 h-4 mr-1.5" /> Réessayer
          </button>
          
          <Link
            href="/dashboard"
            className="btn btn-outline flex-1 rounded-xl normal-case"
          >
            <Home className="w-4 h-4 mr-1.5" /> Tableau de Bord
          </Link>
        </div>
      </div>
    </div>
  );
}
