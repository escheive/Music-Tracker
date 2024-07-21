import React from 'react';
import { Spinner } from '@chakra-ui/react';
import { AuthProvider } from '@/context/AuthProvider';
import { ModalProvider } from '@/context/ModalProvider';
import { ModalComponent } from '@/components/modal/ModalComponent';
import { CustomChakraProvider } from '@context/CustomChakraProvider';
import { SWRConfig } from 'swr';

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
      <SWRConfig value={{ provider: () => new Map() }}>
        <AuthProvider>
          <CustomChakraProvider>
            <ModalProvider>
              {children}
              <ModalComponent />
            </ModalProvider>
          </CustomChakraProvider>
        </AuthProvider>
      </SWRConfig>
    </React.Suspense>
  );
};