import { baseUrl } from "../common/http_utils";
import AsyncStorage from '@react-native-async-storage/async-storage';

class AppContext {
  private _userEmail;
  private settingJwtToken = false;
  private _loggedInWatcher;
  constructor() {
  };

  public get email(): string {
    return this._userEmail;
  }

  public set email(anEmail: string) {
    this._userEmail = anEmail;
  }

  public set loggedInWatcher(watcher: Function) {
    this._loggedInWatcher = watcher;
  }

  public getJwtToken(): string {
    const jwtToken = this.getJwtFromStorage();
    this.checkJwtExpiration();
    return jwtToken;
  }

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

  private getJwtFromStorage(): string {
    AsyncStorage.getItem('jwtToken')
      .then((value) => {
        if (value!= null) {
          this.settingJwtToken = false;
        }
        return value;
      })
      .catch((error) => {
        console.log('error in jwt access: ' + error.message);
        return null;
      });
    return null;
  }

  public set jwtToken(token: string) {
    if (token != null) {
      this.setJwtExpiration();
    } else {
      AsyncStorage.removeItem('jwtToken');
    }
    this.settingJwtToken = true;
    console.log('setting jwtToken to:'+ token.toString());
    AsyncStorage.setItem('jwtToken', token.toString());
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

  isLoggedIn() {
    return this.settingJwtToken || this.getJwtFromStorage() != null;
  }
};

export default AppContext;