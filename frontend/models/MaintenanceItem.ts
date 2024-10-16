
export interface MaintenanceItem {
  id: number;
//  bike: Bike;
  part: string;
  name: string;
  brand: string;
  model: string;
  link: string;
  bikeDistance: number;
  dueDistanceMeters: number;
  defaultLongevity: number;
  autoAdjustLongevity: boolean;
};

export enum Part {
  CHAIN = "Chain",
  CASSETTE = "Cassette",
  FRONT_TIRE = "Front Tire",
  REAR_TIRE = "Rear Tire",
  CRANKSET = "Crankset",
  FRONT_BRAKE_CABLE = "Front Brake Cable",
  REAR_BRAKE_CABLE = "Rear Brake Cable",
  FRONT_BRAKE_PADS = "Front Brake Pads",
  REAR_BRAKE_PADS = "Rear Brake Pads",
  REAR_SHIFTER_CABLE = "Rear Shifter Cable",
  FRONT_SHIFTER_CABLE = "Front Shifter Cable",
  BAR_TAPE = "Bar Tape",
  TUNE_UP = "Tune Up",
};
