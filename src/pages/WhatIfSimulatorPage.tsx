import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { UrbanLocation, Intervention, SimulationResult } from '../types';
import { SlidersHorizontal, MapPin, Play, RefreshCw, CheckCircle2, TrendingDown, DollarSign, Users, Leaf, ArrowRight } from 'lucide-react';

export const WhatIfSimulatorPage: React.FC = () => {
  const [locations, setLocations] = useState<UrbanLocation[]>([]);
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Hyderabad');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedZone, setSelectedZone] = useState<string>('');
  const [selectedInterventionId, setSelectedInterventionId] = useState<string>('TS-INT-001');
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [running, setRunning] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function init() {
      try {
        const [locs, ints] = await Promise.all([
          api.getLocations(),
          api.getInterventions(),
        ]);
        setLocations(locs);
        setInterventions(ints);

        if (ints.length > 0) setSelectedInterventionId(ints[0].interventionId);

        // Run default simulation for initial view
        const initSim = await api.runSimulation({
          district: 'Hyderabad',
          interventionId: ints[0]?.interventionId || 'TS-INT-001',
        });
        setSimulationResult(initSim);
      } catch (err) {
        console.error('Failed to initialize simulator:', err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const districts = Array.from(new Set(locations.map((l) => l.district))).sort();
  const districtLocations = locations.filter((l) => l.district === selectedDistrict);
  const cities = Array.from(new Set(districtLocations.map((l) => l.city))).sort();
  const zones = districtLocations.map((l) => l.zone);

  const handleSimulate = async () => {
    setRunning(true);
    try {
      const res = await api.runSimulation({
        district: selectedDistrict,
        city: selectedCity || undefined,
        zone: selectedZone || undefined,
        interventionId: selectedInterventionId,
      });
      setSimulationResult(res);
    } catch (err) {
      console.error('Simulation run error:', err);
    } finally {
      setRunning(false);
    }
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
          <span className="text-xs text-gray-500 font-mono">Dynamic AI Sandbox</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Telangana Urban What-If Simulator
        </h1>
        <p className="text-sm text-gray-400">
          Evaluate the potential impact of urban interventions across Telangana before implementation.
        </p>
      </div>

      {/* Simulator Control Sandbox */}
      <div className="p-6 rounded-2xl bg-[#111726] border border-[#1E293B] space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
          <span className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
            Configure Scenario Parameters
          </span>
          <span className="text-[11px] font-mono text-emerald-400">
            Backend Computational Engine (Java Spring Data)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          {/* District Select */}
          <div className="space-y-1.5">
            <label className="font-semibold text-gray-300">1. District:</label>
            <select
              value={selectedDistrict}
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                setSelectedCity('');
                setSelectedZone('');
              }}
              className="w-full bg-[#161F33] text-gray-200 rounded-lg p-2.5 border border-[#222F4C] focus:outline-none focus:border-emerald-500"
            >
              {districts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* City Select */}
          <div className="space-y-1.5">
            <label className="font-semibold text-gray-300">2. City / Municipality (Optional):</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-[#161F33] text-gray-200 rounded-lg p-2.5 border border-[#222F4C] focus:outline-none focus:border-emerald-500"
            >
              <option value="">All Cities in {selectedDistrict}</option>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Zone Select */}
          <div className="space-y-1.5">
            <label className="font-semibold text-gray-300">3. Specific Zone / Node:</label>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="w-full bg-[#161F33] text-gray-200 rounded-lg p-2.5 border border-[#222F4C] focus:outline-none focus:border-emerald-500"
            >
              <option value="">District Wide Node Aggregate</option>
              {zones.map((z) => (
                <option key={z} value={z}>{z}</option>
              ))}
            </select>
          </div>

          {/* Intervention Select */}
          <div className="space-y-1.5">
            <label className="font-semibold text-gray-300">4. Civil Intervention:</label>
            <select
              value={selectedInterventionId}
              onChange={(e) => setSelectedInterventionId(e.target.value)}
              className="w-full bg-[#161F33] text-gray-200 rounded-lg p-2.5 border border-[#222F4C] focus:outline-none focus:border-emerald-500"
            >
              {interventions.map((i) => (
                <option key={i.interventionId} value={i.interventionId}>
                  [{i.category}] {i.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-[11px] text-gray-400">
            Note: Results are computed in real time by the backend differential simulation service.
          </p>

          <button
            onClick={handleSimulate}
            disabled={running}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
          >
            {running ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Computing Differential Models...
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                Execute Telangana Simulation
              </>
            )}
          </button>
        </div>
      </div>

      {/* Simulation Output Dashboard */}
      {simulationResult && (
        <div className="p-6 rounded-2xl bg-[#111726] border border-emerald-500/40 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1E293B] pb-4">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Simulation Projection Verified: {simulationResult.geographicScope}
              </span>
              <h3 className="text-xl font-extrabold text-white mt-0.5">
                {simulationResult.interventionName}
              </h3>
              <p className="text-xs text-gray-400">
                Target Node: <span className="text-gray-200 font-semibold">{simulationResult.location}</span> ({simulationResult.district})
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-gray-400 uppercase block font-semibold">Net Overall Risk Reduction</span>
              <span className="text-3xl font-black text-emerald-400">
                -{simulationResult.riskReductionPct}%
              </span>
            </div>
          </div>

          {/* Metric Comparison Cards (Before vs Projected) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            {/* Traffic Risk */}
            <div className="p-4 rounded-xl bg-[#161F33] border border-[#222F4C] space-y-2">
              <span className="text-gray-400 text-[11px] font-semibold block">Traffic Risk Index</span>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 line-through">{simulationResult.currentTrafficRisk}</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-lg font-bold text-white">{simulationResult.projectedTrafficRisk}</span>
              </div>
              <p className="text-[10px] text-emerald-400 font-medium">
                {simulationResult.currentTrafficRisk > simulationResult.projectedTrafficRisk ? 'Mitigated Bottleneck' : 'Unchanged'}
              </p>
            </div>

            {/* Pollution Risk */}
            <div className="p-4 rounded-xl bg-[#161F33] border border-[#222F4C] space-y-2">
              <span className="text-gray-400 text-[11px] font-semibold block">Pollution Risk Index</span>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 line-through">{simulationResult.currentPollutionRisk}</span>
                <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-lg font-bold text-white">{simulationResult.projectedPollutionRisk}</span>
              </div>
              <p className="text-[10px] text-purple-400 font-medium">
                {simulationResult.currentPollutionRisk > simulationResult.projectedPollutionRisk ? 'Air Emission Scrubbing' : 'Unchanged'}
              </p>
            </div>

            {/* Overall Composite Risk */}
            <div className="p-4 rounded-xl bg-[#161F33] border border-[#222F4C] space-y-2">
              <span className="text-gray-400 text-[11px] font-semibold block">Overall Urban Risk</span>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 line-through">{simulationResult.currentOverallRisk}</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-lg font-bold text-emerald-400">{simulationResult.projectedOverallRisk}</span>
              </div>
              <p className="text-[10px] text-gray-400 font-mono">0-100 Multi-Sector</p>
            </div>

            {/* Population Benefited */}
            <div className="p-4 rounded-xl bg-[#161F33] border border-[#222F4C] space-y-2">
              <span className="text-gray-400 text-[11px] font-semibold block">Population Benefited</span>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <span className="text-lg font-bold text-white">
                  {simulationResult.populationBenefited.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-mono">Civic Reach</p>
            </div>
          </div>

          {/* Investment & Returns Strip */}
          <div className="p-4 rounded-xl bg-[#0B0F19] border border-[#1E293B] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <p className="text-gray-400 text-[11px]">Estimated Capital Cost</p>
                <p className="font-bold text-white text-sm">₹{simulationResult.estimatedCostInrCrores} Crores</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-teal-500/10 text-teal-400">
                <Leaf className="w-4 h-4" />
              </div>
              <div>
                <p className="text-gray-400 text-[11px]">CO2 Reduction</p>
                <p className="font-bold text-white text-sm">{simulationResult.co2ReductionTonsYr.toLocaleString()} tons/year</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                <TrendingDown className="w-4 h-4" />
              </div>
              <div>
                <p className="text-gray-400 text-[11px]">Estimated Social ROI</p>
                <p className="font-bold text-white text-sm">{simulationResult.estimatedRoi}x Multiplier</p>
              </div>
            </div>
          </div>

          {/* Scientific Rationale Statement */}
          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs space-y-1">
            <span className="font-bold text-emerald-400 uppercase tracking-wider block">
              Computational Scientific Rationale:
            </span>
            <p className="text-gray-300 leading-relaxed font-sans">
              {simulationResult.scientificRationale}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
