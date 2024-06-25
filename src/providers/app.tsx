import * as React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ChakraProvider, Spinner, extendTheme } from '@chakra-ui/react';
import { AuthProvider } from '@/providers/AuthProvider';
import { commonRoutes } from '@/routes';
import { publicRoutes } from '@/routes/public';
import { protectedRoutes } from '@/routes/protected';
import NavbarWrapper from '@/components/nav/NavbarWrapper';
import { useSpotifyUser } from '@/api/spotify';
import ErrorBoundary from '@/error-page';


export const AppProvider = () => {
  const { user } = useSpotifyUser();

  const permittedRoutes = user ? protectedRoutes : publicRoutes;

  const router = createBrowserRouter([
    {
      path: '/',
      element: <NavbarWrapper />,
      children: [
        ...commonRoutes, 
        ...permittedRoutes,
      ]
    }
  ])

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
      <ErrorBoundary>
        <ChakraProvider theme={theme}>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </ChakraProvider>
      </ErrorBoundary>
    </React.Suspense>
  );
};