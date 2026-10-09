import React from 'react';
import { Link } from 'react-router-dom';
import { TelanganaMapVisual } from '../components/TelanganaMapVisual';
import {
  MapPin,
  ArrowRight,
  ShieldCheck,
  Activity,
  Car,
  CloudFog,
  Droplets,
  HeartPulse,
  Workflow,
  Cpu,
  Layers,
  Sparkles,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#070A11] text-[#F3F4F6] flex flex-col selection:bg-emerald-500/20 selection:text-emerald-400">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-[#1E293B] bg-[#070A11]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-emerald-400/30">
              <span className="font-extrabold text-white text-base">US</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white tracking-tight text-base">
                  UrbanScientist AI
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                  Telangana
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-medium">
                Telangana Urban Intelligence
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#111726] border border-[#1E293B]">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-semibold text-gray-300">
              📍 Telangana, India
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-xs font-semibold text-gray-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-[#161F33] transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/dashboard"
              className="text-xs font-semibold px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
            >
              Launch Platform
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-6 max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Side: Mandatory Landing Page Hero Branding */}
          <div className="lg:col-span-6 space-y-6">
            {/* Small badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold tracking-wide">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>📍 TELANGANA, INDIA</span>
            </div>

            {/* Product Label */}
            <div className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
              UrbanScientist AI — Telangana
            </div>

            {/* Large Heading */}
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
              Understand Your City.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Predict Its Future.
              </span><br />
              Act Before Problems Escalate.
            </h1>

            {/* Subtitle */}
            <h2 className="text-lg font-semibold text-gray-200">
              Autonomous Urban Intelligence & Decision Support Platform for Telangana
            </h2>

            {/* Description */}
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed max-w-xl">
              Transforming fragmented urban data into explainable intelligence for smarter, faster and evidence-based urban decisions across Telangana.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/cities"
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2"
              >
                <span>Explore Telangana</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                to="/dashboard"
                className="px-6 py-3 rounded-xl bg-[#161F33] hover:bg-[#222F4C] border border-[#222F4C] text-gray-200 font-semibold text-sm transition-all flex items-center gap-2"
              >
                <span>View Urban Intelligence</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </Link>
            </div>

            {/* Key Platform Badges */}
            <div className="pt-6 border-t border-[#1E293B] grid grid-cols-3 gap-4 text-left">
              <div>
                <p className="text-2xl font-black text-white">33</p>
                <p className="text-xs text-gray-400">Telangana Districts</p>
              </div>
              <div>
                <p className="text-2xl font-black text-emerald-400">12.7M+</p>
                <p className="text-xs text-gray-400">Monitored Citizens</p>
              </div>
              <div>
                <p className="text-2xl font-black text-teal-400">71</p>
                <p className="text-xs text-gray-400">Urban Sensed Nodes</p>
              </div>
            </div>
          </div>

          {/* Right Side: Sophisticated Telangana Urban Intelligence Visualization */}
          <div className="lg:col-span-6">
            <TelanganaMapVisual />
          </div>
        </div>
      </section>

      {/* Platform Pillars Section */}
      <section className="py-16 px-6 border-t border-[#1E293B] bg-[#0B0F19]/60">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#161F33] border border-[#222F4C] text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Multi-Sector Decision Intelligence
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Statewide Digital Twin Architecture for Telangana
            </h2>
            <p className="text-sm text-gray-400">
              Integrating real-time spatial sensors, machine learning risk engines, and predictive scenario simulators across all urban centers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-[#111726] border border-[#1E293B] hover:border-emerald-500/40 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Car className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Traffic Intelligence</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Corridor flow synchronization, arterial delay mitigation, and transit congestion forecasting across Telangana highway junctions.
              </p>
              <Link to="/traffic" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1">
                View Hotspots &rarr;
              </Link>
            </div>

            <div className="p-5 rounded-2xl bg-[#111726] border border-[#1E293B] hover:border-emerald-500/40 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <CloudFog className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Pollution Intelligence</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Atmospheric particulate mapping (PM2.5, PM10) and industrial emission tracking across Patancheru, Ramagundam, and Kothagudem.
              </p>
              <Link to="/pollution" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1">
                View AQI Risk &rarr;
              </Link>
            </div>

            <div className="p-5 rounded-2xl bg-[#111726] border border-[#1E293B] hover:border-emerald-500/40 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Droplets className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Water Intelligence</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Groundwater depletion telemetry, municipal piped supply deficits, and Mission Bhagiratha grid telemetry analytics.
              </p>
              <Link to="/water" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1">
                View Water Stress &rarr;
              </Link>
            </div>

            <div className="p-5 rounded-2xl bg-[#111726] border border-[#1E293B] hover:border-emerald-500/40 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">What-If Simulator</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Backend-calculated predictive civil intervention engine evaluating projected risk reductions, citizen impact, and capital ROI.
              </p>
              <Link to="/simulator" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1">
                Run Simulation &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-[#1E293B] bg-[#070A11] py-8 px-6 text-xs text-gray-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-white">UrbanScientist AI — Telangana</span>
            <p className="text-gray-500 text-[11px]">Autonomous Urban Intelligence & Decision Support Platform</p>
          </div>
          <div className="text-center md:text-left">
            <span className="font-semibold text-emerald-400">Geographic Scope: Telangana, India</span>
            <p className="text-gray-500 text-[10px]">Data Notice: Development datasets are synthetic unless otherwise stated.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="hover:text-white">Admin Login</Link>
            <span>•</span>
            <Link to="/data-sources" className="hover:text-white">Data Sources</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
