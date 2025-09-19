import { Farm as ServiceFarm } from '../services/farmService';

// Combined interface with all required properties
export interface Farm extends ServiceFarm {
  crop_type: string;
  area: number;
  status: 'active' | 'inactive';
  last_updated: string;
}

// Type guard to convert from service Farm type to full Farm type
export function toFullFarm(farm: ServiceFarm): Farm {
  return {
    ...farm,
    crop_type: determineCropType(farm),
    area: farm.size_hectares,
    status: determineStatus(farm),
    last_updated: farm.last_reading_date || farm.created_at,
  };
}

// Helper function to determine crop type based on farm data
function determineCropType(farm: ServiceFarm): string {
  // This is a placeholder - you'll need to implement the actual logic
  // based on your farm data or service calls
  return 'unknown';
}

// Helper function to determine farm status based on farm data
function determineStatus(farm: ServiceFarm): 'active' | 'inactive' {
  // This is a placeholder - you'll need to implement the actual logic
  // based on your farm data or service calls
  return farm.last_reading_date ? 'active' : 'inactive';
}