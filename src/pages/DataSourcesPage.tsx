import React, { useState, useEffect, useRef, useMemo } from 'react';
import { api, BASE_URL } from '../services/api';
import { DataSourceItem, UploadedDatasetAnalysis } from '../types';
import { UploadedDatasetGisMap } from '../components/UploadedDatasetGisMap';
import {
  MapPin,
  FileSpreadsheet,
  UploadCloud,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  Sliders,
  Table,
  RefreshCw,
  Eye,
  Download,
  Info,
  ChevronDown,
  ChevronUp,
  FileText,
  Wind,
  Activity,
  BarChart2,
  Calendar
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export const DataSourcesPage: React.FC = () => {
  const [sources, setSources] = useState<DataSourceItem[]>([]);
  const [loadingSources, setLoadingSources] = useState<boolean>(true);

  // Studio State
  const [activeTab, setActiveTab] = useState<'studio' | 'catalogs'>('studio');
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [datasetAnalysis, setDatasetAnalysis] = useState<UploadedDatasetAnalysis | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showMappingOverrides, setShowMappingOverrides] = useState<boolean>(false);
  const [showPreviewTable, setShowPreviewTable] = useState<boolean>(false);
  const [showMissingValuesTable, setShowMissingValuesTable] = useState<boolean>(false);

  // Filter for Air Quality Analytics
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>('ALL');

  // Manual column override form state
  const [manualOverrides, setManualOverrides] = useState<{
    latitude: string;
    longitude: string;
    district: string;
    city: string;
    zone: string;
    locationId: string;
  }>({
    latitude: '',
    longitude: '',
    district: '',
    city: '',
    zone: '',
    locationId: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load 9 master catalogs on mount
  useEffect(() => {
    async function loadSources() {
      try {
        const list = await api.getDataSources();
        setSources(list);
      } catch (err) {
        console.error('Failed to load data sources:', err);
      } finally {
        setLoadingSources(false);
      }
    }
    loadSources();
  }, []);

  // Pre-load default sample on initial view (e.g. traffic.csv)
  useEffect(() => {
    if (!datasetAnalysis && !analyzing) {
      handleLoadCatalog('traffic.csv');
    }
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalyzing(true);
    setErrorMessage(null);
    try {
      const result = await api.uploadDatasetFile(file);
      setDatasetAnalysis(result);
      initializeOverrides(result);
      setSelectedCityFilter('ALL');
      setActiveTab('studio');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to upload and analyze CSV file.');
    } finally {
      setAnalyzing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleLoadCatalog = async (fileName: string) => {
    setAnalyzing(true);
    setErrorMessage(null);
    try {
      const result = await api.getCatalogAnalysis(fileName);
      setDatasetAnalysis(result);
      initializeOverrides(result);
      setSelectedCityFilter('ALL');
      setActiveTab('studio');
    } catch (err: any) {
      setErrorMessage(err.message || `Failed to load catalog ${fileName}.`);
    } finally {
      setAnalyzing(false);
    }
  };

  const initializeOverrides = (analysis: UploadedDatasetAnalysis) => {
    setManualOverrides({
      latitude: analysis.detectedGeoFields.latitude || '',
      longitude: analysis.detectedGeoFields.longitude || '',
      district: analysis.detectedGeoFields.district || '',
      city: analysis.detectedGeoFields.city || '',
      zone: analysis.detectedGeoFields.zone || '',
      locationId: analysis.detectedGeoFields.locationId || '',
    });
  };

  const handleApplyOverrides = async () => {
    if (!datasetAnalysis) return;
    setAnalyzing(true);
    try {
      const result = await api.getCatalogAnalysis(datasetAnalysis.fileName);
      setDatasetAnalysis(result);
      setShowMappingOverrides(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to re-map columns.');
    } finally {
      setAnalyzing(false);
    }
  };

  // Air Quality filtered metrics
  const airQuality = datasetAnalysis?.airQualityAnalysis;
  const isAirQualityDataset = airQuality?.hasAirQualityData;

  const filteredCitySummaries = useMemo(() => {
    if (!airQuality?.citySummaries) return [];
    if (selectedCityFilter === 'ALL') return airQuality.citySummaries;
    return airQuality.citySummaries.filter((c) => c.city === selectedCityFilter);
  }, [airQuality, selectedCityFilter]);

  // Chart data for Top Cities Comparison
  const topCitiesChartData = useMemo(() => {
    if (!airQuality?.citySummaries) return [];
    return airQuality.citySummaries
      .slice(0, 10)
      .map((c) => ({
        city: c.city,
        aqi: c.avgAqi || 0,
        pm25: c.avgPm25 || 0,
        pm10: c.avgPm10 || 0,
      }));
  }, [airQuality]);

  // AQI Category Distribution Chart Data
  const aqiDistributionChartData = useMemo(() => {
    if (!airQuality?.aqiDistribution) return [];
    return Object.entries(airQuality.aqiDistribution).map(([category, count]) => ({
      category,
      count,
    }));
  }, [airQuality]);

  const getAqiBadgeColor = (bucket: string | null | undefined) => {
    switch (bucket?.toLowerCase()) {
      case 'good':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'satisfactory':
        return 'bg-teal-500/20 text-teal-400 border-teal-500/40';
      case 'moderate':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'poor':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'very poor':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      case 'severe':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/40';
      default:
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E293B] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              Telangana State GIS Studio
            </span>
            <span className="text-xs text-gray-500 font-mono">Autonomous Spatial Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Telangana Urban Data Sources & GIS Mapping Studio
          </h1>
          <p className="text-sm text-gray-400">
            Upload custom CSV datasets or explore pre-calibrated regional catalogs with real-time interactive GIS mapping and pollution intelligence.
          </p>
        </div>

        {/* Studio / Catalog Tab Toggle */}
        <div className="flex items-center bg-[#111726] p-1 rounded-xl border border-[#222F4C] shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('studio')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'studio'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Interactive GIS Studio</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('catalogs')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'catalogs'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Master Catalogs ({sources.length || 9})</span>
          </button>
        </div>
      </div>

      {/* ERROR BANNER */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between text-xs text-rose-300">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-rose-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* TAB 1: INTERACTIVE GIS MAP & UPLOAD STUDIO */}
      {activeTab === 'studio' && (
        <div className="space-y-6">
          {/* UPLOAD & DATASET CONTROLLER CARD */}
          <div className="p-5 rounded-2xl bg-[#111726] border border-[#1E293B] shadow-2xl space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-emerald-400" />
                  Upload & Analyze Dataset
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Upload any CSV file (including Kaggle Air Quality in India, mobility telemetry, or civic grids). Geographic columns (city, district, coordinates) and numeric metrics are detected automatically.
                </p>
              </div>

              {/* Upload Input & Quick Samples */}
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".csv,text/csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="csv-file-input"
                />
                <label
                  htmlFor="csv-file-input"
                  className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Choose CSV to Upload</span>
                </label>
              </div>
            </div>

            {/* Quick Catalog Sample Loaders */}
            <div className="pt-2 border-t border-[#1E293B]">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                Or Quick-Load Telangana Master Catalog:
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { file: 'traffic.csv', label: 'Traffic Telemetry', color: 'text-amber-400' },
                  { file: 'pollution.csv', label: 'Pollution & AQI', color: 'text-purple-400' },
                  { file: 'water.csv', label: 'Water Availability', color: 'text-blue-400' },
                  { file: 'weather.csv', label: 'Microclimate & UHI', color: 'text-amber-300' },
                  { file: 'locations.csv', label: 'GIS Boundary Nodes', color: 'text-emerald-400' },
                  { file: 'population.csv', label: 'Demographics', color: 'text-cyan-400' },
                  { file: 'healthcare.csv', label: 'Healthcare Pressure', color: 'text-rose-400' },
                  { file: 'infrastructure.csv', label: 'Infrastructure & NDVI', color: 'text-teal-400' },
                  { file: 'interventions.csv', label: 'Civic Interventions', color: 'text-gray-300' },
                ].map((item) => (
                  <button
                    key={item.file}
                    type="button"
                    disabled={analyzing}
                    onClick={() => handleLoadCatalog(item.file)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border border-[#222F4C] bg-[#0B0F19] hover:bg-[#161F33] transition-all cursor-pointer flex items-center gap-1.5 ${
                      datasetAnalysis?.fileName === item.file
                        ? 'border-emerald-500 text-white font-bold bg-[#161F33]'
                        : 'text-gray-300'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${datasetAnalysis?.fileName === item.file ? 'bg-emerald-400' : 'bg-gray-500'}`} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* LOADING STATE */}
          {analyzing && (
            <div className="p-8 rounded-2xl bg-[#111726] border border-[#1E293B] text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
              <p className="text-sm font-semibold text-white">
                Parsing records, identifying schema, and computing geographic & air quality metrics...
              </p>
            </div>
          )}

          {/* DATASET ANALYSIS & VALIDATION SUMMARY */}
          {!analyzing && datasetAnalysis && (
            <div className="space-y-6">
              {/* 4 PRIMARY SEPARATED METRIC CARDS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* 1. Records Analyzed */}
                <div className="p-4 rounded-xl bg-[#111726] border border-[#1E293B] shadow-lg">
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">
                    Records Analyzed
                  </span>
                  <span className="text-2xl font-bold font-mono text-white mt-1 block">
                    {(datasetAnalysis.recordsAnalyzed ?? datasetAnalysis.totalRecords).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-gray-500 mt-0.5 block">
                    {datasetAnalysis.allColumns.length} total attributes detected
                  </span>
                </div>

                {/* 2. Geographically Mapped */}
                <div className="p-4 rounded-xl bg-[#111726] border border-emerald-500/20 shadow-lg">
                  <span className="text-[10px] text-emerald-400/90 uppercase font-bold tracking-wider block">
                    Geographically Mapped
                  </span>
                  <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block flex items-center gap-1.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    {datasetAnalysis.mappedCount.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-emerald-400/80 mt-0.5 block">
                    {Math.round((datasetAnalysis.mappedCount / (datasetAnalysis.totalRecords || 1)) * 100)}% spatial alignment
                  </span>
                </div>

                {/* 3. Unmatched Locations */}
                <div className="p-4 rounded-xl bg-[#111726] border border-[#1E293B] shadow-lg">
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">
                    Unmatched Locations
                  </span>
                  <span
                    className={`text-2xl font-bold font-mono mt-1 block flex items-center gap-1.5 ${
                      (datasetAnalysis.unmatchedLocationsCount ?? datasetAnalysis.unmappedCount) > 0
                        ? 'text-amber-400'
                        : 'text-gray-400'
                    }`}
                  >
                    {(datasetAnalysis.unmatchedLocationsCount ?? datasetAnalysis.unmappedCount) > 0 && (
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                    )}
                    {(datasetAnalysis.unmatchedLocationsCount ?? datasetAnalysis.unmappedCount).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-gray-500 mt-0.5 block">
                    {datasetAnalysis.unmappedCount === 0
                      ? 'Zero missing coordinates'
                      : 'Non-spatial / unreferenced records'}
                  </span>
                </div>

                {/* 4. Numeric Metrics */}
                <div className="p-4 rounded-xl bg-[#111726] border border-blue-500/20 shadow-lg">
                  <span className="text-[10px] text-blue-400/90 uppercase font-bold tracking-wider block">
                    Numeric Metrics
                  </span>
                  <span className="text-2xl font-bold font-mono text-blue-400 mt-1 block">
                    {datasetAnalysis.numericColumns.length}
                  </span>
                  <span className="text-[10px] text-blue-400/80 mt-0.5 block truncate" title={datasetAnalysis.numericColumns.join(', ')}>
                    {datasetAnalysis.numericColumns.length > 0
                      ? datasetAnalysis.numericColumns.slice(0, 3).join(', ') + (datasetAnalysis.numericColumns.length > 3 ? '...' : '')
                      : 'None detected'}
                  </span>
                </div>
              </div>

              {/* AUTOMATIC COLUMN DETECTION & ATTRIBUTE STRIP */}
              <div className="p-4 rounded-xl bg-[#111726] border border-[#1E293B] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Detected Schema & Spatial Alignment
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowMappingOverrides(!showMappingOverrides)}
                    className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                  >
                    <span>{showMappingOverrides ? 'Close Column Mapper' : 'Remap Columns Manually'}</span>
                    {showMappingOverrides ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <div className="px-2.5 py-1 rounded-lg bg-[#0B0F19] border border-[#222F4C] flex items-center gap-1.5">
                    <span className="text-gray-400">Coordinates:</span>
                    <strong className="text-emerald-400 font-mono">
                      {datasetAnalysis.detectedGeoFields.latitude && datasetAnalysis.detectedGeoFields.longitude
                        ? `${datasetAnalysis.detectedGeoFields.latitude}, ${datasetAnalysis.detectedGeoFields.longitude}`
                        : 'None (Using Reference Registry)'}
                    </strong>
                  </div>

                  <div className="px-2.5 py-1 rounded-lg bg-[#0B0F19] border border-[#222F4C] flex items-center gap-1.5">
                    <span className="text-gray-400">City:</span>
                    <strong
                      className={`font-mono ${
                        datasetAnalysis.detectedGeoFields.city ? 'text-emerald-400 font-bold' : 'text-gray-500'
                      }`}
                    >
                      {datasetAnalysis.detectedGeoFields.city || 'Not Detected'}
                    </strong>
                  </div>

                  <div className="px-2.5 py-1 rounded-lg bg-[#0B0F19] border border-[#222F4C] flex items-center gap-1.5">
                    <span className="text-gray-400">District:</span>
                    <strong
                      className={`font-mono ${
                        datasetAnalysis.detectedGeoFields.district ? 'text-blue-400 font-bold' : 'text-gray-500'
                      }`}
                    >
                      {datasetAnalysis.detectedGeoFields.district || 'Not Detected'}
                    </strong>
                  </div>

                  <div className="px-2.5 py-1 rounded-lg bg-[#0B0F19] border border-[#222F4C] flex items-center gap-1.5">
                    <span className="text-gray-400">Temporal (Date):</span>
                    <strong
                      className={`font-mono ${
                        datasetAnalysis.temporalColumns && datasetAnalysis.temporalColumns.length > 0
                          ? 'text-amber-400 font-bold'
                          : 'text-gray-500'
                      }`}
                    >
                      {datasetAnalysis.temporalColumns?.join(', ') || 'Not Detected'}
                    </strong>
                  </div>

                  {datasetAnalysis.categoricalColumns && datasetAnalysis.categoricalColumns.length > 0 && (
                    <div className="px-2.5 py-1 rounded-lg bg-[#0B0F19] border border-[#222F4C] flex items-center gap-1.5">
                      <span className="text-gray-400">Categorical:</span>
                      <strong className="text-purple-400 font-mono">
                        {datasetAnalysis.categoricalColumns.join(', ')}
                      </strong>
                    </div>
                  )}
                </div>

                {/* MANUAL REMAPPING PANEL */}
                {showMappingOverrides && (
                  <div className="p-3.5 rounded-lg bg-[#0B0F19] border border-[#222F4C] mt-2 space-y-3">
                    <div className="text-[11px] text-gray-300 font-semibold">
                      Override detected columns if auto-detection was ambiguous:
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {(['latitude', 'longitude', 'district', 'city', 'zone', 'locationId'] as const).map((field) => (
                        <div key={field}>
                          <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">
                            {field}:
                          </label>
                          <select
                            value={manualOverrides[field]}
                            onChange={(e) => setManualOverrides({ ...manualOverrides, [field]: e.target.value })}
                            className="w-full bg-[#111726] text-white text-xs rounded-lg px-2 py-1.5 border border-[#1E293B] focus:outline-none focus:border-emerald-500"
                          >
                            <option value="">None</option>
                            {datasetAnalysis.allColumns.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyOverrides}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs cursor-pointer hover:bg-emerald-400 transition-colors"
                    >
                      Apply Re-mapping
                    </button>
                  </div>
                )}
              </div>

              {/* AIR QUALITY INTELLIGENCE & ANALYTICS STUDIO */}
              {isAirQualityDataset && airQuality && (
                <div className="p-5 rounded-2xl bg-[#111726] border border-[#222F4C] shadow-2xl space-y-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#1E293B] pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                        <Wind className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          Air Quality & Atmospheric Pollution Intelligence
                        </h3>
                        <p className="text-xs text-gray-400">
                          Automated analysis of particulate matter (PM2.5, PM10) and gaseous pollutants from actual uploaded records.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {airQuality.dateRange?.minDate && airQuality.dateRange?.maxDate && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0B0F19] border border-[#222F4C] text-[11px] font-mono text-gray-300">
                          <Calendar className="w-3.5 h-3.5 text-amber-400" />
                          <span>
                            {airQuality.dateRange.minDate} to {airQuality.dateRange.maxDate}
                          </span>
                        </div>
                      )}

                      {/* City Selector */}
                      {airQuality.citySummaries && airQuality.citySummaries.length > 0 && (
                        <div className="flex items-center gap-1.5 bg-[#0B0F19] px-2.5 py-1 rounded-lg border border-[#222F4C]">
                          <span className="text-[10px] uppercase font-bold text-gray-400">City:</span>
                          <select
                            value={selectedCityFilter}
                            onChange={(e) => setSelectedCityFilter(e.target.value)}
                            className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer"
                          >
                            <option value="ALL">All Cities ({airQuality.citySummaries.length})</option>
                            {airQuality.citySummaries.map((c) => (
                              <option key={c.city} value={c.city} className="bg-[#111726]">
                                {c.city} ({c.recordCount} rows)
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* POLLUTANT SUMMARY CARDS */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                    {/* AQI */}
                    <div className="p-3 rounded-xl bg-[#0B0F19] border border-[#222F4C]">
                      <span className="text-[10px] text-gray-400 uppercase font-semibold block">Air Quality Index</span>
                      <span className="text-xl font-bold font-mono text-white mt-0.5 block">
                        {selectedCityFilter === 'ALL'
                          ? airQuality.overall?.avgAqi ?? 'N/A'
                          : filteredCitySummaries[0]?.avgAqi ?? 'N/A'}
                      </span>
                      <span
                        className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold border ${getAqiBadgeColor(
                          selectedCityFilter === 'ALL'
                            ? airQuality.overall?.dominantBucket
                            : filteredCitySummaries[0]?.dominantBucket
                        )}`}
                      >
                        {selectedCityFilter === 'ALL'
                          ? airQuality.overall?.dominantBucket ?? 'Unclassified'
                          : filteredCitySummaries[0]?.dominantBucket ?? 'Unclassified'}
                      </span>
                    </div>

                    {/* PM2.5 */}
                    <div className="p-3 rounded-xl bg-[#0B0F19] border border-[#222F4C]">
                      <span className="text-[10px] text-gray-400 uppercase font-semibold block">PM2.5 (Fine Particulate)</span>
                      <span className="text-xl font-bold font-mono text-rose-400 mt-0.5 block">
                        {selectedCityFilter === 'ALL'
                          ? airQuality.overall?.avgPm25 ?? 'N/A'
                          : filteredCitySummaries[0]?.avgPm25 ?? 'N/A'}
                        <span className="text-xs text-gray-500 font-normal ml-0.5">µg/m³</span>
                      </span>
                      <span className="text-[10px] text-gray-500">WHO Guideline: 15 µg/m³</span>
                    </div>

                    {/* PM10 */}
                    <div className="p-3 rounded-xl bg-[#0B0F19] border border-[#222F4C]">
                      <span className="text-[10px] text-gray-400 uppercase font-semibold block">PM10 (Coarse Particulate)</span>
                      <span className="text-xl font-bold font-mono text-amber-400 mt-0.5 block">
                        {selectedCityFilter === 'ALL'
                          ? airQuality.overall?.avgPm10 ?? 'N/A'
                          : filteredCitySummaries[0]?.avgPm10 ?? 'N/A'}
                        <span className="text-xs text-gray-500 font-normal ml-0.5">µg/m³</span>
                      </span>
                      <span className="text-[10px] text-gray-500">NAAQS Limit: 100 µg/m³</span>
                    </div>

                    {/* NO2 */}
                    <div className="p-3 rounded-xl bg-[#0B0F19] border border-[#222F4C]">
                      <span className="text-[10px] text-gray-400 uppercase font-semibold block">Nitrogen Dioxide (NO2)</span>
                      <span className="text-xl font-bold font-mono text-blue-400 mt-0.5 block">
                        {selectedCityFilter === 'ALL'
                          ? airQuality.overall?.avgNo2 ?? 'N/A'
                          : filteredCitySummaries[0]?.avgNo2 ?? 'N/A'}
                        <span className="text-xs text-gray-500 font-normal ml-0.5">µg/m³</span>
                      </span>
                      <span className="text-[10px] text-gray-500">Vehicular / Combustion</span>
                    </div>

                    {/* SO2 */}
                    <div className="p-3 rounded-xl bg-[#0B0F19] border border-[#222F4C]">
                      <span className="text-[10px] text-gray-400 uppercase font-semibold block">Sulphur Dioxide (SO2)</span>
                      <span className="text-xl font-bold font-mono text-cyan-400 mt-0.5 block">
                        {selectedCityFilter === 'ALL'
                          ? airQuality.overall?.avgSo2 ?? 'N/A'
                          : filteredCitySummaries[0]?.avgSo2 ?? 'N/A'}
                        <span className="text-xs text-gray-500 font-normal ml-0.5">µg/m³</span>
                      </span>
                      <span className="text-[10px] text-gray-500">Thermal / Industrial</span>
                    </div>

                    {/* CO */}
                    <div className="p-3 rounded-xl bg-[#0B0F19] border border-[#222F4C]">
                      <span className="text-[10px] text-gray-400 uppercase font-semibold block">Carbon Monoxide (CO)</span>
                      <span className="text-xl font-bold font-mono text-emerald-400 mt-0.5 block">
                        {selectedCityFilter === 'ALL'
                          ? airQuality.overall?.avgCo ?? 'N/A'
                          : filteredCitySummaries[0]?.avgCo ?? 'N/A'}
                        <span className="text-xs text-gray-500 font-normal ml-0.5">mg/m³</span>
                      </span>
                      <span className="text-[10px] text-gray-500">Incomplete combustion</span>
                    </div>
                  </div>

                  {/* VISUAL CHARTS SECTION */}
                  {topCitiesChartData.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Top Cities Comparison Bar Chart */}
                      <div className="p-4 rounded-xl bg-[#0B0F19] border border-[#222F4C] space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                            <BarChart2 className="w-3.5 h-3.5 text-emerald-400" />
                            City Air Quality Index (AQI) Comparison
                          </h4>
                          <span className="text-[10px] text-gray-400 font-mono">
                            Top {topCitiesChartData.length} Cities
                          </span>
                        </div>
                        <div className="h-56 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topCitiesChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                              <XAxis
                                dataKey="city"
                                stroke="#64748B"
                                fontSize={10}
                                angle={-30}
                                textAnchor="end"
                                interval={0}
                              />
                              <YAxis stroke="#64748B" fontSize={10} />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: '#111726',
                                  borderColor: '#222F4C',
                                  borderRadius: '8px',
                                  fontSize: '11px',
                                }}
                              />
                              <Bar dataKey="aqi" name="AQI" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                              <Bar dataKey="pm25" name="PM2.5" fill="#EF4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* AQI Health Category Distribution */}
                      <div className="p-4 rounded-xl bg-[#0B0F19] border border-[#222F4C] space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5 text-purple-400" />
                            AQI Health Impact Category Breakdown
                          </h4>
                          <span className="text-[10px] text-gray-400 font-mono">CPCB Guidelines</span>
                        </div>
                        <div className="h-56 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={aqiDistributionChartData}
                              layout="vertical"
                              margin={{ top: 10, right: 20, left: 25, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
                              <XAxis type="number" stroke="#64748B" fontSize={10} />
                              <YAxis type="category" dataKey="category" stroke="#64748B" fontSize={10} />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: '#111726',
                                  borderColor: '#222F4C',
                                  borderRadius: '8px',
                                  fontSize: '11px',
                                }}
                              />
                              <Bar dataKey="count" name="Readings" fill="#10B981" radius={[0, 4, 4, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* DATA QUALITY & MISSING VALUES ACCORDION */}
                  <div className="border-t border-[#1E293B] pt-3">
                    <button
                      type="button"
                      onClick={() => setShowMissingValuesTable(!showMissingValuesTable)}
                      className="text-xs font-bold text-gray-300 hover:text-white flex items-center gap-2 cursor-pointer"
                    >
                      <Table className="w-3.5 h-3.5 text-blue-400" />
                      <span>Data Completeness & Missing Value Statistics (Per Pollutant Column)</span>
                      {showMissingValuesTable ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {showMissingValuesTable && (
                      <div className="mt-3 overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-[#222F4C] text-gray-400 font-semibold uppercase text-[10px]">
                              <th className="py-2 px-3">Column / Pollutant</th>
                              <th className="py-2 px-3">Present Readings</th>
                              <th className="py-2 px-3">Missing (NaN/Blank)</th>
                              <th className="py-2 px-3">Completeness</th>
                              <th className="py-2 px-3">Min Value</th>
                              <th className="py-2 px-3">Max Value</th>
                              <th className="py-2 px-3">Average</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#1E293B] text-gray-300 font-mono text-[11px]">
                            {datasetAnalysis.numericColumns.map((col) => {
                              const stats = datasetAnalysis.numericStats[col];
                              const missing = datasetAnalysis.missingValueSummary?.[col];
                              const completenessPct = missing ? 100 - missing.missingPct : 100;
                              return (
                                <tr key={col} className="hover:bg-[#161F33]/50">
                                  <td className="py-2 px-3 font-bold text-white font-sans">{col}</td>
                                  <td className="py-2 px-3 text-emerald-400">{missing ? missing.presentCount.toLocaleString() : (stats?.count ?? 0).toLocaleString()}</td>
                                  <td className="py-2 px-3 text-amber-400">{missing ? missing.missingCount.toLocaleString() : (stats?.missingCount ?? 0).toLocaleString()}</td>
                                  <td className="py-2 px-3">
                                    <span
                                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                        completenessPct > 70
                                          ? 'bg-emerald-500/10 text-emerald-400'
                                          : completenessPct > 40
                                          ? 'bg-amber-500/10 text-amber-400'
                                          : 'bg-rose-500/10 text-rose-400'
                                      }`}
                                    >
                                      {completenessPct.toFixed(1)}%
                                    </span>
                                  </td>
                                  <td className="py-2 px-3">{stats?.min !== null && stats?.min !== undefined ? `${stats.min}${stats.unit}` : '-'}</td>
                                  <td className="py-2 px-3">{stats?.max !== null && stats?.max !== undefined ? `${stats.max}${stats.unit}` : '-'}</td>
                                  <td className="py-2 px-3 text-white font-bold">{stats?.avg !== null && stats?.avg !== undefined ? `${stats.avg}${stats.unit}` : '-'}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* INTERACTIVE GIS MAP VISUALIZATION */}
              {datasetAnalysis.hasGeographicData ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Compass className="w-5 h-5 text-emerald-400" />
                      <h3 className="text-base font-bold text-white">
                        Interactive GIS Map Visualization
                      </h3>
                    </div>
                    <span className="text-xs font-mono text-gray-400">
                      Plotted Nodes: {datasetAnalysis.mappedCount} / {datasetAnalysis.totalRecords}
                    </span>
                  </div>

                  {/* LEAFLET MAP COMPONENT */}
                  <UploadedDatasetGisMap dataset={datasetAnalysis} height="560px" />
                </div>
              ) : (
                /* INFORMATIVE CARD WHEN DATASET HAS NO GEOGRAPHIC FIELDS */
                <div className="p-6 rounded-2xl bg-[#111726] border border-amber-500/30 text-center space-y-3">
                  <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
                  <h4 className="text-base font-bold text-white">
                    Non-Spatial or Unmapped Dataset
                  </h4>
                  <p className="text-xs text-gray-300 max-w-xl mx-auto leading-relaxed">
                    This dataset (<strong>{datasetAnalysis.fileName}</strong>) was parsed and verified with{' '}
                    <strong>{datasetAnalysis.numericColumns.length} numeric metrics</strong> detected across{' '}
                    <strong>{datasetAnalysis.totalRecords} records</strong>. However, no valid coordinate pairs or recognized geographic boundary entities were present in the data rows.
                  </p>
                  <p className="text-[11px] text-gray-400 max-w-md mx-auto">
                    Pollutant analytics and missing-value summaries are fully rendered above. You can view the tabular data below or link the dataset to the Telangana GIS Reference Catalog.
                  </p>
                </div>
              )}

              {/* DATA PREVIEW TABLE EXPANDER */}
              <div className="p-4 rounded-2xl bg-[#111726] border border-[#1E293B] space-y-3">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setShowPreviewTable(!showPreviewTable)}
                    className="text-xs font-bold text-white flex items-center gap-2 hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    <Table className="w-4 h-4 text-emerald-400" />
                    <span>Raw Dataset Preview (First {datasetAnalysis.sampleRecords.length} Rows)</span>
                    {showPreviewTable ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <span className="text-xs font-mono text-gray-500">
                    {datasetAnalysis.allColumns.length} Columns
                  </span>
                </div>

                {showPreviewTable && (
                  <div className="overflow-x-auto mt-2">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-[#1E293B] text-gray-400 font-semibold uppercase text-[10px]">
                          {datasetAnalysis.allColumns.map((c) => (
                            <th key={c} className="py-2 px-2.5 whitespace-nowrap">
                              {c}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1E293B] text-gray-300 font-mono text-[11px]">
                        {datasetAnalysis.sampleRecords.map((row, idx) => (
                          <tr key={idx} className="hover:bg-[#161F33]/50">
                            {datasetAnalysis.allColumns.map((col) => (
                              <td key={col} className="py-2 px-2.5 whitespace-nowrap">
                                {row[col] !== null && row[col] !== undefined && row[col] !== '' ? String(row[col]) : '-'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PROJECT DATASETS (9 MASTER CATALOGS) */}
      {activeTab === 'catalogs' && (
        <div className="p-5 rounded-2xl bg-[#111726] border border-[#1E293B] shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              Project Datasets (9 Master Catalogs)
            </h3>
            <span className="text-xs font-mono text-emerald-400">
              Geographic Coverage: TELANGANA, INDIA
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1E293B] text-gray-400 font-semibold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Dataset</th>
                  <th className="py-2.5 px-3">Module</th>
                  <th className="py-2.5 px-3">Geographic Coverage</th>
                  <th className="py-2.5 px-3">Records</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Actions</th>
                  <th className="py-2.5 px-3">Source</th>
                  <th className="py-2.5 px-3">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B] text-gray-300">
                {loadingSources ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-400">
                      Loading data sources...
                    </td>
                  </tr>
                ) : (
                  sources.map((src, idx) => (
                    <tr key={idx} className="hover:bg-[#161F33]/50 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                        {src.dataset}
                      </td>
                      <td className="py-3 px-3 font-medium text-white">
                        {src.module}
                      </td>
                      <td className="py-3 px-3 font-bold text-white tracking-wide">
                        {src.geographicCoverage}
                      </td>
                      <td className="py-3 px-3 font-mono">
                        {src.records}
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          Active
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleLoadCatalog(src.dataset)}
                            className="px-2.5 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View on Map</span>
                          </button>
                          <a
                            href={`${BASE_URL}/data-sources/download/${src.dataset}`}
                            download
                            className="p-1 rounded bg-[#0B0F19] hover:bg-[#1E293B] text-gray-400 hover:text-white border border-[#222F4C] transition-colors"
                            title={`Download ${src.dataset}`}
                          >
                            <Download className="w-3 h-3" />
                          </a>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-[11px] text-gray-400 max-w-[200px] truncate" title={src.source}>
                        {src.source}
                      </td>
                      <td className="py-3 px-3 font-mono text-gray-500 text-[11px]">
                        {src.createdDate}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
