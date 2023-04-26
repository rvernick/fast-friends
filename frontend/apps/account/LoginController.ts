import AppController from "../config/AppController";
import { GlobalStateContext } from "../config/GlobalContext"; 
import AppContext from "../config/app-context";

class LoginController extends AppController {
  
  constructor(context: AppContext) {
    super(context);
  }

  async login(username: string, password: string) {
    const args = JSON.stringify({
      username: username,
      password: password,
    });
    const response = this.post('auth/login', args);
    response
      .then(resp => {
        if (resp.ok) {
          resp.json().then(body => this.appContext.jwtToken = body);
          this.appContext.email = username;
          console.log('Should be logged in: ' + this.appContext.isLoggedIn())  
        } else {
          console.log('Login failed ' + resp.statusText)  
        }
      })
      .catch(error => {console.log('Failed to log in ' + error.message)});
  };
}

export default LoginController;