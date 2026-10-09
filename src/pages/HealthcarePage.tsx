import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { HeartPulse, MapPin, Bed, Activity, Clock, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const HealthcarePage: React.FC = () => {
  const [hcData, setHcData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        const h = await api.getHealthcareData();
        setHcData(h);
      } catch (err) {
        console.error('Failed to load healthcare data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const chartData = (hcData?.records || []).slice(0, 10).map((r: any) => ({
    name: r.zone.replace(' Zone', '').slice(0, 12),
    icu: r.icuOccupancyRatePct,
    beds: r.hospitalBedsPer1000,
    amb: r.ambulanceAvgResponseMin,
    district: r.district,
  }));

  return (
    <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="border-b border-[#1E293B] pb-5 space-y-1">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/25 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            📍 Telangana, India
          </span>
          <span className="text-xs text-gray-500 font-mono">Capacity & Epidemic Telemetry</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Telangana Healthcare Intelligence
        </h1>
        <p className="text-sm text-gray-400">
          Identify healthcare capacity pressure and underserved areas across Telangana.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#111726] border border-[#1E293B] flex items-center gap-4">
          <div className="p-3 rounded-lg bg-rose-500/10 text-rose-400">
            <Bed className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Hospital Beds / 1,000</p>
            <p className="text-2xl font-bold text-white">{hcData?.avgBedsPer1000 || 2.4}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#111726] border border-[#1E293B] flex items-center gap-4">
          <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Avg ICU Occupancy</p>
            <p className="text-2xl font-bold text-white">{hcData?.avgIcuOccupancyPct || 74.2}%</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#111726] border border-[#1E293B] flex items-center gap-4">
          <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Ambulance Response</p>
            <p className="text-2xl font-bold text-white">{hcData?.avgAmbulanceResponseMin || 16.2} min</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#111726] border border-[#1E293B] flex items-center gap-4">
          <div className="p-3 rounded-lg bg-red-500/10 text-red-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Critical Shortage Zones</p>
            <p className="text-2xl font-bold text-white">{hcData?.criticalShortageCount || 0}</p>
          </div>
        </div>
      </div>

      {/* ICU Capacity Chart */}
      <div className="p-5 rounded-2xl bg-[#111726] border border-[#1E293B] space-y-4">
        <h3 className="text-sm font-bold text-white">
          ICU Bed Occupancy Rate (%) across Monitored Telangana Urban Zones
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
              <Bar dataKey="icu" fill="#F43F5E" radius={[4, 4, 0, 0]} name="ICU Occupancy (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
