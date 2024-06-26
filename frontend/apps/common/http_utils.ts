
export const baseUrl = () => {
  var defaultBase = 'http://localhost:3000';
  if (process.env.NODE_ENV === 'production') {
    defaultBase = 'https://fast-friends-be.onrender.com';
  }
  const result = process.env.BASE_URL || defaultBase;
  return ensureNoSlash(result);
}

export const getInternal = async (url: string, parameters: any, jwtTokenPromise: Promise<any>) => {
  var jwtToken = null;
  if (jwtTokenPromise != null) {
    jwtToken = await jwtTokenPromise;
  }
  console.log('getInternal url: ' + url);
  const fullUrl = baseUrl() + url;
  return get(fullUrl, parameters, jwtToken.access_token);
};

export const get = (url: string, parameters: any, access_token: string) => {
  var fullUrl = url
  if (parameters != null && Object.keys(parameters).length > 0) {
    fullUrl = fullUrl + '?' + objToQueryString(parameters);
  }
  console.log('fullUrl: ' + fullUrl);
  console.log('jwtToken ' + access_token);
  return fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+ access_token,
    },
  })
  .then((res) => res.json())
  .catch((err) => console.log(err));
};

function ensureNoSlash(path: string) {
  return path.endsWith('/')? path.slice(0, -1) : path;
}

function objToQueryString(obj) {
  const keyValuePairs = [];
  for (const key in obj) {
    keyValuePairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
  }
  return keyValuePairs.join('&');
}

export const post = (endpoint: string, body: Object, jwtTokenPromise: Promise<any>) => {
  return postExternal(baseUrl(), endpoint, body, jwtTokenPromise);
};

export const postExternal = async (urlBase: string, endpoint: string, args: Object, jwtTokenPromise: Promise<any>) => {
  var jwtToken = null;
  if (jwtTokenPromise != null) {
    jwtToken = await jwtTokenPromise;
  }
  const url = urlBase + endpoint;
  const body = JSON.stringify(args);
  console.log('Posting: ' + url + '\n' + body);
  var headers = {
    'Content-Type': 'application/json',
  };
  if (jwtToken) {
    headers['Authorization'] = 'Bearer ' + jwtToken.access_token;
    console.log('jwtToken.access_token: ' + jwtToken.access_token);
  }
  return fetch(url, {
    method: 'POST',
    headers: headers,
    body: body
  });
}
