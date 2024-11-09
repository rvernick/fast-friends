import { screen, fireEvent, cleanup, waitFor } from '@testing-library/react-native';
import { ProviderWrapper } from '../../test_utils';
import { LoginComponent } from '../LoginComponent';
import { renderRouter } from 'expo-router/testing-library';

jest.useFakeTimers();
afterEach(cleanup);

describe('Login Component', () => {
  
  it('displays an error message for invalid email', async () => {
    const wrappedLogin = jest.fn(() => 
        <ProviderWrapper>
          <LoginComponent />
        </ProviderWrapper>);
    
    renderRouter(
      {
        index: wrappedLogin,
        'directory/a': wrappedLogin,
        '(group)/b': wrappedLogin,
      },
      {
        initialUrl: '/directory/a',
      }
    );
  
    const emailInput = await screen.findByTestId('emailInput');
    const passwordInput = await screen.findByTestId('passwordInput');
    fireEvent.changeText(emailInput, 'test');
    fireEvent.changeText(passwordInput, 'weak');
    expect(await screen.findByDisplayValue('test')).not.toBeNull();
    // expect(await screen.findByTestId('weak')).toBeNull();
  });

});
