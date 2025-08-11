import AppContext from "@/common/app-context";
import AppController from "@/common/AppController";
import { getBike } from "@/common/data-utils";
import { post, postForm } from "@/common/http-utils";
import { Bike } from "@/models/Bike";


class BikeController extends AppController {
  constructor(appContext: AppContext) {
    super(appContext);
  }

  getBike = async (session: any, bikeid: number, username: string): Promise<Bike | null>  => {
    return getBike(session, bikeid, username);
  }

  updateBike = async (
    session: any,
    username: string,
    id: number,
    name: string,
    year: string,
    brand: string,
    model: string,
    line: string,
    odometerMeters: number,
    type: string,
    groupsetBrand: string,
    groupsetSpeed: number,
    isElectronic: boolean,
    isRetired: boolean,
    bikeDefinitionId: number = 0): Promise<string> => {

    try {
      const body = {
        username: username,
        id: id,
        name: name,
        year: year,
        brand: brand,
        model: model,
        line: line,
        odometerMeters: odometerMeters,
        type: type,
        groupsetBrand: groupsetBrand,
        groupsetSpeed: groupsetSpeed,
        isElectronic: isElectronic,
        isRetired: isRetired,
        bikeDefinitionId: bikeDefinitionId,
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

      const response = await post('/bike/delete-bike', body, session.jwt_token);
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

  updateBikePhoto = async (session: any, bikeid: number, file: File): Promise<string>  => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bikeid', bikeid.toString());

      const response = await postForm('/bike/upload-bike-photo', formData, session.jwt_token);
      if (response.ok) {
        return '';
      }
      const result = await response.json();
      return result.message;
    } catch(e: any) {
      console.log(e.message);
      return 'Unable to update photo';
    }
  };
}

export default BikeController;
