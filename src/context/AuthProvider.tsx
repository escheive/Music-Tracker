import React, { createContext, useContext, useState } from 'react';

type AuthContextType = {
  accessToken: string;
  storeAccessToken: (accessToken: string) => void;
};


const AuthContext = createContext<AuthContextType>({
  accessToken: '',
  storeAccessToken: (_accessToken: string) => {},
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

  const storeAccessToken = (token) => {
    setAccessToken(token);
  };

  return (
    <AuthContext.Provider value={{ accessToken, storeAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
