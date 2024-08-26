import { useContext, createContext, type PropsWithChildren, useEffect } from 'react';
import { useStorageState } from './useStorageState';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { confirmLogin } from './common/utils';
import { AppState } from 'react-native';
import { Auth0Provider, useAuth0 } from 'react-native-auth0';

export const defaultAuthState = {
  signIn: (jwtToken: string, email: string) => null,
  signOut: () => null,
  jwt_token: null,
  email: null,
  isLoading: false,
};

const AuthContext = createContext<{
  signIn: (jwtToken: string, email: string) => void;
  signOut: () => void;
  jwt_token?: string | null;
  email?: string | null;
  isLoading: boolean;
}>(defaultAuthState);

const LoginConfirmation = createContext('not-logged-in');

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}

function LoginConfirmationWrapper({ children }: PropsWithChildren) {
  const session = useSession();
  const {authorize, clearSession, user, error, isLoading, getCredentials} = useAuth0();

  const queryClient = useQueryClient();
  const { data, isFetching, isError } = useQuery({
    queryKey: ['loginConfirmation'],
    queryFn: async () => confirmLogin(await getCredentials()),
    initialData: 'logged-in',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
    refetchInterval: 60*1000,
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    if (session && session.jwt_token && !isFetching && ('not-logged-in' === data || isError)) {
      console.log('Signing out.... ' + session.jwt_token + ' ' + data);
      session.signOut();
    }
  }, [session, data, isFetching, isError]);

  return (
    <LoginConfirmation.Provider value={'aString'}>
      { children }
    </LoginConfirmation.Provider>
  );
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, jwt_token], setSession] = useStorageState('jwt_token');
  const [[emailLoading, email], setEmail] = useStorageState('email');
  const domain = process.env.EXPO_PUBLIC_REACT_APP_AUTH0_DOMAIN;
  const clientId = process.env.EXPO_PUBLIC_REACT_APP_AUTH0_CLIENT_ID;
 
  if (!(domain && clientId)) {
    console.error('Missing required environment variables for Auth0 ' + domain + ' @ ' + clientId);
    return null;
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
    >
      <AuthContext.Provider
        value={{
          signIn: (jwtToken: string, email: string) => {
            // Perform sign-in logic here
            setSession(jwtToken);
            setEmail(email);
          },
          signOut: () => {
            setSession(null);
            setEmail(null);
          },
          jwt_token,
          email,
          isLoading,
        }}>
        <LoginConfirmationWrapper>
          {children}
        </LoginConfirmationWrapper>
      </AuthContext.Provider>
    </Auth0Provider>
  );
}
