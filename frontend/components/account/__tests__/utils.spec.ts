import {strippedPhone, isValidPhone, isValidPassword, isValidEmail, ensureNumber, getDateFromString } from '../../../common/utils';

describe('Phone Helper Methods', () => {
  it('stripped phone number', () => {
    expect(strippedPhone('1234567890')).toBe('1234567890');
    expect(strippedPhone('(123) 456-7890')).toBe('1234567890');
    expect(strippedPhone('123-456-7890')).toBe('1234567890');
    expect(strippedPhone('123.456.7890')).toBe('1234567890');
  });

  it('validate phone number', () => {
    expect(isValidPhone('1234567890')).toBeTruthy();
    expect(isValidPhone('(123) 456-7890')).toBeTruthy();
    expect(isValidPhone('123-456-7890')).toBeTruthy();
    expect(isValidPhone('123.456.7890')).toBeTruthy();
    expect(isValidPhone('123456789')).toBeFalsy();
    expect(isValidPhone('(123) 46-7890')).toBeFalsy();
    expect(isValidPhone('123-456-78901')).toBeFalsy();
    expect(isValidPhone('123.45667890')).toBeFalsy();
  });

  it('validate password', () => {
    expect(isValidPassword('e!ghtCha')).toBeTruthy();
    expect(isValidPassword('pa$$Word123')).toBeTruthy();
    expect(isValidPassword('tooF#w')).toBeFalsy();
    expect(isValidPassword('noSpecial')).toBeFalsy();
    expect(isValidPassword('no(apital')).toBeFalsy();
  });

  it('validate email', () => {
    expect(isValidEmail('noAmpersand')).toBeFalsy();
    expect(isValidEmail('no@period')).toBeFalsy();
    expect(isValidEmail('@nothingBefore.amper')).toBeFalsy();
    expect(isValidEmail('nothing@after.')).toBeFalsy();
    expect(isValidEmail('two@amper@sand.com')).toBeFalsy();
    expect(isValidEmail('a@b.com')).toBeTruthy();
  });

  it('ensure number', () => {
    expect(ensureNumber('1234567890')).toBe(1234567890);
    expect(ensureNumber(123)).toBe(123);
    expect(ensureNumber(123.456)).toBe(123.456);
    expect(ensureNumber(null)).toBe(0);
    expect(ensureNumber('')).toBe(0);
    expect(ensureNumber('abc123')).toBe(0);
    expect(ensureNumber('123abc')).toBe(0);
    expect(ensureNumber('123.456')).toBe(123.456);
    expect(ensureNumber('abc.123')).toBe(0);
    expect(ensureNumber('123abc.456')).toBe(0);
    expect(ensureNumber('abc.123.456')).toBe(0);
    expect(ensureNumber('abc.123.456.789')).toBe(0);
  })

  it('parse date', () => {
    const nan = 'Invalid Date'
    expect(getDateFromString(nan)).toBeNull();
    const christmas = '12/25/2025';
    expect(getDateFromString(christmas)).toEqual(new Date(2025, 11, 25));
    const july4 = '7/4/2026';
    expect(getDateFromString(july4)).toEqual(new Date(2026, 6, 4));

    expect(getDateFromString('2022/07/04')).toEqual(new Date(2022, 6, 4));
    expect(getDateFromString('4/25/2022')).toEqual(new Date(2022, 3, 25));
    expect(getDateFromString('11/25/2024')).toEqual(new Date(2024, 10, 25));

    const altDate = new Date('8/4/2023')
    const eight423 =new Date(2023, 7, 4)

    expect(getDateFromString('2023-08-04')).toEqual(eight423);
  });
});

