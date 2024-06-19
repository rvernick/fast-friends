import { Platform } from "react-native";
import AppContext from "../config/app-context";
import AppController from "../config/AppController";
import { getInternal, post } from "../common/http_utils";
import { sleep } from "../common/utils";
 import { MaintenanceItem } from "../../models/maintenanceItem";

class MaintenanceListController extends AppController {
  constructor(appContext: AppContext) {
    super(appContext);
  }

  getMaintenanceItems = async (username: string, bikeId: number): Promise<MaintenanceItem[]>  => {
    await sleep(20);
    console.log('get maintenanceItems bikeId:'+ bikeId);
    if (this.appContext === null) {
      console.log('get maintenanceItems has no context: ' + username);
      return Promise.resolve([]);
    }
    const jwtToken = await this.appContext.getJwtTokenPromise();
    if (jwtToken == null) {
      console.log('get MaintenanceItems has no token dying: ' + username);
      return Promise.resolve([]);
    }

    try {
      const parameters = {
        username: username,
        bikeId: bikeId,
        latest: true,
      };
      return getInternal('/user/maintenance-items', parameters, this.appContext.getJwtTokenPromise());
    } catch(e: any) {
      console.log(e.message);
      return [];
    }
  };

  performedMaintenance = async (username: string, maintenanceItem) => {
    console.log('performed maintenanceItem:' + JSON.stringify(maintenanceItem));
    if (this.appContext === null) {
      console.log('get maintenanceItems has no context: ' + username);
      return Promise.resolve([]);
    }
    const jwtToken = await this.appContext.getJwtTokenPromise();
    if (jwtToken == null) {
      console.log('get MaintenanceItems has no token dying: ' + username);
      return Promise.resolve([]);
    }

    try {
      const parameters = {
        username: username,
        maintenanceItemId: maintenanceItem.id,
      };
      return post('/user/performed-maintenance', parameters, this.appContext.getJwtTokenPromise());
    } catch(e: any) {
      console.log(e.message);
      return [];
    }
  };

};

export default MaintenanceListController;