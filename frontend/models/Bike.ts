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
  bikeDefinitionSummary: BikeDefinitionSummary | null;
};
