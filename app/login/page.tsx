"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, LogIn, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';

const authInputClass = "input w-full border-0 bg-base-100 pl-10 shadow-sm outline-none transition-all duration-200 focus:border-0 focus:outline-none focus:ring-0 focus:bg-base-100 focus:shadow-md rounded-xl";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue lors de la connexion.");
      }

      router.push(data.redirectTo || '/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-base-300 font-sans text-base-content">
      <div className="mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden flex-col justify-between bg-[#071116] p-10 text-white lg:flex">
          <Link href="/" className="text-3xl font-extrabold italic">
            Mon<span className="text-primary">CV</span>
          </Link>

          <div className="max-w-md">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-primary">
              <ShieldCheck className="h-4 w-4" /> Espace candidat securise
            </div>
            <h1 className="text-5xl font-black leading-tight">
              Reprenez votre CV la ou vous l'avez laisse.
            </h1>
            <p className="mt-5 text-sm leading-6 text-slate-300">
              Connectez-vous pour modifier vos contenus, choisir un modele professionnel et exporter une version prete a envoyer.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs text-slate-300">
            <div className="rounded-xl bg-white/[0.08] p-4">
              <strong className="block text-lg text-white">20+</strong>
              Modeles CV
            </div>
            <div className="rounded-xl bg-white/[0.08] p-4">
              <strong className="block text-lg text-white">PDF</strong>
              Export propre
            </div>
            <div className="rounded-xl bg-white/[0.08] p-4">
              <strong className="block text-lg text-white">Auto</strong>
              Sauvegarde
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center lg:hidden">
              <Link href="/" className="text-4xl font-extrabold italic">
                Mon<span className="text-primary">CV</span>
              </Link>
              <p className="mt-2 text-sm text-base-content/60">Connectez-vous pour gerer vos CVs.</p>
            </div>

            <div className="rounded-2xl bg-base-100/80 p-6 shadow-xl shadow-base-content/5 sm:p-8">
              <div className="mb-7">
                <p className="text-xs font-bold uppercase text-primary">Connexion</p>
                <h2 className="mt-1 text-3xl font-black">Bon retour</h2>
                <p className="mt-2 text-sm text-base-content/60">Accedez a votre tableau de bord MonCV.</p>
              </div>

              {error && (
                <div className="alert alert-error mb-4 rounded-xl py-3 text-sm shadow-sm">
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Adresse email</span>
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-base-content/40" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={authInputClass}
                      placeholder="nom@exemple.com"
                      required
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Mot de passe</span>
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-base-content/40" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`${authInputClass} pr-10`}
                      placeholder="Votre mot de passe"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 transition-colors hover:text-base-content"
                      aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary h-12 w-full rounded-xl border-none bg-gradient-to-r from-primary to-secondary text-base font-bold normal-case text-primary-content shadow-lg shadow-primary/15"
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <>
                      <LogIn className="h-5 w-5" /> Se connecter <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-base-content/60">
                Vous n'avez pas de compte ?{' '}
                <Link href="/register" className="font-bold text-primary hover:text-secondary">
                  Inscrivez-vous gratuitement
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
