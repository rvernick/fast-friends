import { Platform } from "react-native";
import AppContext from "../config/app-context";
import AppController from "../config/AppController";
import { authorize } from 'react-native-app-auth';
import { post, postExternal } from "../common/http_utils";
import { doTokenExchange, stravaBase } from "../strava/utils";

class StravaController extends AppController {
  constructor(appContext: AppContext) {
    super(appContext);
  }

  async updateStravaCode(appContext, stravaCode: string) {
    this.saveStravaCode(appContext, stravaCode);
    console.log('calling doTokenExchange');
    doTokenExchange(appContext, stravaCode)
      .then((resultString) => {
        this.syncStravaInfo(appContext, stravaCode)
        appContext.invalidateUser()});
    ;
  }


  async syncStravaInfo(appContext, stravaCode: string) {
    console.log('syncStravaInfo');
    const username = await appContext.getEmailPromise();
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
      const response = await post('/user/sync-strava', body, this.appContext.getJwtTokenPromise());
      if (response.ok) {
        console.log('sync response:'+ JSON.stringify(response));
        return '';
      }
    } catch(e: any) {
      console.log(e.message);
      return e.message;
    }
  }

  async saveStravaCode(appContext, stravaCode: string) {
    console.log('saveStravaCode:'+ stravaCode);
    appContext.put('stravaCode ', stravaCode);
    const username = await appContext.getEmailPromise();
    try {
      const body = {
        username: username,
        stravaCode: stravaCode,
      };

      const response = await post('/auth/update-strava', body, this.appContext.getJwtTokenPromise());
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

  async callUpdateAccount(username: string,
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

      const response = await post('/auth/update-user', body, this.appContext.getJwtTokenPromise());
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

  async linkToStrava(user, appContext) {
    console.log('Sending account to Strava for linking... ' + JSON.stringify(user));

    if (Platform.OS === 'web') {
      console.log('Platform.OS:'+ Platform.OS);
      this.linkToStravaWeb(user, appContext);
    } else {
      this.linkToStravaMobile(user, appContext);
    }
  }

  /**
   * ,
      redirect_uri: redirectUri
  https://www.strava.com/oauth/authorize?clientId=CLIENT_ID&responseType=code&approval_prompt=force&scope=read&redirectUri=http%3A%2F%2Flocalhost%3A190
   * @param user
   * @param appContext
   */
  async linkToStravaWeb(user, appContext) {
    const redirectUri = 'http://localhost:19000' + '/strava-reply';
    const clientId = await appContext.getStravaClientId();
    console.log('redirect ' + redirectUri);
    console.log('base: ' + appContext.baseUrl());
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
  async linkToStravaMobile(user, appContext) {
    const stravaId = await appContext.getStravaClientId();
    console.log('Sending account to Strava for linking... ' + user);
    console.log(user.email);
    const config = {
      clientId: await appContext.getStravaClientId(),
      clientSecret: await appContext.getStravaClientSecret(),
      redirectUrl: 'http://localhost:19000/strava-reply',
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