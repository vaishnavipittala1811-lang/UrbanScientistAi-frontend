import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { DashboardSummary, UrbanLocation, AiInsight } from '../types';
import { TelanganaMap } from '../components/TelanganaMap';
import {
  MapPin,
  Activity,
  Car,
  CloudFog,
  Droplets,
  HeartPulse,
  Workflow,
  Sparkles,
  AlertTriangle,
  ArrowUpRight,
  TrendingDown,
  ChevronRight,
  ShieldAlert,
  Flame
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [locations, setLocations] = useState<UrbanLocation[]>([]);
  const [insights, setInsights] = useState<AiInsight[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All Telangana');
  const [districts, setDistricts] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [sumRes, locRes, insRes] = await Promise.all([
          api.getDashboardSummary(),
          api.getLocations(),
          api.getAiInsights(),
        ]);
        setSummary(sumRes);
        setLocations(locRes);
        setInsights(insRes);

        // Unique districts
        const dists = Array.from(new Set(locRes.map((l) => l.district))).sort();
        setDistricts(dists);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading && !summary) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-gray-400">Loading Telangana Urban Intelligence...</p>
        </div>
      </div>
    );
  }

  const healthScore = summary?.healthScore || 58.9;
  const healthCat = summary?.healthCategory || 'Moderate';

  return (
    <div className="flex-1 p-6 space-y-8 max-w-7xl mx-auto w-full">
      {/* Top Header & Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E293B] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              📍 Telangana, India
            </span>
            <span className="text-xs text-gray-500 font-mono">Statewide Urban Twin</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Telangana Urban Intelligence
          </h1>
          <p className="text-sm text-gray-400">
            Real-time and predictive intelligence across Telangana's urban systems
          </p>
        </div>

        {/* District Filter Pill */}
        <div className="flex items-center gap-2 bg-[#111726] border border-[#222F4C] p-1.5 rounded-xl">
          <label className="text-xs font-semibold text-gray-400 pl-2">Filter District:</label>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="bg-[#161F33] text-gray-200 text-xs font-semibold rounded-lg px-3 py-1.5 border border-[#222F4C] focus:outline-none focus:border-emerald-500"
          >
            <option value="All Telangana">All Telangana (33 Districts)</option>
            {districts.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Top Metric Cards: Telangana Urban Health Score & Sector Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Official Telangana Urban Health Score */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#161F33] to-[#0B0F19] border border-[#222F4C] relative overflow-hidden shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Telangana Urban Health Score
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
              healthCat === 'Good' || healthCat === 'Excellent' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
            }`}>
              {healthCat}
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-black text-white">{healthScore}</span>
            <span className="text-xs text-gray-400 font-mono">/ 100</span>
          </div>

          <div className="w-full bg-[#111726] h-2 rounded-full mt-3 overflow-hidden border border-[#222F4C]">
            <div
              className={`h-full transition-all duration-1000 ${
                healthScore >= 70 ? 'bg-emerald-500' : (healthScore >= 50 ? 'bg-amber-500' : 'bg-red-500')
              }`}
              style={{ width: `${healthScore}%` }}
            />
          </div>

          <p className="text-[11px] text-gray-400 mt-2 flex items-center justify-between">
            <span>Composite Resilience</span>
            <span className="text-gray-300 font-medium">71 Nodes Analyzed</span>
          </p>
        </div>

        {/* Card 2: Air Quality Index */}
        <div className="p-5 rounded-2xl bg-[#111726] border border-[#1E293B] shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Average Air AQI</span>
            <CloudFog className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{summary?.averageAqi || 80}</span>
            <span className="text-xs text-emerald-400 font-semibold">Satisfactory</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-3">
            Dominant stress in Patancheru & Ramagundam industrial belts
          </p>
        </div>

        {/* Card 3: Arterial Congestion */}
        <div className="p-5 rounded-2xl bg-[#111726] border border-[#1E293B] shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Traffic Congestion</span>
            <Car className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{summary?.averageCongestionPct || 53.1}%</span>
            <span className="text-xs text-amber-400 font-semibold">+6.2% Peak Surge</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-3">
            Hyderabad ORR, Kazipet & Nizamabad junctions flagged
          </p>
        </div>

        {/* Card 4: Water Supply Deficit */}
        <div className="p-5 rounded-2xl bg-[#111726] border border-[#1E293B] shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Water Supply Deficit</span>
            <Droplets className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{summary?.averageWaterDeficitPct || 26.7}%</span>
            <span className="text-xs text-cyan-400 font-semibold">Mission Bhagiratha</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-3">
            Groundwater table monitoring active across 33 districts
          </p>
        </div>
      </div>

      {/* Main Map Component: Telangana Urban Risk Map */}
      <div className="space-y-3">
        <TelanganaMap
          locations={locations}
          selectedDistrict={selectedDistrict}
          height="540px"
        />
      </div>

      {/* Bottom Grid: Live AI Insights & District Rankings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: AI Urban Insights */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#111726] border border-[#1E293B] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-base text-white">
                Telangana AI Urban Insights
              </h3>
            </div>
            <Link
              to="/ai-insights"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1"
            >
              View All ({insights.length})
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {insights.slice(0, 3).map((ins) => (
              <div
                key={ins.id}
                className="p-4 rounded-xl bg-[#161F33] border border-[#222F4C] space-y-2 hover:border-emerald-500/30 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-white tracking-tight flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${ins.severity === 'CRITICAL' ? 'bg-red-500' : 'bg-amber-400'}`} />
                      {ins.title}
                    </span>
                    {/* Mandatory Geographic Location Badge */}
                    <p className="text-xs font-bold text-emerald-400 font-mono">
                      {ins.locationBadge}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#0B0F19] text-gray-300 border border-[#1E293B]">
                    {ins.metricValue}
                  </span>
                </div>

                <div className="text-xs text-gray-400 space-y-1">
                  <p className="text-[11px] font-semibold text-gray-300">Evidence:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-gray-400 pl-1">
                    {ins.evidence.map((e, idx) => (
                      <li key={idx}>{e}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-[#1E293B] text-[11px]">
                  <span className="text-emerald-400 font-semibold">Recommendation: </span>
                  <span className="text-gray-300">{ins.recommendation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: District Health Leaderboard */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#111726] border border-[#1E293B] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <h3 className="font-bold text-base text-white">
              Telangana District Health Scores
            </h3>
            <span className="text-xs text-gray-400 font-mono">33 Districts</span>
          </div>

          <div className="max-h-[380px] overflow-y-auto space-y-2 pr-1">
            {summary?.healthBreakdown?.districtBreakdown &&
              Object.entries(summary.healthBreakdown.districtBreakdown)
                .sort((a, b) => b[1] - a[1])
                .map(([dist, score], idx) => (
                  <div
                    key={dist}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-[#161F33] border border-[#222F4C] text-xs hover:border-emerald-500/30 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#0B0F19] flex items-center justify-center font-mono font-bold text-[10px] text-gray-400">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-gray-200">{dist}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-[#0B0F19] h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${score >= 75 ? 'bg-emerald-500' : (score >= 60 ? 'bg-amber-500' : 'bg-red-400')}`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                      <span className="font-bold text-white w-9 text-right">{score}</span>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};
