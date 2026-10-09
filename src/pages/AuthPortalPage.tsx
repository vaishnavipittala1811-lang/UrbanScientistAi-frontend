import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  MapPin,
  Lock,
  Mail,
  User as UserIcon,
  UserPlus,
  LogIn,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Compass
} from 'lucide-react';

interface AuthPortalPageProps {
  defaultTab?: 'login' | 'register';
}

export const AuthPortalPage: React.FC<AuthPortalPageProps> = ({ defaultTab = 'login' }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab);

  // Login Form States (clean, empty by default)
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');

  // Register Form States
  const [registerName, setRegisterName] = useState<string>('');
  const [registerEmail, setRegisterEmail] = useState<string>('');
  const [registerPassword, setRegisterPassword] = useState<string>('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState<string>('');

  // General States
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  // Handle Login Submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      await login(loginEmail, loginPassword);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify your email and password.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Register Submission
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (registerPassword !== registerConfirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    if (registerPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    try {
      await register(registerName, registerEmail, registerPassword);
      setSuccess('Account created successfully! Redirecting to Telangana Dashboard...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 800);
    } catch (err: any) {
      setError(err.message || 'Account creation failed. Please try a different email.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070A11] text-[#F3F4F6] flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden selection:bg-emerald-500/20 selection:text-emerald-400">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[34rem] h-[34rem] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold tracking-wide">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>📍 TELANGANA, INDIA</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            UrbanScientist AI — Telangana
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto font-medium">
            Autonomous Urban Intelligence & Decision Support Platform for Telangana
          </p>
        </div>

        {/* Clean Auth Card */}
        <div className="p-6 sm:p-7 rounded-2xl bg-[#111726] border border-[#1E293B] shadow-2xl space-y-5">
          {/* Tab Selector */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-[#0B0F19] border border-[#1E293B]">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setError('');
                setSuccess('');
              }}
              className={`py-2 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                activeTab === 'login'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-[#161F33]'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              Sign In (Login)
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setError('');
                setSuccess('');
              }}
              className={`py-2 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                activeTab === 'register'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-[#161F33]'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              Create Account
            </button>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2.5 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* 1. SIGN IN (LOGIN) FORM */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-gray-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                  Official or Registered Email:
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@urbanscientist.telangana.gov.in"
                  className="w-full bg-[#0B0F19] border border-[#222F4C] rounded-xl px-3.5 py-2.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-gray-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  Password:
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#0B0F19] border border-[#222F4C] rounded-xl px-3.5 py-2.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 mt-2"
              >
                {submitting ? (
                  <span>Authenticating Session...</span>
                ) : (
                  <>
                    <span>Sign In to Telangana Intelligence Portal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <div className="text-center pt-3 border-t border-[#1E293B] text-xs text-gray-400">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setError('');
                    setSuccess('');
                  }}
                  className="text-emerald-400 font-semibold hover:underline"
                >
                  Create Account / Register
                </button>
              </div>
            </form>
          )}

          {/* 2. CREATE ACCOUNT (REGISTER) FORM */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-gray-300 flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-emerald-400" />
                  Full Name:
                </label>
                <input
                  type="text"
                  required
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  placeholder="Your Full Name"
                  className="w-full bg-[#0B0F19] border border-[#222F4C] rounded-xl px-3.5 py-2.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-gray-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                  Official or Registered Email:
                </label>
                <input
                  type="email"
                  required
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  placeholder="name@domain.gov.in"
                  className="w-full bg-[#0B0F19] border border-[#222F4C] rounded-xl px-3.5 py-2.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    Password:
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full bg-[#0B0F19] border border-[#222F4C] rounded-xl px-3.5 py-2.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    Confirm Password:
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={registerConfirmPassword}
                    onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full bg-[#0B0F19] border border-[#222F4C] rounded-xl px-3.5 py-2.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 mt-2"
              >
                {submitting ? (
                  <span>Registering Account...</span>
                ) : (
                  <>
                    <span>Create Account & Register</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <div className="text-center pt-3 border-t border-[#1E293B] text-xs text-gray-400">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setError('');
                    setSuccess('');
                  }}
                  className="text-emerald-400 font-semibold hover:underline"
                >
                  Sign In (Login)
                </button>
              </div>
            </form>
          )}

          {/* Clean footer link */}
          <div className="pt-3 border-t border-[#1E293B] flex items-center justify-center text-xs text-gray-400">
            <Link
              to="/landing"
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5 text-blue-400" />
              <span>Explore Platform Overview & Landing Page</span>
            </Link>
          </div>
        </div>

        {/* Geographic notice */}
        <p className="text-center text-[11px] text-gray-500">
          Geographic Scope: Telangana, India • Municipal & District Urban Administration
        </p>
      </div>
    </div>
  );
};
