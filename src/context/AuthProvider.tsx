import React, { createContext, useContext, useState } from 'react';

type AuthContextType = {
  accessToken: string;
  storeAccessToken: (accessToken: string) => void;
  refreshToken: string;
  storeRefreshToken: (refreshToken: string) => void;
};


const AuthContext = createContext<AuthContextType>({
  accessToken: '',
  storeAccessToken: (_accessToken: string) => {},
  refreshToken: '',
  storeRefreshToken: (_refreshToken: string) => {},
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

  const storeAccessToken = (token) => {
    setAccessToken(token);
  };

  const storeRefreshToken = (token) => {
    setRefreshToken(token);
  };

  return (
    <AuthContext.Provider value={{ accessToken, storeAccessToken, refreshToken, storeRefreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
