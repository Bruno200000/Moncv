import React from 'react';
import Link from 'next/link';
import { HelpCircle, ArrowLeft, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-base-300 flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Decorative Glow background */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/10 blur-[120px] pointer-events-none" />

      <div className="card max-w-md w-full bg-base-200 border border-base-content/10 shadow-2xl p-8 rounded-2xl text-center z-10">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-secondary/10 text-secondary rounded-full">
            <HelpCircle className="w-12 h-12 animate-bounce" />
          </div>
        </div>

        <h1 className="text-6xl font-black text-primary mb-2">404</h1>
        <h2 className="text-xl font-bold mb-3">Page introuvable</h2>
        <p className="text-sm text-base-content/60 mb-8 leading-relaxed">
          Le document ou la page que vous recherchez n&apos;existe pas ou a été déplacé.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/dashboard"
            className="btn btn-primary bg-gradient-to-r from-primary to-secondary text-primary-content border-none rounded-xl normal-case flex-1"
          >
            <Home className="w-4 h-4 mr-1.5" /> Tableau de bord
          </Link>
          <Link
            href="/"
            className="btn btn-outline rounded-xl normal-case flex-1"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
