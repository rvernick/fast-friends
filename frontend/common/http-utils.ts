import { Platform } from "react-native";

export const baseUrl = () => {
  var defaultBase = 'http://10.0.2.2:4000';  // Android emulator
  defaultBase = 'https://fast-friends-be.onrender.com';
  if (Platform.OS === 'web') {
    defaultBase = 'http://localhost:4000';
  }
  if (process.env.NODE_ENV === 'production') {
    defaultBase = 'https://fast-friends-be.onrender.com';
  }
  const result = process.env.BASE_URL || defaultBase;
  return ensureNoSlash(result);
}

export const getInternal = async (url: string, parameters: any, jwtToken: string | null) => {
  // console.log('getInternal url: ' + url);
  const fullUrl = baseUrl() + url;
  return get(fullUrl, parameters, jwtToken);
};

export const get = (url: string, parameters: any, access_token: string | null) => {
  var fullUrl = url
  if (parameters != null && Object.keys(parameters).length > 0) {
    fullUrl = fullUrl + '?' + objToQueryString(parameters);
  }
  var headers = {};
  if (access_token!= null) {
    headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+ access_token,
    }
    } else {
    headers = {
      'Content-Type': 'application/json',
    }
  }
  // console.log('fullUrl: ' + fullUrl);
  // console.log('jwtToken ' + access_token);
  return fetch(fullUrl, {
    method: 'GET',
    headers: headers,
  })
  .then((res) => res.json())
  .catch((err) => console.log(err));
};

function ensureNoSlash(path: string) {
  return path.endsWith('/')? path.slice(0, -1) : path;
}

function objToQueryString(obj: { [x: string]: string | number | boolean; }) {
  const keyValuePairs = [];
  for (const key in obj) {
    keyValuePairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
  }
  return keyValuePairs.join('&');
}

export const post = (endpoint: string, body: Object, jwtToken: string | null) => {
  return postExternal(baseUrl(), endpoint, body, jwtToken);
};

export const postExternal = async (urlBase: string, endpoint: string, args: Object, jwtToken: string | null) => {
  var headers = {};
  const url = urlBase + endpoint;
  const body = JSON.stringify(args);
  // console.log('Posting: ' + url + '\n' + body);
  if (jwtToken) {
    // console.log('jwtToken'+ jwtToken);
    headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+ jwtToken,
    }
  } else {
    headers = {
      'Content-Type': 'application/json',
    };
  }

  return fetch(url, {
    method: 'POST',
    headers: headers,
    body: body
  });
}

/**
 * Strips everything but the base URL from a given URL string.
 * 
 * @param {string} url - The full URL string.
 * @returns {string} The base URL.
 */
export const getBaseUrl = (url: string): string => {
  try {
    const parsedUrl = new URL(url);
    return `${parsedUrl.protocol}//${parsedUrl.host}`;
  } catch (error) {
    console.error('Invalid URL:', error);
    return '';
  }
}

export const isLoggedIn = async (session: any): Promise<boolean> => {
  if (session === null) {
      console.log('get Requests has no context: ');
      return false;
    }
    const jwtToken = await session.jwt_token;
    if (jwtToken == null) {
      console.log('get requests has no token dying: ' );
      return false;
    }
    return true;
}
