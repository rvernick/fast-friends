import AppContext from "@/common/app-context";
import AppController from "@/common/AppController";
import { getInternal } from "@/common/http-utils";
import { sleep } from "@/common/utils";
import { Bike } from "@/models/Bike";
import { MaintenanceItem } from "@/models/MaintenanceItem";


class MaintenanceListController extends AppController {
  constructor(appContext: AppContext) {
    super(appContext);
  }

  getMaintenanceItems = async (session: any, username: string): Promise<MaintenanceItem[]>  => {
    await sleep(20);
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
      return getInternal('/user/maintenance-items', parameters, jwtToken);
    } catch(e: any) {
      console.log(e.message);
      return [];
    }
  }
}

export default MaintenanceListController;
