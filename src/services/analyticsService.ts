import api from './api';

export interface RegionalStat {
  region: string;
  count: number;
  total_area: number;
  avg_yield: number;
}

export interface DashboardStats {
  farmersByRegion: RegionalStat[];
  farmsByCropType: Array<{
    type: string;
    count: number;
  }>;
  monthlyRegistrations: Array<{
    month: string;
    count: number;
  }>;
  soilTypes: Array<{
    type: string;
    count: number;
  }>;
}

export interface CustomReportConfig {
  fields: string[];
  filters: Record<string, any>;
  groupBy?: string;
}

const analyticsService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/admin/analytics/dashboard');
    return response.data;
  },

  getRegionalStats: async () => {
    const response = await api.get('/admin/analytics/regional');
    return response.data;
  },

  generateReport: async (config: CustomReportConfig) => {
    const response = await api.post('/admin/analytics/report', config);
    return response.data;
  },

  exportAnalytics: async (type: string, format: 'excel' | 'csv') => {
    const response = await api.get(`/admin/analytics/export/${type}?format=${format}`, {
      responseType: 'blob'
    });
    return response.data;
  },
};

export default analyticsService;