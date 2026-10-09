import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Workflow, MapPin, Zap, Trash2, ShieldCheck, AlertCircle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const InfrastructurePage: React.FC = () => {
  const [infraData, setInfraData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        const inf = await api.getInfrastructureData();
        setInfraData(inf);
      } catch (err) {
        console.error('Failed to load infrastructure data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const chartData = (infraData?.records || []).slice(0, 10).map((r: any) => ({
    name: r.zone.replace(' Zone', '').slice(0, 12),
    pci: r.roadQualityPci,
    sewage: r.sewageNetworkCoveragePct,
    power: r.powerGridReliabilityPct,
    district: r.district,
  }));

  return (
    <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="border-b border-[#1E293B] pb-5 space-y-1">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-500/25 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            📍 Telangana, India
          </span>
          <span className="text-xs text-gray-500 font-mono">Civic Asset Grid</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Telangana Infrastructure Intelligence
        </h1>
        <p className="text-sm text-gray-400">
          Identify infrastructure stress and maintenance priorities across Telangana.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#111726] border border-[#1E293B] flex items-center gap-4">
          <div className="p-3 rounded-lg bg-teal-500/10 text-teal-400">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Power Grid Reliability</p>
            <p className="text-2xl font-bold text-white">{infraData?.avgPowerGridReliabilityPct || 94.2}%</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#111726] border border-[#1E293B] flex items-center gap-4">
          <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Workflow className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Sewage Network Coverage</p>
            <p className="text-2xl font-bold text-white">{infraData?.avgSewageCoveragePct || 64.8}%</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#111726] border border-[#1E293B] flex items-center gap-4">
          <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Road Quality (PCI Score)</p>
            <p className="text-2xl font-bold text-white">{infraData?.avgRoadPci || 68.4} / 100</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#111726] border border-[#1E293B] flex items-center gap-4">
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Trash2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Solid Waste Processing</p>
            <p className="text-2xl font-bold text-white">78.5% Efficiency</p>
          </div>
        </div>
      </div>

      {/* Road Quality PCI Chart */}
      <div className="p-5 rounded-2xl bg-[#111726] border border-[#1E293B] space-y-4">
        <h3 className="text-sm font-bold text-white">
          Pavement Condition Index (PCI) across Monitored Telangana Zones
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} interval={0} angle={-25} textAnchor="end" />
              <YAxis stroke="#94A3B8" fontSize={11} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#161F33', borderColor: '#222F4C', borderRadius: '8px' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Bar dataKey="pci" fill="#0D9488" radius={[4, 4, 0, 0]} name="PCI Quality Score" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
