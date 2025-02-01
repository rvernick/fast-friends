import { Linking } from "react-native";
import AppContext from "../../common/app-context";
import AppController from "../../common/AppController";
import { authorize } from 'react-native-app-auth';
import { getBaseUrl, getInternal, post, postExternal } from "../../common/http-utils";
import { stravaBase } from "../strava/utils";
import { isMobile } from "@/common/utils";
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';

class StravaController extends AppController {

  async updateStravaCode(session: any, appContext: AppContext, stravaCode: string, verifyCode: string): Promise<any> {
    this.saveStravaCode(session, appContext, stravaCode, verifyCode);
    console.log('calling doTokenExchange: ' + stravaCode + ','+ verifyCode);
    return this.doTokenExchange(session, appContext, stravaCode, verifyCode)
      .then((result: any) => {
        this.syncStravaInfo(session, result, stravaCode, verifyCode)
        appContext.invalidateUser(session)
        return result;
      });
  }

  //https://www.strava.com/oauth/token
  //appContext.put('stravaToken', result.access_token);
  // appContext.put('stravaRefreshToken', result.refresh_token);
  // appContext.put('stravaExpiresAt', result.expires_at);
  // appContext.put('stravaTokenType', result.token_type);
  // appContext.put('stravaAthlete', '' + result.athlete.id);
//"refresh_token":"xxxxxx",
// "access_token":"xxxxx",
// "athlete":

  async syncStravaInfo(session: any, info: any, stravaCode: string, verifyCode: string): Promise<any> {
    console.log('syncStravaInfo');
    const username = (session && session.email) ? session.email : '';
    console.log('sync username:'+ username);
    try {
      const body = {
        username: username,
        verifyCode: verifyCode,
        stravaCode: stravaCode,
        stravaToken: info.access_token,
        stravaTokenType: info.token_type,
        stravaAthlete: info.athlete.id.toString(),
        stravaRefreshToken: info.refresh_token,
        stravaExpiresAt: '', // info.expires_at,
      }
      console.log('sync body:'+ JSON.stringify(body));
      const response = await post('/user/v1/sync-strava', body, session.jwt_token);
      if (response.ok) {
        console.log('sync response:'+ JSON.stringify(response));
        return '';
      }
    } catch(e: any) {
      console.log(e.message);
      return e.message;
    }
  }

  async saveStravaCode(session: any, appContext: AppContext, stravaCode: string, verifyCode: string) {
    console.log('saveStravaCode:'+ stravaCode);
    appContext.put('stravaCode ', stravaCode);
    const username = session.email;
    try {
      const body = {
        stravaCode: stravaCode,
        verifyCode: verifyCode,
      };

      const response = await post('/user/v1/update-strava', body, session.jwt_token);
      if (response.ok) {
        return '';
      }
      const result = await response.json();
      console.log('json'+ result.message);
      return result.message;
    } catch(e: any) {
      console.log(e.message);
      return 'Unable to Update Account';
    };
  };

  async callUpdateAccount(
    session: any,
    username: string,
    firstName: string,
    lastName: string,
    cellPhone: string) {

    try {
      const body = {
        username: username,
        firstName: firstName,
        lastName: lastName,
        cellPhone: cellPhone,
      };

      const response = await post('/auth/update-user', body, session.jwt_token);
      if (response.ok) {
        return '';
      }
      const result = await response.json();
      console.log('json ' + result.message);
      return result.message;
    } catch(e: any) {
      console.log(e.message);
      return 'Unable to Update Account';
    }
  };

  async unlinkFromStrava(session: any, appContext: AppContext, user: any): Promise<string> {
    user.stravaToken = null;
    user.stravaId = null;
    appContext.remove('stravaId');
    appContext.remove('stravaAthlete');
    try {
      const body = {
        username: user.username,
      };

      const response = await post('/auth/unlink-from-strava', body, session.jwt_token);
      if (response.ok) {
        return '';
      }
      const result = await response.json();
      console.log('json ' + result.message);
      return result.message;
    } catch(e: any) {
      console.log(e.message);
      return 'Unable to Update Account';
    }

  }

  async getLocationBaseUrl(): Promise<string> {
    const initialUrl = await Linking.getInitialURL();
    if (initialUrl) {
      return getBaseUrl(initialUrl);
    }
    return 'https://www.pedal-assistant.com';
  }

    async linkToStrava(session: any) {
    console.log('Sending account to Strava for linking... ');

    if (isMobile()) {
      this.linkToStravaMobile(session);
    } else {
      this.linkToStravaWeb(session);
    }
  }

  /**
   * ,
      redirect_uri: redirectUri
  https://www.strava.com/oauth/authorize?clientId=CLIENT_ID&responseType=code&approval_prompt=force&scope=read&redirectUri=http%3A%2F%2Flocalhost%3A190
   * @param user
   * @param appContext
   */
  async linkToStravaWeb(session: any) {
    const url = await this.createStravaAuthUrl(session);
    window.open(url);
  }

  async createStravaAuthUrl(session: any): Promise<string> {
    const replyUrl = await this.getLocationBaseUrl();
    const stravaVerifyCode = await this.getStravaVerifyCode(session);
    const redirectUri = replyUrl + '/strava-reply/' + stravaVerifyCode;
    const clientId = await this.appContext.getStravaClientId(session, '');
    console.log('redirect ' + redirectUri);

    const paramsObj = {
      client_id:  clientId ,
      response_type: 'code',
      approval_prompt: 'force',
      scope: 'read_all,profile:read_all,activity:read' };
    const searchParams = new URLSearchParams(paramsObj);

    const url = 'https://www.strava.com/oauth/authorize?'
      + searchParams.toString()
      + '&redirect_uri=' + redirectUri;
    console.log('url:'+ url);
    return url;
  };

  async getStravaVerifyCode(session: any): Promise<string> {
    try {
      const parameters = {
        username: session.email,
      };
      return await getInternal('/user/strava-verify-code', parameters, session.jwt_token) as Promise<string>;
    } catch(e: any) {
      console.log(e.message);
      return '';
    }
  }

  async linkToStravaMobileExpo(session: any, appContext: AppContext, code: string) {
    WebBrowser.maybeCompleteAuthSession();

    // Endpoint
    const discovery = {
      authorizationEndpoint: 'https://www.strava.com/oauth/mobile/authorize',
      tokenEndpoint: 'https://www.strava.com/oauth/token',
      revocationEndpoint: 'https://www.strava.com/oauth/deauthorize',
    };

    const [request, response, promptAsync] = useAuthRequest(
      {
        clientId: 'CLIENT_ID',
        scopes: ['activity:read_all'],
        redirectUri: makeRedirectUri({
          // the "redirect" must match your "Authorization Callback Domain" in the Strava dev console.
          native: 'your.app://redirect',
        }),
      },
      discovery
    );

    if (response?.type === 'success') {
      const { code } = response.params;
    }
  };

  async linkToStravaMobile(session: any) {
    this.linkToStravaMobileThroughBrowser(session);
  }

  async linkToStravaMobileThroughBrowser(session: any) {
    const url = await this.createStravaAuthUrl(session);
    Linking.openURL(url);
  }

  /*
  * Connect to strava using: FormidableLabs SDK
  * https://github.com/FormidableLabs/react-native-app-auth/blob/main/docs/config-examples/strava.md
  */
  async linkToStravaMobileThroughAuthConfig(session: any) {
    const appContext = this.appContext;
    const redirectUri = 'https://pedal-assistant.com/strava-reply';
    const authEndpoint = 'https://www.strava.com/oauth/cellPhone/authorize';
    const clientId = await appContext.getStravaClientId(session, '');
    const clientSecret = await appContext.getStravaClientSecret(session, 'dummy');
    const tokenEndpoint = 'https://www.strava.com/oauth/token?client_id=' + clientId + '&client_secret=' + clientSecret;
    const config = {
      issuer: 'https://www.strava.com/oauth/mobile/authorize',
      clientId: clientId,
      clientSecret: clientSecret,
      redirectUrl: redirectUri,
      serviceConfiguration: {
        authorizationEndpoint: authEndpoint,
        tokenEndpoint: tokenEndpoint,
      },
      additionalParameters: {
        response_type: 'code',
        approval_prompt: 'force',
        grant_type: 'authorization_code',
      },
      scopes: ['read_all,profile:read_all,activity:read_all'],
    };

    console.log('linkToStravaMobile: ' + JSON.stringify(config));
    try {
      console.log('calling authorize');
      const authState = authorize(config);
      console.log('authorize promise');
      authState.then((authState) => {
        console.log('authState: ' + authState);
        console.log(authState);
        console.log(authState.authorizationCode);
        console.log(authState.accessToken);
        console.log(authState.refreshToken);
        console.log(authState.idToken);
        console.log(authState.accessTokenExpirationDate);
      }).catch((error) => {
        console.log('authState promise error: ' + error);
      });
    } catch (error) {
      console.log('authorize call error: ' + error);
    }
  }

  // https://developers.strava.com/docs/authentication/#tokenexchange
// {"token_type":"Bearer","expires_at":1714369868,"expires_in":21600,
// "refresh_token":"xxxxxx",
// "access_token":"xxxxx",
// "athlete":{"id":7128,"username":"rvernick","resource_state":2,
// "firstname":"Russell","lastname":"Vernick","bio":"","city":"San Francisco",
// "state":"CA","country":"United States","sex":"M","premium":true,
// "summit":true,"created_at":"2010-08-17T17:40:48Z",
// "updated_at":"2023-07-28T20:01:19Z","badge_type_id":1,"weight":74.8427,
// "profile_medium":"https://dgalywyr863hv.cloudfront.net/pictures/athletes/7128/352077/2/medium.jpg","profile":"https://dgalywyr863hv.cloudfront.net/pictures/athletes/7128/352077/2/large.jpg","friend":null,"follower":null}}
  async doTokenExchange(session: any, appContext: AppContext, stravaCode: string, verifyCode: string): Promise<any> {
    console.log('doTokenExchange: ' + stravaCode +'-'+ verifyCode);
    const clientId = await appContext.getStravaClientId(session, verifyCode);
    const clientSecret = await appContext.getStravaClientSecret(session, verifyCode);
    const params = {
      client_id: clientId,
      client_secret: clientSecret,
      code: stravaCode,
      grant_type: 'authorization_code',
      f: 'json',
    };

    try {
      const response = await postExternal(stravaBase(), '/oauth/token', params, null);
      if (response.ok) {
        const result = await response.json();
        console.log('token exchange result: ' + JSON.stringify(result));
        appContext.put('stravaToken', result.access_token);
        appContext.put('stravaRefreshToken', result.refresh_token);
        appContext.put('stravaExpiresAt', result.expires_at);
        appContext.put('stravaTokenType', result.token_type);
        appContext.put('stravaAthlete', '' + result.athlete.id);
        return result;
      } else {
        return response.statusText;
      }
    } catch(e: any) {
      console.log(e.message);
      return e.message;
    }
  };
};

export default StravaController;