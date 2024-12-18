import axios from "axios";
import * as https from 'https'

export const get = (url: string, parameters: any, access_token: string | null): Promise<any | null> => {
  var fullUrl = url
  if (parameters != null && Object.keys(parameters).length > 0) {
    fullUrl = fullUrl + '?' + objToQueryString(parameters);
  }
  console.log('fullUrl: ' + fullUrl);
  console.log('jwtToken ' + access_token);
  var headers = {};
  if (access_token) {
    headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+ access_token,
    }
  } else {
    headers = {
      'Content-Type': 'application/json',
    };
  }
  return axios({
        url: fullUrl,
        method: 'GET',
        timeout: 3000,
        responseType: 'json',
        headers: headers,
        // httpsAgent: new https.Agent({
        //     rejectUnauthorized: false,
        // }),
    })
  .then((res) => {
    // console.log('GET: '+ url + '\n' + JSON.stringify(res.data));
    return res.data
  })
  .catch((err) => console.log(err));
};

export const post = (url: string, params: any, access_token: string | null = null) => {
  var headers = {};
  const body = JSON.stringify(params);
  console.log('Posting: ' + url + '\n' + body);
  if (access_token) {
    headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+ access_token,
    }
  } else {
    headers = {
      'Content-Type': 'application/json',
    };
  }

  return axios({
        url: url,
        method: 'POST',
        headers: headers,
        data: body,
        responseType: 'json',
        httpsAgent: new https.Agent({
            rejectUnauthorized: false,
        }),
    })
    .then((res) => res.data)
    .catch((err) => console.log(err));
  };

function objToQueryString(obj: { [x: string]: string | number | boolean; }) {
  const keyValuePairs = [];
  for (const key in obj) {
    keyValuePairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
  }
  return keyValuePairs.join('&');
}
