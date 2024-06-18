
export interface MaintenanceItem {
  id: number;
  part: string;
  type: string;
  brand: string;
  model: string;
  link: string;
  dueDistanceMeters: number;
  dueDate: Date;
  completed: boolean;
}
