import { getInternal, post } from "./http-utils";
import AppContext from "./app-context";
import { Credentials } from "react-native-auth0";

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

export async function confirmLogin(session: Credentials | undefined): Promise<string> {
  if (!session || session === null || session.accessToken === null) {
    return '';
  }
  try {
    const result = await getInternal('/auth/check-session', {  }, session.accessToken);
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

export async function login(username: string, password: string, appContext: AppContext) {
  console.log('Logging in... ' + appContext);
  console.log('Logging in... ' + appContext.getEmail());

  const args = {
    username: username,
    password: password,
  };
  const response = post('/auth/login', args, appContext.getJwtToken());
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
          appContext.signIn(body.access_token, username);
          console.log('setting appContext.email to:'+ username);
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

export const sleep = (seconds: number): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(resolve, 1000*seconds);
  });
};

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