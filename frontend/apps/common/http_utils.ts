
export const baseUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://fast-friends-be.onrender.com/';
  }
  console.log('process.env.BASE_URL: ' + process.env.BASE_URL)
  const result = process.env.BASE_URL || 'http://localhost:3000';
  return ensureNoSlash(result);
}

export const get = (url: string, parameters, jwtToken) => {
  const fullUrl = baseUrl() + url + '?' + new URLSearchParams(parameters).toString();
  console.log('fullUrl: ' + fullUrl);

  return fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+ jwtToken,
    },
  })
   .then((res) => res.json())
   .catch((err) => console.log(err));
}

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

export const post = (endpoint: string, body: Object, jwtToken) => {
  return postExternal(baseUrl(), endpoint, body, jwtToken);
};

export const postExternal = (urlBase: string, endpoint: string, args: Object, jwtToken) => {
  const url = urlBase + endpoint;
  const body = JSON.stringify(args);
  console.log('Posting: ' + url);
  var headers = {
    'Content-Type': 'application/json',
  };
  if (jwtToken) {
    headers['Authorization'] = 'Bearer '+ jwtToken;
  }
  return fetch(url, {
    method: 'POST',
    headers: headers,
    body: body
  });
}
