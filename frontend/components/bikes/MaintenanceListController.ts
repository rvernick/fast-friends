import AppContext from "@/common/app-context";
import AppController from "@/common/AppController";
import { getInternal } from "@/common/http-utils";
import { Bike } from "@/models/Bike";
import { MaintenanceItem } from "@/models/MaintenanceItem";

class MaintenanceListController extends AppController {
  constructor(appContext: AppContext) {
    super(appContext);
  }

  getBikes = async (session: any, username: string): Promise<Bike[] | null> => {
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
  }

  getMaintenanceItems = async (session: any, username: string): Promise<MaintenanceItem[]>  => {
    if (session === null) {
      console.log('get maintenanceItems has no context: ' + username);
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
      console.log('get maintenance items');
      return getInternal('/bike/maintenance-items', parameters, jwtToken);
    } catch(e: any) {
      console.log(e.message);
      return [];
    }
  }
}

export default MaintenanceListController;
