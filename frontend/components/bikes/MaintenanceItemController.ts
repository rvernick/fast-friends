import AppContext from "@/common/app-context";
import AppController from "@/common/AppController";
import { getInternal, post } from "@/common/http-utils";
import { ensureString, sleep } from "@/common/utils";
import { Bike } from "@/models/Bike";
import { MaintenanceItem } from "@/models/MaintenanceItem";

class MaintenanceItemController extends AppController {
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
  }

  deleteMaintenanceItem = async (session: any, username: string, maintenanceItemId: number): Promise<boolean> => {
    if (session === null) {
      console.log('get maintenanceItem has no context: ' + username);
      return Promise.resolve(false);
    }
    const jwtToken = session.jwt_token;
    if (jwtToken == null) {
      console.log('delete maintenance item has no token dying: ' + username);
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

  updateOrAddMaintenanceItem = async (
      session: any,
      username: string,
      maintenanceItemId: number,
      bikeId: number,
      part: string,
      dueMiles: number,
      brand: string,
      model: string,
      link: string,
      defaultLongevity: number,
      autoAdjustLongevity: boolean,
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
        defaultLongevity: defaultLongevity,
        autoAdjustLongevity: autoAdjustLongevity,
      };
      console.log('update maintenanceItem ' + maintenanceItemId);
      console.log('/bike/update-or-add-maintenance-item', JSON.stringify(parameters));
      const response = await post('/bike/update-or-add-maintenance-item', parameters, jwtToken);
      return response.ok;
    } catch(e: any) {
      console.log(e.message);
      return Promise.resolve(false);
    }
  }

  async logMaintenance(session: any, selectedItems: MaintenanceLog[]): Promise<string> {
    console.log('log maintenance ' + session.email);
    const logUpdates = selectedItems.map(item => ({
      maintenanceItemId: item.maintenanceItem.id,
      bikeId: item.bikeId,
      nextDue: item.nextDue,
    }));

    try {
      const parameters = {
        username: session.email,
        logs: logUpdates,
      };
      const response = await post('/bike/log-performed-maintenance', parameters, session.jwt_token);
      return response.ok ? '' : 'Failed to log maintenance';
    } catch(e: any) {
      console.log(e.message);
      return e.message;
    }
  }
}

interface MaintenanceLog {
  id: number;
  bikeId: number;
  maintenanceItem: MaintenanceItem;
  nextDue: number;
  selected: boolean;
}

export default MaintenanceItemController;
