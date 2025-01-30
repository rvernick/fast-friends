export interface MaintenanceHistoryItem {
  id: number;
//  bike: Bike;
  bikeName: string;
  bikeId: number;
  distanceMeters: number;
  doneDate: Date;
  part: string;
  action: string;
  name: string;
  brand: string;
  model: string;
  link: string;
  bikeOdemeterMeters: number;
  dueDistanceMeters: number;
  defaultLongevity: number;
  autoAdjustLongevity: boolean;
};
