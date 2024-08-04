import {render, fireEvent} from '@testing-library/react-native';
import { ProviderWrapper } from '../../test_utils';
import { EmailPasswordComponent } from '../EmailPasswordComponent';
import { invalidPasswordMessage } from '../../../common/utils';
import CreateAccountController from '../CreateAccountController';
import AppContext from '@/common/app-context';
import { QueryClient } from '@tanstack/react-query';
import { defaultAuthState } from '@/ctx';
import { LoginComponent } from '../LoginComponent';


describe('CreateAccount Component', () => {
  it('displays an error message for invalid email', () => {
    const { getByTestId, getByText, findByText, queryByText } = render(
      <ProviderWrapper>
        <LoginComponent />
      </ProviderWrapper>
    );
  });

});

