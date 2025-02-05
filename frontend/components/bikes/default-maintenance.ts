import { milesToMeters, today } from "@/common/utils";
import { Bike } from "@/models/Bike";
import { Action, MaintenanceItem, Part } from "@/models/MaintenanceItem";

const threeThousandMilesInMeters = milesToMeters(3000);
const twentyFiveHundredMilesInMeters = milesToMeters(2500);
const twoThousandMilesInMeters = milesToMeters(2000);
const fifteenHundredMilesInMeters = milesToMeters(1500);
const oneThousandMileInMeters = milesToMeters(1000);
const oneHundredMilesInMeters = milesToMeters(100);

export function defaultMaintenanceItems(bike: Bike): MaintenanceItem[] {
  const result: MaintenanceItem[] = [];
  
  result.push(createMaintenanceItem(bike, Part.CHAIN, Action.LUBRICATE, oneHundredMilesInMeters, 0));
  result.push(createMaintenanceItem(bike, Part.CHAIN, Action.REPLACE, fifteenHundredMilesInMeters, 0));
  result.push(createMaintenanceItem(bike, Part.FRONT_TIRE, Action.REPLACE, twentyFiveHundredMilesInMeters, 0));
  result.push(createMaintenanceItem(bike, Part.REAR_TIRE, Action.REPLACE, twoThousandMilesInMeters, 0));
  result.push(createMaintenanceItem(bike, Part.FRONT_BRAKE_PADS, Action.REPLACE, oneThousandMileInMeters, 0));
  result.push(createMaintenanceItem(bike, Part.REAR_BRAKE_PADS, Action.REPLACE, oneThousandMileInMeters, 0));
  result.push(createMaintenanceItem(bike, Part.FRONT_TIRE_SEALANT, Action.REPLACE, 0, 90));
  result.push(createMaintenanceItem(bike, Part.REAR_TIRE_SEALANT, Action.REPLACE, 0, 90));
  result.push(createMaintenanceItem(bike, Part.REAR_DERAILLEUR_BATTERY, Action.REPLACE, fifteenHundredMilesInMeters, 0));
  result.push(createMaintenanceItem(bike, Part.FRONT_DERAILLEUR_BATTERY, Action.REPLACE, fifteenHundredMilesInMeters, 0));
  result.push(createMaintenanceItem(bike, Part.LEFT_SHIFTER_BATTERY, Action.REPLACE, fifteenHundredMilesInMeters, 0));
  result.push(createMaintenanceItem(bike, Part.RIGHT_SHIFTER_BATTERY, Action.REPLACE, fifteenHundredMilesInMeters, 0));
  result.push(createMaintenanceItem(bike, Part.REAR_BRAKE_CABLE, Action.REPLACE, 0, 365));
  result.push(createMaintenanceItem(bike, Part.FRONT_BRAKE_CABLE, Action.REPLACE, 0, 365));
  result.push(createMaintenanceItem(bike, Part.REAR_SHIFTER_CABLE, Action.REPLACE, 0, 365));
  result.push(createMaintenanceItem(bike, Part.FRONT_SHIFTER_CABLE, Action.REPLACE, 0, 365));
  return result;
}

const createMaintenanceItem = (bike: Bike, part: Part, action: Action, defaultLongevity: number, days: number): MaintenanceItem => {
  return {
    id: 0,
    part,
    action,
    name: '',
    brand: '',
    model: '',
    link: '',
    bikeDistance: bike.odometerMeters,
    dueDistanceMeters: defaultLongevity > 0 ? bike.odometerMeters + defaultLongevity : 0,
    defaultLongevity: defaultLongevity,
    defaultLongevityDays: days,
    dueDate: days > 0 ? new Date(today().getTime() + days * 24 * 60 * 60 * 1000) : new Date(),
    autoAdjustLongevity: true,
  };
}