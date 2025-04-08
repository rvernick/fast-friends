import { Bike } from "@/models/Bike";
import { sleep } from "./utils";
import { getInternal } from "./http-utils";
import { MaintenanceHistoryItem } from "@/models/MaintenanceHistory";
import { MaintenanceItem } from "@/models/MaintenanceItem";

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

export const getBike = async (session: any, bikeid: number, username: string): Promise<Bike | null>  => {
  const jwtToken = session.jwt_token;
  if (jwtToken == null) {
    console.log('get bikes has no token dying: ' + username);
    return Promise.resolve(null);
  }

  try {
    const parameters = {
      username: username,
      bikeid: bikeid,
    };
    return getInternal('/bike/bike', parameters, jwtToken);
  } catch(e: any) {
    console.log(e.message);
    return null;
  }
};

export const getMaintenanceItem = (session: any, maintenanceId: number, username: string): Promise<MaintenanceItem | null>=> {
  if (session === null) {
    console.log('get maintenanceItem has no context: ' + username);
    return Promise.resolve(null);
  }
  const jwtToken = session.jwt_token;
  if (jwtToken == null) {
    console.log('get maintenance item has no token dying: ' + username);
    return Promise.resolve(null);
  }

  try {
    const parameters = {
      username: username,
      maintenanceid: maintenanceId,
    };
    console.log('get maintenanceItem');
    return getInternal('/bike/maintenance-item', parameters, jwtToken);
  } catch(e: any) {
    console.log(e.message);
    return Promise.resolve(null);
  }
};

export const getMaintenanceHistoryItem = (session: any, maintenanceHistoryId: number, username: string): Promise<MaintenanceHistoryItem | null>=> {
  if (session === null) {
    console.log('get maintenanceHistoryItem has no context: ' + username);
    return Promise.resolve(null);
  }
  const jwtToken = session.jwt_token;
  if (jwtToken == null) {
    console.log('get maintenance history item has no token dying: ' + username);
    return Promise.resolve(null);
  }

  try {
    const parameters = {
      username: username,
      maintenance_history_id: maintenanceHistoryId,
    };
    console.log('get maintenanceItem');
    return getInternal('/bike/maintenance-history-item', parameters, jwtToken);
  } catch(e: any) {
    console.log(e.message);
    return Promise.resolve(null);
  }
};

export const getAllBrands = async (session: any): Promise<string[]> => {
  if (session === null) {
    console.log('get all brands has no context');
    return Promise.resolve([]);
  }
  const jwtToken = session.jwt_token;
  if (jwtToken == null) {
    console.log('get all brands has no token dying');
    return Promise.resolve([]);
  }

  try {
    const parameters = {};
    console.log('get all brands');
    const result = getInternal('/bike-definition/all-brands', parameters, jwtToken);
    console.log('get all brands result:', await result);
    return result;
  } catch(e: any) {
    console.log(e.message);
    return Promise.resolve([]);
  }
};

export const getModels = async (session: any, brand: string): Promise<string[]> => {
  if (session === null) {
    console.log('get all brands has no context');
    return Promise.resolve([]);
  }
  const jwtToken = session.jwt_token;
  if (jwtToken == null) {
    console.log('get all brands has no token dying');
    return Promise.resolve([]);
  }

  try {
    const parameters = {
      brand: brand,
    };
    console.log('get all brands');
    return getInternal('/bike-definition/models-for-brand', parameters, jwtToken);
  } catch(e: any) {
    console.log(e.message);
    return Promise.resolve([]);
  }
}
