import AppContext from "@/common/app-context";
import AppController from "@/common/AppController";
import { post } from "@/common/http-utils";

class ChangePasswordController extends AppController {
  constructor(appContext: AppContext) {
    super(appContext);
  }

  public changePassword(oldPassword: string, newPassword: string) {
    const username = this.getEmail();

    this.verifyPassword(newPassword);
    return this.callChangePassword(username, oldPassword, newPassword);
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
      const body = {
        username: username,
        oldPassword: oldPassword,
        newPassword: newPassword,
      };

      const response = await post('/auth/changePassword', body, this.getJwtTokenPromise());
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