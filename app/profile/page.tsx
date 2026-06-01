"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Crown, FileText, Mail, Save, Shield, User } from 'lucide-react';

type ProfileUser = {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'premium' | 'vip';
  createdAt: string;
  cvsCount: number;
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch('/api/user/profile', { cache: 'no-store' });
        if (res.status === 401) {
          router.replace('/login');
          return;
        }
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Impossible de charger le profil.');
        setUser(data.user);
        setName(data.user.name || '');
        setEmail(data.user.email || '');
      } catch (err: any) {
        setError(err.message || 'Erreur de chargement.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Modification impossible.');
      setUser((current) => current ? { ...current, ...data.user } : data.user);
      setPassword('');
      setMessage('Profil modifie avec succes.');
    } catch (err: any) {
      setError(err.message || 'Erreur de modification.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-300 flex items-center justify-center">
        <span className="loading loading-ring loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-300 text-base-content">
      <header className="border-b border-base-content/10 bg-base-200/90 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <Link href="/dashboard" className="btn btn-ghost btn-sm">
            <ArrowLeft className="h-4 w-4" /> Tableau
          </Link>
          <h1 className="text-xl font-black">Mon profil</h1>
          <div className="w-24" />
        </div>
      </header>

      <main className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-6 py-8 lg:grid-cols-[1fr_330px]">
        <section className="rounded-2xl border border-base-content/10 bg-base-200 p-6 shadow-sm">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Compte utilisateur</p>
            <h2 className="mt-1 text-2xl font-black">Modifier mes informations</h2>
          </div>

          {message && <div className="alert alert-success mb-4 text-sm">{message}</div>}
          {error && <div className="alert alert-error mb-4 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="form-control">
              <span className="label-text font-semibold">Nom complet</span>
              <div className="input input-bordered flex items-center gap-2">
                <User className="h-4 w-4 text-base-content/40" />
                <input value={name} onChange={(e) => setName(e.target.value)} className="grow" />
              </div>
            </label>

            <label className="form-control">
              <span className="label-text font-semibold">Email</span>
              <div className="input input-bordered flex items-center gap-2">
                <Mail className="h-4 w-4 text-base-content/40" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="grow" />
              </div>
            </label>

            <label className="form-control">
              <span className="label-text font-semibold">Nouveau mot de passe</span>
              <div className="input input-bordered flex items-center gap-2">
                <Shield className="h-4 w-4 text-base-content/40" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Laisser vide pour ne pas changer"
                  className="grow"
                />
              </div>
            </label>

            <button disabled={saving} className="btn btn-primary rounded-xl">
              {saving ? <span className="loading loading-spinner loading-sm" /> : <Save className="h-4 w-4" />}
              Enregistrer
            </button>
          </form>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-base-content/10 bg-base-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="font-black">Plan actuel</p>
              <span className={`badge ${user?.plan === 'vip' ? 'badge-warning' : user?.plan === 'premium' ? 'badge-primary' : 'badge-outline'}`}>
                {user?.plan}
              </span>
            </div>
            <div className="mt-5 rounded-xl bg-base-100 p-4">
              <p className="text-xs font-bold uppercase text-base-content/45">CV crees</p>
              <p className="mt-1 flex items-center gap-2 text-3xl font-black">
                <FileText className="h-6 w-6 text-primary" /> {user?.cvsCount ?? 0}
              </p>
            </div>
            <div className="mt-4 rounded-xl bg-base-100 p-4">
              <p className="text-xs font-bold uppercase text-base-content/45">Inscrit depuis</p>
              <p className="mt-1 font-bold">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : '-'}</p>
            </div>
          </div>

          {user?.plan !== 'vip' && (
            <Link href="/dashboard" className="btn btn-warning w-full rounded-xl">
              <Crown className="h-4 w-4" /> Voir les offres VIP
            </Link>
          )}
        </aside>
      </main>
    </div>
  );
}
