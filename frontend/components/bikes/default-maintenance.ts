import { milesToMeters } from "@/common/utils";
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
  
  result.push(createMaintenanceItem(Part.CHAIN, Action.LUBRICATE, oneHundredMilesInMeters, 0));
  result.push(createMaintenanceItem(Part.CHAIN, Action.REPLACE, fifteenHundredMilesInMeters, 0));
  result.push(createMaintenanceItem(Part.FRONT_TIRE, Action.REPLACE, twentyFiveHundredMilesInMeters, 0));
  result.push(createMaintenanceItem(Part.REAR_TIRE, Action.REPLACE, twoThousandMilesInMeters, 0));
  result.push(createMaintenanceItem(Part.FRONT_BRAKE_PADS, Action.REPLACE, oneThousandMileInMeters, 0));
  result.push(createMaintenanceItem(Part.REAR_BRAKE_PADS, Action.REPLACE, oneThousandMileInMeters, 0));
  result.push(createMaintenanceItem(Part.FRONT_TIRE_SEALANT, Action.REPLACE, 0, 90));
  result.push(createMaintenanceItem(Part.REAR_TIRE_SEALANT, Action.REPLACE, 0, 90));
  return result;
}

const createMaintenanceItem = (part: Part, action: Action, bikeDistance: number, days: number): MaintenanceItem => {
  return {
    id: 0,
    part,
    action,
    name: '',
    brand: '',
    model: '',
    link: '',
    bikeDistance,
    dueDistanceMeters: bikeDistance,
    defaultLongevity: bikeDistance,
    defaultLongevityDays: days,
    dueDate: new Date(),
    autoAdjustLongevity: true,
  };
}