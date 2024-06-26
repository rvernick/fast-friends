import { getInternal, post } from "./http_utils";
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

export async function login(username: string, password: string, appContext: AppContext) {
  console.log('Logging in... ' + appContext);
  console.log('Logging in... ' + appContext.getEmail());
  appContext.clearJwtToken();
  appContext.clearJwtExpiration();

  const args = {
    username: username,
    password: password,
  };
  const response = post('/auth/login', args, appContext.getJwtTokenPromise());
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
          appContext.setEmail(username);
          appContext.updateUser();
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

export const fetchUser = async (username: string, appContext: AppContext): Promise<User | null> => {
  console.log('fetching user:' + username);
  console.log(appContext);
  console.log(appContext.getJwtToken());
  try {
    const parameters = {
      username: username,
    };
    console.log('fetching user: ' + username);
    return getInternal('/auth/user', parameters, appContext.getJwtTokenPromise()) as Promise<User | null>;
  } catch(e: any) {
    console.log(e.message);
    return null;
  }
}

export const fetchSecrets = async (appContext: AppContext): Promise<User | null> => {
  console.log('fetchSecrets ' + appContext);
  console.log('fetchSecrets jwt: ' + appContext.getJwtToken());
  try {
    const parameters = {};
    console.log('fetching secrets: ');
    return getInternal('/secrets', parameters, appContext.getJwtTokenPromise()) as Promise<User | null>;
  } catch(e: any) {
    console.log(e.message);
    return null;
  }
}

export const sleep = (timeout: number): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};

export const invalidPasswordMessage = 'password must be at least 8 characters with a mix of special, upper and lower case'
