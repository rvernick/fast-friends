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

export const postExternal = async (urlBase: string, endpoint: string, args: Object, jwtTokenPromise: Promise<any>) => {
  var jwtToken = null;
  if (jwtTokenPromise != null) {
    jwtToken = await jwtTokenPromise;
  }
  const url = urlBase + endpoint;
  const body = JSON.stringify(args);
  console.log('Posting: ' + url);
  var headers = {
    'Content-Type': 'application/json',
  };
  if (jwtToken) {
    headers['Authorization'] = 'Bearer '+ jwtToken.access_token;
  }
  return fetch(url, {
    method: 'POST',
    headers: headers,
    body: body
  });
}
