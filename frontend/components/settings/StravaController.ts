import { Linking, Platform } from "react-native";
import AppContext from "../../common/app-context";
import AppController from "../../common/AppController";
import { authorize } from 'react-native-app-auth';
import { getBaseUrl, post, postExternal } from "../../common/http-utils";
import { doTokenExchange, stravaBase } from "../strava/utils";

class StravaController extends AppController {

  async updateStravaCode(session: any, appContext: AppContext, stravaCode: string) {
    this.saveStravaCode(session, appContext, stravaCode);
    console.log('calling doTokenExchange');
    doTokenExchange(session, appContext, stravaCode)
      .then((resultString: string) => {
        this.syncStravaInfo(session, appContext, stravaCode)
        appContext.invalidateUser()});
    ;
  }


  async syncStravaInfo(session: any, appContext: AppContext, stravaCode: string) {
    console.log('syncStravaInfo');
    const username = session.email;
    console.log('sync username:'+ username);
    try {
      const body = {
        username: username,
        stravaCode: stravaCode,
        stravaToken: appContext.get('stravaToken'),
        stravaTokenType: appContext.get('stravaTokenType'),
        stravaAthlete: appContext.get('stravaAthlete'),
      }
      console.log('sync body:'+ JSON.stringify(body));
      const response = await post('/user/sync-strava', body, session.jwt_token);
      if (response.ok) {
        console.log('sync response:'+ JSON.stringify(response));
        return '';
      }
    } catch(e: any) {
      console.log(e.message);
      return e.message;
    }
  }

  async saveStravaCode(session: any, appContext: AppContext, stravaCode: string) {
    console.log('saveStravaCode:'+ stravaCode);
    appContext.put('stravaCode ', stravaCode);
    const username = appContext.getEmail();
    try {
      const body = {
        username: username,
        stravaCode: stravaCode,
      };

      const response = await post('/auth/update-strava', body, session.jwt_token);
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
    mobile: string) {

    try {
      const body = {
        username: username,
        firstName: firstName,
        lastName: lastName,
        mobile: mobile,
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

  async linkToStrava(session: any, user: any) {
    console.log('Sending account to Strava for linking... ' + JSON.stringify(user));

    if (Platform.OS === 'web') {
      console.log('Platform.OS:'+ Platform.OS);
      this.linkToStravaWeb(session, user);
    } else {
      this.linkToStravaMobile(session, user);
    }
  }

  async unlinkFromStrava(session: any, user: any) {
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
    return '';
  }
  /**
   * ,
      redirect_uri: redirectUri
  https://www.strava.com/oauth/authorize?clientId=CLIENT_ID&responseType=code&approval_prompt=force&scope=read&redirectUri=http%3A%2F%2Flocalhost%3A190
   * @param user
   * @param appContext
   */
  async linkToStravaWeb(session: any, user: any) {
    const replyUrl = await this.getLocationBaseUrl();
    const redirectUri = replyUrl + '/strava-reply';
    const clientId = await this.appContext.getStravaClientId(session);
    console.log('redirect ' + redirectUri);
    console.log('base: ' + this.appContext.baseUrl());
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
    window.location.href = url;
    // window.open(url, '_blank', 'location=no');
    // const result = fetch(url, {
    //   method: 'GET',
    //   mode: 'no-cors',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   }
    // });
    // result
    //   .then((res) =>
    //     console.log(res.json()))
    //   .catch((err) => console.log(err));
  }

  /*
  * Connect to strava using: FormidableLabs SDK
  * https://github.com/FormidableLabs/react-native-app-auth/blob/main/docs/config-examples/strava.md
  */
  async linkToStravaMobile(session: any, user: any) {
    const appContext = this.appContext;
    const stravaId = await appContext.getStravaClientId(session);
    console.log('Sending account to Strava for linking... ' + user);
    console.log(user.email);
    const replyUrl = await this.getLocationBaseUrl();
    const redirectUri = replyUrl + '/strava-reply';
    const config = {
      clientId: await appContext.getStravaClientId(session),
      clientSecret: await appContext.getStravaClientSecret(session),
      redirectUrl: redirectUri,
      serviceConfiguration: {
        authorizationEndpoint: 'https://www.strava.com/oauth/mobile/authorize',
        tokenEndpoint:
          'https://www.strava.com/oauth/token?client_id=CLIENT_ID&client_secret=CLIENT_SECRET',
      },
      scopes: ['read_all,profile:read_all,activity:read_all'],
    };

    try {
      const authState = authorize(config);
      authState.then((authState) => {
        console.log('authState: ' + authState);
        console.log(authState);
        console.log(authState.authorizationCode);
        console.log(authState.accessToken);
        console.log(authState.refreshToken);
        console.log(authState.idToken);
        console.log(authState.accessTokenExpirationDate);
      }).catch((error) => {
        console.log(error);
      });
    } catch (error) {
      console.log(error);
    }
  }
};

export default StravaController;