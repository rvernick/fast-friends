import AppContext from "@/common/app-context";
import AppController from "@/common/AppController";
import { getHistory } from "@/common/data-utils";
import { MaintenanceHistoryItem } from "@/models/MaintenanceHistory";

class MaintenanceHistoryController extends AppController {
  constructor(appContext: AppContext) {
    super(appContext);
  }

  getHistory = async (session: any, username: string): Promise<MaintenanceHistoryItem[]> => {
    return getHistory(session, username);
  }

}

export default MaintenanceHistoryController;
