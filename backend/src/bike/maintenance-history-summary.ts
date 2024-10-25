import { MaintenanceHistory } from './maintenance-history.entity';

export class MaintenanceHistorySummary {
  constructor(history: MaintenanceHistory) {
    this.id = history.id;
    this.maintenanceItemId = history.maintenanceItem.id;
    this.bikeName = history.maintenanceItem.bike.name;
    this.bikeId = history.maintenanceItem.bike.id;
    this.part = history.part;
    this.distanceMeters = history.distanceMeters;
    this.type = history.type;
    this.brand = history.brand;
    this.model = history.model;
    this.link = history.link;
  }

  id: number;
  maintenanceItemId: number;
  bikeName: string;
  bikeId: number;
  part: string;
  distanceMeters: number;
  type: string;
  brand: string;
  model: string;
  link: string;
}
