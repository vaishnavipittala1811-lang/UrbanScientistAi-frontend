import React from 'react';
import { MapPin, ShieldCheck, Database, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#1E293B] bg-[#070A11] py-8 px-6 text-xs text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Product & Subtitle */}
        <div className="space-y-1.5 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="font-bold text-white text-sm tracking-tight">
              UrbanScientist AI — Telangana
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              OFFICIAL BUILD
            </span>
          </div>
          <p className="text-gray-400 text-xs">
            Autonomous Urban Intelligence & Decision Support Platform
          </p>
        </div>

        {/* Center: Geographic Scope */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#111726] border border-[#1E293B]">
          <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="text-center md:text-left">
            <span className="text-[11px] font-semibold text-gray-200">
              Geographic Scope: <span className="text-emerald-400">Telangana, India</span>
            </span>
            <p className="text-[10px] text-gray-500">
              Covering 33 Administrative Districts & Municipal Corporations
            </p>
          </div>
        </div>

        {/* Right: Synthetic Data Notice & Engine Tech */}
        <div className="space-y-1 text-center md:text-right">
          <div className="flex items-center justify-center md:justify-end gap-3 text-[11px] text-gray-400">
            <span className="flex items-center gap-1">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              MySQL 8.0 Spatial
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-teal-400" />
              Spring Boot Java 21+
            </span>
          </div>
          <p className="text-[11px] text-gray-500 max-w-sm">
            Data Notice: Development datasets are synthetic unless otherwise stated.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-6 pt-4 border-t border-[#1E293B]/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-2">
        <p>© 2026 UrbanScientist AI — Telangana. Designed for Evidence-Based Urban Decision Making.</p>
        <p className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Enterprise State Urban Digital Twin
        </p>
      </div>
    </footer>
  );
};
