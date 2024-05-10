import {render, fireEvent} from '@testing-library/react-native';
import { wrapForRender } from '../../test_utils';
import { CreateAccount } from '../CreateAccount';
import { invalidPasswordMessage } from '../../common/utils';

describe('CreateAccount Component', () => {
  it('displays an error message for invalid email', () => {
    const { getByTestId, getByText, findByText, queryByText } = render(
      wrapForRender(CreateAccount)
    );

    // const emailForm = getByTestId('emailForm');
    const emailInput = getByTestId('emailInput');
    console.log('emailInput: ' + emailInput);
    console.log('query by: ' + queryByText('Please enter valid email'));
    expect(queryByText('Please enter valid email')).toBeNull();
    fireEvent.changeText(emailInput, 'testwithoutAmpersand');
    fireEvent(emailInput, 'blur');
    console.log('emailInput: ' + emailInput);
    expect(queryByText('Please enter valid email')).not.toBeNull();
  });

  it('displays an error message for invalid password', () => {
    const { getByTestId, queryByText } = render(
      wrapForRender(CreateAccount)
    );

    const passwordInput = getByTestId('passwordInput');
    expect(queryByText(invalidPasswordMessage)).toBeNull();
    fireEvent.changeText(passwordInput, 'tooShort');
    fireEvent(passwordInput, 'blur');
    expect(queryByText(invalidPasswordMessage)).not.toBeNull();
  });
});

