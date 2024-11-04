import { Bike } from "@/models/Bike";
import { sleep } from "./utils";
import { getInternal } from "./http-utils";
import { MaintenanceHistoryItem } from "@/models/MaintenanceHistory";

export const getBikes = async (session: any, username: string): Promise<Bike[] | null> => {
  sleep(0.1);
  if (session === null) {
    console.log('get maintenanceItems has no context: ' + username);
    return Promise.resolve(null);
  }
  const jwtToken = await session.jwt_token;
  if (jwtToken == null) {
    console.log('get bikes has no token dying: ' + username);
    return Promise.resolve(null);
  }

  try {
    const parameters = {
      username: username,
    };
    console.log('get bikes ' +'username:'+ username);
    return getInternal('/bike/bikes', parameters, jwtToken);
  } catch(e: any) {
    console.log(e.message);
    return null;
  }
};

export const getHistory = async (session: any, username: string): Promise<MaintenanceHistoryItem[]> => {
  if (session === null) {
    console.log('get maintenanceItems has no context: ' + username);
    return Promise.resolve([]);
  }
  const jwtToken = await session.jwt_token;
  if (jwtToken == null) {
    console.log('get history has no token dying: ' + username);
    return Promise.resolve([]);
  }

  try {
    const parameters = {
      username: username,
    };
    console.log('get history ' +'username:'+ username);
    return getInternal('/bike/maintenance-history', parameters, jwtToken);
  } catch(e: any) {
    console.log(e.message);
    return [];
  }
};