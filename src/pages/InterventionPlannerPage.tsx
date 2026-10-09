import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Intervention } from '../types';
import { Target, MapPin, DollarSign, Users, Award, ShieldAlert, ArrowUpRight, Search } from 'lucide-react';

export const InterventionPlannerPage: React.FC = () => {
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        const ints = await api.getInterventions();
        setInterventions(ints);
      } catch (err) {
        console.error('Failed to load interventions:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const categories = ['All', 'Traffic', 'Pollution', 'Water', 'Healthcare', 'Infrastructure'];
  const filtered = categoryFilter === 'All'
    ? interventions
    : interventions.filter((i) => i.category.toLowerCase() === categoryFilter.toLowerCase());

  return (
    <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="border-b border-[#1E293B] pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              📍 Telangana, India
            </span>
            <span className="text-xs text-gray-500 font-mono">Portfolio Decision Matrix</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Telangana Intervention Planner
          </h1>
          <p className="text-sm text-gray-400">
            Compare civil interventions by cost, risk reduction, population impact, and ROI across Telangana.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                categoryFilter === cat
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-[#161F33] text-gray-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Interventions Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {loading ? (
          <p className="text-sm text-gray-400">Loading Telangana intervention matrix...</p>
        ) : (
          filtered.map((item) => (
            <div
              key={item.interventionId}
              className="p-5 rounded-2xl bg-[#111726] border border-[#1E293B] hover:border-emerald-500/40 transition-all space-y-4 shadow-xl"
            >
              <div className="flex items-start justify-between gap-2 border-b border-[#1E293B] pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono">
                      {item.interventionId}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">
                      Scope: <span className="text-gray-200">{item.applicableScope}</span>
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">{item.name}</h3>
                </div>

                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                  item.priorityLevel === 'Critical' ? 'bg-red-500/10 text-red-400 border border-red-500/25' : 'bg-amber-500/10 text-amber-400 border border-amber-500/25'
                }`}>
                  {item.priorityLevel} Priority
                </span>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed">
                {item.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-[#161F33] border border-[#222F4C] text-xs">
                <div>
                  <span className="text-gray-400 text-[10px] block">Capital Cost</span>
                  <span className="font-bold text-white">₹{item.costInrCrores} Cr</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] block">Risk Reduction</span>
                  <span className="font-bold text-emerald-400">-{item.expectedRiskReductionPct}%</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] block">Benefited</span>
                  <span className="font-bold text-cyan-400">{(item.estPopulationBenefited / 1000).toFixed(0)}k</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] block">Social ROI</span>
                  <span className="font-bold text-teal-400">{item.roiMultiplier}x</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
