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
  pushToken: string;
};

export enum Units {
  KM = "km",
  MILES = "miles",
}

export const blankUser = () => {
  return {
    username: '',
    emailVerified: false,
    firstName: '',
    lastName: '',
    cellPhone: '',
    stravaId: '',
    bikes: [],
    units: Units.MILES,
  };
};