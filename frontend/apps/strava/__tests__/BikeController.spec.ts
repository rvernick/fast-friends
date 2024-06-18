import AppContext from "../../config/app-context";
import BikeController from "../BikeController";

const invalidEmailMessage = 'Please enter valid email';

const controller = new BikeController(new AppContext());

describe('Name verifications', () => {
  it('Bike Name Validations', () => {
    expect(controller.isValidName('')).toBe(controller.emptyName);
    expect(controller.isValidName(' Invalid space')).toBe(controller.startWithLetterOrNumber);
    expect(controller.isValidName('No $pecial Characters')).toBe(controller.canOnlyContainLettersNumbersSpaces);
    expect(controller.isValidName('Spaces Are Okay')).toBe('');
    expect(controller.isValidName('5numbers AreOKay')).toBe('');
  });
});
