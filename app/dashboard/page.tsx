"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FileText, Plus, LogOut, Settings, Award, 
  Trash2, Copy, Edit3, ShieldAlert, Sparkles, Check, Crown
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CV {
  id: string;
  name: string;
  updatedAt: string;
  personalDetails: any;
  experiences: any[];
  educations: any[];
  languages: any[];
  skills: any[];
  hobbies: any[];
  theme: string;
  template?: string;
}

interface UserSession {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'premium' | 'vip';
  cvsCount: number;
  limit: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [cvs, setCvs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // States for new CV Modal
  const [newCvName, setNewCvName] = useState('');
  const [creatingCv, setCreatingCv] = useState(false);
  
  // Upgrade Modal status
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradingPlan, setUpgradingPlan] = useState<string | null>(null);

  // Charger la session et les CVs
  const fetchData = async () => {
    try {
      // 1. Session check
      const sessionRes = await fetch('/api/auth/session');
      const sessionData = await sessionRes.json();
      
      if (!sessionRes.ok || !sessionData.authenticated) {
        router.push('/login');
        return;
      }
      
      setUser(sessionData.user);

      // 2. Load CVs list
      const cvsRes = await fetch('/api/cvs');
      if (cvsRes.ok) {
        const cvsData = await cvsRes.json();
        setCvs(cvsData.cvs || []);
      }
    } catch (err) {
      console.error("Erreur de chargement des données :", err);
      setError("Impossible de charger vos données.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      console.error("Erreur de déconnexion :", err);
    }
  };

  const handleCreateCv = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCvName.trim()) return;

    setCreatingCv(true);
    setError('');

    try {
      const res = await fetch('/api/cvs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCvName.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Si limite atteinte, on propose l'upgrade
        if (res.status === 400 && data.error?.includes('Limite')) {
          setShowUpgradeModal(true);
          const modal = document.getElementById('new_cv_modal') as HTMLDialogElement;
          if (modal) modal.close();
          throw new Error(data.error);
        }
        throw new Error(data.error || "Impossible de créer le CV.");
      }

      // Fermer le modal
      const modal = document.getElementById('new_cv_modal') as HTMLDialogElement;
      if (modal) modal.close();
      setNewCvName('');

      // Rediriger vers l'éditeur
      router.push(`/builder/${data.cv.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreatingCv(false);
    }
  };

  const handleDeleteCv = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce CV ? Cette action est irréversible.")) return;

    try {
      const res = await fetch(`/api/cvs/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur de suppression.");
      }
      
      // Recharger
      fetchData();
      confetti({
        particleCount: 40,
        spread: 40,
        origin: { y: 0.8 }
      });
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDuplicateCv = async (cv: CV) => {
    if (user && user.cvsCount >= user.limit) {
      setError("Limite de votre forfait atteinte. Veuillez mettre à niveau pour dupliquer ce CV.");
      setShowUpgradeModal(true);
      return;
    }

    try {
      // 1. Créer un nouveau CV avec un nom copié
      const createRes = await fetch('/api/cvs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: `Copie de ${cv.name}` }),
      });

      if (!createRes.ok) {
        const errData = await createRes.json();
        throw new Error(errData.error || "Erreur lors de la création du duplicata.");
      }

      const newCvData = await createRes.json();
      const newCvId = newCvData.cv.id;

      // 2. Mettre à jour avec les informations de l'ancien
      const updateRes = await fetch(`/api/cvs/${newCvId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personalDetails: cv.personalDetails,
          experiences: cv.experiences,
          educations: cv.educations,
          languages: cv.languages,
          skills: cv.skills,
          hobbies: cv.hobbies,
          theme: cv.theme,
          template: cv.template,
        }),
      });

      if (!updateRes.ok) {
        const errData = await updateRes.json();
        throw new Error(errData.error || "Erreur lors du transfert de données du duplicata.");
      }

      // Recharger
      fetchData();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpgrade = async (plan: 'premium' | 'vip') => {
    setUpgradingPlan(plan);
    try {
      const res = await fetch('/api/user/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur de mise à niveau.");
      }

      // Succès
      fetchData();
      setShowUpgradeModal(false);
      
      // Explosion de confettis premium !
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.5 },
        colors: plan === 'vip' ? ['#ff00ff', '#00ffff', '#ffff00', '#ffffff'] : ['#570df8', '#f000b8', '#37cdbe']
      });

      alert(data.message);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUpgradingPlan(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-300 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-ring loading-lg text-primary"></span>
          <p className="text-base-content/60 text-sm animate-pulse">Chargement de votre espace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-300 font-sans text-base-content">
      {/* Header */}
      <header className="navbar bg-base-200/80 backdrop-blur-md border-b border-base-content/10 px-6 sm:px-12 sticky top-0 z-40">
        <div className="flex-1">
          <Link href="/" className="text-2xl font-extrabold italic select-none">
            Mon<span className="text-primary bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">CV</span>
          </Link>
        </div>
        <div className="flex-none gap-4">
          {user && (
            <div className="flex items-center gap-2">
              <span className="text-sm hidden sm:inline-block text-base-content/70">
                Bonjour, <strong className="text-base-content font-bold">{user.name}</strong>
              </span>
              
              {user.plan === 'vip' ? (
                <div className="badge badge-warning gap-1 py-3 px-3 font-semibold shadow-sm text-xs">
                  <Crown className="w-3.5 h-3.5" /> VIP
                </div>
              ) : user.plan === 'premium' ? (
                <div className="badge badge-primary gap-1 py-3 px-3 font-semibold shadow-sm text-xs">
                  <Sparkles className="w-3.5 h-3.5" /> Premium
                </div>
              ) : (
                <div className="badge badge-outline gap-1 py-3 px-3 text-xs">
                  Essai Gratuit
                </div>
              )}
            </div>
          )}

          <button onClick={handleLogout} className="btn btn-ghost btn-circle btn-sm text-error tooltip tooltip-bottom" data-tip="Se déconnecter">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10 sm:px-12">
        
        {/* Banner Alert error */}
        {error && (
          <div className="alert alert-error mb-6 shadow-md rounded-xl flex items-start">
            <ShieldAlert className="w-5 h-5 mt-0.5 shrink-0" />
            <div>
              <h3 className="font-bold">Attention</h3>
              <div className="text-sm">{error}</div>
            </div>
            <button onClick={() => setError('')} className="btn btn-xs btn-circle btn-ghost ml-auto">✕</button>
          </div>
        )}

        {/* Dashboard Top Section (Subscription Status) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="card md:col-span-2 bg-base-200 border border-base-content/10 shadow-lg p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Utilisation de votre Forfait</h2>
              <p className="text-sm text-base-content/60 mb-4">
                {user?.plan === 'free' 
                  ? "Vous utilisez le forfait d'essai gratuit. Mettez à niveau pour créer plus de 3 CVs et accéder à tous les thèmes."
                  : user?.plan === 'premium'
                  ? "Vous êtes membre Premium. Vous pouvez créer jusqu'à 10 CVs avec tous les thèmes premium."
                  : "Vous possédez l'accès VIP Illimité. Vous n'avez aucune limite et profitez de l'export HD sans filigrane."}
              </p>
            </div>
            
            {/* Quota Progress Bar */}
            <div className="w-full">
              <div className="flex justify-between text-sm font-semibold mb-1">
                <span>CVs créés</span>
                <span>
                  {user?.plan === 'vip' 
                    ? `${user.cvsCount} / Illimité` 
                    : `${user?.cvsCount} sur ${user?.limit} max`}
                </span>
              </div>
              
              {user?.plan !== 'vip' ? (
                <div className="w-full bg-base-300 rounded-full h-3.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${
                      (user?.cvsCount || 0) >= (user?.limit || 3) 
                        ? 'from-error to-red-500' 
                        : 'from-primary to-secondary'
                    }`}
                    style={{ width: `${Math.min(((user?.cvsCount || 0) / (user?.limit || 3)) * 100, 100)}%` }}
                  />
                </div>
              ) : (
                <div className="w-full bg-gradient-to-r from-warning via-amber-400 to-warning rounded-full h-3.5 animate-pulse" />
              )}
            </div>
          </div>

          <div className="card bg-gradient-to-br from-base-200 to-base-100 border border-base-content/10 shadow-lg p-6 rounded-2xl flex flex-col justify-between items-center text-center">
            <div className="flex flex-col items-center">
              <div className="p-3 bg-primary/10 text-primary rounded-full mb-3">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold">Améliorer mon offre</h3>
              <p className="text-xs text-base-content/60 mt-1 max-w-[200px]">
                Débloquez des modèles exclusifs et créez sans limites.
              </p>
            </div>
            <button 
              onClick={() => setShowUpgradeModal(true)} 
              className="btn btn-primary bg-gradient-to-r from-primary to-secondary text-primary-content border-none w-full mt-4 normal-case rounded-xl shadow-lg shadow-primary/10"
            >
              Voir les tarifs
            </button>
          </div>
        </section>

        {/* CV List Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-extrabold flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" /> Mes Documents CV
            </h2>
            
            <button 
              onClick={() => {
                const modal = document.getElementById('new_cv_modal') as HTMLDialogElement;
                if (modal) modal.showModal();
              }}
              className="btn btn-primary bg-gradient-to-r from-primary to-secondary text-primary-content border-none normal-case rounded-xl shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Plus className="w-5 h-5 mr-1" /> Nouveau CV
            </button>
          </div>

          {cvs.length === 0 ? (
            <div className="card bg-base-200 border border-dashed border-base-content/20 shadow-sm p-12 text-center flex flex-col items-center justify-center rounded-2xl min-h-[300px]">
              <div className="p-4 bg-base-300 rounded-full mb-4">
                <FileText className="w-12 h-12 text-base-content/30" />
              </div>
              <h3 className="text-lg font-bold">Aucun CV créé pour le moment</h3>
              <p className="text-sm text-base-content/50 max-w-sm mt-1 mb-6">
                Commencez dès aujourd'hui en créant votre premier CV professionnel en quelques clics.
              </p>
              <button 
                onClick={() => {
                  const modal = document.getElementById('new_cv_modal') as HTMLDialogElement;
                  if (modal) modal.showModal();
                }}
                className="btn btn-primary rounded-xl"
              >
                Créer mon premier CV
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cvs.map((cv) => (
                <div key={cv.id} className="card bg-base-200 border border-base-content/10 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl group flex flex-col justify-between overflow-hidden">
                  
                  {/* CV Header preview area */}
                  <div className="p-6 bg-gradient-to-br from-base-100 to-base-200 border-b border-base-content/5 relative min-h-[120px] flex flex-col justify-end">
                    <div className="absolute top-4 right-4 badge badge-neutral py-2 px-2.5 text-[10px] uppercase font-bold tracking-wider">
                      {cv.theme}
                    </div>
                    <h3 className="text-lg font-bold text-base-content truncate group-hover:text-primary transition-colors">
                      {cv.name}
                    </h3>
                    <p className="text-xs text-base-content/40 mt-1">
                      Modifié le {new Date(cv.updatedAt).toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>

                  {/* Actions footer */}
                  <div className="p-4 bg-base-200 flex justify-between items-center gap-2">
                    <Link 
                      href={`/builder/${cv.id}`} 
                      className="btn btn-sm btn-primary flex-1 gap-1 text-xs normal-case rounded-lg"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Éditer
                    </Link>
                    
                    <button 
                      onClick={() => handleDuplicateCv(cv)}
                      className="btn btn-sm btn-ghost btn-square tooltip tooltip-top text-base-content/60 hover:text-base-content" 
                      data-tip="Dupliquer"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    
                    <button 
                      onClick={() => handleDeleteCv(cv.id)}
                      className="btn btn-sm btn-ghost btn-square tooltip tooltip-top text-error/60 hover:text-error hover:bg-error/10" 
                      data-tip="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Modal 1: Create new CV */}
      <dialog id="new_cv_modal" className="modal">
        <div className="modal-box bg-base-200 border border-base-content/10 rounded-2xl max-w-md">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          
          <h3 className="font-extrabold text-xl mb-4 flex items-center gap-2">
            <FileText className="text-primary w-6 h-6" /> Nouveau Document
          </h3>
          
          <form onSubmit={handleCreateCv} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Nom de votre CV</span>
              </label>
              <input 
                type="text" 
                placeholder="Ex: CV Développeur Web, CV Marketing..." 
                value={newCvName}
                onChange={(e) => setNewCvName(e.target.value)}
                className="input input-bordered w-full bg-base-100 focus:input-primary rounded-xl"
                required
                maxLength={40}
                autoFocus
              />
            </div>
            
            <div className="modal-action">
              <button 
                type="button" 
                onClick={() => {
                  const modal = document.getElementById('new_cv_modal') as HTMLDialogElement;
                  if (modal) modal.close();
                }}
                className="btn btn-ghost rounded-xl"
              >
                Annuler
              </button>
              <button 
                type="submit" 
                disabled={creatingCv}
                className="btn btn-primary rounded-xl bg-gradient-to-r from-primary to-secondary text-primary-content border-none"
              >
                {creatingCv ? <span className="loading loading-spinner loading-xs"></span> : "Créer le document"}
              </button>
            </div>
          </form>
        </div>
      </dialog>

      {/* Modal 2: Pricing Upgrade Plans */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-base-200 border border-base-content/10 max-w-4xl w-full rounded-3xl p-6 sm:p-8 relative shadow-2xl overflow-y-auto max-h-[90vh]">
            <button 
              onClick={() => setShowUpgradeModal(false)}
              className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4"
            >
              ✕
            </button>

            <div className="text-center mb-8">
              <span className="badge badge-primary badge-outline mb-2">MonCV SaaS Tarifs</span>
              <h2 className="text-3xl font-extrabold">Boostez votre création de CV</h2>
              <p className="text-sm text-base-content/60 mt-1">
                Choisissez le forfait adapté à vos ambitions professionnelles.
              </p>
            </div>

            {/* Pricing Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Free Plan Card */}
              <div className="card bg-base-100 border border-base-content/5 p-6 rounded-2xl flex flex-col justify-between relative">
                <div>
                  <h4 className="font-bold text-lg">Essai Gratuit</h4>
                  <div className="flex items-baseline my-3">
                    <span className="text-3xl font-extrabold">0 FCFA</span>
                  </div>
                  <p className="text-xs text-base-content/50 mb-4">Parfait pour tester nos outils.</p>
                  
                  <ul className="space-y-2 text-xs mb-6">
                    <li className="flex items-center gap-2 text-base-content/80">
                      <Check className="w-4 h-4 text-success" /> Jusqu'à 3 CVs
                    </li>
                    <li className="flex items-center gap-2 text-base-content/80">
                      <Check className="w-4 h-4 text-success" /> Thèmes de base Next.js
                    </li>
                    <li className="flex items-center gap-2 text-base-content/80">
                      <Check className="w-4 h-4 text-success" /> Export PDF standard
                    </li>
                  </ul>
                </div>
                
                <button 
                  disabled={user?.plan === 'free'}
                  className="btn btn-sm btn-outline btn-block rounded-lg normal-case"
                >
                  {user?.plan === 'free' ? "Plan actuel" : "Gratuit"}
                </button>
              </div>

              {/* Premium Plan Card */}
              <div className="card bg-base-100 border-2 border-primary p-6 rounded-2xl flex flex-col justify-between relative shadow-lg">
                <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 badge badge-primary gap-1 py-3 px-3.5 text-[10px] uppercase font-bold tracking-wider">
                  <Sparkles className="w-3 h-3" /> Recommandé
                </div>
                
                <div>
                  <h4 className="font-bold text-lg mt-1">Premium Access</h4>
                  <div className="flex items-baseline my-3">
                    <span className="text-3xl font-extrabold text-primary">500 FCFA</span>
                    <span className="text-xs text-base-content/60 ml-1">/ mois</span>
                  </div>
                  <p className="text-xs text-base-content/50 mb-4">Pour une recherche d'emploi efficace.</p>
                  
                  <ul className="space-y-2 text-xs mb-6">
                    <li className="flex items-center gap-2 text-base-content/80">
                      <Check className="w-4 h-4 text-primary" /> **Jusqu'à 10 CVs**
                    </li>
                    <li className="flex items-center gap-2 text-base-content/80">
                      <Check className="w-4 h-4 text-primary" /> Accès à **tous les thèmes**
                    </li>
                    <li className="flex items-center gap-2 text-base-content/80">
                      <Check className="w-4 h-4 text-primary" /> Support par email 24h
                    </li>
                    <li className="flex items-center gap-2 text-base-content/80">
                      <Check className="w-4 h-4 text-primary" /> Duplication de CV facile
                    </li>
                  </ul>
                </div>

                <button 
                  onClick={() => handleUpgrade('premium')}
                  disabled={upgradingPlan !== null || user?.plan === 'premium'}
                  className="btn btn-sm btn-primary bg-gradient-to-r from-primary to-secondary text-primary-content border-none btn-block rounded-lg normal-case shadow-md"
                >
                  {upgradingPlan === 'premium' ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : user?.plan === 'premium' ? (
                    "Plan actuel"
                  ) : (
                    "Choisir Premium"
                  )}
                </button>
              </div>

              {/* VIP Plan Card */}
              <div className="card bg-neutral border border-neutral-content/10 text-neutral-content p-6 rounded-2xl flex flex-col justify-between relative shadow-lg">
                <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 badge badge-warning gap-1 py-3 px-3.5 text-[10px] uppercase font-bold tracking-wider">
                  <Crown className="w-3 h-3" /> VIP
                </div>

                <div>
                  <h4 className="font-bold text-lg text-warning mt-1">VIP / Illimité</h4>
                  <div className="flex items-baseline my-3">
                    <span className="text-3xl font-extrabold text-warning">3 000 FCFA</span>
                    <span className="text-xs text-neutral-content/60 ml-1">/ mois</span>
                  </div>
                  <p className="text-xs text-neutral-content/50 mb-4">Pour les professionnels exigeants.</p>
                  
                  <ul className="space-y-2 text-xs mb-6">
                    <li className="flex items-center gap-2 text-neutral-content/90">
                      <Check className="w-4 h-4 text-warning" /> **CVs Illimités**
                    </li>
                    <li className="flex items-center gap-2 text-neutral-content/90">
                      <Check className="w-4 h-4 text-warning" /> Thèmes exclusifs VIP
                    </li>
                    <li className="flex items-center gap-2 text-neutral-content/90">
                      <Check className="w-4 h-4 text-warning" /> **Export PDF HD sans filigrane**
                    </li>
                    <li className="flex items-center gap-2 text-neutral-content/90">
                      <Check className="w-4 h-4 text-warning" /> Support prioritaire 24/7
                    </li>
                  </ul>
                </div>

                <button 
                  onClick={() => handleUpgrade('vip')}
                  disabled={upgradingPlan !== null || user?.plan === 'vip'}
                  className="btn btn-sm btn-warning text-neutral bg-gradient-to-r from-warning to-amber-500 border-none btn-block rounded-lg normal-case shadow-md hover:scale-[1.01]"
                >
                  {upgradingPlan === 'vip' ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : user?.plan === 'vip' ? (
                    "Plan actuel"
                  ) : (
                    "Choisir VIP"
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
