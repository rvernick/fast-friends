import { Bike } from "./Bike";

export interface User {
  username: string;
  firstName: string;
  lastName: string;
  cellPhone: string;
  stravaId: string;
  bikes: Bike[];
};
