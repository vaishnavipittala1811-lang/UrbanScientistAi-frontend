import React, { useState, useEffect } from 'react';
import { Activity, Car, CloudFog, Droplets, HeartPulse, Building2, MapPin, Zap } from 'lucide-react';

interface CityNode {
  id: string;
  name: string;
  district: string;
  x: number;
  y: number;
  trafficRisk: number;
  aqi: number;
  waterStress: number;
  hcPressure: number;
  infraStress: number;
}

export const TelanganaMapVisual: React.FC = () => {
  const [activeNode, setActiveNode] = useState<CityNode | null>(null);
  const [ticker, setTicker] = useState<number>(0);

  // Key urban telemetry hubs across Telangana coordinates plotted on 500x500 SVG space
  const cityNodes: CityNode[] = [
    { id: 'HYD', name: 'Hyderabad Central', district: 'Hyderabad', x: 235, y: 310, trafficRisk: 78, aqi: 142, waterStress: 64, hcPressure: 72, infraStress: 61 },
    { id: 'WGL', name: 'Warangal Heritage', district: 'Warangal', x: 340, y: 220, trafficRisk: 58, aqi: 94, waterStress: 48, hcPressure: 55, infraStress: 42 },
    { id: 'HNK', name: 'Hanamkonda', district: 'Hanamkonda', x: 330, y: 205, trafficRisk: 52, aqi: 88, waterStress: 44, hcPressure: 51, infraStress: 39 },
    { id: 'KNR', name: 'Karimnagar Civic', district: 'Karimnagar', x: 300, y: 155, trafficRisk: 54, aqi: 82, waterStress: 52, hcPressure: 48, infraStress: 44 },
    { id: 'NZB', name: 'Nizamabad North', district: 'Nizamabad', x: 195, y: 130, trafficRisk: 61, aqi: 104, waterStress: 58, hcPressure: 60, infraStress: 52 },
    { id: 'KMM', name: 'Khammam Hub', district: 'Khammam', x: 390, y: 330, trafficRisk: 64, aqi: 98, waterStress: 46, hcPressure: 58, infraStress: 49 },
    { id: 'RGD', name: 'Ramagundam Industrial', district: 'Peddapalli', x: 330, y: 130, trafficRisk: 62, aqi: 156, waterStress: 61, hcPressure: 66, infraStress: 68 },
    { id: 'NLG', name: 'Nalgonda Gateway', district: 'Nalgonda', x: 285, y: 360, trafficRisk: 49, aqi: 76, waterStress: 67, hcPressure: 45, infraStress: 38 },
    { id: 'MBN', name: 'Mahbubnagar South', district: 'Mahbubnagar', x: 180, y: 395, trafficRisk: 51, aqi: 72, waterStress: 71, hcPressure: 49, infraStress: 41 },
    { id: 'SDP', name: 'Siddipet Eco-Model', district: 'Siddipet', x: 260, y: 220, trafficRisk: 39, aqi: 62, waterStress: 36, hcPressure: 42, infraStress: 33 },
    { id: 'PTN', name: 'Patancheru Chemical', district: 'Sangareddy', x: 205, y: 280, trafficRisk: 72, aqi: 168, waterStress: 69, hcPressure: 64, infraStress: 71 },
    { id: 'ADB', name: 'Adilabad Frontier', district: 'Adilabad', x: 230, y: 65, trafficRisk: 44, aqi: 68, waterStress: 42, hcPressure: 50, infraStress: 37 },
  ];

  useEffect(() => {
    setActiveNode(cityNodes[0]);
    const interval = setInterval(() => {
      setTicker((prev) => (prev + 1) % cityNodes.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setActiveNode(cityNodes[ticker]);
  }, [ticker]);

  return (
    <div className="relative w-full h-[520px] rounded-2xl bg-gradient-to-b from-[#111726]/90 to-[#0B0F19] border border-[#222F4C] p-4 flex flex-col justify-between overflow-hidden shadow-2xl shadow-emerald-950/20">
      {/* Top Bar: Regional Identity Badge */}
      <div className="flex items-center justify-between z-10 border-b border-[#1E293B] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-bold text-gray-200 uppercase tracking-wider">
            Telangana Autonomous Urban Sensing Grid
          </span>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          📍 TELANGANA STATE GRID
        </span>
      </div>

      {/* SVG Canvas: Telangana Outline + Connected City Nodes */}
      <div className="relative flex-1 flex items-center justify-center my-2">
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full max-h-[380px] drop-shadow-[0_0_25px_rgba(16,185,129,0.15)]"
        >
          <defs>
            {/* Holographic glowing lines */}
            <linearGradient id="telanganaGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#059669" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#0D9488" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.8" />
            </linearGradient>

            <radialGradient id="gridRadial" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background circular radar pulses */}
          <circle cx="250" cy="250" r="180" fill="none" stroke="#1E293B" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="250" cy="250" r="120" fill="none" stroke="#222F4C" strokeWidth="1" />
          <circle cx="250" cy="250" r="60" fill="none" stroke="#10B981" strokeOpacity="0.2" strokeWidth="1" />

          {/* Accurate stylized silhouette boundary path of Telangana state */}
          <path
            d="M 230,45 
               C 275,55 315,95 345,120 
               C 385,150 420,210 435,270 
               C 445,310 415,365 375,395 
               C 340,420 300,445 255,465 
               C 215,455 170,430 145,390 
               C 120,350 115,295 130,240 
               C 145,190 170,140 190,95 
               Z"
            fill="#111827"
            fillOpacity="0.75"
            stroke="url(#telanganaGlow)"
            strokeWidth="2.5"
            strokeLinejoin="round"
            className="transition-all duration-700 hover:fill-emerald-950/20"
          />

          {/* Arterial Data Transmission Connections between Telangana urban centers */}
          <g stroke="#10B981" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="3 3">
            {/* Hyderabad to Warangal */}
            <line x1="235" y1="310" x2="340" y2="220" />
            {/* Hyderabad to Nizamabad */}
            <line x1="235" y1="310" x2="195" y2="130" />
            {/* Hyderabad to Karimnagar */}
            <line x1="235" y1="310" x2="300" y2="155" />
            {/* Hyderabad to Mahbubnagar */}
            <line x1="235" y1="310" x2="180" y2="395" />
            {/* Hyderabad to Nalgonda */}
            <line x1="235" y1="310" x2="285" y2="360" />
            {/* Hyderabad to Khammam */}
            <line x1="235" y1="310" x2="390" y2="330" />
            {/* Warangal to Ramagundam */}
            <line x1="340" y1="220" x2="330" y2="130" />
            {/* Karimnagar to Ramagundam */}
            <line x1="300" y1="155" x2="330" y2="130" />
            {/* Nizamabad to Adilabad */}
            <line x1="195" y1="130" x2="230" y2="65" />
            {/* Sangareddy (Patancheru) to Hyderabad */}
            <line x1="205" y1="280" x2="235" y2="310" strokeWidth="2" strokeOpacity="0.6" />
          </g>

          {/* City Nodes */}
          {cityNodes.map((node) => {
            const isSelected = activeNode?.id === node.id;
            return (
              <g
                key={node.id}
                className="cursor-pointer group"
                onClick={() => setActiveNode(node)}
              >
                {/* Active Outer Pulsing Halo */}
                {isSelected && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="16"
                    fill="url(#gridRadial)"
                    className="animate-ping"
                  />
                )}

                {/* Node Outer Circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isSelected ? '7' : '4.5'}
                  fill={isSelected ? '#10B981' : '#0D9488'}
                  stroke="#F3F4F6"
                  strokeWidth={isSelected ? '2' : '1'}
                  className="transition-all duration-300 group-hover:scale-125"
                />

                {/* City Label */}
                <text
                  x={node.x + 8}
                  y={node.y + 4}
                  fill={isSelected ? '#10B981' : '#94A3B8'}
                  fontSize={isSelected ? '11' : '9'}
                  fontWeight={isSelected ? 'bold' : 'normal'}
                  fontFamily="Inter, sans-serif"
                  className="pointer-events-none transition-colors"
                >
                  {node.district}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Live Floating Node Telemetry Card */}
        {activeNode && (
          <div className="absolute top-2 right-2 max-w-[210px] bg-[#161F33]/95 border border-emerald-500/40 rounded-xl p-3 shadow-xl backdrop-blur-md transition-all">
            <div className="flex items-center gap-1.5 border-b border-[#222F4C] pb-1.5 mb-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <div>
                <p className="text-xs font-bold text-white leading-tight">{activeNode.district}</p>
                <p className="text-[10px] text-emerald-400 font-mono">{activeNode.name}</p>
              </div>
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-gray-400">
                  <Car className="w-3 h-3 text-amber-400" /> Traffic Risk
                </span>
                <span className="font-semibold text-amber-400">{activeNode.trafficRisk}%</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-gray-400">
                  <CloudFog className="w-3 h-3 text-purple-400" /> Air AQI
                </span>
                <span className={`font-semibold ${activeNode.aqi > 120 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {activeNode.aqi}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-gray-400">
                  <Droplets className="w-3 h-3 text-blue-400" /> Water Stress
                </span>
                <span className="font-semibold text-blue-400">{activeNode.waterStress}%</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-gray-400">
                  <HeartPulse className="w-3 h-3 text-rose-400" /> Health Strain
                </span>
                <span className="font-semibold text-rose-400">{activeNode.hcPressure}%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Telemetry Ticker Strip */}
      <div className="grid grid-cols-5 gap-2 pt-2 border-t border-[#1E293B] text-center">
        <div className="p-1.5 rounded-lg bg-[#111726]">
          <p className="text-[9px] text-gray-500 font-medium">TRAFFIC</p>
          <p className="text-xs font-bold text-amber-400">53.1%</p>
        </div>
        <div className="p-1.5 rounded-lg bg-[#111726]">
          <p className="text-[9px] text-gray-500 font-medium">AIR AQI</p>
          <p className="text-xs font-bold text-emerald-400">80 Avg</p>
        </div>
        <div className="p-1.5 rounded-lg bg-[#111726]">
          <p className="text-[9px] text-gray-500 font-medium">WATER</p>
          <p className="text-xs font-bold text-cyan-400">26.7% Def</p>
        </div>
        <div className="p-1.5 rounded-lg bg-[#111726]">
          <p className="text-[9px] text-gray-500 font-medium">HEALTH</p>
          <p className="text-xs font-bold text-rose-400">79.0 Index</p>
        </div>
        <div className="p-1.5 rounded-lg bg-[#111726]">
          <p className="text-[9px] text-gray-500 font-medium">INFRA</p>
          <p className="text-xs font-bold text-teal-400">72.5 PCI</p>
        </div>
      </div>
    </div>
  );
};
