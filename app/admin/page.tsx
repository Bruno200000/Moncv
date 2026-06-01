"use client"

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BarChart3, Crown, Download, FileText, LogOut, Search, ShieldCheck,
  Sparkles, Trash2, TrendingUp, UserCheck, Users
} from 'lucide-react';

type Plan = 'free' | 'premium' | 'vip';

type AdminUser = {
  id: string;
  name: string;
  email: string;
  plan: Plan;
  createdAt: string;
  cvsCount: number;
  lastCvAt?: string | null;
};

type AdminStats = {
  totalUsers: number;
  usersThisMonth: number;
  totalCvs: number;
  cvsThisMonth: number;
  totalVisits?: number;
  visitsThisMonth?: number;
  totalDownloads?: number;
  downloadsThisMonth?: number;
  revenueMonth: number;
  conversionRate: number;
  averageCvsPerUser: number;
  plans: { free: number; premium: number; vip: number };
  recentUsers: AdminUser[];
  users: AdminUser[];
  recentCvs: Array<{
    id: string;
    name: string;
    template: string;
    theme: string;
    updatedAt: string;
    userName: string;
    userEmail: string;
  }>;
  topTemplates: Array<{ template: string; count: number }>;
};

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [busyUserId, setBusyUserId] = useState('');

  const loadStats = async () => {
    try {
      setError('');
      const res = await fetch('/api/admin/stats', { cache: 'no-store' });
      if (res.status === 401) {
        router.replace('/login');
        return;
      }

      const rawBody = await res.text();
      const data = rawBody ? JSON.parse(rawBody) : null;
      if (!res.ok) throw new Error(data?.error || "Impossible de charger l'espace admin.");
      if (!data?.stats) throw new Error('Reponse admin vide. Veuillez vous reconnecter.');
      setStats(data.stats);
    } catch (err: any) {
      setError(err.message || 'Erreur de chargement admin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const filteredUsers = useMemo(() => {
    if (!stats) return [];
    const value = query.trim().toLowerCase();
    if (!value) return stats.users || stats.recentUsers || [];
    return (stats.users || []).filter((user) =>
      `${user.name} ${user.email} ${user.plan}`.toLowerCase().includes(value)
    );
  }, [query, stats]);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/login');
  };

  const handleDeleteUser = async (user: AdminUser) => {
    const ok = confirm(`Supprimer ${user.name} ? Tous ses CV seront aussi supprimes.`);
    if (!ok) return;
    setBusyUserId(user.id);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || 'Suppression impossible.');
      await loadStats();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setBusyUserId('');
    }
  };

  const handlePlanChange = async (user: AdminUser, plan: Plan) => {
    setBusyUserId(user.id);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || 'Modification impossible.');
      await loadStats();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setBusyUserId('');
    }
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
          <h1 className="text-xl font-black mb-2">Acces admin impossible</h1>
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
          <div className="flex items-center gap-2">
            <button onClick={loadStats} className="btn btn-sm btn-outline rounded-xl">Actualiser</button>
            <button onClick={handleLogout} className="btn btn-ghost btn-sm text-error">
              <LogOut className="w-4 h-4" /> Deconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard label="Inscrits" value={stats.totalUsers} icon={Users} tone="text-primary" />
          <StatCard label="CV crees" value={stats.totalCvs} icon={FileText} tone="text-success" />
          <StatCard label="Revenu du mois" value={`${stats.revenueMonth.toLocaleString('fr-FR')} FCFA`} icon={TrendingUp} tone="text-warning" />
          <StatCard label="Telechargements" value={stats.totalDownloads ?? 0} icon={Download} tone="text-info" />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-4">
          <MiniStat label="Visites ce mois" value={stats.visitsThisMonth ?? 0} />
          <MiniStat label="CV ce mois" value={stats.cvsThisMonth} />
          <MiniStat label="Nouveaux utilisateurs" value={stats.usersThisMonth} />
          <MiniStat label="Conversion payante" value={`${stats.conversionRate}%`} />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="rounded-2xl bg-base-200 border border-base-content/10 p-6">
            <h2 className="font-black text-lg mb-4 flex items-center gap-2">
              <Crown className="w-5 h-5 text-warning" /> Plans
            </h2>
            <PlanRow label="Gratuit" value={stats.plans.free} />
            <PlanRow label="Acces Plus" value={stats.plans.premium} />
            <PlanRow label="VIP" value={stats.plans.vip} />
            <div className="mt-4 rounded-xl bg-base-100 p-4">
              <p className="text-xs font-bold uppercase text-base-content/45">Moyenne CV / utilisateur</p>
              <p className="mt-1 text-2xl font-black">{stats.averageCvsPerUser}</p>
            </div>
          </div>

          <div className="rounded-2xl bg-base-200 border border-base-content/10 p-6">
            <h2 className="font-black text-lg mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" /> Modeles populaires
            </h2>
            <div className="space-y-3">
              {stats.topTemplates.map((template) => (
                <PlanRow key={template.template} label={template.template || 'classic'} value={template.count} />
              ))}
              {stats.topTemplates.length === 0 && <p className="text-sm text-base-content/50">Aucun modele utilise.</p>}
            </div>
          </div>

          <div className="rounded-2xl bg-base-200 border border-base-content/10 p-6">
            <h2 className="font-black text-lg mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-info" /> Activite
            </h2>
            <MiniStat label="Visites totales" value={stats.totalVisits ?? 0} compact />
            <MiniStat label="Telechargements ce mois" value={stats.downloadsThisMonth ?? 0} compact />
          </div>
        </section>

        <section className="rounded-2xl bg-base-200 border border-base-content/10 p-6 mt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
            <h2 className="font-black text-lg flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-primary" /> Utilisateurs
            </h2>
            <label className="input input-bordered input-sm flex items-center gap-2 w-full sm:w-80">
              <Search className="w-4 h-4 text-base-content/40" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher nom, email, plan" />
            </label>
          </div>
          <div className="overflow-x-auto">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>Utilisateur</th>
                  <th>Plan</th>
                  <th>CV</th>
                  <th>Derniere activite</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="font-bold">{user.name}</div>
                      <div className="text-xs text-base-content/50">{user.email}</div>
                    </td>
                    <td>
                      <select
                        className="select select-bordered select-xs"
                        value={user.plan}
                        disabled={busyUserId === user.id}
                        onChange={(event) => handlePlanChange(user, event.target.value as Plan)}
                      >
                        <option value="free">free</option>
                        <option value="premium">premium</option>
                        <option value="vip">vip</option>
                      </select>
                    </td>
                    <td>{user.cvsCount}</td>
                    <td className="text-xs">
                      {user.lastCvAt ? new Date(user.lastCvAt).toLocaleDateString('fr-FR') : 'Aucun CV'}
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => handleDeleteUser(user)}
                        disabled={busyUserId === user.id}
                        className="btn btn-error btn-xs btn-outline"
                      >
                        {busyUserId === user.id ? <span className="loading loading-spinner loading-xs" /> : <Trash2 className="w-3.5 h-3.5" />}
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl bg-base-200 border border-base-content/10 p-6 mt-6">
          <h2 className="font-black text-lg mb-4">Derniers CV modifies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            {stats.recentCvs.map((cv) => (
              <div key={cv.id} className="rounded-xl bg-base-100 p-4 border border-base-content/10">
                <p className="font-bold truncate">{cv.name}</p>
                <p className="text-xs text-base-content/50 truncate">{cv.userName} · {cv.userEmail}</p>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="badge badge-outline badge-sm">{cv.template}</span>
                  <span>{new Date(cv.updatedAt).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            ))}
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
    <div className="flex items-center justify-between rounded-xl bg-base-100 px-4 py-3">
      <span className="font-semibold capitalize">{label}</span>
      <span className="badge badge-primary badge-outline">{value}</span>
    </div>
  );
}

function MiniStat({ label, value, compact = false }: { label: string; value: number | string; compact?: boolean }) {
  return (
    <div className={`rounded-xl bg-base-100 ${compact ? 'p-4 mb-3' : 'p-4'}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-base-content/45">{label}</p>
      <p className="mt-2 text-2xl font-black">{typeof value === 'number' ? value.toLocaleString('fr-FR') : value}</p>
    </div>
  );
}
