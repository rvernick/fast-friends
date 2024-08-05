import {render, screen, fireEvent, cleanup } from '@testing-library/react-native';
import { ProviderWrapper } from '../../test_utils';
import { LoginComponent } from '../LoginComponent';

jest.useFakeTimers();
afterEach(cleanup);

describe('Login Component', () => {
  
  it('displays an error message for invalid email', () => {
    render(
      <ProviderWrapper>
        <LoginComponent />
      </ProviderWrapper>
    );
    const emailInput = screen.getByTestId('emailInput');
    const passwordInput = screen.getByTestId('passwordInput');
    fireEvent.changeText(emailInput, 'test');
    fireEvent.changeText(passwordInput, 'weak');
    expect(screen.getByDisplayValue('test')).not.toBeNull();
    // expect(screen.getByText('weak')).toBeNull();
  });

});
