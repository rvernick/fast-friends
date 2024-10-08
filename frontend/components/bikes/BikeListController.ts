import AppContext from "@/common/app-context";
import AppController from "@/common/AppController";
import { getInternal } from "@/common/http-utils";
import { sleep } from "@/common/utils";
import { Bike } from "@/models/Bike";

class BikeListController extends AppController {
  constructor(appContext: AppContext) {
    super(appContext);
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
}

export default BikeListController;
