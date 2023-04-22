import { GlobalStateContext } from "../../config/GlobalContext"; 
import AppContext from "../../config/app-context";

class LoginController {
  appContext: AppContext;
  baseUrl: string;
  
  constructor(context: AppContext) {
    this.appContext = context;
    this.baseUrl = context.baseUrl();
  }

  async login(username: string, password: string) {
    const url = this.baseUrl + 'auth/login';
    console.log('Calling: ' + url)
    const response = await fetch(this.baseUrl + 'auth/login', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
             body: JSON.stringify({
                username: username,
                password: password,
            })
        });
    if (!response.ok) {
      console.log('Error in calling: ' + url);
      throw response;
    }
    this.appContext.jwtToken = await response.json();
    console.log('Should be logged in: ' + this.appContext.isLoggedIn())
  };

}

export default LoginController;