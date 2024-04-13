

export const strippedPhone = (formattedPhone: string) => {
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

export const invalidPasswordMessage = 'password must be at least 8 characters with a mix of special, upper and lower case'