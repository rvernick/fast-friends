

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
  FRONT_TIRE_SEALANT = "Front Tire Sealant",
  REAR_TIRE_SEALANT = "Rear Tire Sealant",
  LEFT_SHIFTER_BATTERY = "Left Shifter Battery",
  RIGHT_SHIFTER_BATTERY = "Right Shifter Battery",
  FRONT_WHEEL = "Front Wheel",
  REAR_WHEEL = "Rear Wheel",
  PEDALS = "Pedals",
  FRONT_SHIFTER = "Front Shifter",
  REAR_SHIFTER = "Rear Shifter",
  FRONT_BRAKE = "Front Brake",
  REAR_BRAKE = "Rear Brake",
};

export const getPartFor = (partCode: string): Part | null => {
  const vals = Object.values(Part);
  const keys = Object.keys(Part)
  for (const checkKey in keys) {
    if (vals[checkKey] === partCode) {
      return Part[keys[checkKey]];
    }
  }
  return null;
}


export enum GroupsetBrand {
  SHIMANO = "Shimano",
  SRAM = "SRAM",
  CAMPAGNOLO = "Campagnolo"
}

export enum Action {
  CHECK = "Check",
  CLEAN = "Clean",
  LUBRICATE = "Lubricate",
  REPLACE = "Replace",
};

export const getActionFor = (actionCode: string): Action | null => {
  const vals = Object.values(Action);
  const keys = Object.keys(Action)
  for (const checkKey in keys) {
    if (vals[checkKey] === actionCode) {
      return Action[keys[checkKey]];
    }
  }
  return null;
}

export enum Material {
  CARBON = "Carbon",
  ALLOY = "Alloy",
  STEEL = "Steel",
  TITANIUM = "Titanium",
  BAMBOO = "Bamboo",
}
