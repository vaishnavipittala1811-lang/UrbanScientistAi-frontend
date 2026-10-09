import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { UrbanLocation, DevelopmentTrends, TrendMetricKey } from '../types';
import { api } from '../services/api';
import {
  Layers,
  Map as MapIcon,
  Globe,
  ExternalLink,
  Compass,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Activity,
  X,
  Pin,
  PinOff,
  Maximize2,
  Minimize2,
  TreePine,
  Thermometer,
  Wind,
  Building2,
  Droplets,
  Clock
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import 'leaflet/dist/leaflet.css';

interface TelanganaMapProps {
  locations: UrbanLocation[];
  selectedDistrict?: string;
  onSelectLocation?: (loc: UrbanLocation) => void;
  height?: string;
}

export type ActiveLayer = 'Overall' | 'Traffic' | 'Pollution' | 'Water' | 'Healthcare' | 'Population' | 'Infrastructure';
export type GoogleBasemapMode = 'roadmap' | 'hybrid' | 'terrain';

const GOOGLE_BASEMAPS: Record<GoogleBasemapMode, { name: string; url: string; label: string }> = {
  roadmap: {
    name: 'Google Maps (Roads)',
    label: 'Roads',
    url: 'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
  },
  hybrid: {
    name: 'Google Satellite (Hybrid)',
    label: 'Satellite',
    url: 'https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
  },
  terrain: {
    name: 'Google Terrain',
    label: 'Terrain',
    url: 'https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
  },
};

interface MetricConfig {
  key: TrendMetricKey;
  label: string;
  shortLabel: string;
  unit: string;
  icon: React.FC<{ className?: string }>;
  positiveLabel: string;
  negativeLabel: string;
  isPositiveGood: boolean;
  color: string;
}

const METRICS_CONFIG: Record<TrendMetricKey, MetricConfig> = {
  greenCover: {
    key: 'greenCover',
    label: 'Green Cover / NDVI',
    shortLabel: 'Green Cover',
    unit: '%',
    icon: TreePine,
    positiveLabel: 'Improvement',
    negativeLabel: 'Degradation',
    isPositiveGood: true,
    color: '#10B981', // emerald
  },
  surfaceTemperature: {
    key: 'surfaceTemperature',
    label: 'Surface Temperature',
    shortLabel: 'Temperature',
    unit: '°C',
    icon: Thermometer,
    positiveLabel: 'Warming Stress',
    negativeLabel: 'Cooling Effect',
    isPositiveGood: false,
    color: '#F59E0B', // amber
  },
  airQuality: {
    key: 'airQuality',
    label: 'Air Quality (AQI)',
    shortLabel: 'Air Quality',
    unit: ' AQI',
    icon: Wind,
    positiveLabel: 'Pollution Surge',
    negativeLabel: 'Air Quality Improvement',
    isPositiveGood: false,
    color: '#8B5CF6', // purple
  },
  builtUpArea: {
    key: 'builtUpArea',
    label: 'Built-up Area Density',
    shortLabel: 'Built-up Area',
    unit: '%',
    icon: Building2,
    positiveLabel: 'Urban Expansion',
    negativeLabel: 'Urban Contraction',
    isPositiveGood: true,
    color: '#06B6D4', // cyan
  },
  waterAvailability: {
    key: 'waterAvailability',
    label: 'Water Availability',
    shortLabel: 'Water Supply',
    unit: '%',
    icon: Droplets,
    positiveLabel: 'Water Security Improvement',
    negativeLabel: 'Water Stress Decline',
    isPositiveGood: true,
    color: '#3B82F6', // blue
  },
};

const METRIC_KEYS: TrendMetricKey[] = [
  'greenCover',
  'surfaceTemperature',
  'airQuality',
  'builtUpArea',
  'waterAvailability'
];

/**
 * Custom dark-themed tooltip for synchronized comparison charts
 */
const CustomChartTooltip = ({ active, payload, label, unit }: any) => {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    return (
      <div className="bg-[#0B0F19]/95 border border-[#334155] rounded-md px-2 py-1 text-[10px] shadow-xl text-gray-200 pointer-events-none">
        <span className="text-gray-400 font-mono">{label}:</span>{' '}
        <span className="font-bold text-white">
          {val}
          {unit}
        </span>
      </div>
    );
  }
  return null;
};

/**
 * Reusable Synchronized Line Chart Pair Component
 */
interface TrendChartsProps {
  trends: DevelopmentTrends;
  activeMetric: TrendMetricKey;
  onSelectMetric: (key: TrendMetricKey) => void;
  compact?: boolean;
}

const DevelopmentImpactSection: React.FC<TrendChartsProps> = ({
  trends,
  activeMetric,
  onSelectMetric,
  compact = false,
}) => {
  const config = METRICS_CONFIG[activeMetric];
  const delta = trends.deltas ? trends.deltas[activeMetric] : null;

  const beforeYears = trends.beforeDevelopment?.years || [2019, 2020, 2021, 2022, 2023];
  const afterYears = trends.afterDevelopment?.years || [2024, 2025, 2026, 2027, 2028];

  const beforeVals: number[] = (trends.beforeDevelopment as any)?.[activeMetric] || [];
  const afterVals: number[] = (trends.afterDevelopment as any)?.[activeMetric] || [];

  const beforeChartData = beforeYears.map((yr, idx) => ({
    year: `${yr}`,
    val: beforeVals[idx] ?? 0,
  }));

  const afterChartData = afterYears.map((yr, idx) => ({
    year: `${yr}`,
    val: afterVals[idx] ?? 0,
  }));

  // Synchronize Y-axis scales between Before and After charts
  const allVals = [...beforeVals, ...afterVals].filter((v) => typeof v === 'number');
  const minVal = allVals.length > 0 ? Math.min(...allVals) : 0;
  const maxVal = allVals.length > 0 ? Math.max(...allVals) : 100;
  const padding = Math.max(1, (maxVal - minVal) * 0.18);
  const yDomain: [number, number] = [
    Math.max(0, Math.floor(minVal - padding)),
    Math.ceil(maxVal + padding),
  ];

  // Delta calculation & badge
  const changeAbs = delta ? delta.changeAbs : 0;
  const changePct = delta ? delta.changePct : 0;
  const isPositiveChange = changeAbs >= 0;
  const isGood = config.isPositiveGood ? isPositiveChange : !isPositiveChange;
  const impactLabel = isPositiveChange ? config.positiveLabel : config.negativeLabel;

  return (
    <div className="w-full text-xs font-sans text-gray-200">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-[#222F4C]">
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <h5 className="font-bold text-[11px] text-white tracking-wide uppercase">
            Development Impact Comparison
          </h5>
        </div>
        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#111726] border border-[#222F4C] text-emerald-400">
          5-YR BASELINE VS PROJECTION
        </span>
      </div>

      {/* Metric Selector Pills */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1.5 mb-2 scrollbar-none">
        {METRIC_KEYS.map((k) => {
          const cfg = METRICS_CONFIG[k];
          const IconComp = cfg.icon;
          const isSelected = activeMetric === k;
          return (
            <button
              key={k}
              type="button"
              onClick={() => onSelectMetric(k)}
              className={`px-2 py-1 rounded text-[10px] font-medium flex items-center gap-1 transition-all shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-[#111726] hover:bg-[#1A2338] text-gray-400 hover:text-white border border-[#222F4C]'
              }`}
            >
              <IconComp className="w-3 h-3 shrink-0" />
              <span>{cfg.shortLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Delta Indicator Banner */}
      <div className="bg-[#0B0F19] rounded-lg p-2 border border-[#222F4C] mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
              isGood
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}
          >
            {isPositiveChange ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
          </span>
          <div>
            <div className="text-[10px] text-gray-400 leading-tight">
              {config.label} Impact:
            </div>
            <div className="text-[11px] font-bold text-white flex items-center gap-1">
              <span>{impactLabel}</span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div
            className={`font-mono font-bold text-xs ${
              isGood ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {isPositiveChange ? '+' : ''}
            {changeAbs}
            {config.unit} ({isPositiveChange ? '+' : ''}
            {changePct}%)
          </div>
          <div className="text-[9px] text-gray-400">
            2023 Baseline → 2028 Target
          </div>
        </div>
      </div>

      {/* Side-by-Side Synchronized Line Charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {/* LEFT PANEL: Before Development (Historical Baseline) */}
        <div className="bg-[#0B0F19] p-2 rounded-lg border border-[#222F4C] flex flex-col">
          <div className="flex items-center justify-between mb-1 pb-1 border-b border-[#1E293B]">
            <div>
              <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" />
                Before Development
              </div>
              <div className="text-[9px] text-gray-400">Historical Baseline</div>
            </div>
            <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-[#161F33] text-gray-300">
              2019–2023
            </span>
          </div>

          <div style={{ height: compact ? 70 : 85 }} className="w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={beforeChartData} margin={{ top: 6, right: 6, left: -22, bottom: 0 }}>
                <XAxis
                  dataKey="year"
                  tick={{ fill: '#64748B', fontSize: 9 }}
                  axisLine={{ stroke: '#1E293B' }}
                  tickLine={false}
                />
                <YAxis
                  domain={yDomain}
                  tick={{ fill: '#64748B', fontSize: 8 }}
                  axisLine={{ stroke: '#1E293B' }}
                  tickLine={false}
                  width={30}
                />
                <Tooltip content={<CustomChartTooltip unit={config.unit} />} />
                <Line
                  type="monotone"
                  dataKey="val"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  dot={{ r: 2.5, fill: '#F59E0B' }}
                  activeDot={{ r: 4, fill: '#FBBF24' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-1 pt-1 border-t border-[#1E293B] flex items-center justify-between text-[9px] text-gray-400">
            <span>
              2019: <strong className="text-gray-200">{beforeVals[0] ?? '-'}{config.unit}</strong>
            </span>
            <ArrowRight className="w-2.5 h-2.5 text-gray-500" />
            <span>
              2023: <strong className="text-amber-300">{beforeVals[4] ?? '-'}{config.unit}</strong>
            </span>
          </div>
        </div>

        {/* RIGHT PANEL: After Development (Current / Projected) */}
        <div className="bg-[#0B0F19] p-2 rounded-lg border border-[#222F4C] flex flex-col">
          <div className="flex items-center justify-between mb-1 pb-1 border-b border-[#1E293B]">
            <div>
              <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <TrendingUp className="w-2.5 h-2.5" />
                After Development
              </div>
              <div className="text-[9px] text-gray-400">Current / Projected</div>
            </div>
            <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-[#161F33] text-gray-300">
              2024–2028
            </span>
          </div>

          <div style={{ height: compact ? 70 : 85 }} className="w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={afterChartData} margin={{ top: 6, right: 6, left: -22, bottom: 0 }}>
                <XAxis
                  dataKey="year"
                  tick={{ fill: '#64748B', fontSize: 9 }}
                  axisLine={{ stroke: '#1E293B' }}
                  tickLine={false}
                />
                <YAxis
                  domain={yDomain}
                  tick={{ fill: '#64748B', fontSize: 8 }}
                  axisLine={{ stroke: '#1E293B' }}
                  tickLine={false}
                  width={30}
                />
                <Tooltip content={<CustomChartTooltip unit={config.unit} />} />
                <Line
                  type="monotone"
                  dataKey="val"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ r: 2.5, fill: '#10B981' }}
                  activeDot={{ r: 4, fill: '#34D399' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-1 pt-1 border-t border-[#1E293B] flex items-center justify-between text-[9px] text-gray-400">
            <span>
              2024: <strong className="text-gray-200">{afterVals[0] ?? '-'}{config.unit}</strong>
            </span>
            <ArrowRight className="w-2.5 h-2.5 text-gray-500" />
            <span>
              2028: <strong className="text-emerald-300">{afterVals[4] ?? '-'}{config.unit}</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TelanganaMap: React.FC<TelanganaMapProps> = ({
  locations,
  selectedDistrict,
  onSelectLocation,
  height = '520px',
}) => {
  const [activeLayer, setActiveLayer] = useState<ActiveLayer>('Overall');
  const [basemapMode, setBasemapMode] = useState<GoogleBasemapMode>('roadmap');

  // Interactive Hover & Comparison State
  const [hoveredLoc, setHoveredLoc] = useState<UrbanLocation | null>(null);
  const [hoverTrends, setHoverTrends] = useState<DevelopmentTrends | null>(null);
  const [activeMetric, setActiveMetric] = useState<TrendMetricKey>('greenCover');
  const [isPinned, setIsPinned] = useState<boolean>(false);
  const [isCompactHover, setIsCompactHover] = useState<boolean>(false);
  const [showHoverPanel, setShowHoverPanel] = useState<boolean>(true);

  // In-memory cache for location temporal data (zero redundant network calls)
  const trendCache = useRef<Record<string, DevelopmentTrends>>({});
  const hoverTimerRef = useRef<any>(null);

  // Filter locations if district selected
  const filtered = selectedDistrict && selectedDistrict !== 'All Telangana'
    ? locations.filter((l) => l.district.toLowerCase() === selectedDistrict.toLowerCase())
    : locations;

  // Center of Telangana State (Latitude: 17.85, Longitude: 79.15)
  const telanganaCenter: [number, number] = [17.85, 79.15];

  // Fetch or retrieve cached trends
  const fetchTrendsForLocation = useCallback(async (loc: UrbanLocation) => {
    if (trendCache.current[loc.locationId]) {
      setHoverTrends(trendCache.current[loc.locationId]);
      return;
    }
    try {
      const data = await api.getDevelopmentTrends(loc.locationId);
      trendCache.current[loc.locationId] = data;
      setHoverTrends(data);
    } catch (err) {
      console.error('Failed to load development trends for', loc.locationId, err);
    }
  }, []);

  // Debounced hover handler (75ms debounce)
  const handleMarkerMouseOver = (loc: UrbanLocation) => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      setHoveredLoc(loc);
      fetchTrendsForLocation(loc);
    }, 75);
  };

  const handleMarkerMouseOut = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    if (!isPinned) {
      hoverTimerRef.current = setTimeout(() => {
        // Retain last hovered location if user wants to look at floating dock
      }, 300);
    }
  };

  // Helper to color circles based on selected layer and risk severity
  const getMarkerColor = (loc: UrbanLocation): string => {
    let score = loc.overallUrbanRisk || 50;
    if (activeLayer === 'Traffic') score = loc.trafficRisk || 50;
    if (activeLayer === 'Pollution') score = loc.pollutionRisk || 50;
    if (activeLayer === 'Water') score = loc.waterRisk || 50;
    if (activeLayer === 'Healthcare') score = loc.healthcarePressure || 50;
    if (activeLayer === 'Infrastructure') score = loc.infrastructureStress || 50;
    if (activeLayer === 'Population') score = (loc.population || 100000) / 3000;

    if (score >= 70) return '#EF4444'; // High Risk / Critical Red
    if (score >= 50) return '#F59E0B'; // Moderate Amber
    return '#10B981'; // Good / Low Risk Emerald
  };

  const getMarkerRadius = (loc: UrbanLocation): number => {
    if (activeLayer === 'Population') {
      const pop = loc.population || 100000;
      return Math.min(22, Math.max(7, Math.round(pop / 18000)));
    }
    return 9;
  };

  // Pre-seed first location trends if none hovered yet
  useEffect(() => {
    if (!hoveredLoc && locations.length > 0) {
      const initial = locations[0];
      setHoveredLoc(initial);
      fetchTrendsForLocation(initial);
    }
  }, [locations, hoveredLoc, fetchTrendsForLocation]);

  return (
    <div className="relative w-full rounded-2xl bg-[#0B0F19] border border-[#1E293B] overflow-hidden shadow-2xl flex flex-col">
      {/* Map Header with Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 px-5 py-3.5 border-b border-[#1E293B] bg-[#070A11]/90 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-white tracking-tight flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-emerald-400" />
              Telangana Urban Risk Map
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              📍 TELANGANA, INDIA
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/25 flex items-center gap-1">
              <Globe className="w-3 h-3 text-blue-400" />
              Google Maps
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Real-time multi-sector intelligence across 33 Telangana districts powered by Google Maps basemaps
          </p>
        </div>

        {/* Action Controls: Layer Switcher & Google Basemap Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Google Basemap Mode Toggle */}
          <div className="flex items-center gap-1 bg-[#111726] p-1 rounded-xl border border-[#222F4C]">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-1.5 flex items-center gap-1">
              <MapIcon className="w-3 h-3 text-emerald-400" />
              Base:
            </span>
            {(['roadmap', 'hybrid', 'terrain'] as GoogleBasemapMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setBasemapMode(mode)}
                className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  basemapMode === mode
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-[#161F33]'
                }`}
                title={GOOGLE_BASEMAPS[mode].name}
              >
                {GOOGLE_BASEMAPS[mode].label}
              </button>
            ))}
          </div>

          {/* Sector Overlay Switcher */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0 scrollbar-none bg-[#111726] p-1 rounded-xl border border-[#222F4C]">
            <Layers className="w-3.5 h-3.5 text-gray-400 shrink-0 ml-1.5 mr-0.5" />
            {(['Overall', 'Traffic', 'Pollution', 'Water', 'Healthcare', 'Population', 'Infrastructure'] as ActiveLayer[]).map((layer) => (
              <button
                key={layer}
                onClick={() => setActiveLayer(layer)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all shrink-0 cursor-pointer ${
                  activeLayer === layer
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-[#161F33]'
                }`}
              >
                {layer}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map View */}
      <div style={{ height }} className="w-full relative">
        <MapContainer
          key={basemapMode}
          center={telanganaCenter}
          zoom={7.4}
          minZoom={6}
          maxZoom={18}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%' }}
        >
          {/* Authentic Google Maps TileLayer */}
          <TileLayer
            key={GOOGLE_BASEMAPS[basemapMode].url}
            attribution='&copy; <a href="https://maps.google.com/" target="_blank" rel="noopener noreferrer">Google Maps</a> & Government of Telangana'
            url={GOOGLE_BASEMAPS[basemapMode].url}
            subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
            maxZoom={20}
          />

          {filtered.map((loc) => {
            const color = getMarkerColor(loc);
            const radius = getMarkerRadius(loc);

            return (
              <CircleMarker
                key={loc.locationId}
                center={[loc.latitude, loc.longitude]}
                radius={radius}
                pathOptions={{
                  fillColor: color,
                  fillOpacity: 0.85,
                  color: '#FFFFFF',
                  weight: 2,
                }}
                eventHandlers={{
                  mouseover: () => handleMarkerMouseOver(loc),
                  mouseout: handleMarkerMouseOut,
                  click: () => {
                    handleMarkerMouseOver(loc);
                    if (onSelectLocation) onSelectLocation(loc);
                  },
                }}
              >
                <Popup maxWidth={520} minWidth={360}>
                  <div className="p-1 text-xs font-sans text-gray-100 max-h-[80vh] overflow-y-auto scrollbar-none">
                    {/* ORIGINAL LOCATION CARD SECTION (PRESERVED 100%) */}
                    <div className="border-b border-[#222F4C] pb-2 mb-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-emerald-400">
                          {loc.state} • {loc.district}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#0B0F19] text-gray-400">
                          {loc.locationId}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-white mt-0.5">{loc.locationName}</h4>
                      <p className="text-[11px] text-gray-400">
                        City: <span className="text-gray-200">{loc.city}</span> | Zone: <span className="text-gray-200">{loc.zone}</span>
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] mb-2">
                      <div>
                        <span className="text-gray-400 text-[10px] block">Population</span>
                        <span className="font-semibold text-white">
                          {loc.population ? loc.population.toLocaleString('en-IN') : 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 text-[10px] block">Overall Risk</span>
                        <span className="font-bold text-rose-400">
                          {loc.overallUrbanRisk != null ? `${loc.overallUrbanRisk} / 100` : 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 text-[10px] block">Traffic Risk</span>
                        <span className="font-medium text-amber-400">
                          {loc.trafficRisk != null ? `${loc.trafficRisk}%` : 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 text-[10px] block">Pollution Risk</span>
                        <span className="font-medium text-purple-400">
                          {loc.pollutionRisk != null ? `${loc.pollutionRisk}%` : 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 text-[10px] block">Water Risk</span>
                        <span className="font-medium text-blue-400">
                          {loc.waterRisk != null ? `${loc.waterRisk}%` : 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 text-[10px] block">Healthcare Pressure</span>
                        <span className="font-medium text-red-400">
                          {loc.healthcarePressure != null ? `${loc.healthcarePressure}%` : 'N/A'}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-400 text-[10px] block">Infrastructure Stress</span>
                        <span className="font-medium text-teal-400">
                          {loc.infrastructureStress != null ? `${loc.infrastructureStress}%` : 'N/A'}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#222F4C] space-y-2 mb-3">
                      <div className="text-[10px] text-gray-400 flex items-center justify-between">
                        <span>Coordinates:</span>
                        <span className="font-mono text-gray-300">
                          {loc.latitude.toFixed(4)}°N, {loc.longitude.toFixed(4)}°E
                        </span>
                      </div>

                      {/* Direct Google Maps External Link */}
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${loc.latitude},${loc.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-1.5 px-2.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/40 border border-blue-500/40 text-blue-200 font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-all text-center"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-blue-300" />
                        <span>Open Location in Google Maps</span>
                      </a>
                    </div>

                    {/* NEW SECTION: DEVELOPMENT TREND COMPARISON */}
                    {hoverTrends && hoverTrends.locationId === loc.locationId ? (
                      <div className="pt-2 border-t border-[#222F4C]">
                        <DevelopmentImpactSection
                          trends={hoverTrends}
                          activeMetric={activeMetric}
                          onSelectMetric={setActiveMetric}
                        />
                      </div>
                    ) : (
                      <div className="pt-2 border-t border-[#222F4C] text-center py-2 text-[10px] text-gray-400">
                        <Activity className="w-3.5 h-3.5 text-emerald-400 animate-spin inline mr-1" />
                        Loading temporal development comparison...
                      </div>
                    )}
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>

        {/* Floating Legend */}
        <div className="absolute bottom-4 left-4 z-[500] bg-[#111726]/95 border border-[#222F4C] rounded-xl p-3 backdrop-blur-md shadow-lg text-[11px] text-gray-300">
          <p className="font-semibold text-white mb-1.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Risk Category Severity
          </p>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Low / Good (&lt;50)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Moderate (50-69)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> High / Critical (≥70)
            </span>
          </div>
        </div>

        {/* Floating Google Maps Active Indicator */}
        <div className="absolute top-4 right-4 z-[500] bg-[#111726]/90 border border-[#222F4C] rounded-lg px-2.5 py-1 backdrop-blur-md text-[10px] text-gray-300 flex items-center gap-1.5 font-medium shadow-md">
          <Globe className="w-3 h-3 text-blue-400" />
          <span>Active: {GOOGLE_BASEMAPS[basemapMode].name}</span>
        </div>

        {/* INTERACTIVE FLOATING HOVER DEVELOPMENT COMPARISON PANEL */}
        {showHoverPanel && hoveredLoc && hoverTrends && (
          <div className="absolute top-14 right-4 z-[500] w-96 max-w-[calc(100vw-2rem)] bg-[#0F172A]/95 border border-[#334155] rounded-xl p-3 backdrop-blur-xl shadow-2xl transition-all">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1E293B]">
              <div className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">
                  Hover Intelligence:
                </span>
                <span className="text-xs font-bold text-white truncate max-w-[150px]">
                  {hoveredLoc.locationName}
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsPinned(!isPinned)}
                  title={isPinned ? 'Unpin Panel' : 'Pin Panel on Map'}
                  className={`p-1 rounded cursor-pointer transition-colors ${
                    isPinned
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'text-gray-400 hover:text-white hover:bg-[#1E293B]'
                  }`}
                >
                  {isPinned ? <Pin className="w-3.5 h-3.5" /> : <PinOff className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => setIsCompactHover(!isCompactHover)}
                  title={isCompactHover ? 'Expand' : 'Compact View'}
                  className="p-1 rounded text-gray-400 hover:text-white hover:bg-[#1E293B] cursor-pointer"
                >
                  {isCompactHover ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => setShowHoverPanel(false)}
                  title="Close Floating Panel"
                  className="p-1 rounded text-gray-400 hover:text-white hover:bg-[#1E293B] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-gray-400 mb-2">
              <span>
                District: <strong className="text-gray-200">{hoveredLoc.district}</strong>
              </span>
              <span>
                Risk Score: <strong className="text-rose-400">{hoveredLoc.overallUrbanRisk ?? 'N/A'}/100</strong>
              </span>
            </div>

            {/* Development Impact Synchronized Side-by-Side Comparison */}
            <DevelopmentImpactSection
              trends={hoverTrends}
              activeMetric={activeMetric}
              onSelectMetric={setActiveMetric}
              compact={isCompactHover}
            />
          </div>
        )}

        {/* Toggle button to reopen hover panel if user closed it */}
        {!showHoverPanel && (
          <button
            type="button"
            onClick={() => setShowHoverPanel(true)}
            className="absolute top-14 right-4 z-[500] px-3 py-1.5 rounded-lg bg-[#111726]/90 border border-[#222F4C] text-[11px] font-semibold text-emerald-400 hover:bg-[#1A2338] shadow-lg flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Show Development Trends</span>
          </button>
        )}
      </div>
    </div>
  );
};
