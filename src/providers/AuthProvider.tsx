import React, { createContext, useContext, useState } from 'react';

type AuthContextType = {
  accessToken: string;
  storeAccessToken: (accessToken: string) => void;
  refreshToken: string;
  storeRefreshToken: (refreshToken: string) => void;
  handleUserLogout: () => void;
  session: any;
  setSession: (session: any) => void;
  
};


const AuthContext = createContext<AuthContextType>({
  accessToken: '',
  storeAccessToken: (_accessToken: string) => {},
  refreshToken: '',
  storeRefreshToken: (_refreshToken: string) => {},
  handleUserLogout: () => {},
  session: null,
  setSession: (session: any) => {},
  
});

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('usePlayerContext must be used within the PlayerContext provider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [session, setSession] = useState(null);

  const storeAccessToken = (token) => {
    setAccessToken(token);
  };

  const storeRefreshToken = (token) => {
    setRefreshToken(token);
  };

  const handleUserLogout = () => {
    setAccessToken('');
    setRefreshToken('')
  }

  const contextValue = {
    accessToken, 
    storeAccessToken, 
    refreshToken, 
    storeRefreshToken,
    handleUserLogout,
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
