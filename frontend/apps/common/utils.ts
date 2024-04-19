import { post } from "./http_utils";
import AppContext from "../config/app-context";

export const strippedPhone = (formattedPhone: string) => {
  if (!formattedPhone) {
    return '';
  }
  return formattedPhone.replace(/[^0-9]/g, '');
};

export const isValidPhone = (phone: string) => {
  return strippedPhone(phone).length == 10;
};

export const isValidPassword = (password: string) => {
  console.log('ivp length ' + password.length);
  return password.match(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
  && password.length >= 8;
};

export async function login(username: string, password: string, appContext: AppContext) {
  console.log('Logging in... ' + appContext);
  console.log('Logging in... ' + appContext.email);

  const args = JSON.stringify({
    username: username,
    password: password,
  });
  const response = post('auth/login', args, appContext.jwtToken);
  return response
    .then(resp => {
      if (resp.ok) {
        console.log('resp: ' + resp);
        // console.log('setting appContext.jwtToken to:'+ resp.json())
        // console.log('body ' + resp.body);
        // console.log('json ' + resp.body);
        resp.json().then(body => {
          console.log('setting appContext.jwtToken to:' + body);
          console.log('body ' + body.access_token);
          appContext.jwtToken = body;
          console.log('setting appContext.email to:'+ username);
          appContext.email = username;
          console.log('checking is logged in');
          console.log('Should be logged in: ' + appContext.isLoggedIn())
          return '';
        });
      } else {
        console.log('Login failed ' + resp.statusText)
        return 'Invalid username or password';
      }
    })
    .catch(error => {
      console.log('Failed to log in ' + error.message);
      return 'System error';
    });
};

export const invalidPasswordMessage = 'password must be at least 8 characters with a mix of special, upper and lower case'