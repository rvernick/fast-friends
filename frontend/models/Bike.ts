import { MaintenanceItem } from "./MaintenanceItem";

export interface Bike {
  id: number;
  name: string;
  type: string; // Example: Road, Mountain, etc.
  groupsetSpeed: number;
  groupsetBrand: string;
  isElectronic: boolean;
  odometerMeters: number;
  maintenanceItems: MaintenanceItem[];
};
