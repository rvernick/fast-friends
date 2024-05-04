import { Platform } from "react-native";
import AppContext from "../config/app-context";
import AppController from "../config/AppController";
import { authorize } from 'react-native-app-auth';
import { stravaBase, stravaClientId, stravaClientSecret } from "./utils";
import { getInternal, post } from "../common/http_utils";

class BikeListController extends AppController {
  constructor(appContext: AppContext) {
    super(appContext);
  }

  getBikes = (username: string, appContext: AppContext): Promise<Object>  => {
    console.log('getting user:' + username);
    console.log(appContext);
    console.log(appContext.getJwtToken());
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