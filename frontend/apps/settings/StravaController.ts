import { Platform } from "react-native";
import AppContext from "../config/app-context";
import AppController from "../config/AppController";
import { authorize } from 'react-native-app-auth';
import {} from "../common/http_utils";

class StravaController extends AppController {
  constructor(appContext: AppContext) {
    super(appContext);
  }

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
    console.log('redirect ' + redirectUri);
    console.log('base: ' + appContext.baseUrl());
    const paramsObj = {
      client_id: '125563',
      response_type: 'code',
      approval_prompt: 'force',
      scope: 'read_all' };
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
    return {
      clientId: '125563',
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
    console.log('Sending account to Strava for linking... ' + user);
    console.log(user.email);
    const config = {
      clientId: '125563',
      clientSecret: '22bbcc919c35ee62b0a8882def9503b459a39341',
      redirectUrl: 'http://localhost:19000/strava-callback',
      serviceConfiguration: {
        authorizationEndpoint: 'https://www.strava.com/oauth/mobile/authorize',
        tokenEndpoint:
          'https://www.strava.com/oauth/token?client_id=125563&client_secret=22bbcc919c35ee62b0a8882def9503b459a39341',
      },
      scopes: ['activity:read_all'],
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