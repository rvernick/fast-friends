import AppContext from "../config/app-context";
import AppController from "../config/AppController";
import { isValidPassword, invalidPasswordMessage, isValidEmail } from "../common/utils";
import { post } from '../common/http_utils';

class NewPasswordOnResetController extends AppController {
  private token: string;

  constructor(appContext: AppContext, token: string) {
    super(appContext);
    this.token = token;
  }

  headingText() {
    return 'Reset Password';
  }

  buttonText() {
    return 'Reset Password';
  }

  apply(email, password) {
    return this.callResetPassword(email, this.token, password);
  }

  async callResetPassword(username: string, token: string, password: string) {
    try {
      const body = {
        username: username,
        token: token,
        password: password,
      };

      const response = await post('/auth/reset-password', body, null);
      if (response.ok) {
        return '';
      }
      const result = await response.json();
      console.log('json ' + result.message);
      return result.message;
    } catch(e: any) {
      console.log(e.message);
      return 'Unable to Reset Password';
    }
  }
};

export default NewPasswordOnResetController;