import { BikeDefinitionSummary } from "./BikeDefinition";
import { MaintenanceItem } from "./MaintenanceItem";

export interface Bike {
  id: number;
  name: string;
  type: string; // Example: Road, Mountain, etc.
  year: string | null;
  brand: string | null;
  model: string | null;
  line: string | null;
  groupsetSpeed: number;
  groupsetBrand: string;
  isElectronic: boolean;
  odometerMeters: number;
  maintenanceItems: MaintenanceItem[];
  stravaId: string;
  isRetired: boolean;
  serialNumber: string;
  bikeDefinitionSummary: BikeDefinitionSummary | null;
  bikePhotoUrl: string | null;
};

export const createNewBike = (): Bike => {
  return {
    id: 0,
    name: '',
    type: 'Road',
    groupsetSpeed: 11,
    groupsetBrand: 'Shimano',
    isElectronic: false,
    odometerMeters: 0,
    maintenanceItems: [],
    stravaId: '',
    isRetired: false,
    bikeDefinitionSummary: null,
    year: '',
    brand: '',
    model: '',
    line: '',
    bikePhotoUrl: null,
    serialNumber: '',
  }
};
