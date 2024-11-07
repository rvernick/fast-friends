import AppContext from "../../common/app-context";
import AppController from "../../common/AppController";
import { strippedPhone } from "../../common/utils";
import { post } from "../../common/http-utils";

class SettingsController extends AppController {
  constructor(appContext: AppContext) {
    super(appContext);
  }

  public updateAccount(
      session: any,
      username: string,
      firstName: string,
      lastName: string,
      cellPhone: string,
      units: string) {
    return this.callUpdateAccount(
      session,
      username,
      firstName,
      lastName,
      strippedPhone(cellPhone),
      units);
  }

  async callUpdateAccount(
    session: any,
    username: string,
    firstName: string,
    lastName: string,
    cellPhone: string,
    units: string) {

    try {
      const body = {
        username: username,
        firstName: firstName,
        lastName: lastName,
        cellPhone: cellPhone,
        units: units,
      };

      const response = await post('/auth/update-user', body, session.jwt_token);
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
  }

  async deleteAccount(session: any, username: string) {
    try {
      const body = {
        username: username,
      };

      const response = await post('/auth/delete-user', body, session.jwt_token);
      if (response.ok) {
        return '';
      }
      const result = await response.json();
      console.log('json'+ result.message);
      return result.message;
    } catch(e: any) {
      console.log(e.message);
      return 'Unable to Delete Account';
    }
  }

};

export default SettingsController;