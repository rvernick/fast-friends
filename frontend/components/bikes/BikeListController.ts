import AppContext from "@/common/app-context";
import AppController from "@/common/AppController";
import { getInternal } from "@/common/http-utils";
import { sleep } from "@/common/utils";
import { Bike } from "@/models/Bike";


class BikeListController extends AppController {
  constructor(appContext: AppContext) {
    super(appContext);
  }

  getBikes = async (username: string, appContext: AppContext): Promise<Bike[]>  => {
    const result = [];
    result.push({
      id: 3,
      name: 'Three Bike',
      groupsetBrand: 'Shimano',
      groupsetSpeed: 10,
      isElectronic: true,
      type: 'Road',
    });
    result.push({id: 2,
      name: 'Two Bike',
      groupsetBrand: 'Shimano',
      groupsetSpeed: 11,
      isElectronic: false,
      type: 'Mountain',
    });
    result.push({id: 1,
      name: 'Test Bike',
      groupsetBrand: 'Shimano',
      groupsetSpeed: 12,
      isElectronic: true,
      type: 'Road',
    });

    return Promise.resolve(result);
  }

  getBikesX = async (username: string, appContext: AppContext): Promise<Bike[]>  => {
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
      return [];
    }
  }
}

export default BikeListController;