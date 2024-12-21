import {render, fireEvent, screen, cleanup } from '@testing-library/react-native';
import { ProviderWrapper } from '../../test_utils';
import { CreateAccountComponent } from '../CreateAccountComponent';
import { invalidPasswordMessage } from '../../../common/utils';
import CreateAccountController from '../CreateAccountController';
import AppContext from '@/common/app-context';
import { QueryClient } from '@tanstack/react-query';
import { defaultAuthState } from '@/common/ctx';
import { renderRouter } from 'expo-router/testing-library';

const createController = () => {
  return new CreateAccountController(new AppContext(new QueryClient(), defaultAuthState));
}

afterEach(cleanup);

describe('CreateAccount Component', () => {
  it('displays an error message for invalid email', async () => {
    const wrappedCreateAccount = jest.fn(() => 
        <ProviderWrapper>
          <CreateAccountComponent controller={createController()} />
        </ProviderWrapper>);
    renderRouter(
      {
        index: wrappedCreateAccount,
        'directory/a': wrappedCreateAccount,
        '(group)/b': wrappedCreateAccount,
      },
      {
        initialUrl: '/directory/a',
      }
    );

    // const emailForm = await findByTestId('emailForm');
    const emailInput = screen.getByTestId('emailInput');
    // console.log('emailInput: ' + emailInput);
    // console.log('query by: ' + queryByText('Please enter valid email'));
    expect(screen.queryByText('Please enter valid email')).toBeNull();
    fireEvent.changeText(emailInput, 'testwithoutAmpersand');
    fireEvent(emailInput, 'blur');
    const errorText = await screen.findByText('Please enter valid email');
    // console.log('emailInput: ' + emailInput);
    expect(errorText).not.toBeNull();
  });

  it('displays an error message for invalid password', async () => {
    const wrappedCreateAccount = jest.fn(() => 
        <ProviderWrapper>
          <CreateAccountComponent controller={createController()} />
        </ProviderWrapper>);
    renderRouter(
      {
        index: wrappedCreateAccount,
        'directory/a': wrappedCreateAccount,
        '(group)/b': wrappedCreateAccount,
      },
      {
        initialUrl: '/directory/a',
      }
    );

    const passwordInput = screen.getByTestId('passwordInput');
    expect(screen.queryByText(invalidPasswordMessage)).toBeNull();
    fireEvent.changeText(passwordInput, 'tooShort');
    fireEvent(passwordInput, 'blur');
    expect(await screen.findByText(invalidPasswordMessage)).not.toBeNull();
  });
});

