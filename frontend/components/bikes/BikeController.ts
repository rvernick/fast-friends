import AppContext from "@/common/app-context";
import AppController from "@/common/AppController";
import { getInternal, post } from "@/common/http-utils";
import { Bike } from "@/models/Bike";


class BikeController extends AppController {
  constructor(appContext: AppContext) {
    super(appContext);
  }

  getBike = async (session: any, bikeid: number, username: string, appContext: AppContext): Promise<Bike | null>  => {
    if (appContext === null) {
      console.log('get bikes has no context: ' + username);
      return Promise.resolve(null);
    }
    const jwtToken = session.jwt_token;
    if (jwtToken == null) {
      console.log('get bikes has no token dying: ' + username);
      return Promise.resolve(null);
    }

    try {
      const parameters = {
        username: username,
        bikeid: bikeid,
      };
      return getInternal('/bike/bike', parameters, jwtToken);
    } catch(e: any) {
      console.log(e.message);
      return null;
    }
  }

  updateBike = async (
    session: any,
    username: string,
    id: number,
    name: string,
    odometerMeters: number,
    type: string,
    groupsetBrand: string,
    groupsetSpeed: string,
    isElectronic: boolean): Promise<string> => {

    try {
      const body = {
        username: username,
        id: id,
        name: name,
        odometerMeters: odometerMeters,
        type: type,
        groupsetBrand: groupsetBrand,
        groupsetSpeed: Number(groupsetSpeed),
        isElectronic: isElectronic,
      };

      console.log('update bike called: ' + JSON.stringify(body));
      const response = await post('/bike/add-or-update-bike', body, session.jwt_token);
      if (response.ok) {
        return '';
      }
      const result = await response.json();
      console.log('json ' + result.message);
      return result.message;
    } catch(e: any) {
      console.log(e.message);
      return 'Unable to Update Account';
    }
  };

  deleteBike = async (session: any, username: string, id: number): Promise<string> => {
    try {
      const body = {
        username: username,
        id: id,
      };

      const response = await post('/user/delete-bike', body, session.jwt_token);
      if (response.ok) {
        return '';
      }
      const result = await response.json();
      console.log('json ' + result.message);
      return result.message;
    } catch(e: any) {
      console.log(e.message);
      return 'Unable to Update Account';
    }
  };
}

export default BikeController;