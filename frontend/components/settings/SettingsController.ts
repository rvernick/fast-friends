import AppContext from "../../common/app-context";
import AppController from "../../common/AppController";
import { fetchUser, strippedPhone } from "../../common/utils";
import { post } from "../../common/http-utils";

class SettingsController extends AppController {
  constructor(appContext: AppContext) {
    super(appContext);
  }

  public updateAccount(session: any, username: string, firstName: string, lastName: string, cellPhone: string) {
    return this.callUpdateAccount(
      session,
      username,
      firstName,
      lastName,
      strippedPhone(cellPhone));
  }

  async callUpdateAccount(
    session: any,
    username: string,
    firstName: string,
    lastName: string,
    cellPhone: string) {

    try {
      const body = {
        username: username,
        firstName: firstName,
        lastName: lastName,
        cellPhone: cellPhone,
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

};


export default SettingsController;