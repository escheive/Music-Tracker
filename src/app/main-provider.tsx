import React, { useState, useEffect } from 'react';
import { ChakraProvider, Spinner, extendTheme, theme as defaultTheme } from '@chakra-ui/react';
import { AuthProvider, useAuthContext } from '@/context/AuthProvider';
import { ModalProvider } from '@/context/ModalProvider';
import { ModalComponent } from '@/components/modal/ModalComponent';
import { Button, Text } from '@components/chakra-ui';
import { useSupabaseProfile } from '@api/supabase/fetch/fetch';
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