import { screen, fireEvent, cleanup, render } from '@testing-library/react-native';
import { ProviderWrapper } from '../../test_utils';
import { LoginComponent } from '../LoginComponent';
import { renderRouter } from 'expo-router/testing-library';

jest.useFakeTimers();
afterEach(cleanup);

describe('Login Component', () => {
  
  it('displays an error message for invalid email', async () => {
    const { getByTestId, getByText, findByText, queryByText } = render(
      <ProviderWrapper>
        <LoginComponent />
      </ProviderWrapper>
    );
  
    const emailInput = await screen.findByTestId('emailInput');
    const passwordInput = await screen.findByTestId('passwordInput');
    fireEvent.changeText(emailInput, 'test');
    fireEvent.changeText(passwordInput, 'weak');
    expect(await screen.findByDisplayValue('test')).not.toBeNull();
    // expect(await screen.findByTestId('weak')).toBeNull();
  });

});
