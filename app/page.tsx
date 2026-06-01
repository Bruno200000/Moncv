"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  FileText, Check, ArrowRight, Sparkles, Crown, 
  Zap, Lock, LayoutTemplate, Download, CheckCircle2 
} from 'lucide-react';

const PREMIUM_PAYMENT_URL = 'https://pay.wave.com/m/M_ci_x9IzJZ0zY6sa/c/ci/?amount=1000';
const VIP_PAYMENT_URL = 'https://pay.wave.com/m/M_ci_x9IzJZ0zY6sa/c/ci/?amount=3000';

const buildPaymentUrl = (url: string, plan: 'premium' | 'vip') => {
  return url;
};

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
      <header className="navbar min-h-16 flex-wrap gap-3 bg-base-200/40 backdrop-blur-xl border-b border-base-content/10 px-4 sm:px-6 lg:px-12 sticky top-0 z-50 transition-all duration-300">
        <div className="min-w-0 flex-1">
          <Link href="/" className="block truncate text-xl sm:text-2xl font-extrabold italic select-none">
            Mon<span className="text-primary bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">CV</span>
          </Link>
        </div>
        
        <div className="flex-none gap-6 hidden md:flex text-sm font-medium">
          <a href="#features" className="hover:text-primary transition-colors">Fonctionnalités</a>
          <a href="#pricing" className="hover:text-primary transition-colors">Tarifs</a>
        </div>

        <div className="ml-auto flex max-w-full flex-none gap-2">
          {loading ? (
            <div className="w-20 h-8 rounded-lg bg-base-200 animate-pulse"></div>
          ) : session ? (
            <Link 
              href="/dashboard" 
              className="btn btn-primary btn-sm sm:btn-md max-w-[58vw] sm:max-w-none bg-gradient-to-r from-primary to-secondary text-primary-content border-none normal-case rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.03] active:scale-[0.97] transition-all"
            >
              <span className="truncate sm:hidden">Tableau</span>
              <span className="hidden truncate sm:inline">Mon Tableau de Bord</span>
              <ArrowRight className="w-4 h-4 shrink-0 sm:ml-1" />
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
      <section className="hero min-h-[85vh] px-4 sm:px-8 lg:px-12 relative flex items-center justify-center">
        <div className="hero-content w-full text-center max-w-4xl flex-col lg:flex-row gap-12 z-10 py-10 sm:py-12">
          <div className="min-w-0 w-full">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black leading-tight tracking-tight mb-6 break-words">
              Créez un CV qui vous{' '}
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                démarque
              </span>
            </h1>
            
            <p className="text-base sm:text-xl text-base-content/75 max-w-2xl mx-auto mb-8 leading-relaxed break-words">
              MonCV est l'outil ultime de création de curriculum vitae moderne. Choisissez un thème, complétez vos informations et téléchargez un PDF professionnel en quelques clics.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-4">
              <Link 
                href={session ? "/dashboard" : "/register"} 
                className="btn btn-primary min-h-12 h-auto sm:btn-lg bg-gradient-to-r from-primary via-secondary to-accent text-primary-content border-none px-5 sm:px-8 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.03] active:scale-[0.97] transition-all w-full sm:w-auto whitespace-normal text-center"
              >
                Créer mon CV gratuitement <ArrowRight className="w-5 h-5 ml-1" />
              </Link>
              <a 
                href="#pricing" 
                className="btn btn-outline min-h-12 h-auto sm:btn-lg rounded-2xl w-full sm:w-auto hover:bg-base-200/50 hover:text-base-content whitespace-normal"
              >
                Consulter les tarifs
              </a>
            </div>

            {/* Float Screen Preview mockup */}
            <div className="mt-12 sm:mt-16 relative mx-auto w-full max-w-3xl rounded-2xl border border-base-content/10 bg-base-200/50 backdrop-blur-md p-3 sm:p-4 shadow-2xl group overflow-hidden">
              <div className="absolute top-2 left-4 flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-error/30"></span>
                <span className="w-3 h-3 rounded-full bg-warning/30"></span>
                <span className="w-3 h-3 rounded-full bg-success/30"></span>
              </div>
              <div className="absolute top-2 right-4 text-[10px] text-base-content/30 select-none">monCv.pdf</div>
              
              <div className="mt-4 aspect-[4/3] sm:aspect-[16/9] w-full rounded-lg bg-base-300 border border-base-content/5 flex items-center justify-center p-3 sm:p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.16),transparent_26%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.1),transparent_24%)]" />
                <div className="relative h-full w-full max-w-2xl overflow-hidden">
                  <div className="moncv-template-carousel flex h-full items-center gap-5">
                    {[
                      { name: 'Executive', side: true, soft: 'bg-primary/15', medium: 'bg-primary/30', strong: 'bg-primary/40', line: 'bg-primary/50', title: 'bg-primary/55', panel: 'bg-primary/20' },
                      { name: 'Minimal', side: false, soft: 'bg-accent/15', medium: 'bg-accent/30', strong: 'bg-accent/35', line: 'bg-accent/40', title: 'bg-accent/55', panel: 'bg-accent/20' },
                      { name: 'Corporate', side: true, soft: 'bg-secondary/15', medium: 'bg-secondary/30', strong: 'bg-secondary/40', line: 'bg-secondary/50', title: 'bg-secondary/55', panel: 'bg-secondary/20' },
                      { name: 'Executive', side: true, soft: 'bg-primary/15', medium: 'bg-primary/30', strong: 'bg-primary/40', line: 'bg-primary/50', title: 'bg-primary/55', panel: 'bg-primary/20' },
                      { name: 'Minimal', side: false, soft: 'bg-accent/15', medium: 'bg-accent/30', strong: 'bg-accent/35', line: 'bg-accent/40', title: 'bg-accent/55', panel: 'bg-accent/20' },
                      { name: 'Corporate', side: true, soft: 'bg-secondary/15', medium: 'bg-secondary/30', strong: 'bg-secondary/40', line: 'bg-secondary/50', title: 'bg-secondary/55', panel: 'bg-secondary/20' },
                    ].map((model, index) => (
                      <div
                        key={`${model.name}-${index}`}
                        className="h-[88%] w-[190px] shrink-0 rounded-lg bg-base-100 p-3 text-left shadow-2xl ring-1 ring-base-content/10"
                      >
                        {model.side ? (
                          <div className="flex h-full gap-3">
                            <div className={`w-[38%] rounded-md ${model.soft} p-2`}>
                              <div className={`mx-auto mb-3 h-9 w-9 rounded-full ${model.strong}`} />
                              <div className={`mb-2 h-2 rounded ${model.line}`} />
                              <div className="mb-1.5 h-1.5 rounded bg-base-content/20" />
                              <div className="mb-1.5 h-1.5 w-4/5 rounded bg-base-content/15" />
                              <div className="mt-5 space-y-1.5">
                                <div className={`h-1.5 rounded ${model.line}`} />
                                <div className={`h-1.5 w-3/4 rounded ${model.medium}`} />
                              </div>
                            </div>
                            <div className="flex-1 py-1">
                              <div className="mb-1 h-3 rounded bg-base-content/35" />
                              <div className={`mb-4 h-2 w-2/3 rounded ${model.title}`} />
                              <div className="space-y-1.5">
                                <div className="h-1.5 rounded bg-base-content/20" />
                                <div className="h-1.5 rounded bg-base-content/15" />
                                <div className="h-1.5 w-4/5 rounded bg-base-content/15" />
                              </div>
                              <div className="mt-5 space-y-2">
                                <div className={`h-2 w-1/2 rounded ${model.line}`} />
                                <div className="h-1.5 rounded bg-base-content/15" />
                                <div className="h-1.5 w-5/6 rounded bg-base-content/15" />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex h-full flex-col items-center p-2">
                            <div className={`mb-3 h-10 w-10 rounded-full ${model.strong}`} />
                            <div className="mb-1.5 h-3 w-3/4 rounded bg-base-content/35" />
                            <div className={`mb-5 h-2 w-1/2 rounded ${model.title}`} />
                            <div className="w-full space-y-1.5">
                              <div className="h-1.5 rounded bg-base-content/20" />
                              <div className="h-1.5 rounded bg-base-content/15" />
                              <div className="h-1.5 w-5/6 rounded bg-base-content/15" />
                            </div>
                            <div className="mt-5 grid w-full grid-cols-2 gap-2">
                              <div className={`h-8 rounded-md ${model.panel}`} />
                              <div className="h-8 rounded-md bg-base-200" />
                            </div>
                            <span className="mt-auto text-[10px] font-bold uppercase tracking-wide text-base-content/35">
                              {model.name}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating tags */}
                <div className="absolute top-4 right-4 hidden sm:flex bg-base-200/90 border border-base-content/10 rounded-xl px-3 py-2 text-xs font-semibold items-center gap-1.5 shadow-md backdrop-blur animate-bounce duration-1000">
                  <Zap className="w-3.5 h-3.5 text-secondary" /> Modèles en temps réel
                </div>

                <div className="absolute bottom-4 left-4 hidden sm:flex bg-base-200/90 border border-base-content/10 rounded-xl px-3 py-2 text-xs font-semibold items-center gap-1.5 shadow-md backdrop-blur animate-pulse">
                  <LayoutTemplate className="w-3.5 h-3.5 text-primary" /> 30+ Thèmes
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-24 bg-base-200/50 border-y border-base-content/5 px-4 sm:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black mb-4 break-words">Pourquoi choisir MonCV ?</h2>
            <p className="text-sm sm:text-base text-base-content/60 max-w-xl mx-auto">
              Une suite complète d'outils optimisés pour maximiser vos chances d'obtenir des entretiens.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Feature 1 */}
            <div className="card bg-base-100 border border-base-content/5 p-6 sm:p-8 rounded-2xl hover:shadow-xl hover:scale-[1.02] transition-all duration-300 break-words">
              <div className="p-3 bg-primary/10 text-primary w-fit rounded-xl mb-6">
                <LayoutTemplate className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Thèmes DaisyUI</h3>
              <p className="text-sm text-base-content/70 leading-relaxed">
                Profitez de plus de 30 thèmes (Sunset, Dark, Valentine, Cupcake...) pour accorder votre CV à votre personnalité ou au secteur ciblé.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card bg-base-100 border border-base-content/5 p-6 sm:p-8 rounded-2xl hover:shadow-xl hover:scale-[1.02] transition-all duration-300 break-words">
              <div className="p-3 bg-secondary/10 text-secondary w-fit rounded-xl mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Sauvegarde Automatique</h3>
              <p className="text-sm text-base-content/70 leading-relaxed">
                Ne perdez plus jamais vos saisies. Notre éditeur synchronise automatiquement vos modifications dans la base locale toutes les secondes.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card bg-base-100 border border-base-content/5 p-6 sm:p-8 rounded-2xl hover:shadow-xl hover:scale-[1.02] transition-all duration-300 break-words">
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
      <section id="pricing" className="py-20 sm:py-24 px-4 sm:px-8 lg:px-12 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-black mb-4 break-words">Des tarifs simples et transparents</h2>
          <p className="text-sm sm:text-base text-base-content/60 max-w-xl mx-auto">
            Commencez gratuitement, puis passez à la vitesse supérieure quand vous en avez besoin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          
          {/* Free Card */}
          <div className="card bg-base-200 border border-base-content/10 p-6 sm:p-8 rounded-3xl flex flex-col justify-between hover:shadow-lg transition-all break-words">
            <div>
              <span className="text-xs uppercase font-extrabold text-base-content/40 tracking-wider">Essai</span>
              <h3 className="text-2xl font-bold mt-1 mb-4">Gratuit</h3>
              
              <div className="flex flex-wrap items-baseline gap-x-1 mb-6">
                <span className="text-3xl sm:text-4xl font-extrabold">0 FCFA</span>
                <span className="text-xs text-base-content/60 ml-1">/ à vie</span>
              </div>
              
              <p className="text-sm text-base-content/60 mb-6">
                Idéal pour découvrir l'interface et construire un premier CV de base.
              </p>

              <hr className="border-base-content/10 my-6" />

              <ul className="space-y-3.5 text-sm mb-8">
                <li className="flex items-start gap-3 text-base-content/80">
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0" /> Jusqu'à 3 CVs maximum
                </li>
                <li className="flex items-start gap-3 text-base-content/80">
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0" /> Accès aux modèles standards
                </li>
                <li className="flex items-start gap-3 text-base-content/80">
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0" /> Export PDF standard
                </li>
              </ul>
            </div>

            <Link 
              href={session ? "/dashboard" : "/register"} 
              className="btn btn-outline btn-block h-auto min-h-11 rounded-xl normal-case whitespace-normal"
            >
              {session ? "Accéder au tableau" : "Commencer l'essai"}
            </Link>
          </div>

          {/* Premium Card */}
          <div className="card bg-base-200 border-2 border-primary p-6 sm:p-8 rounded-3xl flex flex-col justify-between shadow-xl relative hover:shadow-2xl transition-all break-words">
            <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 badge badge-primary gap-1 py-3 px-4 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Populaire
            </div>

            <div>
              <span className="text-xs uppercase font-extrabold text-primary tracking-wider mt-2 block">Premium</span>
              <h3 className="text-2xl font-bold mt-1 mb-4">Accès Plus</h3>
              
              <div className="flex flex-wrap items-baseline gap-x-1 mb-6">
                <span className="text-3xl sm:text-4xl font-extrabold text-primary">1 000 FCFA</span>
                <span className="text-xs text-base-content/60 ml-1">/ mois</span>
              </div>
              
              <p className="text-sm text-base-content/60 mb-6">
                Le choix privilégié des candidats pour multiplier leurs CVs et adapter leurs thèmes.
              </p>

              <hr className="border-base-content/10 my-6" />

              <ul className="space-y-3.5 text-sm mb-8">
                <li className="flex items-start gap-3 text-base-content/85">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> Jusqu'à 10 CVs simultanés
                </li>
                <li className="flex items-start gap-3 text-base-content/85">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> Accès à tous les 30+ thèmes
                </li>
                <li className="flex items-start gap-3 text-base-content/85">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> Duplication de CV en un clic
                </li>
                <li className="flex items-start gap-3 text-base-content/85">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> Support client 24h par email
                </li>
              </ul>
            </div>

            {session ? (
              session.plan === 'premium' ? (
                <button disabled className="btn btn-primary btn-block h-auto min-h-11 rounded-xl normal-case whitespace-normal">
                  Forfait actuel
                </button>
              ) : (
                <a
                  href={buildPaymentUrl(PREMIUM_PAYMENT_URL, 'premium')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary h-auto min-h-11 bg-gradient-to-r from-primary to-secondary text-primary-content border-none btn-block rounded-xl normal-case shadow-lg shadow-primary/10 whitespace-normal"
                >
                  Payer 1 000 FCFA
                </a>
              )
            ) : (
              <Link
                href="/register?next=/dashboard&create=1"
                className="btn btn-primary h-auto min-h-11 bg-gradient-to-r from-primary to-secondary text-primary-content border-none btn-block rounded-xl normal-case shadow-lg shadow-primary/10 whitespace-normal"
              >
                Créer un compte pour payer
              </Link>
            )}
          </div>

          {/* VIP Card */}
          <div className="card bg-neutral text-neutral-content border border-neutral-content/10 p-6 sm:p-8 rounded-3xl flex flex-col justify-between hover:shadow-lg transition-all break-words">
            <div>
              <span className="text-xs uppercase font-extrabold text-warning tracking-wider block">VIP</span>
              <h3 className="text-2xl font-bold mt-1 mb-4 text-warning">Accès Illimité</h3>
              
              <div className="flex flex-wrap items-baseline gap-x-1 mb-6">
                <span className="text-3xl sm:text-4xl font-extrabold text-warning">3 000 FCFA</span>
                <span className="text-xs text-neutral-content/60 ml-1">/ mois</span>
              </div>
              
              <p className="text-sm text-neutral-content/60 mb-6">
                La formule ultime pour les agences, consultants, ou demandeurs d'emploi actifs.
              </p>

              <hr className="border-neutral-content/10 my-6" />

              <ul className="space-y-3.5 text-sm mb-8">
                <li className="flex items-start gap-3 text-neutral-content/90">
                  <Crown className="w-5 h-5 text-warning shrink-0" /> CVs illimités
                </li>
                <li className="flex items-start gap-3 text-neutral-content/90">
                  <Crown className="w-5 h-5 text-warning shrink-0" /> Accès aux thèmes VIP exclusifs
                </li>
                <li className="flex items-start gap-3 text-neutral-content/90">
                  <Crown className="w-5 h-5 text-warning shrink-0" /> Export PDF HD sans filigrane
                </li>
                <li className="flex items-start gap-3 text-neutral-content/90">
                  <Crown className="w-5 h-5 text-warning shrink-0" /> Support prioritaire VIP 24/7
                </li>
              </ul>
            </div>

            {session ? (
              session.plan === 'vip' ? (
                <button disabled className="btn btn-warning btn-block h-auto min-h-11 rounded-xl normal-case whitespace-normal">
                  Forfait actuel
                </button>
              ) : (
                <a
                  href={buildPaymentUrl(VIP_PAYMENT_URL, 'vip')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-warning h-auto min-h-11 text-neutral bg-gradient-to-r from-warning to-amber-500 border-none btn-block rounded-xl normal-case shadow-md hover:scale-[1.01] whitespace-normal"
                >
                  Payer 3 000 FCFA
                </a>
              )
            ) : (
              <Link
                href="/register?next=/dashboard&create=1"
                className="btn btn-warning h-auto min-h-11 text-neutral bg-gradient-to-r from-warning to-amber-500 border-none btn-block rounded-xl normal-case shadow-md hover:scale-[1.01] whitespace-normal"
              >
                Créer un compte pour payer
              </Link>
            )}
          </div>

        </div>
      </section>

      {/* Call to Action Footer Area */}
      <section className="py-20 px-4 sm:px-8 lg:px-12 bg-gradient-to-br from-base-200 to-base-300 relative overflow-hidden text-center">
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
        <div className="max-w-2xl mx-auto z-10 relative">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 break-words">Prêt à propulser votre carrière ?</h2>
          <p className="text-sm sm:text-base text-base-content/60 mb-8 max-w-lg mx-auto">
            Créez votre compte en moins d'une minute et générez votre CV dès aujourd'hui. Aucune carte bancaire requise.
          </p>
          <Link 
            href={session ? "/dashboard" : "/register"} 
            className="btn btn-primary h-auto min-h-12 bg-gradient-to-r from-primary to-secondary text-primary-content border-none px-5 sm:px-8 rounded-2xl shadow-xl shadow-primary/20 normal-case whitespace-normal"
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
