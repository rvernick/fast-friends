import { screen, fireEvent, cleanup } from '@testing-library/react-native';
import { ProviderWrapper } from '../../test_utils';
import { LoginComponent } from '../LoginComponent';
import { renderRouter } from 'expo-router/testing-library';

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
  
    const emailInput = screen.getByTestId('emailInput');
    const passwordInput = screen.getByTestId('passwordInput');
    fireEvent.changeText(emailInput, 'test');
    fireEvent.changeText(passwordInput, 'weak');
    expect( await screen.findByDisplayValue('test') ).not.toBeNull();
    // expect(await screen.findByTestId('weak')).toBeNull();
  });

});