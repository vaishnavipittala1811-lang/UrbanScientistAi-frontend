import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Intervention, BudgetOptimizationResult } from '../types';
import { Calculator, MapPin, DollarSign, Users, Award, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export const BudgetOptimizerPage: React.FC = () => {
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [budgetInrCrores, setBudgetInrCrores] = useState<number>(150.0);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All Telangana');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [optimizationResult, setOptimizationResult] = useState<BudgetOptimizationResult | null>(null);
  const [running, setRunning] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function init() {
      try {
        const ints = await api.getInterventions();
        setInterventions(ints);
        setSelectedIds(ints.map((i) => i.interventionId));

        // Initial budget run
        const res = await api.optimizeBudget({
          district: 'All Telangana',
          budgetInrCrores: 150.0,
        });
        setOptimizationResult(res);
      } catch (err) {
        console.error('Failed to init budget optimizer:', err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const handleOptimize = async () => {
    setRunning(true);
    try {
      const res = await api.optimizeBudget({
        district: selectedDistrict,
        budgetInrCrores: Number(budgetInrCrores),
        selectedInterventionIds: selectedIds.length > 0 ? selectedIds : undefined,
      });
      setOptimizationResult(res);
    } catch (err) {
      console.error('Optimization error:', err);
    } finally {
      setRunning(false);
    }
  };

  const toggleIntervention = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="border-b border-[#1E293B] pb-5 space-y-1">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            📍 Telangana, India
          </span>
          <span className="text-xs text-gray-500 font-mono">Knapsack Capital Allocation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Telangana Urban Budget Optimizer
        </h1>
        <p className="text-sm text-gray-400">
          Identify high-impact interventions within a limited urban-development budget across Telangana.
        </p>
      </div>

      {/* Control Box */}
      <div className="p-6 rounded-2xl bg-[#111726] border border-[#1E293B] space-y-5 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          {/* Budget Input */}
          <div className="space-y-2">
            <label className="font-bold text-gray-200">
              Total Fiscal Budget (₹ Crores): <span className="text-emerald-400 text-sm font-black">₹{budgetInrCrores} Cr</span>
            </label>
            <input
              type="range"
              min="20"
              max="500"
              step="5"
              value={budgetInrCrores}
              onChange={(e) => setBudgetInrCrores(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-mono">
              <span>₹20 Cr (Minor)</span>
              <span>₹250 Cr (Medium)</span>
              <span>₹500 Cr (Mega)</span>
            </div>
          </div>

          {/* District Scope */}
          <div className="space-y-2">
            <label className="font-bold text-gray-200">Target Administrative Scope:</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full bg-[#161F33] text-gray-200 rounded-lg p-2.5 border border-[#222F4C] focus:outline-none focus:border-emerald-500 text-xs"
            >
              <option value="All Telangana">Statewide Telangana (33 Districts)</option>
              <option value="Hyderabad">Hyderabad Metropolitan Region</option>
              <option value="Warangal">Warangal-Hanamkonda Smart Region</option>
              <option value="Karimnagar">Karimnagar Urban Development Authority</option>
              <option value="Nizamabad">Nizamabad Municipal Corporation</option>
            </select>
          </div>

          {/* Run Button */}
          <div className="flex items-end">
            <button
              onClick={handleOptimize}
              disabled={running}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
            >
              {running ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Solving Knapsack Constraints...
                </>
              ) : (
                <>
                  <Calculator className="w-4 h-4" />
                  Run Optimal Budget Allocation
                </>
              )}
            </button>
          </div>
        </div>

        {/* Candidate Intervention Selector Chips */}
        <div className="pt-3 border-t border-[#1E293B] space-y-2">
          <label className="text-xs font-semibold text-gray-400 block">
            Select Eligible Interventions to Consider ({selectedIds.length} / {interventions.length}):
          </label>
          <div className="flex flex-wrap gap-2">
            {interventions.map((i) => {
              const checked = selectedIds.includes(i.interventionId);
              return (
                <button
                  key={i.interventionId}
                  onClick={() => toggleIntervention(i.interventionId)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    checked
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                      : 'bg-[#161F33] border-[#222F4C] text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {checked ? '✓ ' : '+ '} {i.name} (₹{i.costInrCrores} Cr)
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Optimization Results View */}
      {optimizationResult && (
        <div className="space-y-6">
          {/* Summary KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#111726] border border-[#1E293B] space-y-1">
              <span className="text-gray-400 text-[11px] font-semibold">Budget Used</span>
              <p className="text-2xl font-black text-white">
                ₹{optimizationResult.budgetUsedInrCrores} Cr
              </p>
              <p className="text-[10px] text-gray-500 font-mono">
                Remaining: ₹{optimizationResult.remainingBudgetInrCrores} Cr
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#111726] border border-[#1E293B] space-y-1">
              <span className="text-gray-400 text-[11px] font-semibold">Net Risk Reduction</span>
              <p className="text-2xl font-black text-emerald-400">
                -{optimizationResult.totalRiskReductionPct}%
              </p>
              <p className="text-[10px] text-emerald-400/90 font-mono">
                Optimal Multi-Sector Impact
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#111726] border border-[#1E293B] space-y-1">
              <span className="text-gray-400 text-[11px] font-semibold">Population Impacted</span>
              <p className="text-2xl font-black text-cyan-400">
                {(optimizationResult.totalPopulationImpacted / 100000).toFixed(2)} Lakhs
              </p>
              <p className="text-[10px] text-gray-500 font-mono">
                Direct Citizen Coverage
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#111726] border border-[#1E293B] space-y-1">
              <span className="text-gray-400 text-[11px] font-semibold">Overall Impact Score</span>
              <p className="text-2xl font-black text-teal-400">
                {optimizationResult.overallImpactScore} / 100
              </p>
              <p className="text-[10px] text-teal-400/90 font-mono">
                Average ROI: {optimizationResult.averageRoiMultiplier}x
              </p>
            </div>
          </div>

          {/* Recommended Interventions Table */}
          <div className="p-5 rounded-2xl bg-[#111726] border border-[#1E293B] space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span>Optimally Selected Civil Interventions ({optimizationResult.recommendedInterventions.length})</span>
              <span className="text-xs text-emerald-400 font-mono">📍 {optimizationResult.geographicScope}</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#1E293B] text-gray-400 font-semibold uppercase text-[10px]">
                    <th className="py-2.5 px-3">Intervention</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Cost (₹ Cr)</th>
                    <th className="py-2.5 px-3">Risk Drop</th>
                    <th className="py-2.5 px-3">Benefited</th>
                    <th className="py-2.5 px-3">Priority</th>
                    <th className="py-2.5 px-3">ROI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E293B] text-gray-300">
                  {optimizationResult.recommendedInterventions.map((item) => (
                    <tr key={item.interventionId} className="hover:bg-[#161F33]/50 transition-colors">
                      <td className="py-3 px-3 font-semibold text-white">
                        {item.name}
                        <span className="block text-[10px] text-gray-500 font-mono">{item.interventionId}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#161F33] text-gray-300 border border-[#222F4C]">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-white">₹{item.costInrCrores}</td>
                      <td className="py-3 px-3 font-bold text-emerald-400">-{item.expectedRiskReductionPct}%</td>
                      <td className="py-3 px-3">{(item.estPopulationBenefited / 1000).toFixed(0)}k</td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] font-bold text-amber-400">{item.priorityLevel}</span>
                      </td>
                      <td className="py-3 px-3 font-bold text-teal-400">{item.roiMultiplier}x</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
