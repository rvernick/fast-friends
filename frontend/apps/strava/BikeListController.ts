import { Platform } from "react-native";
import AppContext from "../config/app-context";
import AppController from "../config/AppController";
import { getInternal } from "../common/http_utils";
import { sleep } from "../common/utils";

class BikeListController extends AppController {
  constructor(appContext: AppContext) {
    super(appContext);
  }

  getBikes = async (username: string, appContext: AppContext): Promise<Bike[]>  => {
    if (appContext === null) {
      console.log('get bikes has no context: ' + username);
      return Promise.resolve([]);
    }
    if (appContext.getJwtToken() == null) {
      console.log('get bikes has no token sleeping: ' + username);
      await sleep(1000);
    }
    console.log('getBikes user:' + username);
    console.log(appContext);

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