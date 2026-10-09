import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { UrbanLocation } from '../types';
import { Building2, MapPin, Search, Activity, Users, Car, CloudFog, Droplets, Shield } from 'lucide-react';

export const CityIntelligencePage: React.FC = () => {
  const [locations, setLocations] = useState<UrbanLocation[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('All Telangana');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<UrbanLocation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        const locs = await api.getLocations();
        setLocations(locs);
        if (locs.length > 0) setSelectedLocation(locs[0]);
      } catch (err) {
        console.error('Failed to load cities:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const cities = ['All Telangana', ...Array.from(new Set(locations.map((l) => l.city))).sort()];

  const filtered = locations.filter((loc) => {
    const matchesCity = selectedCity === 'All Telangana' || loc.city === selectedCity;
    const matchesSearch =
      loc.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.zone.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesSearch;
  });

  return (
    <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="border-b border-[#1E293B] pb-5 space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            📍 Telangana, India
          </span>
          <span className="text-xs text-gray-500 font-mono">Administrative Explorer</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Telangana City Intelligence
        </h1>
        <p className="text-sm text-gray-400">
          Explore urban conditions, risks and infrastructure across cities and districts of Telangana.
        </p>
      </div>

      {/* City Selector Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#111726] border border-[#1E293B] p-3 rounded-2xl">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Building2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
          <span className="text-xs font-semibold text-gray-300">City / District:</span>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="bg-[#161F33] text-gray-200 text-xs font-semibold rounded-lg px-3 py-2 border border-[#222F4C] focus:outline-none focus:border-emerald-500"
          >
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search Telangana zones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#161F33] border border-[#222F4C] rounded-lg pl-9 pr-3 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Main Grid: Location Cards & Selected Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Location Cards List */}
        <div className="lg:col-span-7 space-y-3 max-h-[620px] overflow-y-auto pr-2">
          {loading ? (
            <p className="text-sm text-gray-400">Loading Telangana locations...</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-gray-400">No matching Telangana locations found.</p>
          ) : (
            filtered.map((loc) => {
              const isSelected = selectedLocation?.locationId === loc.locationId;
              return (
                <div
                  key={loc.locationId}
                  onClick={() => setSelectedLocation(loc)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#161F33] border-emerald-500 shadow-lg'
                      : 'bg-[#111726] border-[#1E293B] hover:border-[#222F4C]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{loc.locationName}</h4>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono">
                          {loc.districtId}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        District: <span className="text-gray-200 font-medium">{loc.district}</span> | City: <span className="text-gray-200 font-medium">{loc.city}</span>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 block">Overall Risk</span>
                      <span className={`text-sm font-black ${
                        (loc.overallUrbanRisk || 50) >= 65 ? 'text-red-400' : 'text-amber-400'
                      }`}>
                        {loc.overallUrbanRisk || 50} / 100
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-[#1E293B] text-[11px]">
                    <div>
                      <span className="text-gray-500 block text-[9px]">TRAFFIC</span>
                      <span className="font-semibold text-amber-400">{loc.trafficRisk}%</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[9px]">AIR AQI</span>
                      <span className="font-semibold text-purple-400">{loc.aqi || 78}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[9px]">WATER STRESS</span>
                      <span className="font-semibold text-cyan-400">{loc.waterRisk}%</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[9px]">POPULATION</span>
                      <span className="font-semibold text-gray-300">
                        {loc.population ? (loc.population / 1000).toFixed(0) + 'k' : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Selected Location Deep Dive Panel */}
        <div className="lg:col-span-5">
          {selectedLocation ? (
            <div className="sticky top-20 p-5 rounded-2xl bg-[#111726] border border-[#222F4C] space-y-5 shadow-2xl">
              <div className="border-b border-[#1E293B] pb-3">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  📍 {selectedLocation.district} — {selectedLocation.zone}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{selectedLocation.locationName}</h3>
                <p className="text-xs text-gray-400">
                  Urban Category: <span className="text-gray-200 font-semibold">{selectedLocation.urbanCategory}</span>
                </p>
              </div>

              {/* Hierarchy identifiers table */}
              <div className="p-3 rounded-xl bg-[#0B0F19] border border-[#1E293B] space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-gray-400">
                  <span>State:</span> <span className="text-white">Telangana (TS)</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>District ID:</span> <span className="text-emerald-400">{selectedLocation.districtId}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>City ID:</span> <span className="text-teal-400">{selectedLocation.cityId}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Zone ID:</span> <span className="text-cyan-400">{selectedLocation.zoneId}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Location ID:</span> <span className="text-white">{selectedLocation.locationId}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Coordinates:</span> <span className="text-gray-300">{selectedLocation.latitude.toFixed(4)}°N, {selectedLocation.longitude.toFixed(4)}°E</span>
                </div>
              </div>

              {/* Multi-Sector Risk Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Sector Risk Metrics
                </h4>

                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-400">Traffic Congestion Risk</span>
                      <span className="font-semibold text-amber-400">{selectedLocation.trafficRisk}%</span>
                    </div>
                    <div className="w-full bg-[#161F33] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-400 h-full" style={{ width: `${selectedLocation.trafficRisk}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-400">Air Pollution Risk</span>
                      <span className="font-semibold text-purple-400">{selectedLocation.pollutionRisk}%</span>
                    </div>
                    <div className="w-full bg-[#161F33] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-purple-400 h-full" style={{ width: `${selectedLocation.pollutionRisk}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-400">Water Scarcity & Stress</span>
                      <span className="font-semibold text-blue-400">{selectedLocation.waterRisk}%</span>
                    </div>
                    <div className="w-full bg-[#161F33] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-400 h-full" style={{ width: `${selectedLocation.waterRisk}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-400">Healthcare Surge Pressure</span>
                      <span className="font-semibold text-rose-400">{selectedLocation.healthcarePressure}%</span>
                    </div>
                    <div className="w-full bg-[#161F33] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-rose-400 h-full" style={{ width: `${selectedLocation.healthcarePressure}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-400">Infrastructure Stress</span>
                      <span className="font-semibold text-teal-400">{selectedLocation.infrastructureStress}%</span>
                    </div>
                    <div className="w-full bg-[#161F33] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-teal-400 h-full" style={{ width: `${selectedLocation.infrastructureStress}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-[#111726] border border-[#1E293B] text-center text-gray-500 text-xs">
              Select a Telangana location to inspect detailed multi-sector telemetry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
