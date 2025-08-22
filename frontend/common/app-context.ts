import { QueryClient } from "@tanstack/react-query";
import { baseUrl } from "./http-utils";
import AsyncStorage  from '@react-native-async-storage/async-storage';
import { fetchUser, fetchSecrets, fetchSecretsByVerify } from "../common/utils";

class AppContext {
  private queryClient: QueryClient;
  private hotStringCache = new Map<string, string>();
  private _session: any;
  private _jwtTokenExpiration: Date | null;
  private testing: boolean = true;

  constructor(queryClient: QueryClient, session: any) {
    this.queryClient = queryClient;
    this._session = session;
    this._jwtTokenExpiration = null;
    this.ensureUpToDate();
  };

  public signIn(jwtToken: any, username: string) {
    this._session.signIn(jwtToken, username);
  }

  public getSession(): any {
    return this._session;
  }

  public setSession(session: any) {
    this._session = session;
  }

  public ensureUpToDate() {
    if (this._session == null || this.testing) {
      return;
    }
    try {
      // this.syncEmail();
      // this.syncJwtToken();
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

  public remove(key: string) {
    this.hotStringCache.delete(key);
    AsyncStorage.removeItem(key);
  }

// TODO: Should move this to use similar logic to ctx.tsx
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

  public invalidateUser(session: any) {
    console.log('context invalidating user ' + session.email);
    this.queryClient.removeQueries({queryKey: ['user']});
  }

  public async getSecrets(session: any): Promise<any> {
    this.setSession(session);
    if (!session.jwt_token) { return; }
    const email = session.email;
    console.log('context updating secrets: ' + email);
    return this.getQueryClient().fetchQuery({
      queryKey: ['secrets'],
      queryFn: () => fetchSecrets(session)
    });
  }

  public async getSecret(session: any, verifyCode: string, secretKey: string, target: string): Promise<string> {
    if (session.jwt_token != null) {
      this.setSession(session);
      const secrets = await this.getSecrets(session);
      return secrets[secretKey];
    }
    const secrets = await fetchSecretsByVerify(verifyCode, target);
    return secrets[secretKey];
  }

  public async getStravaClientId(session: any, verifyCode: string): Promise<string> {
    return this.getSecret(session, verifyCode, 'stravaClientId', 'strava');
  }
  public async getStravaClientSecret(session: any, verifyCode: string): Promise<string> {
    return this.getSecret(session, verifyCode, 'stravaSecret', 'strava');
  }

  public async getBikeIndexClientId(session: any, verifyCode: string): Promise<string> {
    return this.getSecret(session, verifyCode, 'bikeIndexClientId', 'bike-index');
  }
  public async getBikeIndexClientSecret(session: any, verifyCode: string): Promise<string> {
    return this.getSecret(session, verifyCode, 'bikeIndexSecret', 'bike-index');
  }

  public getEmail(): string | null {
    if (this._session == null) {
      return null;
    }
    return this._session.email;
  }

  public getJwtToken() {
    console.log('getJwtToken: ' + JSON.stringify(this._session));
    return this._session.jwt_token
  }

  public async getJwtTokenPromise(): Promise<any> {
    const result = await AsyncStorage.getItem('jwtToken');
    if (result!= null) {
      return JSON.parse(result);
    }
    return null;
  }

  public hasLoginExpired() {
    return this._jwtTokenExpiration != null && this._jwtTokenExpiration < new Date();
  }

  public clearJwtToken() {
    this._session.signOut();
  }

  public clearJwtExpiration() {
    AsyncStorage.removeItem('jwtExpiration');
    this._jwtTokenExpiration = null;
  }

  private async getFromStorage(key: string) {
    let result = null;
    return await AsyncStorage.getItem(key)
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

  isLoggedIn() {
    const email = this.getEmail();
    const token = this.getJwtToken();
    console.log('checking is logged email: ' + email);
    console.log('checking is logged setting: ' + token);
    const result = email != null && email.length > 0
      && token != null && token.length > 0;
    console.log('checking is logged in: ' + result);
    return result;
  }
};

export default AppContext;