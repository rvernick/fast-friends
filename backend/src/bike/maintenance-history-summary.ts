import { MaintenanceHistory } from './maintenance-history.entity';

export class MaintenanceHistorySummary {
  constructor(history: MaintenanceHistory) {
    this.id = history.id;
    this.maintenanceItemId = history.maintenanceItem.id;
    this.bikeName = history.maintenanceItem.bike.name;
    this.bikeId = history.maintenanceItem.bike.id;
    this.part = history.maintenanceItem.part;
    this.action = history.maintenanceItem.action;
    this.distanceMeters = history.distanceMeters;
    this.bikeOdemeterMeters = history.maintenanceItem.bike.odometerMeters;
    this.doneDate = history.doneDate;
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
  action: string;
  distanceMeters: number;
  bikeOdemeterMeters: number;
  doneDate: Date;
  type: string;
  brand: string;
  model: string;
  link: string;
}
