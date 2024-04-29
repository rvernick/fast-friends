import { baseUrl } from "../common/http_utils";
import AsyncStorage from '@react-native-async-storage/async-storage';

class AppContext {
  private _jwtToken;
  private _jwtExpiration;
  private _email;
  private _loggedInWatcher;
  private _syncingJwtToken = true;
  private _syncingEmail = true;

  constructor() {
    this.syncEmail();
    this.syncJwtToken();
  };

  public getEmail(): string {
    this.syncEmail();
    return this._email;
  }

  public setEmail(anEmail: string) {
    this._email = anEmail;
    AsyncStorage.setItem('email',anEmail);
  }

  public set loggedInWatcher(watcher: Function) {
    this._loggedInWatcher = watcher;
  }

  public getJwtToken() {
    this.syncJwtToken();
    this.checkJwtExpiration();
    return this._jwtToken;
  }

  public async getJwtTokenPromise(): Promise<any> {
    const result = await AsyncStorage.getItem('jwtToken');
    return JSON.parse(result);
  }

  private syncJwtToken() {
    AsyncStorage.getItem('jwtToken')
      .then((value) => {
        console.log('syncing jwtToken:'+ value);
        this._jwtToken = JSON.parse(value);
      })
      .catch((error) => {
        console.log('error getting jwtToken from storage:'+ error);
      });
  };
  private syncEmail() {
    AsyncStorage.getItem('email')
      .then((value) => {
        console.log('syncing email:'+ value);
        this._email = value;
      })
      .catch((error) => {
        console.log('error getting email from storage:'+ error);
      });
  };

  private syncJwtExpiration() {
    AsyncStorage.getItem('jwtExpiration')
      .then((value) => {
        this._jwtExpiration = value;
      })
      .catch((error) => {
        console.log('error getting jwtExpiration from storage:'+ error);
      });
  };

  private async checkJwtExpiration() {
    AsyncStorage.getItem('jwtExpiration')
     .then((value) => {
      if (value == null) { return; }
      const expirationDate = new Date(value);
      const now = new Date();
      console.log('expirationDate: ' + expirationDate.toString());
      console.log('now: ' + now.toString());
      if (now > expirationDate) {
        AsyncStorage.removeItem('jwtToken');
        AsyncStorage.removeItem('jwtExpiration');
      }
    })
  }

  private async getFromStorage(key: string) {
    let result = null;
    return await AsyncStorage.getItem(key)
  }


  public set jwtToken(token: string) {
    if (token != null) {
      this.setJwtExpiration();
    } else {
      AsyncStorage.removeItem('jwtToken');
    }
    console.log('setting jwtToken to:'+ token.toString());
    AsyncStorage.setItem('jwtToken', JSON.stringify(token));
    this._jwtToken = token;
  }

  setJwtExpiration() {
    const now = new Date();
    const fiveHoursInMilliseconds = 5*60*60*1000;
    const expirationDate = new Date(now.getTime() + fiveHoursInMilliseconds);
    console.log('setting expiration: ' + expirationDate.toString());
    AsyncStorage.setItem('jwtExpiration', expirationDate.toString());
  }

  baseUrl() {
    return baseUrl();
  }

  async waitIsLoggedIn(): Promise<boolean> {
    const email = await this.getFromStorage('email');
    const jwtToken = await this.getFromStorage('jwtToken');
    console.log('checking is logged in email: ' + email + 'jwtToken: ' + jwtToken);
    return email != null && email.length > 0 && jwtToken != null;
  }

  isLoggedIn() {
    console.log('checking is logged email: ' + this.getEmail());
    console.log('checking is logged setting: ' + this._jwtToken);
    const result = this.getEmail() != null && this.getEmail().length > 0
      && this._jwtToken != null;
    console.log('checking is logged in: ' + result);
    return result;
  }
};

export default AppContext;