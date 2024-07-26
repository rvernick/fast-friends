import { QueryClient } from "@tanstack/react-query";
import { baseUrl } from "./http-utils";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchUser, fetchSecrets } from "../common/utils";

class AppContext {
  private queryClient: QueryClient;
  private hotStringCache = new Map<string, string>();
  private _jwtToken: string | null;
  private _jwtTokenExpiration: Date | null;
  private _email: string | null;
  private _syncingJwtToken = true;
  private _syncingEmail = true;

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
    this._jwtToken = null;
    this._jwtTokenExpiration = null;
    this._email = null;
    this.ensureUpToDate();
  };

  public ensureUpToDate() {
    try {
      this.syncEmail();
      this.syncJwtToken();
      this.syncCache();
    } catch (error) {
      console.error(error);
    }
  }

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
               if (value!= null) {
                 this.hotStringCache.set(key, value);
               }
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

  public getUser(): User | null {
    if (this.getUserFromCache() == null) {
      this.updateUser();
      const email = this.getEmail();
      return {username: email == null ? '' : email, firstName: '', lastName: '', mobile: '', stravaId: ''};
    }
    return this.getUserFromCache() as User;
  }

  private getUserFromCache() {
    const email = this.getEmail();
    console.log('getting user from cache: ' + email);
    const result = this.queryClient.getQueryData(['user', email]);
    
    return result;
  }

  public invalidateUser() {
    this.queryClient.invalidateQueries({queryKey: ['user', this.getEmail()]});
  }

  private callFetchUser(): Promise<User | null> {
    const email = this.getEmail();
    console.log('fetching user: ' + email);
    if (email == null || email == '') {
      return Promise.resolve(null);
    }
    return fetchUser(email, this);
  }

  async getUserPromise(): Promise<User | null> {
    const email = this.getEmail();
    if (email == null || email == '') {
     return Promise.resolve(null);
    }
    return this.queryClient.fetchQuery({
      queryKey: ['user', this.getEmail()],
      queryFn: () => fetchUser(email, this)
    });
  }

  public updateUser() {
    console.log('context updating user: ' + this.getEmail());
    const email = this.getEmail();
    if (email == null || email == '') {
      return;
    }

    this.getQueryClient().prefetchQuery({
      queryKey: ['user', email],
      queryFn: () => fetchUser(email, this)
    });
  }

  public async getSecrets(): Promise<any> {
    const isLoggedIn = await this.isLoggedInPromise();
    if (!isLoggedIn) { return; }
    const email = this.getEmail();
    console.log('context updating secrets: ' + email);
    return this.getQueryClient().fetchQuery({
      queryKey: ['secrets', email],
      queryFn: () => fetchSecrets(this)
    });
  }

  public async getStravaClientId(): Promise<string> {
    const secrets = await this.getSecrets();
    console.log('secrets:'+ JSON.stringify(secrets));
    return secrets['stravaClientId'];
  }

  public async getStravaClientSecret(): Promise<string> {
    const secrets = await this.getSecrets();
    return secrets['stravaSecret'];
  }

  public getEmail(): string | null {
    this.syncEmail();
    return this._email;
  }

  public getEmailPromise(): Promise<any> {
    return AsyncStorage.getItem('email');
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
    if (result!= null) {
      return JSON.parse(result);
    }
    return null;
  }

  private async syncJwtToken() {
    const token = await AsyncStorage.getItem('jwtToken');
    const expiration = await AsyncStorage.getItem('jwtExpiration');
    if (token != null) {
      this._jwtToken = JSON.parse(token);
    }
    if (expiration != null) {
      this._jwtTokenExpiration = new Date(expiration);
    }
  };

  private syncEmail() {
    AsyncStorage.getItem('email')
      .then((value) => {
        console.log('syncing email:'+ value);
        if (value == null) { return; }
        this._email = value;
      })
      .catch((error) => {
        console.log('error getting email from storage:'+ error);
      });
  };

  public hasLoginExpired() {
    return this._jwtTokenExpiration != null && this._jwtTokenExpiration < new Date();
  }

  public clearJwtToken() {
    AsyncStorage.removeItem('jwtToken');
    this._jwtToken = null;
  }

  public clearJwtExpiration() {
    AsyncStorage.removeItem('jwtExpiration');
    this._jwtTokenExpiration = null;
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
        this.clearJwtToken();
        this.clearJwtExpiration();
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
    const twoMinutesInMilliseconds = 2*60*1000;
    const expirationDate = new Date(now.getTime() + twoMinutesInMilliseconds);
    // const expirationDate = new Date(now.getTime() + fiveSecondsInMilliseconds);
//    const expirationDate = new Date(now.getTime() + fiveHoursInMilliseconds);
    console.log('setting expiration: ' + expirationDate.toString());
    this._jwtTokenExpiration = expirationDate;
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

  async isLoggedInPromise(): Promise<boolean> {
    const jwtToken = await this.getJwtTokenPromise();
    const email = await this.getFromStorage('email');
    const expiration = await this.getFromStorage('jwtExpiration');

    return Promise.resolve(email != null
      && email.length > 0
      && jwtToken != null 
      && expiration != null 
      && new Date(expiration) > new Date());
  }

  isLoggedIn() {
    const email = this.getEmail();
    console.log('checking is logged email: ' + this.getEmail());
    console.log('checking is logged setting: ' + this._jwtToken);
    const result = email != null && email.length > 0
      && this._jwtToken != null;
    console.log('checking is logged in: ' + result);
    return result;
  }
};

export default AppContext;