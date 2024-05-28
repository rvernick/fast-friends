import { Platform } from "react-native";
import AppContext from "../config/app-context";
import AppController from "../config/AppController";
import { getInternal, post } from "../common/http_utils";
import { sleep } from "../common/utils";

class BikeController extends AppController {
  constructor(appContext: AppContext) {
    super(appContext);
  }

  updateBike = async (
    username: string,
    id: number,
    name: string,
    groupsetBrand: string,
    groupsetSpeed: string,
    isElectronic: boolean): Promise<string> => {

    try {
      const body = {
        username: username,
        id: id,
        name: name,
        groupsetBrand: groupsetBrand,
        groupsetSpeed: Number(groupsetSpeed),
        isElectronic: isElectronic,
      };

      const response = await post('/user/add-or-update-bike', body, this.appContext.getJwtTokenPromise());
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

  deleteBike = async (username: string, id: number): Promise<string> => {
    try {
      const body = {
        username: username,
        id: id,
      };

      const response = await post('/user/delete-bike', body, this.appContext.getJwtTokenPromise());
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