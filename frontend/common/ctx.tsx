import { useContext, createContext, type PropsWithChildren, useEffect } from 'react';
import { useStorageState } from '../useStorageState';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { confirmLogin, sleep } from './utils';

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
  const queryClient = useQueryClient();
  const { data, isFetching, isError } = useQuery({
    queryKey: ['loginConfirmation'],
    queryFn: async () => confirmLogin(session),
    initialData: 'logged-in',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
    refetchInterval: 2*60*1000,
    refetchIntervalInBackground: true,
  });

  const ensureServerRecognizesSession = async () => {
    await sleep(10);  // let the login process complete before checking
    if (session 
          && session.jwt_token 
          && session.jwt_token.length > 0
          && !isFetching
          && ('not-logged-in' === data || isError)) {
      console.log('Signing out.... ' + session.jwt_token + ' ' + data);
      session.signOut();
    }
  }

  useEffect(() => {
    ensureServerRecognizesSession();
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

  return (
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
  );
}
