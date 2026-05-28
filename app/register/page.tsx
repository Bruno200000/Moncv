"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, UserPlus, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password.length < 6) {
      setError("Le mot de passe doit comporter au moins 6 caractères.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue lors de la création du compte.");
      }

      // Rediriger vers le tableau de bord
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-base-300 overflow-hidden font-sans">
      {/* Background Decorative Blur Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/20 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md p-8 z-10">
        {/* Logo/Branding Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-4xl font-extrabold tracking-tight italic select-none">
            Mon<span className="text-primary bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">CV</span>
          </Link>
          <p className="text-base-content/60 mt-2 text-sm">
            Créez votre compte gratuit et commencez vos CVs d'essai
          </p>
        </div>

        {/* Card wrapper */}
        <div className="card bg-base-200/60 backdrop-blur-xl border border-base-content/10 shadow-2xl rounded-2xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
            <UserPlus className="w-6 h-6 text-primary" /> Inscription
          </h2>

          {error && (
            <div className="alert alert-error mb-4 shadow-sm text-sm py-3 rounded-xl flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Nom complet</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input input-bordered w-full pl-10 bg-base-100/50 focus:bg-base-100 focus:input-primary transition-all duration-200 rounded-xl"
                  placeholder="Jean Dupont"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Adresse Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input input-bordered w-full pl-10 bg-base-100/50 focus:bg-base-100 focus:input-primary transition-all duration-200 rounded-xl"
                  placeholder="jean.dupont@exemple.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Mot de passe (min 6 caractères)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input input-bordered w-full pl-10 pr-10 bg-base-100/50 focus:bg-base-100 focus:input-primary transition-all duration-200 rounded-xl"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/40 hover:text-base-content/80 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="form-control mt-6">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-content w-full normal-case text-base shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 rounded-xl py-3 h-auto min-h-0"
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <>
                    S'inscrire <ArrowRight className="w-5 h-5 ml-1" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Login Redirect */}
          <div className="text-center mt-6 text-sm text-base-content/60">
            Vous avez déjà un compte ?{' '}
            <Link href="/login" className="text-primary hover:underline hover:text-secondary font-medium transition-colors">
              Connectez-vous ici
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
