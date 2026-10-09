import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { UrbanLocation } from '../types';
import { TelanganaMap } from '../components/TelanganaMap';
import { Droplets, MapPin, Waves, ShieldCheck, Database, AlertCircle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const WaterPage: React.FC = () => {
  const [locations, setLocations] = useState<UrbanLocation[]>([]);
  const [waterData, setWaterData] = useState<any>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All Telangana');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [locs, wtr] = await Promise.all([
          api.getLocations(),
          api.getWaterData(selectedDistrict === 'All Telangana' ? undefined : selectedDistrict),
        ]);
        setLocations(locs);
        setWaterData(wtr);
      } catch (err) {
        console.error('Failed to load water data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedDistrict]);

  const districts = ['All Telangana', ...Array.from(new Set(locations.map((l) => l.district))).sort()];

  const chartData = (waterData?.records || [])
    .slice(0, 10)
    .map((r: any) => ({
      name: r.zone.replace(' Zone', '').slice(0, 12),
      depth: r.groundwaterDepthM,
      deficit: r.supplyDeficitPct,
      wqi: r.waterQualityIndex,
      district: r.district,
    }));

  return (
    <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="border-b border-[#1E293B] pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              📍 Telangana, India
            </span>
            <span className="text-xs text-gray-500 font-mono">Hydro-Sensing</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Telangana Water Intelligence
          </h1>
          <p className="text-sm text-gray-400">
            Analyze water availability, quality and water-stress patterns across Telangana.
          </p>
        </div>

        {/* District Filter */}
        <div className="flex items-center gap-2 bg-[#111726] border border-[#222F4C] p-1.5 rounded-xl">
          <span className="text-xs font-semibold text-gray-400 pl-2">District:</span>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="bg-[#161F33] text-gray-200 text-xs font-semibold rounded-lg px-3 py-1.5 border border-[#222F4C] focus:outline-none focus:border-cyan-500"
          >
            {districts.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#111726] border border-[#1E293B] flex items-center gap-4">
          <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Avg Groundwater Depth</p>
            <p className="text-2xl font-bold text-white">{waterData?.avgGroundwaterDepthM || 21.4} m</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#111726] border border-[#1E293B] flex items-center gap-4">
          <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Supply Deficit</p>
            <p className="text-2xl font-bold text-white">{waterData?.avgSupplyDeficitPct || 26.7}%</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#111726] border border-[#1E293B] flex items-center gap-4">
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Waves className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Water Quality Index (WQI)</p>
            <p className="text-2xl font-bold text-white">{waterData?.avgWaterQualityIndex || 74.2}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#111726] border border-[#1E293B] flex items-center gap-4">
          <div className="p-3 rounded-lg bg-teal-500/10 text-teal-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Mission Bhagiratha Grid</p>
            <p className="text-2xl font-bold text-white">Active Telemetry</p>
          </div>
        </div>
      </div>

      {/* Map Section: Telangana Water Stress Map */}
      <div className="space-y-2">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <span>Telangana Water Stress Map</span>
          <span className="text-xs font-normal text-gray-400 font-mono">📍 Telangana, India</span>
        </h2>
        <TelanganaMap
          locations={locations}
          selectedDistrict={selectedDistrict}
          height="460px"
        />
      </div>

      {/* Groundwater Depth Chart */}
      <div className="p-5 rounded-2xl bg-[#111726] border border-[#1E293B] space-y-4">
        <h3 className="text-sm font-bold text-white">
          Groundwater Table Depth (m) across Monitored Telangana Zones
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} interval={0} angle={-25} textAnchor="end" />
              <YAxis stroke="#94A3B8" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#161F33', borderColor: '#222F4C', borderRadius: '8px' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Bar dataKey="depth" fill="#06B6D4" radius={[4, 4, 0, 0]} name="Water Table Depth (m)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
