import AppContext from "@/common/app-context";
import AppController from "@/common/AppController";
import { getInternal } from "@/common/http-utils";
import { Bike } from "@/models/Bike";
import { MaintenanceHistoryItem } from "@/models/MaintenanceHistory";
import { MaintenanceItem } from "@/models/MaintenanceItem";

class MaintenanceHistoryController extends AppController {
  constructor(appContext: AppContext) {
    super(appContext);
  }

  getHistory = async (session: any, username: string): Promise<MaintenanceHistoryItem[]> => {
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
      console.log('get bikes ' +'username:'+ username);
      return getInternal('/bike/maintenance-history', parameters, jwtToken);
    } catch(e: any) {
      console.log(e.message);
      return [];
    }
  }

}

export default MaintenanceHistoryController;
