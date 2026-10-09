export type Role = 'ADMIN' | 'PLANNER' | 'ANALYST' | 'VIEWER';

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: Role;
  createdAt?: string;
  enabled?: boolean;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  fullName: string;
  email: string;
  role: Role;
}

export interface UrbanLocation {
  id?: number;
  state: string;
  stateId: string;
  district: string;
  districtId: string;
  city: string;
  cityId: string;
  zone: string;
  zoneId: string;
  locationId: string;
  locationName: string;
  latitude: number;
  longitude: number;
  areaSqKm: number;
  elevationM?: number;
  urbanCategory: string;
  population?: number;
  trafficRisk?: number;
  pollutionRisk?: number;
  waterRisk?: number;
  healthcarePressure?: number;
  infrastructureStress?: number;
  overallUrbanRisk?: number;
  aqi?: number;
  aqiCategory?: string;
  pm25?: number;
  congestionLevelPct?: number;
  avgSpeedKmh?: number;
  hotspotFlag?: number;
  groundwaterDepthM?: number;
  waterQualityIndex?: number;
  floodVulnerabilityIndex?: number;
  hospitalBedsPer1000?: number;
  criticalShortageFlag?: number;
  powerGridReliabilityPct?: number;
  greenCoverRatioPct?: number;
}

export interface HealthScoreData {
  geographicScope: string;
  overallScore: number;
  category: 'Excellent' | 'Good' | 'Moderate' | 'High Risk' | 'Critical';
  trafficHealth: number;
  pollutionHealth: number;
  waterHealth: number;
  healthcareHealth: number;
  infrastructureHealth: number;
  populationHealth: number;
  totalLocationsMonitored: number;
  activeHotspotsCount: number;
  districtBreakdown: Record<string, number>;
}

export interface DashboardSummary {
  productTitle: string;
  subtitle: string;
  geographicScope: string;
  locationCount: number;
  totalMonitoredPopulation: number;
  healthScore: number;
  healthCategory: string;
  activeHotspots: number;
  averageAqi: number;
  averageCongestionPct: number;
  averageWaterDeficitPct: number;
  healthBreakdown: HealthScoreData;
}

export interface Intervention {
  id?: number;
  interventionId: string;
  name: string;
  category: string;
  description: string;
  costInrCrores: number;
  implementationTimeMonths: number;
  expectedRiskReductionPct: number;
  co2ReductionTonsYr: number;
  estPopulationBenefited: number;
  roiMultiplier: number;
  priorityLevel: string;
  applicableScope: string;
  dataType: string;
}

export interface SimulationResult {
  geographicScope: string;
  location: string;
  district: string;
  interventionName: string;
  category: string;
  currentTrafficRisk: number;
  projectedTrafficRisk: number;
  currentPollutionRisk: number;
  projectedPollutionRisk: number;
  currentWaterRisk: number;
  projectedWaterRisk: number;
  currentOverallRisk: number;
  projectedOverallRisk: number;
  riskReductionPct: number;
  populationBenefited: number;
  estimatedCostInrCrores: number;
  co2ReductionTonsYr: number;
  estimatedRoi: number;
  scientificRationale: string;
}

export interface BudgetOptimizationResult {
  geographicScope: string;
  district: string;
  totalBudgetInrCrores: number;
  budgetUsedInrCrores: number;
  remainingBudgetInrCrores: number;
  recommendedInterventions: Intervention[];
  totalRiskReductionPct: number;
  totalPopulationImpacted: number;
  totalCo2ReductionTons: number;
  averageRoiMultiplier: number;
  overallImpactScore: number;
}

export interface AiInsight {
  id: string;
  geographicScope: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE';
  category: string;
  district: string;
  city: string;
  zone: string;
  locationBadge: string;
  metricValue: string;
  evidence: string[];
  recommendation: string;
  algorithm: string;
  confidence: number;
}

export interface UrbanReport {
  id?: number;
  reportId: string;
  title: string;
  subtitle: string;
  geographicScope: string;
  district: string;
  city: string;
  healthScore: number;
  summary: string;
  recommendations: string;
  generatedAt: string;
  generatedBy: string;
}

export interface DataSourceItem {
  dataset: string;
  module: string;
  geographicCoverage: string;
  records: number;
  dataType: string;
  source: string;
  createdDate: string;
  description: string;
}

export interface MetricDelta {
  before: number;
  after: number;
  changeAbs: number;
  changePct: number;
}

export interface MetricTimelineData {
  years: number[];
  greenCover: number[];
  surfaceTemperature: number[];
  airQuality: number[];
  builtUpArea: number[];
  waterAvailability: number[];
}

export type TrendMetricKey = 'greenCover' | 'surfaceTemperature' | 'airQuality' | 'builtUpArea' | 'waterAvailability';

export interface DevelopmentTrends {
  locationId: string;
  locationName: string;
  district: string;
  city: string;
  zone: string;
  beforeDevelopment: MetricTimelineData;
  afterDevelopment: MetricTimelineData;
  deltas: Record<TrendMetricKey, MetricDelta>;
}

export interface GeoFieldDetection {
  latitude?: string;
  longitude?: string;
  district?: string;
  city?: string;
  zone?: string;
  locationId?: string;
}

export interface ColumnStats {
  min: number | null;
  max: number | null;
  avg: number | null;
  count: number;
  missingCount?: number;
  missingPct?: number;
  unit: string;
}

export interface MissingValueStat {
  presentCount: number;
  missingCount: number;
  missingPct: number;
}

export interface CityPollutionSummary {
  city: string;
  recordCount: number;
  avgAqi: number | null;
  avgPm25: number | null;
  avgPm10: number | null;
  avgNo2: number | null;
  avgSo2: number | null;
  avgCo: number | null;
  dominantBucket: string | null;
  isMapped: boolean;
  lat?: number;
  lng?: number;
  state?: string;
}

export interface AirQualityAnalysis {
  hasAirQualityData: boolean;
  citySummaries?: CityPollutionSummary[];
  aqiDistribution?: Record<string, number>;
  overall?: {
    avgAqi: number | null;
    avgPm25: number | null;
    avgPm10: number | null;
    avgNo2: number | null;
    avgSo2: number | null;
    avgCo: number | null;
    dominantBucket: string | null;
    totalReadings: number;
  };
  dateRange?: {
    minDate: string | null;
    maxDate: string | null;
  };
}

export interface UploadedDatasetAnalysis {
  fileName: string;
  totalRecords: number;
  recordsAnalyzed?: number;
  mappedCount: number;
  unmappedCount: number;
  unmatchedLocationsCount?: number;
  hasGeographicData: boolean;
  detectedGeoFields: GeoFieldDetection;
  allColumns: string[];
  numericColumns: string[];
  textColumns: string[];
  temporalColumns?: string[];
  categoricalColumns?: string[];
  numericStats: Record<string, ColumnStats>;
  missingValueSummary?: Record<string, MissingValueStat>;
  airQualityAnalysis?: AirQualityAnalysis;
  sampleRecords: Record<string, any>[];
  mappedRecords: Record<string, any>[];
  unmappedRecords: Record<string, any>[];
  bounds: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
    centerLat: number;
    centerLng: number;
  };
}

