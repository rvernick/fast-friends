import { QueryClient } from "@tanstack/react-query";
import { baseUrl } from "../common/http_utils";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchUser, fetchSecrets } from "../common/utils";

class AppContext {
  private queryClient: QueryClient;
  private hotStringCache = new Map<string, string>();
  private _jwtToken;
  private _email;
  private _syncingJwtToken = true;
  private _syncingEmail = true;

  constructor() {
    this.syncEmail();
    this.syncJwtToken();
  };

  public put(key: string, value: string) {
    if (value == null) {
      this.hotStringCache.delete(key);
      return;
    }
    this.hotStringCache.set(key, value);
    AsyncStorage.setItem(key,value);
  }

  public get(key: string) {
    this.syncCache();
    return this.hotStringCache.get(key);
  }

  private syncCache() {
    AsyncStorage.getAllKeys()
      .then((keys) => {
        keys.forEach((key) => {
          AsyncStorage.getItem(key)
            .then((value) => {
               this.hotStringCache.set(key, value);
             })
            .catch((error) => {
               console.log(error);
             });
          })
        for (let key of this.hotStringCache.keys()) {
          if (!keys.includes(key)) {
            this.hotStringCache.delete(key);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  public setQueryClient(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }
  public getQueryClient(): QueryClient {
    return this.queryClient;
  }

  public getUser(): User {
    if (this.getUserFromCache() == null) {
      this.updateUser();
      return {username: this.getEmail(), firstName: '', lastName: '', mobile: '', stravaId: ''};
    }
    return this.getUserFromCache();
  }

  private getUserFromCache(): User | null {
    return this.queryClient.getQueryData(['user', this.getEmail()]);
  }

  public updateUser() {
    console.log('context updating user: ' + this.getEmail());
    if (this.getEmail() == null || this.getEmail() == '') {
      return;
    }

    this.getQueryClient().prefetchQuery(
      ['user', this.getEmail()],
      () => fetchUser(this.getEmail(), this)
    )
    this.updateSecrets();
  }

  public updateSecrets() {
    this.getQueryClient().prefetchQuery(
      ['secrets', this.getEmail()],
      () => fetchSecrets(this)
    )
  }

  private getSecrets() {
    return this.queryClient.getQueryData(['secrets', this.getEmail()]);
  }

  public getStravaClientId(): string {
    return this.getSecrets()['stravaClientId'];
  }

  public getStravaClientSecret(): string {
    return this.getSecrets()['stravaSecret'];
  }

  public getEmail(): string {
    this.syncEmail();
    return this._email;
  }

  public setEmail(anEmail: string) {
    this._email = anEmail;
    AsyncStorage.setItem('email',anEmail);
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
    const fiveSecondsInMilliseconds = 5*1000;
    const oneMinutesInMilliseconds = 1*60*1000;
    // const expirationDate = new Date(now.getTime() + oneMinutesInMilliseconds);
    // const expirationDate = new Date(now.getTime() + fiveSecondsInMilliseconds);
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