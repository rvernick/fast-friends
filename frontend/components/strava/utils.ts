import { get, postExternal } from '../../common/http-utils';
import AppContext from '../../common/app-context';

export enum MaintenanceItemType {
  CHAIN = "Replace Chain",
  FRONT_BRAKE_PADS = "Replace Brakes",
  REAR_BRAKE_PADS = "Replace Brakes",
  REAR_SHIFTER_CABLE = "Rear Shifter Cable",
  FRONT_SHIFTER_CABLE = "Front Shifter Cable",
  REAR_BRAKE_CABLE = "Rear Brake Cable",
  FRONT_BRAKE_CABLE = "Front Brake Cable",
  REAR_SUSPENSION = "Replace Rear Suspension",
  FRONT_SUSPENSION = "Replace Front Suspension",
  REAR_TIRE = "Replace Rear Tire",
  FRONT_TIRE = "Replace Front Tire",
}

export const stravaBase = () => {
  return 'https://www.strava.com';
}


/**
 * https://developers.strava.com/docs/reference/#api-Athletes-getLoggedInAthlete
 * https://www.strava.com/api/v3/athlete" "Authorization: Bearer [[token]]"
 */
export const getAthelete = async (appContext: AppContext) => {
  const url = stravaBase() + '/oauth/token'
  var token = appContext.get('stravaToken');
  if (token == null) {
    token = '';
  }

  try {
    const response = await get(url, {}, token);
    if (response.ok) {
      const result = await response.json();
      console.log(JSON.stringify(result));
      return result;
    } else {
      return response.statusText;
    }
  } catch(e: any) {
    console.log(e.message);
    return e.message;
  }
};

/**
 * https://developers.strava.com/docs/reference/#api-Gears-getGearById
 * $ http GET "https://www.strava.com/api/v3/gear/{id}" "Authorization: Bearer [[token]]"
 * @param appContext
 */
export const getBike = async (bikeId: string, appContext: AppContext) => {
  const url = stravaBase() + '/gear/' + bikeId;
  var token = appContext.get('stravaToken');
  if (token == null) {
    token = '';
  }
  try {
    const response = await get(url, {}, token);
    if (response.ok) {
      const result = await response.json();
      console.log(JSON.stringify(result));
      return result;
    } else {
      return response.statusText;
    }
  } catch(e: any) {
    console.log(e.message);
    return e.message;
  }
};

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
export const doTokenExchange = async (session: any, appContext: AppContext, stravaCode: string) => {
  console.log('doTokenExchange');
  const clientId = await appContext.getStravaClientId(session);
  const clientSecret = await appContext.getStravaClientSecret(session);
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
      appContext.put('stravaAthlete', '' + result.athlete.id);
      return '';
    } else {
      return response.statusText;
    }
  } catch(e: any) {
    console.log(e.message);
    return e.message;
  }
};