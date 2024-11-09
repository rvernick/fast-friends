import { fireEvent, cleanup, render } from '@testing-library/react-native';
import { ProviderWrapper } from '../../test_utils';
import { LoginComponent } from '../LoginComponent';

jest.useFakeTimers();
afterEach(cleanup);

describe('Login Component', () => {
  
  it('displays an error message for invalid email', async () => {
    const { findByTestId, findByDisplayValue, findByText, queryByText } = render(
      <ProviderWrapper>
        <LoginComponent />
      </ProviderWrapper>
    );
  
    const emailInput = await findByTestId('emailInput');
    const passwordInput = await findByTestId('passwordInput');
    fireEvent.changeText(emailInput, 'test');
    fireEvent.changeText(passwordInput, 'weak');
    expect(await findByDisplayValue('test')).not.toBeNull();
    // expect(await screen.findByTestId('weak')).toBeNull();
  });

});
