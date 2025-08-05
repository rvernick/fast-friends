import { getInternal, post } from "./http-utils";
import * as SecureStore from 'expo-secure-store';
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/models/User";
import { identifyLogRocketMobile, identifyLogRocketWeb } from "./logrocket";
import { FACE_ID_PASSWORD, FACE_ID_USERNAME, LAST_LOGIN_TIME_MS } from "./constants";

export const strippedPhone = (formattedPhone: string) => {
  if (!formattedPhone) {
    return '';
  }
  return formattedPhone.replace(/[^0-9]/g, '');
};

export const isValidPhone = (phone: string) => {
  return strippedPhone(phone).length == 10;
};

export const isMobileSize = (): boolean => {
  return isMobile() || isSmallScreen();
};

const isSmallScreen = (): boolean => {
  return window && window.innerWidth != null && window.innerWidth < 600;
}

export const isMobile = (): boolean => {
  return Platform.OS === 'android' || Platform.OS === 'ios';
}

export const isProduction = (): boolean => {
  return isMobile() || process.env.NODE_ENV === 'production';
}

export const remember = (key: string, value: string) => {
  if (isMobile()) {
    SecureStore.setItemAsync(key, value);
  } else {
    AsyncStorage.setItem(key, value);
  }
}

export const forget = (key: string) => {
  if (isMobile()) {
    SecureStore.deleteItemAsync(key);
  } else {
    AsyncStorage.removeItem(key);
  }
}

export const remind = async (key: string): Promise<string> => {
  if (isMobile()) {
    return ensureString(SecureStore.getItem(key));
  } else {
    return ensureString(await AsyncStorage.getItem(key));
  }
}

/**
 * ensures password is at least 8 characters long
 * has at least one special character
 * and at least one lower and one upper case letter
 */
export const isValidPassword = (password: string) => {
  return (
    password.length >= 8 &&
    password.match(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/) !=  null
  );
}

export const isValidEmail = (email: string): boolean => {
  return (
    email.includes('@') &&
    email.includes('.') &&
    email.length > 4 &&
    email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/) != null);
}

export const isValidSession = async (session: any): Promise<boolean> => {
  return await confirmLogin(session) === 'logged-in';
}

export async function confirmLogin(session: any): Promise<string> {
  if (session === null || session.jwt_token === null) {
    return '';
  }
  try {
    console.log('Confirm Login.  Checking session...');
    const result = await getInternal('/auth/check-session', {  }, session.jwt_token);
    if (result.status === 'logged-in') {
      return 'logged-in';
    } else {
      console.log('Failed to check session with get: ' + result.ok + JSON.stringify(result));
      return 'not-logged-in';
    }
  } catch (error) {
    console.log('Failed to check session: ' + error);
    return 'not-logged-in';
  }
}

export async function login(username: string, password: string, session: any) {
  console.log('Logging in... ' + username);

  if (username === '' || password === '') {
    console.log('Invalid username or password');
    return 'Invalid username or password';
  }

  const args = {
    username: username,
    password: password,
  };
  const response = post('/auth/login', args, null);
  return response
    .then(resp => {
      if (resp.ok) {
        console.log('resp: ' + resp);
        // console.log('setting appContext.jwtToken to:'+ resp.json())
        // console.log('body ' + resp.body);
        // console.log('json ' + resp.body);
        resp.json().then(body => {
          session.signIn(body.access_token, username);
          console.log('setting appContext.jwtToken to:' + body);
          console.log('body ' + body.access_token);
          if (isMobile()) {
            const now = new Date();
            remember(FACE_ID_USERNAME, username);
            remember(FACE_ID_PASSWORD, password);
            remember(LAST_LOGIN_TIME_MS, now.getTime().toString());
          }
          initializeLogRocket(body.user);
          console.log('setting appContext.email to:'+ username);
          return '';
        });
      } else {
        console.log('Login failed ' + resp.statusText);
        forget(FACE_ID_USERNAME);
        forget(FACE_ID_PASSWORD);
        return 'Invalid username or password';
      }
    })
    .catch(error => {
      console.log('Failed to log in ' + error.message);
      return 'System error';
    });
};

export const defaultUserPreferences = {
  units: "miles",
};

const initializeLogRocket = (user: User) => {
  if (!isProduction()) {
    console.log('Not initializing LogRocket.');
    return;
  }

  console.log('Initializing LogRocket...');
  try {
    if (isMobile()) {
      identifyLogRocketMobile(user.username, user.firstName, user.lastName);
    } else {
      identifyLogRocketWeb(user.username, user.firstName, user.lastName);
    }
  } catch (error: any) {
    console.error('Failed to initialize LogRocket:', error);
  }
}

export const updateUserPreferences = async (session: any): Promise<any | null> => {
  const user = await fetchUser(session, session.email);
  if (user) {
    return setUserPreferences(user);
  }
  return defaultUserPreferences
}

export const setUserPreferences = async (user: User): Promise<any | null> => {
  const preferences: { units?: string } = {};
  preferences.units = user.units == 'km'? "km" : "miles";
  remember("ff.preferences", JSON.stringify(preferences));
  return preferences;
}

export const getUserPreferences = async (session: any): Promise<any | null> => {
  const result = await remind("ff.preferences");
  if (result && result.length > 0) {
    try {
      return JSON.parse(result);
    } catch (e: any) {
      console.log('Failed to parse user preferences: ' + e.message);
      forget("ff.preferences");
      return defaultUserPreferences;
    }
  } else {
    updateUserPreferences(session);
  }
  return defaultUserPreferences;
}

export const fetchUser = async (session: any, username: string): Promise<User | null> => {
  console.log('fetching user: ' + username);
  try {
    const parameters = {
      username: username,
    };
    return getInternal('/auth/user', parameters, session.jwt_token) as Promise<User | null>;
  } catch(e: any) {
    console.log(e.message);
    return null;
  }
}

export const setUserPushToken = async (session: any, pushToken: string): Promise<User | null> => {
try {
    const parameters = {
      username: session.email,
      push_token: pushToken,
    };
    return post('/user/update-push-token', parameters, session.jwt_token) as Promise<any | null>;
  } catch(e: any) {
    console.log(e.message);
    return null;
  }
}

export const fetchSecrets = async (session: any): Promise<any | null> => {
  console.log('fetchSecrets jwt: ' + session.jwt_token);
  try {
    const parameters = {};
    console.log('fetching secrets: ');
    return getInternal('/secrets', parameters, session.jwt_token) as Promise<any | null>;
  } catch(e: any) {
    console.log(e.message);
    return null;
  }
}

export const fetchSecretsByVerify = async (verifyCode: string): Promise<any | null> => {
  try {
    const parameters = {
      verifyCode: verifyCode,
    };
    console.log('fetching secrets: ' + verifyCode);
    return getInternal('/user/v1/secrets', parameters, '') as Promise<any | null>;
  } catch(e: any) {
    console.log(e.message);
    return null;
  }
}

export const sleep = (seconds: number): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(resolve, 1000*seconds);
  });
};

export const copy = (obj: any): any => {
  return JSON.parse(JSON.stringify(obj));
}

export const invalidPasswordMessage = 'password must be at least 8 characters with a mix of special, upper and lower case'

export const ensureString = (value: string | string[] | null | undefined | number | any): string => {
  if (value == null || value === '') {
    return '';
  }
  if (typeof value === 'number') {
    return value.toString();
  }
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  if (typeof value === 'string') {
    return value;
  }
  return '';
}

export const milesToMeters = (miles: number): number => {
  return Math.round(miles * 1609.34);
}

export const kilometersToMeters = (km: number): number => {
  return Math.round(km * 1000);
}

export const metersToMiles = (meters: number): number => {
  return Math.round(meters / 1609.34);
}

export const metersToMilesString = (meters: number): string => {
  return metersToMiles(meters).toFixed(0);
}

export const metersToKilometersString = (meters: number): string => {
  return (meters / 1000).toFixed(0);
}

export const metersToDisplayString = (meters: number, preferences: any): string => {
  if (preferences.units === "km") {
    return metersToKilometersString(meters);
  }
  return metersToMilesString(meters);
}

export const displayStringToMeters = (displayString: string, preferences: any): number => {
  if (preferences.units === "km") {
    return kilometersToMeters(parseInt(displayString));
  }
  return milesToMeters(parseInt(displayString));
}

export const distanceUnitDisplayString = (preferences: any): string => {
  return preferences.units === 'km'? 'km' :' miles';
}

export const today = (): Date => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}
