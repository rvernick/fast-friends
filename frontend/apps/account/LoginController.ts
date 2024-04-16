import AppController from "../config/AppController";
import { GlobalStateContext } from "../config/GlobalContext";
import AppContext from "../config/app-context";
import { login } from "../common/utils";

class LoginController extends AppController {

  constructor(context: AppContext) {
    super(context);
  }
}

// test@test.com	h@ppyHappy
export default LoginController;