import {render, fireEvent} from '@testing-library/react-native';
import { ProviderWrapper } from '../../test_utils';
import { CreateAccountComponent } from '../CreateAccountComponent';
import { invalidPasswordMessage } from '../../../common/utils';
import CreateAccountController from '../CreateAccountController';
import AppContext from '@/common/app-context';
import { QueryClient } from '@tanstack/react-query';
import { defaultAuthState } from '@/ctx';

const createController = () => {
  return new CreateAccountController(new AppContext(new QueryClient(), defaultAuthState));
}

describe('CreateAccount Component', () => {
  it('displays an error message for invalid email', async () => {
    const { findByTestId, queryByText, findByText } = render(
      <ProviderWrapper>
        <CreateAccountComponent controller={createController()}/>
      </ProviderWrapper>
    );

    // const emailForm = await findByTestId('emailForm');
    const emailInput = await findByTestId('emailInput');
    // console.log('emailInput: ' + emailInput);
    // console.log('query by: ' + queryByText('Please enter valid email'));
    expect(queryByText('Please enter valid email')).toBeNull();
    fireEvent.changeText(emailInput, 'testwithoutAmpersand');
    fireEvent(emailInput, 'blur');
    const errorText = await findByText('Please enter valid email');
    // console.log('emailInput: ' + emailInput);
    expect(errorText).not.toBeNull();
  });

  it('displays an error message for invalid password', async () => {
    const { findByTestId, queryByText } = render(
      <ProviderWrapper>
        <CreateAccountComponent controller={createController()}/>
      </ProviderWrapper>
    );

    const passwordInput = await findByTestId('passwordInput');
    expect(queryByText(invalidPasswordMessage)).toBeNull();
    fireEvent.changeText(passwordInput, 'tooShort');
    fireEvent(passwordInput, 'blur');
    expect(queryByText(invalidPasswordMessage)).not.toBeNull();
  });
});

