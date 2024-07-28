import { useContext, createContext, type PropsWithChildren } from 'react';
import { useStorageState } from './useStorageState';

const AuthContext = createContext<{
  signIn: (jwtToken: string, email: string) => void;
  signOut: () => void;
  jwt_token?: string | null;
  email?: string | null;
  isLoading: boolean;
}>({
  signIn: (jwtToken: string, email: string) => null,
  signOut: () => null,
  jwt_token: null,
  email: null,
  isLoading: false,
});

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
      {children}
    </AuthContext.Provider>
  );
}
