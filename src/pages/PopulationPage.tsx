import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Users, MapPin, TrendingUp, Building, ArrowUpRight } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

export const PopulationPage: React.FC = () => {
  const [popData, setPopData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        const p = await api.getPopulationData();
        setPopData(p);
      } catch (err) {
        console.error('Failed to load population data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const chartData = (popData?.records || []).slice(0, 8).map((r: any) => ({
    name: r.zone.replace(' Zone', '').slice(0, 12),
    current: Math.round(r.currentPopulation / 1000),
    fc5: Math.round(r.forecast5yr / 1000),
    fc10: Math.round(r.forecast10yr / 1000),
    fc15: Math.round(r.forecast15yr / 1000),
    district: r.district,
  }));

  return (
    <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="border-b border-[#1E293B] pb-5 space-y-1">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            📍 Telangana, India
          </span>
          <span className="text-xs text-gray-500 font-mono">Demographic Projections</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Telangana Population Intelligence
        </h1>
        <p className="text-sm text-gray-400">
          Understand population growth and future urban demand across Telangana.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#111726] border border-[#1E293B] flex items-center gap-4">
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Current Population</p>
            <p className="text-2xl font-bold text-white">
              {popData?.totalCurrentPopulation ? (popData.totalCurrentPopulation / 1000000).toFixed(2) + 'M' : '12.72M'}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#111726] border border-[#1E293B] flex items-center gap-4">
          <div className="p-3 rounded-lg bg-teal-500/10 text-teal-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Annual Growth Rate</p>
            <p className="text-2xl font-bold text-white">2.64%</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#111726] border border-[#1E293B] flex items-center gap-4">
          <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Avg Density / sq km</p>
            <p className="text-2xl font-bold text-white">{popData?.avgDensityPerSqkm || 4820}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#111726] border border-[#1E293B] flex items-center gap-4">
          <div className="p-3 rounded-lg bg-purple-500/10 text-purple-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400">15-Year Projected</p>
            <p className="text-2xl font-bold text-white">
              {popData?.total15yrForecast ? (popData.total15yrForecast / 1000000).toFixed(2) + 'M' : '18.82M'}
            </p>
          </div>
        </div>
      </div>

      {/* Population Growth Forecast Chart */}
      <div className="p-5 rounded-2xl bg-[#111726] border border-[#1E293B] space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white">
            Telangana Urban Growth Cohort Projections (in Thousands)
          </h3>
          <p className="text-xs text-gray-400">Current baseline vs 5-year, 10-year, and 15-year forward demand projections</p>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} interval={0} angle={-25} textAnchor="end" />
              <YAxis stroke="#94A3B8" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#161F33', borderColor: '#222F4C', borderRadius: '8px' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="current" fill="#10B981" name="Current" radius={[3, 3, 0, 0]} />
              <Bar dataKey="fc5" fill="#0D9488" name="5-Yr Forecast" radius={[3, 3, 0, 0]} />
              <Bar dataKey="fc10" fill="#06B6D4" name="10-Yr Forecast" radius={[3, 3, 0, 0]} />
              <Bar dataKey="fc15" fill="#8B5CF6" name="15-Yr Forecast" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
