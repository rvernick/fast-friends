import {render, fireEvent} from '@testing-library/react-native';
import { ProviderWrapper } from '../../test_utils';
import { EmailPasswordComponent } from '../EmailPasswordComponent';
import { invalidPasswordMessage } from '../../../common/utils';
import CreateAccountController from '../CreateAccountController';
import AppContext from '@/common/app-context';
import { QueryClient } from '@tanstack/react-query';
import { defaultAuthState } from '@/ctx';

const createController = () => {
  return new CreateAccountController(new AppContext(new QueryClient(), defaultAuthState));
}

describe('CreateAccount Component', () => {
  it('displays an error message for invalid email', () => {
    const { getByTestId, getByText, findByText, queryByText } = render(
      <ProviderWrapper>
        <EmailPasswordComponent controller={createController()}/>
      </ProviderWrapper>
    );

    // const emailForm = getByTestId('emailForm');
    const emailInput = getByTestId('emailInput');
    // console.log('emailInput: ' + emailInput);
    // console.log('query by: ' + queryByText('Please enter valid email'));
    expect(queryByText('Please enter valid email')).toBeNull();
    fireEvent.changeText(emailInput, 'testwithoutAmpersand');
    fireEvent(emailInput, 'blur');
    // console.log('emailInput: ' + emailInput);
    expect(queryByText('Please enter valid email')).not.toBeNull();
  });

  it('displays an error message for invalid password', () => {
    const { getByTestId, queryByText } = render(
      <ProviderWrapper>
        <EmailPasswordComponent controller={createController()}/>
      </ProviderWrapper>
    );

    const passwordInput = getByTestId('passwordInput');
    expect(queryByText(invalidPasswordMessage)).toBeNull();
    fireEvent.changeText(passwordInput, 'tooShort');
    fireEvent(passwordInput, 'blur');
    expect(queryByText(invalidPasswordMessage)).not.toBeNull();
  });
});

