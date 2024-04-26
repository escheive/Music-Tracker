import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ChakraProvider, Spinner } from '@chakra-ui/react';
import { UserContextProvider } from '@/context/UserProvider';
import { AuthProvider } from '@/context/AuthProvider';


type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <React.Suspense
      fallback={
        <div className="flex items-center justify-center w-screen h-screen">
          <Spinner size="xl" />
        </div>
      }
    >       
      <ChakraProvider>
        <AuthProvider>
          <UserContextProvider>
            <Router>{children}</Router>
          </UserContextProvider>
        </AuthProvider>
      </ChakraProvider>
    </React.Suspense>
  );
};