import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { UrbanLocation } from '../types';
import { TelanganaMap } from '../components/TelanganaMap';
import { CloudFog, MapPin, Wind, AlertTriangle, ShieldCheck, Factory } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const PollutionPage: React.FC = () => {
  const [locations, setLocations] = useState<UrbanLocation[]>([]);
  const [pollutionData, setPollutionData] = useState<any>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All Telangana');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [locs, pol] = await Promise.all([
          api.getLocations(),
          api.getPollutionData(selectedDistrict === 'All Telangana' ? undefined : selectedDistrict),
        ]);
        setLocations(locs);
        setPollutionData(pol);
      } catch (err) {
        console.error('Failed to load pollution data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedDistrict]);

  const districts = ['All Telangana', ...Array.from(new Set(locations.map((l) => l.district))).sort()];

  const chartData = (pollutionData?.records || [])
    .slice(0, 10)
    .map((r: any) => ({
      name: r.zone.replace(' Zone', '').slice(0, 12),
      aqi: r.aqi,
      pm25: r.pm25,
      district: r.district,
    }));

  return (
    <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="border-b border-[#1E293B] pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/25 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              📍 Telangana, India
            </span>
            <span className="text-xs text-gray-500 font-mono">Air Quality Grid</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Telangana Pollution Intelligence
          </h1>
          <p className="text-sm text-gray-400">
            Monitor and analyze air-quality patterns across Telangana.
          </p>
        </div>

        {/* District Filter */}
        <div className="flex items-center gap-2 bg-[#111726] border border-[#222F4C] p-1.5 rounded-xl">
          <span className="text-xs font-semibold text-gray-400 pl-2">District:</span>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="bg-[#161F33] text-gray-200 text-xs font-semibold rounded-lg px-3 py-1.5 border border-[#222F4C] focus:outline-none focus:border-purple-500"
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
          <div className="p-3 rounded-lg bg-purple-500/10 text-purple-400">
            <CloudFog className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Average Telangana AQI</p>
            <p className="text-2xl font-bold text-white">{pollutionData?.avgAqi || 80}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#111726] border border-[#1E293B] flex items-center gap-4">
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Wind className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Average PM2.5</p>
            <p className="text-2xl font-bold text-white">{pollutionData?.avgPm25 || 38.4} µg/m³</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#111726] border border-[#1E293B] flex items-center gap-4">
          <div className="p-3 rounded-lg bg-red-500/10 text-red-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Critical AQI Corridors</p>
            <p className="text-2xl font-bold text-white">{pollutionData?.criticalAqiCount || 0}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#111726] border border-[#1E293B] flex items-center gap-4">
          <div className="p-3 rounded-lg bg-teal-500/10 text-teal-400">
            <Factory className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Industrial Belts</p>
            <p className="text-2xl font-bold text-white">Patancheru / Ramagundam</p>
          </div>
        </div>
      </div>

      {/* Map Section: Telangana Pollution Risk Map */}
      <div className="space-y-2">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <span>Telangana Pollution Risk Map</span>
          <span className="text-xs font-normal text-gray-400 font-mono">📍 Telangana, India</span>
        </h2>
        <TelanganaMap
          locations={locations}
          selectedDistrict={selectedDistrict}
          height="460px"
        />
      </div>

      {/* AQI Comparison Chart */}
      <div className="p-5 rounded-2xl bg-[#111726] border border-[#1E293B] space-y-4">
        <h3 className="text-sm font-bold text-white">
          Air Quality Index (AQI) Distribution across Monitored Telangana Zones
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} interval={0} angle={-25} textAnchor="end" />
              <YAxis stroke="#94A3B8" fontSize={11} domain={[0, 250]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#161F33', borderColor: '#222F4C', borderRadius: '8px' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Bar dataKey="aqi" fill="#A855F7" radius={[4, 4, 0, 0]} name="AQI Level" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
