import { Platform } from "react-native";
import AppContext from "../config/app-context";
import AppController from "../config/AppController";
import { authorize } from 'react-native-app-auth';
import { post, postExternal } from "../common/http_utils";
import { stravaBase, stravaClientId, stravaClientSecret } from "../strava/utils";

class StravaController extends AppController {
  constructor(appContext: AppContext) {
    super(appContext);
  }

  async updateStravaCode(appContext, stravaCode: string) {
    this.saveStravaCode(appContext, stravaCode);
    this.doTokenExchange(appContext, stravaCode)
      .then((resultString) => {this.syncStravaInfo(appContext, stravaCode)});
  }


  // https://developers.strava.com/docs/authentication/#tokenexchange
  // {"token_type":"Bearer","expires_at":1714369868,"expires_in":21600,
  // "refresh_token":"8e9140f742b978ba7a361cc22b71adcc0d1b6a4e",
  // "access_token":"9b8593e15c0fffe1470a5e6f6b0014b1411273b8",
  // "athlete":{"id":7128,"username":"rvernick","resource_state":2,
  // "firstname":"Russell","lastname":"Vernick","bio":"","city":"San Francisco",
  // "state":"CA","country":"United States","sex":"M","premium":true,
  // "summit":true,"created_at":"2010-08-17T17:40:48Z",
  // "updated_at":"2023-07-28T20:01:19Z","badge_type_id":1,"weight":74.8427,
  // "profile_medium":"https://dgalywyr863hv.cloudfront.net/pictures/athletes/7128/352077/2/medium.jpg","profile":"https://dgalywyr863hv.cloudfront.net/pictures/athletes/7128/352077/2/large.jpg","friend":null,"follower":null}}
  async doTokenExchange(appContext, stravaCode: string) {
    const clientId = stravaClientId();
    const clientSecret = stravaClientSecret();
    const params = {
      client_id: clientId,
      client_secret: clientSecret,
      code: stravaCode,
      grant_type: 'authorization_code',
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
        appContext.put('stravaAthlete', result.athlete.id);
        return '';
      } else {
        return response.statusText;
      }
    } catch(e: any) {
      console.log(e.message);
      return e.message;
    }
  }

  async syncStravaInfo(appContext, stravaCode: string) {
    console.log('syncStravaInfo');
    const username = appContext.getEmail();
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
        return '';
      }
    } catch(e: any) {
      console.log(e.message);
      return e.message;
    }
  }

  async saveStravaCode(appContext, stravaCode: string) {
    appContext.put('stravaCode', stravaCode);
    const username = appContext.email;
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
    console.log('Sending account to Strava for linking... ' + user);
    console.log(user.email);

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
  https://www.strava.com/oauth/authorize?clientId=125563&responseType=code&approval_prompt=force&scope=read&redirectUri=http%3A%2F%2Flocalhost%3A190
   * @param user
   * @param appContext
   */
  async linkToStravaWeb(user, appContext) {
    const redirectUri = 'http://localhost:19000' + '/strava-reply';
    const clientId = stravaClientId();
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

  private stravaConstants() {
    const stravaId = stravaClientId();
    return {
      clientId: stravaId,
      clientSecret: '22bbcc919c35ee62b0a8882def9503b459a39341',
      redirectUrl: 'http://localhost:19000/strava-reply',
      serviceConfiguration: {
        authorizationEndpoint: 'https://www.strava.com/oauth/mobile/authorize',
        tokenEndpoint:
          'https://www.strava.com/oauth/token?client_id=125563&client_secret=22bbcc919c35ee62b0a8882def9503b459a39341',
      },
      scopes: ['activity:read_all'],
    };
  }

  async linkToStravaMobile(user, appContext) {
    const stravaId = stravaClientId();
    console.log('Sending account to Strava for linking... ' + user);
    console.log(user.email);
    const config = {
      clientId: stravaId,
      clientSecret: '22bbcc919c35ee62b0a8882def9503b459a39341',
      redirectUrl: 'http://localhost:19000/strava-callback',
      serviceConfiguration: {
        authorizationEndpoint: 'https://www.strava.com/oauth/mobile/authorize',
        tokenEndpoint:
          'https://www.strava.com/oauth/token?client_id=125563&client_secret=22bbcc919c35ee62b0a8882def9503b459a39341',
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