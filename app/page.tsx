"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  FileText, Check, ArrowRight, Sparkles, Crown, 
  Zap, Lock, LayoutTemplate, Download, CheckCircle2 
} from 'lucide-react';

interface UserSession {
  id: string;
  name: string;
  plan: string;
}

export default function LandingPage() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté pour adapter la navigation
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setSession(data.user);
        }
      })
      .catch((err) => console.error("Erreur de session :", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-base-300 text-base-content font-sans overflow-x-hidden relative selection:bg-primary selection:text-primary-content">
      {/* Decorative Glow Elements */}
      <div className="absolute top-[-10%] left-[-15%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[130px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[10%] w-[50%] h-[50%] rounded-full bg-accent/5 blur-[130px] pointer-events-none" />

      {/* Header / Navbar */}
      <header className="navbar bg-base-200/40 backdrop-blur-xl border-b border-base-content/10 px-6 sm:px-12 sticky top-0 z-50 transition-all duration-300">
        <div className="flex-1">
          <Link href="/" className="text-2xl font-extrabold italic select-none">
            Mon<span className="text-primary bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">CV</span>
          </Link>
        </div>
        
        <div className="flex-none gap-6 hidden md:flex text-sm font-medium">
          <a href="#features" className="hover:text-primary transition-colors">Fonctionnalités</a>
          <a href="#pricing" className="hover:text-primary transition-colors">Tarifs</a>
        </div>

        <div className="flex-none ml-6 gap-2">
          {loading ? (
            <div className="w-20 h-8 rounded-lg bg-base-200 animate-pulse"></div>
          ) : session ? (
            <Link 
              href="/dashboard" 
              className="btn btn-primary bg-gradient-to-r from-primary to-secondary text-primary-content border-none normal-case rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.03] active:scale-[0.97] transition-all"
            >
              Mon Tableau de Bord <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost btn-sm text-sm normal-case rounded-lg">
                Connexion
              </Link>
              <Link 
                href="/register" 
                className="btn btn-primary bg-gradient-to-r from-primary to-secondary text-primary-content border-none normal-case rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.03] active:scale-[0.97] transition-all btn-sm"
              >
                S'inscrire
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero min-h-[85vh] px-6 sm:px-12 relative flex items-center justify-center">
        <div className="hero-content text-center max-w-4xl flex-col lg:flex-row gap-12 z-10 py-12">
          <div>
            <div className="badge badge-primary badge-outline gap-1.5 py-3 px-4 text-xs font-semibold uppercase tracking-wider mb-6 animate-bounce">
              <Sparkles className="w-3.5 h-3.5" /> Propulsé par Next.js & Tailwind
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-black leading-tight tracking-tight mb-6">
              Créez un CV qui vous{' '}
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                démarque
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-base-content/75 max-w-2xl mx-auto mb-8 leading-relaxed">
              MonCV est l'outil ultime de création de curriculum vitae moderne. Choisissez un thème, complétez vos informations et téléchargez un PDF professionnel en quelques clics.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link 
                href={session ? "/dashboard" : "/register"} 
                className="btn btn-primary btn-lg bg-gradient-to-r from-primary via-secondary to-accent text-primary-content border-none px-8 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.03] active:scale-[0.97] transition-all w-full sm:w-auto"
              >
                Créer mon CV gratuitement <ArrowRight className="w-5 h-5 ml-1" />
              </Link>
              <a 
                href="#pricing" 
                className="btn btn-outline btn-lg rounded-2xl w-full sm:w-auto hover:bg-base-200/50 hover:text-base-content"
              >
                Consulter les tarifs
              </a>
            </div>

            {/* Float Screen Preview mockup */}
            <div className="mt-16 relative mx-auto max-w-3xl rounded-2xl border border-base-content/10 bg-base-200/50 backdrop-blur-md p-4 shadow-2xl group overflow-hidden">
              <div className="absolute top-2 left-4 flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-error/30"></span>
                <span className="w-3 h-3 rounded-full bg-warning/30"></span>
                <span className="w-3 h-3 rounded-full bg-success/30"></span>
              </div>
              <div className="absolute top-2 right-4 text-[10px] text-base-content/30 select-none">cv-builder-workspace.pdf</div>
              
              <div className="mt-4 aspect-[16/9] w-full rounded-lg bg-base-300 border border-base-content/5 flex items-center justify-center p-8 relative overflow-hidden">
                {/* Simulated CV elements inside preview */}
                <div className="w-2/3 h-full bg-base-100 rounded-lg shadow-lg flex p-4 text-left gap-4 scale-[0.95] sm:scale-100 transition-transform">
                  <div className="w-1/3 border-r border-base-content/10 pr-3 flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-full bg-primary/20 mb-3 animate-pulse"></div>
                      <div className="h-4 w-full bg-base-300 rounded mb-2"></div>
                      <div className="h-3 w-3/4 bg-base-200 rounded"></div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-2 w-full bg-base-200 rounded"></div>
                      <div className="h-2 w-5/6 bg-base-200 rounded"></div>
                      <div className="h-2 w-2/3 bg-base-200 rounded"></div>
                    </div>
                  </div>
                  <div className="w-2/3 flex flex-col justify-between pl-1">
                    <div>
                      <div className="h-5 w-2/3 bg-primary/20 rounded mb-4"></div>
                      <div className="space-y-2">
                        <div className="h-3 w-full bg-base-300 rounded"></div>
                        <div className="h-3 w-5/6 bg-base-200 rounded"></div>
                        <div className="h-3 w-4/5 bg-base-200 rounded"></div>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <div className="h-4 w-12 rounded bg-secondary/20"></div>
                      <div className="h-4 w-12 rounded bg-accent/20"></div>
                    </div>
                  </div>
                </div>

                {/* Floating tags */}
                <div className="absolute top-10 right-10 bg-base-200/90 border border-base-content/10 rounded-xl px-3 py-2 text-xs font-semibold flex items-center gap-1.5 shadow-md backdrop-blur animate-bounce duration-1000">
                  <Zap className="w-3.5 h-3.5 text-secondary" /> Modèles en temps réel
                </div>

                <div className="absolute bottom-10 left-10 bg-base-200/90 border border-base-content/10 rounded-xl px-3 py-2 text-xs font-semibold flex items-center gap-1.5 shadow-md backdrop-blur animate-pulse">
                  <LayoutTemplate className="w-3.5 h-3.5 text-primary" /> 30+ Thèmes
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-base-200/50 border-y border-base-content/5 px-6 sm:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black mb-4">Pourquoi choisir MonCV ?</h2>
            <p className="text-sm sm:text-base text-base-content/60 max-w-xl mx-auto">
              Une suite complète d'outils optimisés pour maximiser vos chances d'obtenir des entretiens.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card bg-base-100 border border-base-content/5 p-8 rounded-2xl hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
              <div className="p-3 bg-primary/10 text-primary w-fit rounded-xl mb-6">
                <LayoutTemplate className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Thèmes DaisyUI</h3>
              <p className="text-sm text-base-content/70 leading-relaxed">
                Profitez de plus de 30 thèmes (Sunset, Dark, Valentine, Cupcake...) pour accorder votre CV à votre personnalité ou au secteur ciblé.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card bg-base-100 border border-base-content/5 p-8 rounded-2xl hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
              <div className="p-3 bg-secondary/10 text-secondary w-fit rounded-xl mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Sauvegarde Automatique</h3>
              <p className="text-sm text-base-content/70 leading-relaxed">
                Ne perdez plus jamais vos saisies. Notre éditeur synchronise automatiquement vos modifications dans la base locale toutes les secondes.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card bg-base-100 border border-base-content/5 p-8 rounded-2xl hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
              <div className="p-3 bg-accent/10 text-accent w-fit rounded-xl mb-6">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Téléchargement PDF</h3>
              <p className="text-sm text-base-content/70 leading-relaxed">
                Générez des documents PDF parfaitement proportionnés au format A4 en haute définition, immédiatement prêts à être envoyés.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 sm:px-12 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-black mb-4">Des tarifs simples et transparents</h2>
          <p className="text-sm sm:text-base text-base-content/60 max-w-xl mx-auto">
            Commencez gratuitement, puis passez à la vitesse supérieure quand vous en avez besoin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* Free Card */}
          <div className="card bg-base-200 border border-base-content/10 p-8 rounded-3xl flex flex-col justify-between hover:shadow-lg transition-all">
            <div>
              <span className="text-xs uppercase font-extrabold text-base-content/40 tracking-wider">Essai</span>
              <h3 className="text-2xl font-bold mt-1 mb-4">Gratuit</h3>
              
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-extrabold">0 FCFA</span>
                <span className="text-xs text-base-content/60 ml-1">/ à vie</span>
              </div>
              
              <p className="text-sm text-base-content/60 mb-6">
                Idéal pour découvrir l'interface et construire un premier CV de base.
              </p>

              <hr className="border-base-content/10 my-6" />

              <ul className="space-y-3.5 text-sm mb-8">
                <li className="flex items-center gap-3 text-base-content/80">
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0" /> Jusqu'à 3 CVs maximum
                </li>
                <li className="flex items-center gap-3 text-base-content/80">
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0" /> Accès aux modèles standards
                </li>
                <li className="flex items-center gap-3 text-base-content/80">
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0" /> Export PDF standard
                </li>
              </ul>
            </div>

            <Link 
              href={session ? "/dashboard" : "/register"} 
              className="btn btn-outline btn-block rounded-xl normal-case"
            >
              {session ? "Accéder au tableau" : "Commencer l'essai"}
            </Link>
          </div>

          {/* Premium Card */}
          <div className="card bg-base-200 border-2 border-primary p-8 rounded-3xl flex flex-col justify-between shadow-xl relative hover:shadow-2xl transition-all">
            <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 badge badge-primary gap-1 py-3 px-4 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Populaire
            </div>

            <div>
              <span className="text-xs uppercase font-extrabold text-primary tracking-wider mt-2 block">Premium</span>
              <h3 className="text-2xl font-bold mt-1 mb-4">Accès Plus</h3>
              
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-extrabold text-primary">500 FCFA</span>
                <span className="text-xs text-base-content/60 ml-1">/ mois</span>
              </div>
              
              <p className="text-sm text-base-content/60 mb-6">
                Le choix privilégié des candidats pour multiplier leurs CVs et adapter leurs thèmes.
              </p>

              <hr className="border-base-content/10 my-6" />

              <ul className="space-y-3.5 text-sm mb-8">
                <li className="flex items-center gap-3 text-base-content/85">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> **Jusqu'à 10 CVs** simultanés
                </li>
                <li className="flex items-center gap-3 text-base-content/85">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> Accès à **tous les 30+ thèmes**
                </li>
                <li className="flex items-center gap-3 text-base-content/85">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> Duplication de CV en un clic
                </li>
                <li className="flex items-center gap-3 text-base-content/85">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> Support client 24h par email
                </li>
              </ul>
            </div>

            <Link 
              href={session ? "/dashboard" : "/register"} 
              className="btn btn-primary bg-gradient-to-r from-primary to-secondary text-primary-content border-none btn-block rounded-xl normal-case shadow-lg shadow-primary/10"
            >
              {session ? "Changer de forfait" : "Obtenir l'Accès Premium"}
            </Link>
          </div>

          {/* VIP Card */}
          <div className="card bg-neutral text-neutral-content border border-neutral-content/10 p-8 rounded-3xl flex flex-col justify-between hover:shadow-lg transition-all">
            <div>
              <span className="text-xs uppercase font-extrabold text-warning tracking-wider block">VIP</span>
              <h3 className="text-2xl font-bold mt-1 mb-4 text-warning">Accès Illimité</h3>
              
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-extrabold text-warning">3 000 FCFA</span>
                <span className="text-xs text-neutral-content/60 ml-1">/ mois</span>
              </div>
              
              <p className="text-sm text-neutral-content/60 mb-6">
                La formule ultime pour les agences, consultants, ou demandeurs d'emploi actifs.
              </p>

              <hr className="border-neutral-content/10 my-6" />

              <ul className="space-y-3.5 text-sm mb-8">
                <li className="flex items-center gap-3 text-neutral-content/90">
                  <Crown className="w-5 h-5 text-warning shrink-0" /> **CVs illimités**
                </li>
                <li className="flex items-center gap-3 text-neutral-content/90">
                  <Crown className="w-5 h-5 text-warning shrink-0" /> Accès aux thèmes VIP exclusifs
                </li>
                <li className="flex items-center gap-3 text-neutral-content/90">
                  <Crown className="w-5 h-5 text-warning shrink-0" /> **Export PDF HD sans filigrane**
                </li>
                <li className="flex items-center gap-3 text-neutral-content/90">
                  <Crown className="w-5 h-5 text-warning shrink-0" /> Support prioritaire VIP 24/7
                </li>
              </ul>
            </div>

            <Link 
              href={session ? "/dashboard" : "/register"} 
              className="btn btn-warning text-neutral bg-gradient-to-r from-warning to-amber-500 border-none btn-block rounded-xl normal-case shadow-md hover:scale-[1.01]"
            >
              {session ? "Changer de forfait" : "Devenir membre VIP"}
            </Link>
          </div>

        </div>
      </section>

      {/* Call to Action Footer Area */}
      <section className="py-20 px-6 sm:px-12 bg-gradient-to-br from-base-200 to-base-300 relative overflow-hidden text-center">
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
        <div className="max-w-2xl mx-auto z-10 relative">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Prêt à propulser votre carrière ?</h2>
          <p className="text-sm sm:text-base text-base-content/60 mb-8 max-w-lg mx-auto">
            Créez votre compte en moins d'une minute et générez votre CV dès aujourd'hui. Aucune carte bancaire requise.
          </p>
          <Link 
            href={session ? "/dashboard" : "/register"} 
            className="btn btn-primary bg-gradient-to-r from-primary to-secondary text-primary-content border-none px-8 rounded-2xl shadow-xl shadow-primary/20 normal-case"
          >
            Commencer gratuitement <ArrowRight className="w-5 h-5 ml-1" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer footer-center p-10 bg-base-200 border-t border-base-content/10 text-base-content/60 text-sm">
        <div>
          <span className="text-xl font-bold italic select-none text-base-content mb-2 block">
            Mon<span className="text-primary bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">CV</span>
          </span>
          <p>© 2026 MonCV SaaS. Tous droits réservés.</p>
          <p className="text-xs text-base-content/40 mt-1">Conçu localement pour une expérience ultra rapide.</p>
        </div>
      </footer>
    </div>
  );
}
