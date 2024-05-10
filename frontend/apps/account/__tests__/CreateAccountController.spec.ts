import CreateAccountController from '../CreateAccountController';
import AppContext from "../../config/app-context";

const invalidEmailMessage = 'Please enter valid email';

const controller = new CreateAccountController(new AppContext());
describe('Email verifications', () => {
  it('Clearly invalid', () => {
    expect(controller.verifyEmail('noAmpersand')).toBe(invalidEmailMessage);
    expect(controller.verifyEmail('no@period')).toBe(invalidEmailMessage);
    expect(controller.verifyEmail('@nothingBefore.amper')).toBe(invalidEmailMessage);
    expect(controller.verifyEmail('nothing@after.')).toBe(invalidEmailMessage);
    expect(controller.verifyEmail('two@amper@sand.com')).toBe(invalidEmailMessage);
    expect(controller.verifyEmail('a@b.com')).toBe('');
  });
});
