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
  FRONT_DERAILLEUR_BATTERY = "Front Derailleur Battery",
  REAR_DERAILLEUR_BATTERY = "Rear Derailleur Battery",
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
