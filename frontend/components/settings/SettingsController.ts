import AppContext from "../../common/app-context";
import AppController from "../../common/AppController";
import { fetchUser, strippedPhone } from "../../common/utils";
import { post } from "../../common/http-utils";

class SettingsController extends AppController {
  constructor(appContext: AppContext) {
    super(appContext);
  }

  public updateAccount(username: string, firstName: string, lastName: string, mobile: string) {
    return this.callUpdateAccount(
      username,
      firstName,
      lastName,
      strippedPhone(mobile));
  }

  async callUpdateAccount(username: string,
    firstName: string,
    lastName: string,
    mobile: string) {

    try {
      const body = {
        username: username,
        firstName: firstName,
        lastName: lastName,
        mobile: mobile,
      };

      const response = await post('/auth/update-user', body, this.appContext.getJwtTokenPromise());
      this.appContext.updateUser();
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