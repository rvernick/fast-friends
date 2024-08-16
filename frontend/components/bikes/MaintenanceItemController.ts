import AppContext from "@/common/app-context";
import AppController from "@/common/AppController";
import { getInternal, post } from "@/common/http-utils";
import { ensureString, sleep } from "@/common/utils";
import { Bike } from "@/models/Bike";
import { MaintenanceItemType } from "../strava/utils";
import { MaintenanceItem } from "@/models/MaintenanceItem";


class BikeController extends AppController {
  constructor(appContext: AppContext) {
    super(appContext);
  }

  getMaintenanceItem = (session: any, maintenanceId: number, username: string, appContext: AppContext): Promise<MaintenanceItem | null>=> {
    if (session === null) {
      console.log('get maintenanceItem has no context: ' + username);
      return Promise.resolve(null);
    }
    const jwtToken = session.jwt_token;
    if (jwtToken == null) {
      console.log('get bikes has no token dying: ' + username);
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
  }

  getBikes = async (session: any, username: string): Promise<Bike[]>  => {
    await sleep(0.1);
    if (session === null) {
      console.log('get bikes has no context: ' + username);
      return Promise.resolve([]);
    }
    const jwtToken = await session.jwt_token;
    if (jwtToken == null) {
      console.log('get bikes has no token dying: ' + username);
      return Promise.resolve([]);
    }

    try {
      const parameters = {
        username: username,
      };
      console.log('get bikes');
      return getInternal('/bike/bikes', parameters, jwtToken);
    } catch(e: any) {
      console.log(e.message);
      return [];
    }
  }

  deleteMaintenanceItem = async (session: any, username: string, maintenanceItemId: number): Promise<boolean> => {
    if (session === null) {
      console.log('get maintenanceItem has no context: ' + username);
      return Promise.resolve(false);
    }
    const jwtToken = session.jwt_token;
    if (jwtToken == null) {
      console.log('get bikes has no token dying: ' + username);
      return Promise.resolve(false);
    }

    try {
      const parameters = {
        username: username,
        maintenanceid: maintenanceItemId,
      };
      console.log('delete maintenanceItem ' + maintenanceItemId);
      console.log('/bike/delete-maintenance-item', JSON.stringify(parameters));
      const response = await post('/bike/delete-maintenance-item', parameters, jwtToken);
      return response.ok;
    } catch(e: any) {
      console.log(e.message);
      return Promise.resolve(false);
    }
  }

  updateMaintenanceItem = async (
      session: any,
      username: string,
      maintenanceItemId: number,
      bikeId: number,
      part: string,
      dueMiles: number,
      brand: string,
      model: string,
      link: string
    ) => {

    if (session === null) {
      console.log('get maintenanceItem has no context: ' + username);
      return Promise.resolve(false);
    }
    const jwtToken = session.jwt_token;
    if (jwtToken == null) {
      console.log('get bikes has no token dying: ' + username);
      return Promise.resolve(false);
    }

    try {
      const parameters = {
        username: username,
        id: maintenanceItemId,
        bikeid: bikeId,
        part: ensureString(part),
        duemiles: dueMiles,
        brand: ensureString(brand),
        model: ensureString(model),
        maintenanceid: maintenanceItemId,
        link: ensureString(link),
      };
      console.log('update maintenanceItem ' + maintenanceItemId);
      console.log('/bike/update-maintenance-item', JSON.stringify(parameters));
      const response = await post('/bike/update-maintenance-item', parameters, jwtToken);
      return response.ok;
    } catch(e: any) {
      console.log(e.message);
      return Promise.resolve(false);
    }
  }

}

export default BikeController;