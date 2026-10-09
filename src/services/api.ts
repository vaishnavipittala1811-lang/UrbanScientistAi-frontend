import {
  AuthResponse,
  DashboardSummary,
  HealthScoreData,
  UrbanLocation,
  Intervention,
  SimulationResult,
  BudgetOptimizationResult,
  AiInsight,
  UrbanReport,
  DataSourceItem,
  User,
  Role,
  DevelopmentTrends,
  UploadedDatasetAnalysis
} from '../types';

export const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/+$/, '');

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('urbanscientist_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export const api = {
  // Authentication
  async register(data: { fullName: string; email: string; password: string }): Promise<AuthResponse> {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Registration failed');
    }
    return res.json();
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
    return res.json();
  },

  async getCurrentUser(): Promise<User> {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Not authenticated');
    return res.json();
  },

  async getAllUsers(): Promise<User[]> {
    const res = await fetch(`${BASE_URL}/auth/users`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load users');
    return res.json();
  },

  async updateUserRole(id: number, role: Role): Promise<User> {
    const res = await fetch(`${BASE_URL}/auth/users/${id}/role`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ role }),
    });
    if (!res.ok) throw new Error('Failed to update role');
    return res.json();
  },

  // Dashboard & Spatial
  async getDashboardSummary(): Promise<DashboardSummary> {
    const res = await fetch(`${BASE_URL}/dashboard/summary`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load dashboard summary');
    return res.json();
  },

  async getLocations(): Promise<UrbanLocation[]> {
    const res = await fetch(`${BASE_URL}/dashboard/locations`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load locations');
    return res.json();
  },

  async getHealthScore(): Promise<HealthScoreData> {
    const res = await fetch(`${BASE_URL}/dashboard/health-score`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load health score');
    return res.json();
  },

  // City & Districts
  async getDistricts(): Promise<any[]> {
    const res = await fetch(`${BASE_URL}/districts`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load districts');
    return res.json();
  },

  async getCities(): Promise<any[]> {
    const res = await fetch(`${BASE_URL}/cities`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load cities');
    return res.json();
  },

  async getLocationDetails(locationId: string): Promise<any> {
    const res = await fetch(`${BASE_URL}/locations/${locationId}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load location details');
    return res.json();
  },

  async getDevelopmentTrends(locationId: string): Promise<DevelopmentTrends> {
    const res = await fetch(`${BASE_URL}/locations/${encodeURIComponent(locationId)}/development-trends`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load development trends');
    return res.json();
  },

  // Sector Endpoints
  async getTrafficData(district?: string): Promise<any> {
    const url = district ? `${BASE_URL}/traffic?district=${encodeURIComponent(district)}` : `${BASE_URL}/traffic`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to load traffic data');
    return res.json();
  },

  async getPollutionData(district?: string): Promise<any> {
    const url = district ? `${BASE_URL}/pollution?district=${encodeURIComponent(district)}` : `${BASE_URL}/pollution`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to load pollution data');
    return res.json();
  },

  async getWaterData(district?: string): Promise<any> {
    const url = district ? `${BASE_URL}/water?district=${encodeURIComponent(district)}` : `${BASE_URL}/water`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to load water data');
    return res.json();
  },

  async getWeatherData(district?: string): Promise<any> {
    const url = district ? `${BASE_URL}/weather?district=${encodeURIComponent(district)}` : `${BASE_URL}/weather`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to load weather data');
    return res.json();
  },

  async getPopulationData(district?: string): Promise<any> {
    const url = district ? `${BASE_URL}/population?district=${encodeURIComponent(district)}` : `${BASE_URL}/population`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to load population data');
    return res.json();
  },

  async getHealthcareData(district?: string): Promise<any> {
    const url = district ? `${BASE_URL}/healthcare?district=${encodeURIComponent(district)}` : `${BASE_URL}/healthcare`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to load healthcare data');
    return res.json();
  },

  async getInfrastructureData(district?: string): Promise<any> {
    const url = district ? `${BASE_URL}/infrastructure?district=${encodeURIComponent(district)}` : `${BASE_URL}/infrastructure`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to load infrastructure data');
    return res.json();
  },

  // AI & Simulation
  async getAiInsights(): Promise<AiInsight[]> {
    const res = await fetch(`${BASE_URL}/ai/insights`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load AI insights');
    return res.json();
  },

  async getInterventions(): Promise<Intervention[]> {
    const res = await fetch(`${BASE_URL}/ai/interventions`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load interventions');
    return res.json();
  },

  async runSimulation(data: { district?: string; city?: string; zone?: string; interventionId?: string }): Promise<SimulationResult> {
    const res = await fetch(`${BASE_URL}/ai/simulate`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Simulation failed');
    return res.json();
  },

  async optimizeBudget(data: { district?: string; city?: string; budgetInrCrores: number; selectedInterventionIds?: string[] }): Promise<BudgetOptimizationResult> {
    const res = await fetch(`${BASE_URL}/ai/optimize-budget`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Budget optimization failed');
    return res.json();
  },

  // Reports
  async generateReport(data: { district?: string; city?: string; summary?: string; recommendations?: string }): Promise<UrbanReport> {
    const res = await fetch(`${BASE_URL}/reports/generate`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to generate report');
    return res.json();
  },

  async getAllReports(): Promise<UrbanReport[]> {
    const res = await fetch(`${BASE_URL}/reports`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load reports');
    return res.json();
  },

  // Data Sources
  async getDataSources(): Promise<DataSourceItem[]> {
    const res = await fetch(`${BASE_URL}/data-sources`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load data sources');
    return res.json();
  },

  async uploadDatasetFile(file: File): Promise<UploadedDatasetAnalysis> {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('urbanscientist_token');
    const res = await fetch(`${BASE_URL}/data-sources/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to upload dataset');
    }
    return res.json();
  },

  async analyzeCsvContent(payload: {
    fileName: string;
    content: string;
    fieldOverrides?: Record<string, string>;
  }): Promise<UploadedDatasetAnalysis> {
    const res = await fetch(`${BASE_URL}/data-sources/analyze-content`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to analyze CSV content');
    }
    return res.json();
  },

  async getCatalogAnalysis(fileName: string): Promise<UploadedDatasetAnalysis> {
    const res = await fetch(`${BASE_URL}/data-sources/catalog-analysis/${encodeURIComponent(fileName)}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to analyze catalog dataset');
    }
    return res.json();
  }
};
