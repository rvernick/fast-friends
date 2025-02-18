import { screen, fireEvent, cleanup } from '@testing-library/react-native';
import { ProviderWrapper } from '../../test_utils';
import { renderRouter } from 'expo-router/testing-library';
import { PasswordResetComponent } from '../PasswordResetComponent';

afterEach(cleanup);

describe('Login Component', () => {
  
  it('displays an error message for invalid email', async () => {
    const wrappedLogin = jest.fn(() => 
        <ProviderWrapper>
          <PasswordResetComponent/>
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
    fireEvent.changeText(emailInput, 'test');
    expect( await screen.findByDisplayValue('test') ).not.toBeNull();
    const submitButton = screen.getByTestId('submitButton');
    expect( submitButton ).toBeDisabled();
    fireEvent.changeText(emailInput, 'valid@email.com');
    expect(await screen.findByTestId('submitButton') ).toBeEnabled();
    // expect(await screen.findByTestId('weak')).toBeNull();
  });

});