import { MaintenanceItem } from "./MaintenanceItem";

export interface MaintenanceLog {
  id: number;
  bikeId: number;
  bikeMileage: number;
  maintenanceItem: MaintenanceItem;
  due: number;
  nextDue: number | null;
  nextDate: Date | null;
  selected: boolean;
}