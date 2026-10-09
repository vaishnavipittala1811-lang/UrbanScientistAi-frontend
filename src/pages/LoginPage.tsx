import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MapPin, Shield, Lock, Mail, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070A11] text-[#F3F4F6] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden selection:bg-emerald-500/20 selection:text-emerald-400">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold">
            <MapPin className="w-3.5 h-3.5" />
            📍 TELANGANA, INDIA
          </div>

          <h1 className="text-2xl font-black text-white tracking-tight">
            UrbanScientist AI — Telangana
          </h1>
          <p className="text-xs text-gray-400">
            Autonomous Urban Intelligence & Decision Support Platform for Telangana
          </p>
        </div>

        {/* Login Box */}
        <div className="p-6 rounded-2xl bg-[#111726] border border-[#1E293B] shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              Sign In (Login)
            </h2>
            <span className="text-[10px] font-mono text-gray-400">JWT Secure</span>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-gray-300">Official or Registered Email:</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@urbanscientist.telangana.gov.in"
                  className="w-full bg-[#161F33] text-gray-200 rounded-lg pl-9 pr-3 py-2.5 border border-[#222F4C] focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-gray-300">Password:</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#161F33] text-gray-200 rounded-lg pl-9 pr-3 py-2.5 border border-[#222F4C] focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all mt-2"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Authenticating Session...
                </>
              ) : (
                <>
                  <span>Sign In to Telangana Intelligence Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-3 border-t border-[#1E293B] text-xs text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-emerald-400 font-semibold hover:underline">
              Create Account / Register
            </Link>
          </div>
        </div>

        {/* Geographic notice */}
        <p className="text-center text-[11px] text-gray-500">
          Geographic Scope: Telangana, India • Municipal & District Administration
        </p>
      </div>
    </div>
  );
};
