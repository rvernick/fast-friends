export interface MaintenanceHistoryItem {
  id: number;
//  bike: Bike;
  bikeName: string;
  bikeId: number;
  distanceMeters: number;
  part: string;
  action: string;
  name: string;
  brand: string;
  model: string;
  link: string;
  bikeDistance: number;
  dueDistanceMeters: number;
  defaultLongevity: number;
  autoAdjustLongevity: boolean;
};

