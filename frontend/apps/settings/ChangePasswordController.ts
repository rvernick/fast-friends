import AppContext from "../config/app-context";
import AppController from "../config/AppController";
import { post } from "../common/http_utils";

class ChangePasswordController extends AppController {
  constructor(appContext: AppContext) {
    super(appContext);
  }

  public changePassword(oldPassword: string, newPassword: string) {
    const username = this._appContext.email;
    this.verifyEmail(username);
    this.verifyPassword(newPassword);
    return this.callChangePassword(username, oldPassword, newPassword);
  }

  verifyEmail(email: string) {
    if (!email.includes('@') || !email.includes('.')) {
      return 'Please enter valid email';
    }
    return '';
  }

  verifyPassword(password: string) {
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    return '';
  }

  verifyPasswords(password: string, confirmPassword: string) {
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    return '';
  }

  async callChangePassword(username: string, oldPassword: string, newPassword: string) {
    try {
      const body = JSON.stringify({
        username: username,
        oldPassword: oldPassword,
        newPassword: newPassword,
      });

      const response = await post('auth/changePassword', body);
      if (response.ok) {
        return '';
      }
      const result = await response.json();
      console.log('json ' + result.message);
      return result.message;
    } catch(e: any) {
      console.log(e.message);
      return 'Unable to change password';
    }
  }
};

export default ChangePasswordController;