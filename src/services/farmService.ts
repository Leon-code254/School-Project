import api from './api';

export interface Farm {
  id: number;
  name: string;
  location: string;
  size_hectares: number;
  soil_type: 'clay' | 'sandy' | 'silt' | 'peat' | 'loam' | 'chalky';
  irrigation_method: 'drip' | 'sprinkler' | 'flood' | 'center_pivot' | 'manual';
  created_at: string;
  farmer_id: number;
  elevation_meters?: number;
  last_reading_date?: string;
}

export interface CreateFarmDto {
  name: string;
  location: string;
  size_hectares: number;
  soil_type: Farm['soil_type'];
  irrigation_method: Farm['irrigation_method'];
  farmer_id: number;
  elevation_meters?: number;
}

export interface UpdateFarmDto extends Partial<CreateFarmDto> {}

export interface FarmSoilReading {
  id: number;
  farm_id: number;
  moisture_percentage: number;
  ph_level: number;
  nitrogen_level: number;
  phosphorus_level: number;
  potassium_level: number;
  reading_date: string;
}

export interface FarmStatistics {
  soil_readings_count: number;
  average_moisture: number;
  average_ph: number;
  last_reading_date: string;
  recommendations_count: number;
}

const farmService = {
  getAllFarms: async (filters?: { farmer_id?: number; soil_type?: string }): Promise<Farm[]> => {
    const response = await api.get('/farms', { params: filters });
    return response.data;
  },

  getFarmById: async (id: number): Promise<Farm> => {
    const response = await api.get(`/farms/${id}`);
    return response.data;
  },

  createFarm: async (farmData: CreateFarmDto): Promise<Farm> => {
    const response = await api.post('/farms', farmData);
    return response.data;
  },

  updateFarm: async (id: number, farmData: UpdateFarmDto): Promise<Farm> => {
    const response = await api.patch(`/farms/${id}`, farmData);
    return response.data;
  },

  deleteFarm: async (id: number): Promise<void> => {
    await api.delete(`/farms/${id}`);
  },

  getFarmSoilReadings: async (id: number): Promise<FarmSoilReading[]> => {
    const response = await api.get(`/farms/${id}/soil-readings`);
    return response.data;
  },

  getFarmStatistics: async (id: number): Promise<FarmStatistics> => {
    const response = await api.get(`/farms/${id}/statistics`);
    return response.data;
  },

  getFarmsByFarmerId: async (farmerId: number): Promise<Farm[]> => {
    return farmService.getAllFarms({ farmer_id: farmerId });
  },
};

export default farmService;