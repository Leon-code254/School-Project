import api from './api';

export interface FarmProfile {
  farm_name: string;
  location: string;
  soil_type?: 'clay' | 'sandy' | 'silt' | 'peat' | 'loam' | 'chalky';
  irrigation_method?: 'drip' | 'sprinkler' | 'flood' | 'center_pivot' | 'manual';
  farm_size_hectares?: number;
  elevation_meters?: number;
}

import { Farmer, Farm } from '../types/farmer';

const farmerService = {
  getAllFarmers: async (filters?: { region?: string; status?: string }): Promise<Farmer[]> => {
    const response = await api.get('/farmers', { params: filters });
    return response.data;
  },

  getFarmerById: async (id: number): Promise<Farmer> => {
    const response = await api.get(`/farmers/${id}`);
    return response.data;
  },

  updateFarmerStatus: async (id: number, status: 'active' | 'suspended'): Promise<Farmer> => {
    const response = await api.patch(`/farmers/${id}/status`, { status });
    return response.data;
  },

  updateFarmProfile: async (id: number, profile: FarmProfile): Promise<Farmer> => {
    const response = await api.put(`/farmers/${id}/profile`, profile);
    return response.data;
  },

  getFarmersByRegion: async (region: string): Promise<Farmer[]> => {
    const response = await api.get('/farmers', { params: { region } });
    return response.data;
  },
};

export default farmerService;