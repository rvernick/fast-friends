
export interface MaintenanceItem {
  id: number;
//  bike: Bike;
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
  FRONT_BRAKE_ROTOR = "Front Brake Rotor",
  REAR_BRAKE_ROTOR = "Rear Brake Rotor",
  REAR_SHIFTER_CABLE = "Rear Shifter Cable",
  FRONT_SHIFTER_CABLE = "Front Shifter Cable",
  BAR_TAPE = "Bar Tape",
  TUNE_UP = "Tune Up",
  FRONT_SUSPENSION = "Front Suspension",
  REAR_SUSPENSION = "Rear Suspension",
  FRONT_DERAILLEUR_BATTERY = "Front Derailleur Battery",
  REAR_DERAILLEUR_BATTERY = "Rear Derailleur Battery",
};

export enum Action {
  CHECK = "Check",
  CLEAN = "Clean",
  LUBRICATE = "Lubricate",
  REPLACE = "Replace",
};
