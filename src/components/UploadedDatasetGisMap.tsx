import React, { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { UploadedDatasetAnalysis } from '../types';
import {
  Globe,
  Map as MapIcon,
  Compass,
  Layers,
  Search,
  Filter,
  Maximize2,
  Minimize2,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Table,
  Sparkles,
  Info,
  Sliders,
  ExternalLink
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';

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

interface UploadedDatasetGisMapProps {
  dataset: UploadedDatasetAnalysis;
  height?: string;
  onSelectRecord?: (record: Record<string, any>) => void;
  showBaselineOverlay?: boolean;
}

// Controller component inside Leaflet to adjust bounds dynamically
const MapBoundsController: React.FC<{
  bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number };
  trigger: number;
}> = ({ bounds, trigger }) => {
  const map = useMap();

  useEffect(() => {
    if (bounds.minLat && bounds.maxLat && bounds.minLng && bounds.maxLng) {
      try {
        map.fitBounds(
          [
            [bounds.minLat, bounds.minLng],
            [bounds.maxLat, bounds.maxLng],
          ],
          { padding: [40, 40], maxZoom: 14 }
        );
      } catch (e) {
        // Fallback to center
        map.setView([(bounds.minLat + bounds.maxLat) / 2, (bounds.minLng + bounds.maxLng) / 2], 8);
      }
    }
  }, [bounds, trigger, map]);

  return null;
};

export const UploadedDatasetGisMap: React.FC<UploadedDatasetGisMapProps> = ({
  dataset,
  height = '580px',
  onSelectRecord,
}) => {
  const [basemapMode, setBasemapMode] = useState<GoogleBasemapMode>('roadmap');
  const [activeMetric, setActiveMetric] = useState<string>('');
  const [districtFilter, setDistrictFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<'points' | 'proportional'>('points');
  const [showUnmappedDrawer, setShowUnmappedDrawer] = useState<boolean>(false);
  const [zoomTrigger, setZoomTrigger] = useState<number>(0);

  // Default active metric to first numeric column if available
  useEffect(() => {
    if (dataset.numericColumns && dataset.numericColumns.length > 0) {
      if (!activeMetric || !dataset.numericColumns.includes(activeMetric)) {
        setActiveMetric(dataset.numericColumns[0]);
      }
    } else {
      setActiveMetric('');
    }
  }, [dataset, activeMetric]);

  // Extract distinct locations (district or city) from records for filtering
  const locations = useMemo(() => {
    const set = new Set<string>();
    const distField = dataset.detectedGeoFields.district;
    const cityField = dataset.detectedGeoFields.city;
    dataset.mappedRecords.forEach((r) => {
      const val = (distField && r[distField]) || (cityField && r[cityField]) || r.district || r.District || r.city || r.City;
      if (val && typeof val === 'string' && val.trim()) {
        set.add(val.trim());
      }
    });
    return Array.from(set).sort();
  }, [dataset]);

  // Filter records based on location and search
  const filteredRecords = useMemo(() => {
    const distField = dataset.detectedGeoFields.district;
    const cityField = dataset.detectedGeoFields.city;
    return dataset.mappedRecords.filter((rec) => {
      // Location check
      if (districtFilter !== 'ALL') {
        const val = (distField && rec[distField]) || (cityField && rec[cityField]) || rec.district || rec.District || rec.city || rec.City || '';
        if (String(val).toLowerCase() !== districtFilter.toLowerCase()) return false;
      }
      // Search term check
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matches = Object.values(rec).some(
          (v) => v !== null && v !== undefined && String(v).toLowerCase().includes(query)
        );
        if (!matches) return false;
      }
      return true;
    });
  }, [dataset, districtFilter, searchTerm]);

  // Active metric statistics
  const metricStats = useMemo(() => {
    if (!activeMetric || !dataset.numericStats || !dataset.numericStats[activeMetric]) {
      return { min: 0, max: 100, avg: 50, unit: '' };
    }
    const s = dataset.numericStats[activeMetric];
    return {
      min: s.min ?? 0,
      max: s.max ?? 100,
      avg: s.avg ?? 50,
      unit: s.unit || '',
    };
  }, [dataset, activeMetric]);

  // Dynamic marker coloring based on active metric
  const getMarkerColor = (val: any): string => {
    if (!activeMetric || val === null || val === undefined || val === '') {
      return '#38BDF8'; // Sky blue default
    }
    const num = parseFloat(String(val).replace(/[^0-9.-]/g, ''));
    if (isNaN(num)) return '#94A3B8';

    const min = metricStats.min;
    const max = metricStats.max;
    if (max === min) return '#10B981';

    const normalized = Math.max(0, Math.min(1, (num - min) / (max - min)));

    // 3-stop gradient: Emerald (<0.35) -> Amber (0.35 - 0.70) -> Red (>=0.70)
    if (normalized < 0.35) return '#10B981';
    if (normalized < 0.70) return '#F59E0B';
    return '#EF4444';
  };

  const getMarkerRadius = (val: any): number => {
    if (viewMode === 'points' || !activeMetric) return 8;
    const num = parseFloat(String(val).replace(/[^0-9.-]/g, ''));
    if (isNaN(num)) return 8;
    const min = metricStats.min;
    const max = metricStats.max;
    if (max === min) return 9;
    const norm = Math.max(0, Math.min(1, (num - min) / (max - min)));
    return Math.round(7 + norm * 12);
  };

  const initialCenter: [number, number] = [
    dataset.bounds.centerLat || 17.85,
    dataset.bounds.centerLng || 79.15,
  ];

  return (
    <div className="relative w-full rounded-2xl bg-[#0B0F19] border border-[#1E293B] overflow-hidden shadow-2xl flex flex-col font-sans">
      {/* Map Control Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 px-5 py-3.5 border-b border-[#1E293B] bg-[#070A11]/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <Compass className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-white tracking-tight flex items-center gap-1.5">
                <span>{dataset.fileName}</span>
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                {dataset.mappedCount} / {dataset.totalRecords} Mapped
              </span>
              {dataset.unmappedCount > 0 && (
                <button
                  type="button"
                  onClick={() => setShowUnmappedDrawer(!showUnmappedDrawer)}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1 cursor-pointer hover:bg-amber-500/20 transition-colors"
                >
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  {dataset.unmappedCount} Unmapped
                </button>
              )}
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Interactive GIS visualization rendered from uploaded dataset records
            </p>
          </div>
        </div>

        {/* Action Controls Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Numeric Metric Selector */}
          {dataset.numericColumns && dataset.numericColumns.length > 0 && (
            <div className="flex items-center gap-1.5 bg-[#111726] px-2.5 py-1 rounded-xl border border-[#222F4C]">
              <Sliders className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Metric:
              </span>
              <select
                value={activeMetric}
                onChange={(e) => setActiveMetric(e.target.value)}
                className="bg-[#0B0F19] text-white text-[11px] font-semibold rounded-lg px-2 py-1 border border-[#1E293B] focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                {dataset.numericColumns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Location / District Filter Dropdown */}
          {locations.length > 0 && (
            <div className="flex items-center gap-1.5 bg-[#111726] px-2.5 py-1 rounded-xl border border-[#222F4C]">
              <Filter className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <select
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                className="bg-[#0B0F19] text-white text-[11px] font-semibold rounded-lg px-2 py-1 border border-[#1E293B] focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="ALL">All Locations ({locations.length})</option>
                {locations.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#111726] text-white text-[11px] pl-8 pr-2.5 py-1.5 rounded-xl border border-[#222F4C] focus:outline-none focus:border-emerald-500 w-36 lg:w-44"
            />
          </div>

          {/* Visualization Style Switcher */}
          <div className="flex items-center bg-[#111726] p-0.5 rounded-xl border border-[#222F4C]">
            <button
              type="button"
              onClick={() => setViewMode('points')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                viewMode === 'points'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Uniform
            </button>
            <button
              type="button"
              onClick={() => setViewMode('proportional')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                viewMode === 'proportional'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Scaled
            </button>
          </div>

          {/* Basemap Toggle */}
          <div className="flex items-center bg-[#111726] p-0.5 rounded-xl border border-[#222F4C]">
            {(['roadmap', 'hybrid', 'terrain'] as GoogleBasemapMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setBasemapMode(mode)}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  basemapMode === mode
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {GOOGLE_BASEMAPS[mode].label}
              </button>
            ))}
          </div>

          {/* Zoom to Bounds */}
          <button
            type="button"
            onClick={() => setZoomTrigger((prev) => prev + 1)}
            title="Zoom to uploaded dataset extent"
            className="p-1.5 rounded-xl bg-[#111726] hover:bg-[#1E293B] border border-[#222F4C] text-emerald-400 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Map View Canvas */}
      <div style={{ height }} className="w-full relative">
        <MapContainer
          key={basemapMode}
          center={initialCenter}
          zoom={8}
          minZoom={5}
          maxZoom={18}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%' }}
        >
          {/* Bounds adjustment on load or button click */}
          <MapBoundsController bounds={dataset.bounds} trigger={zoomTrigger} />

          {/* Google Maps Tile Layer */}
          <TileLayer
            key={GOOGLE_BASEMAPS[basemapMode].url}
            attribution='&copy; <a href="https://maps.google.com/" target="_blank" rel="noopener noreferrer">Google Maps</a> & Government of Telangana'
            url={GOOGLE_BASEMAPS[basemapMode].url}
            subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
            maxZoom={20}
          />

          {/* Uploaded Dataset Markers */}
          {filteredRecords.map((rec, idx) => {
            const lat = rec._lat;
            const lng = rec._lng;
            const metricVal = activeMetric ? rec[activeMetric] : null;
            const markerColor = getMarkerColor(metricVal);
            const radius = getMarkerRadius(metricVal);

            const locationName =
              rec.location_name ||
              rec.locationName ||
              rec.City ||
              rec.city ||
              rec.zone ||
              rec.district ||
              rec.District ||
              `Record #${rec._rowIndex || idx + 1}`;

            const districtName = rec.District || rec.district || rec.district_name || rec.City || rec.city || 'India';

            return (
              <CircleMarker
                key={rec._rowIndex || idx}
                center={[lat, lng]}
                radius={radius}
                pathOptions={{
                  fillColor: markerColor,
                  fillOpacity: 0.88,
                  color: '#FFFFFF',
                  weight: 2,
                }}
                eventHandlers={{
                  click: () => onSelectRecord && onSelectRecord(rec),
                }}
              >
                <Popup maxWidth={460} minWidth={320}>
                  <div className="p-1.5 text-xs font-sans text-gray-100 max-h-[75vh] overflow-y-auto scrollbar-none">
                    {/* Header */}
                    <div className="border-b border-[#222F4C] pb-2 mb-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {dataset.fileName}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#0B0F19] text-gray-400 border border-[#1E293B]">
                          {rec._mappingType || 'MAPPED'}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-white mt-1">{locationName}</h4>
                      <p className="text-[11px] text-gray-400">
                        District: <span className="text-gray-200 font-medium">{districtName}</span>
                        {rec._matchedReference && (
                          <span className="block text-[10px] text-emerald-400 mt-0.5">
                            Matched Ref: {rec._matchedReference}
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Active Metric Highlight Card */}
                    {activeMetric && metricVal !== null && metricVal !== undefined && (
                      <div className="bg-[#0B0F19] p-2.5 rounded-lg border border-[#222F4C] mb-2 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-gray-400 uppercase font-semibold block">
                            Active Metric ({activeMetric}):
                          </span>
                          <span
                            className="text-base font-extrabold font-mono"
                            style={{ color: markerColor }}
                          >
                            {metricVal}
                            {metricStats.unit}
                          </span>
                        </div>
                        <div className="text-right text-[10px] text-gray-400">
                          <div>Range: {metricStats.min} - {metricStats.max}{metricStats.unit}</div>
                          <div>Avg: {metricStats.avg}{metricStats.unit}</div>
                        </div>
                      </div>
                    )}

                    {/* Coordinates & Google Maps Link */}
                    <div className="flex items-center justify-between text-[10px] text-gray-400 mb-2 pb-2 border-b border-[#222F4C]">
                      <span>Coordinates:</span>
                      <span className="font-mono text-gray-300">
                        {lat.toFixed(4)}°N, {lng.toFixed(4)}°E
                      </span>
                    </div>

                    {/* Complete Record Fields Table */}
                    <div className="space-y-1 mb-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        Record Fields:
                      </span>
                      <div className="bg-[#0B0F19] rounded-lg border border-[#1E293B] max-h-44 overflow-y-auto divide-y divide-[#1E293B] text-[11px]">
                        {dataset.allColumns.map((col) => {
                          const val = rec[col];
                          if (col.startsWith('_')) return null;
                          return (
                            <div key={col} className="flex items-center justify-between px-2 py-1">
                              <span className="text-gray-400 font-mono text-[10px] truncate max-w-[140px]">
                                {col}:
                              </span>
                              <span className="font-medium text-gray-200 text-right truncate max-w-[160px]">
                                {val !== null && val !== undefined ? String(val) : '-'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* External Google Maps Button */}
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-1.5 px-2.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/40 border border-blue-500/40 text-blue-200 font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-all text-center mt-2"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-blue-300" />
                      <span>Inspect in Google Maps</span>
                    </a>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>

        {/* Dynamic Legend Overlay */}
        <div className="absolute bottom-4 left-4 z-[500] bg-[#111726]/95 border border-[#222F4C] rounded-xl p-3 backdrop-blur-md shadow-2xl text-[11px] text-gray-300 max-w-xs">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="font-bold text-white flex items-center gap-1 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              {activeMetric ? activeMetric : 'Uploaded Layer'}
            </span>
            <span className="text-[10px] font-mono text-gray-400">
              {filteredRecords.length} points
            </span>
          </div>

          {activeMetric ? (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[10px]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
                <span className="text-gray-300">
                  Low / Optimal (&lt;{Math.round(metricStats.min + (metricStats.max - metricStats.min) * 0.35)}{metricStats.unit})
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></span>
                <span className="text-gray-300">
                  Moderate ({Math.round(metricStats.min + (metricStats.max - metricStats.min) * 0.35)} - {Math.round(metricStats.min + (metricStats.max - metricStats.min) * 0.70)}{metricStats.unit})
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]"></span>
                <span className="text-gray-300">
                  High / Stress (≥{Math.round(metricStats.min + (metricStats.max - metricStats.min) * 0.70)}{metricStats.unit})
                </span>
              </div>
            </div>
          ) : (
            <div className="text-[10px] text-gray-400">
              Blue markers represent mapped geographic coordinates from uploaded records.
            </div>
          )}
        </div>

        {/* Floating Google Maps Active Indicator */}
        <div className="absolute top-4 right-4 z-[500] bg-[#111726]/90 border border-[#222F4C] rounded-lg px-2.5 py-1 backdrop-blur-md text-[10px] text-gray-300 flex items-center gap-1.5 font-medium shadow-md">
          <Globe className="w-3 h-3 text-blue-400" />
          <span>Active: {GOOGLE_BASEMAPS[basemapMode].name}</span>
        </div>

        {/* Unmapped Records Warning Drawer */}
        {showUnmappedDrawer && dataset.unmappedRecords.length > 0 && (
          <div className="absolute top-4 left-4 z-[500] w-80 max-h-[80%] bg-[#0F172A]/95 border border-amber-500/40 rounded-xl p-3 backdrop-blur-xl shadow-2xl flex flex-col">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1E293B]">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                Unmapped Records ({dataset.unmappedRecords.length})
              </span>
              <button
                type="button"
                onClick={() => setShowUnmappedDrawer(false)}
                className="text-gray-400 hover:text-white p-1 rounded"
              >
                ✕
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mb-2">
              These records could not be plotted because coordinates were missing or the location identifier was not found in the Telangana registry.
            </p>
            <div className="overflow-y-auto space-y-1.5 pr-1 text-[10px]">
              {dataset.unmappedRecords.map((r, idx) => (
                <div key={idx} className="bg-[#111726] p-2 rounded-lg border border-[#1E293B]">
                  <div className="font-semibold text-white">
                    Row #{r._rowIndex || idx + 1}: {r.name || r.location_name || r.district || 'Record'}
                  </div>
                  <div className="text-amber-300/80 mt-0.5">{r._unmappedReason}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
