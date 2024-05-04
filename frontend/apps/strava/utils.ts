import { get } from '../common/http_utils';
import AppContext from '../config/app-context';

export const stravaBase = () => {
  return 'https://www.strava.com';
}

export const stravaClientId = (): string => {
  return '125563';
};

export const stravaClientSecret = (): string => {
  return '22bbcc919c35ee62b0a8882def9503b459a39341';
};

/**
 * https://developers.strava.com/docs/reference/#api-Athletes-getLoggedInAthlete
 * https://www.strava.com/api/v3/athlete" "Authorization: Bearer [[token]]"
 */
export const getAthelete = async (appContext: AppContext) => {
  const url = stravaBase() + '/oauth/token'
  try {
    const response = await get(url, {}, appContext.get('stravaToken'));
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
export const getBike = async (bikeId, appContext: AppContext) => {
  const url = stravaBase() + '/gear/' + bikeId;
  try {
    const response = await get(url, {}, appContext.get('stravaToken'));
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