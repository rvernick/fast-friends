import AppController from "../config/AppController";
import { GlobalStateContext } from "../config/GlobalContext";
import AppContext from "../config/app-context";
import { post } from "../common/http_utils";

class ResetPasswordController extends AppController {
  constructor(context: AppContext, navigator: Navigator) {
    super(context);
  }

  async resetPassword(username: string) {
    const args = JSON.stringify({username: username,});
    const response = post('auth/reset', args);
    response
      .then(resp => {
        if (resp.ok) {
          console.log('Reset password for: ' + username);
        } else {
          console.log('Failed to reset ' + username);
        }
      })
      .catch(error => {console.log('Failed to reset ' + error.message)});
  };
}

export default ResetPasswordController;