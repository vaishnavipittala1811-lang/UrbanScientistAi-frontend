import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { AiInsight } from '../types';
import { Sparkles, MapPin, ShieldAlert, Cpu, CheckCircle2, ChevronRight, Filter } from 'lucide-react';

export const AiInsightsPage: React.FC = () => {
  const [insights, setInsights] = useState<AiInsight[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        const ins = await api.getAiInsights();
        setInsights(ins);
      } catch (err) {
        console.error('Failed to load AI insights:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filtered = filterCategory === 'All'
    ? insights
    : insights.filter((i) => i.category.toLowerCase() === filterCategory.toLowerCase());

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
            <span className="text-xs text-gray-500 font-mono">Explainable AI Core</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Telangana AI Urban Insights
          </h1>
          <p className="text-sm text-gray-400">
            Explainable multi-sector spatial anomaly and predictive risk intelligence across Telangana.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 bg-[#111726] border border-[#222F4C] p-1.5 rounded-xl">
          <Filter className="w-3.5 h-3.5 text-gray-400 ml-2" />
          <span className="text-xs font-semibold text-gray-400">Sector:</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-[#161F33] text-gray-200 text-xs font-semibold rounded-lg px-3 py-1.5 border border-[#222F4C] focus:outline-none focus:border-emerald-500"
          >
            <option value="All">All Sectors ({insights.length})</option>
            <option value="Pollution">Pollution</option>
            <option value="Traffic">Traffic</option>
            <option value="Water">Water</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Infrastructure">Infrastructure</option>
          </select>
        </div>
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-sm text-gray-400">Loading Telangana AI insights...</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-gray-400">No insights found for this sector.</p>
        ) : (
          filtered.map((ins) => (
            <div
              key={ins.id}
              className="p-5 rounded-2xl bg-[#111726] border border-[#1E293B] hover:border-emerald-500/40 transition-all space-y-4 shadow-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1E293B] pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        ins.severity === 'CRITICAL' ? 'bg-red-500 animate-ping' : 'bg-amber-400'
                      }`}
                    />
                    <h3 className="text-base font-extrabold text-white tracking-tight">
                      {ins.title}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#161F33] text-gray-300 border border-[#222F4C]">
                      {ins.category}
                    </span>
                  </div>

                  {/* Mandatory Explicit Geographic Location Indicator */}
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-sm tracking-wide">
                    <span>{ins.locationBadge}</span>
                    <span className="text-xs text-gray-500 font-normal">
                      ({ins.city}, District: {ins.district})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-right">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-[#161F33] text-gray-200 border border-[#222F4C]">
                    {ins.metricValue}
                  </span>
                </div>
              </div>

              {/* Evidence Section */}
              <div className="space-y-1.5">
                <p className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Empirical Evidence:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {ins.evidence.map((ev, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-[#161F33] border border-[#222F4C] text-xs text-gray-300 flex items-start gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{ev}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendation Section */}
              <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs">
                <span className="text-emerald-400 font-bold uppercase tracking-wider block mb-1">
                  Policy & Civil Recommendation:
                </span>
                <p className="text-gray-200 leading-relaxed">{ins.recommendation}</p>
              </div>

              {/* Algorithm & Explainability Footer */}
              <div className="pt-2 border-t border-[#1E293B]/70 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-gray-500 gap-2">
                <div className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-teal-400" />
                  <span>Model: <span className="text-gray-400 font-medium">{ins.algorithm}</span></span>
                </div>
                <div>
                  Confidence: <span className="text-emerald-400 font-mono font-semibold">{(ins.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
