

export const strippedPhone = (formattedPhone: string) => {
  return formattedPhone.replace(/[^0-9]/g, '');
};

export const isValidPhone = (phone: string) => {
  return strippedPhone(phone).length == 10;
};