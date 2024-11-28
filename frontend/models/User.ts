import { Bike } from "./Bike";

export interface User {
  username: string;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  cellPhone: string;
  stravaId: string;
  bikes: Bike[];
  units: string;
};

export enum Units {
  KM = "km",
  MILES = "miles",
}
