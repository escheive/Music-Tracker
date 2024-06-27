import * as React from 'react';
import { ChakraProvider, Spinner, extendTheme } from '@chakra-ui/react';
import { AuthProvider } from '@/providers/AuthProvider';
import { ModalProvider } from '../providers/ModalProvider';
import { ModalComponent } from '@/components/modal/ModalComponent';

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {

  const theme = extendTheme({
    colors: {
      alternatePurple: {
        50: '#ffe5fe',
        100: '#f8b5fd',
        200: '#ee84f9',
        300: '#e254f7',
        400: '#d226f5',
        500: '#b112dc',
        600: '#850cab',
        700: '#5b077a',
        800: '#35024a',
        900: '#16001c',
      }
    },
  })

  return (
    <React.Suspense
      fallback={
        <div className="flex items-center justify-center w-screen h-screen">
          <Spinner size="xl" />
        </div>
      }
    >
        <ChakraProvider theme={theme}>
          <AuthProvider>
            <ModalProvider>
              {children}
              <ModalComponent />
            </ModalProvider>
          </AuthProvider>
        </ChakraProvider>
    </React.Suspense>
  );
};