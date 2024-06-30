import { createContext, useContext, useEffect, useState } from 'react';
import supabase from '@api/supabase';

type AuthContextType = {
  session: any;
  setSession: (session: any) => void;
};

type AuthProviderProps = {
  children: React.ReactNode;
};


const AuthContext = createContext<AuthContextType>({
  session: null,
  setSession: (session: any) => { session; },
});

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within the AuthContext provider');
  }
  return context;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const contextValue = {
    session,
    setSession
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
