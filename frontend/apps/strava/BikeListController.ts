import { Platform } from "react-native";
import AppContext from "../config/app-context";
import AppController from "../config/AppController";
import { getInternal } from "../common/http_utils";
import { sleep } from "../common/utils";
import { Bike } from "../../models/bike";

class BikeListController extends AppController {
  constructor(appContext: AppContext) {
    super(appContext);
  }

  getBikes = async (username: string, appContext: AppContext): Promise<Bike[]>  => {
    await sleep(20);
    if (appContext === null) {
      console.log('get bikes has no context: ' + username);
      return Promise.resolve([]);
    }
    const jwtToken = await appContext.getJwtTokenPromise();
    if (jwtToken == null) {
      console.log('get bikes has no token dying: ' + username);
      return Promise.resolve([]);
    }

    try {
      const parameters = {
        username: username,
      };
      return getInternal('/user/bikes', parameters, appContext.getJwtTokenPromise());
    } catch(e: any) {
      console.log(e.message);
      return null;
    }
  }
}

export default BikeListController;