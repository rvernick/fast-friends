import AppContext from "../config/app-context";
import AppController from "../config/AppController";
import { isValidPassword, invalidPasswordMessage, isValidEmail } from "../common/utils";
import { post } from '../common/http_utils';

class CreateAccountController extends AppController {
  constructor(appContext: AppContext) {
    super(appContext);
  }

  public updatePassword(token: string, password: string) {
    this.verifyPassword(password);
    return this.callUpdatePassword(token, password);
  }

  verifyPassword(password: string) {
    if (!isValidPassword(password)) {
      return invalidPasswordMessage;
    }
    return '';
  }

  verifyPasswords(password: string, confirmPassword: string) {
    if (password!== confirmPassword || !isValidPassword(password)) {
      return invalidPasswordMessage;
    }
    return '';
  }

  async callUpdatePassword(token: string, password: string) {
    try {
      const body = {
        token: token,
        password: password,
      };

      const response = await post('/auth/update-password', body, null);
      if (response.ok) {
        return '';
      }
      const result = await response.json();
      console.log('json ' + result.message);
      return result.message;
    } catch(e: any) {
      console.log(e.message);
      return 'Unable to Create Account';
    }
  }
};

export default CreateAccountController;