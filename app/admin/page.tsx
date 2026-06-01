"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BarChart3, Crown, FileText, LogOut, ShieldCheck, Sparkles, TrendingUp, Users } from 'lucide-react';

type AdminStats = {
  totalUsers: number;
  usersThisMonth: number;
  totalCvs: number;
  cvsThisMonth: number;
  revenueMonth: number;
  plans: { free: number; premium: number; vip: number };
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    plan: 'free' | 'premium' | 'vip';
    createdAt: string;
    cvsCount: number;
  }>;
};

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.status === 401) {
          router.replace('/login');
          return;
        }

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Impossible de charger l'espace admin.");
        setStats(data.stats);
      } catch (err: any) {
        setError(err.message || "Erreur de chargement admin.");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-300 flex items-center justify-center">
        <span className="loading loading-ring loading-lg text-primary" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-base-300 flex items-center justify-center p-6">
        <div className="rounded-2xl bg-base-200 border border-base-content/10 p-8 text-center max-w-md">
          <ShieldCheck className="w-10 h-10 text-error mx-auto mb-3" />
          <h1 className="text-xl font-black mb-2">Accès admin impossible</h1>
          <p className="text-sm text-base-content/60 mb-5">{error || 'Veuillez vous reconnecter.'}</p>
          <Link href="/login" className="btn btn-primary rounded-xl">Retour connexion</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-300 text-base-content">
      <header className="sticky top-0 z-30 bg-base-200/90 backdrop-blur border-b border-base-content/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Administration</p>
            <h1 className="text-2xl font-black">Tableau de bord MonCV</h1>
          </div>
          <button onClick={handleLogout} className="btn btn-ghost btn-sm text-error">
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard label="Inscrits" value={stats.totalUsers} icon={Users} tone="text-primary" />
          <StatCard label="CV créés" value={stats.totalCvs} icon={FileText} tone="text-success" />
          <StatCard label="Revenu du mois" value={`${stats.revenueMonth.toLocaleString('fr-FR')} FCFA`} icon={TrendingUp} tone="text-warning" />
          <StatCard label="Nouveaux inscrits" value={stats.usersThisMonth} icon={BarChart3} tone="text-info" />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="rounded-2xl bg-base-200 border border-base-content/10 p-6">
            <h2 className="font-black text-lg mb-4 flex items-center gap-2">
              <Crown className="w-5 h-5 text-warning" /> Plans
            </h2>
            <PlanRow label="Gratuit" value={stats.plans.free} />
            <PlanRow label="Accès Plus" value={stats.plans.premium} />
            <PlanRow label="VIP" value={stats.plans.vip} />
          </div>

          <div className="rounded-2xl bg-base-200 border border-base-content/10 p-6 lg:col-span-2">
            <h2 className="font-black text-lg mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" /> Activité
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <MiniStat label="CV créés ce mois" value={stats.cvsThisMonth} />
              <MiniStat label="Utilisateurs ce mois" value={stats.usersThisMonth} />
            </div>
          </div>
        </section>

        <section className="rounded-2xl bg-base-200 border border-base-content/10 p-6 mt-6">
          <h2 className="font-black text-lg mb-4">Derniers inscrits</h2>
          <div className="overflow-x-auto">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>Utilisateur</th>
                  <th>Plan</th>
                  <th>CV</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="font-bold">{user.name}</div>
                      <div className="text-xs text-base-content/50">{user.email}</div>
                    </td>
                    <td><span className="badge badge-outline badge-sm">{user.plan}</span></td>
                    <td>{user.cvsCount}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString('fr-FR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, tone }: { label: string; value: number | string; icon: React.ElementType; tone: string }) {
  return (
    <div className="rounded-2xl bg-base-200 border border-base-content/10 p-5 shadow-sm">
      <div className={`w-fit rounded-xl bg-base-100 p-3 ${tone}`}>
        <Icon className="w-6 h-6" />
      </div>
      <p className="mt-5 text-sm font-semibold text-base-content/55">{label}</p>
      <p className="mt-1 text-3xl font-black">{typeof value === 'number' ? value.toLocaleString('fr-FR') : value}</p>
    </div>
  );
}

function PlanRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-base-100 px-4 py-3 mb-3">
      <span className="font-semibold">{label}</span>
      <span className="badge badge-primary badge-outline">{value}</span>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-base-100 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-base-content/45">{label}</p>
      <p className="mt-2 text-2xl font-black">{value.toLocaleString('fr-FR')}</p>
    </div>
  );
}
