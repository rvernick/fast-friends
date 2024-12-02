import AppContext from "@/common/app-context";
import AppController from "@/common/AppController";
import { post } from "@/common/http-utils";

class EmailVerifyController extends AppController {
  constructor(context: AppContext) {
    super(context);
  }

  async verifyEmail(token: string, session: any): Promise<boolean> {
    const args = {token: token};
    const response = post('/auth/verify-email-token', args, session.jwtToken);
    return response
      .then(resp => {
        if (resp.ok) {
          console.log('Verified email for: ' + session.username);
          return true;
        } else {
          console.log('Failed to verify email ' + session.username);
          return false;
        }
      })
      .catch(error => {
        console.log('Failed to reset ' + error.message);
        return false;
      });
  };
}

export default EmailVerifyController;
