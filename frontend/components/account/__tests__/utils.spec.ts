import {strippedPhone, isValidPhone, isValidPassword, isValidEmail } from '../../../common/utils';

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
});