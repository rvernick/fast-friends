import {strippedPhone, isValidPhone, isValidPassword } from '../utils';

describe('FinishAccount Helper Methods', () => {
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
    expect(isValidPassword('tooF#w')).toBeFalsy();
    expect(isValidPassword('noSpecial')).toBeFalsy();
    expect(isValidPassword('no(apital')).toBeFalsy();
  });
});