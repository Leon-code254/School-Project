export interface Farmer {
  id: number;
  name: string;
  email: string;
  phone: string;
  region: string;
  status: 'active' | 'suspended';
  joined_date: string;
  profile_image?: string;
  farms_count: number;
  total_area: number;
}

export interface Farm {
  id: number;
  farmer_id: number;
  name: string;
  location: string;
  area: number;
  crop_type: string;
  soil_type: string;
  created_at: string;
  last_updated: string;
  status: 'active' | 'inactive';
}

export interface FarmerStats {
  total_farms: number;
  total_area: number;
  average_farm_size: number;
  crops_distribution: Array<{
    crop_type: string;
    count: number;
  }>;
}