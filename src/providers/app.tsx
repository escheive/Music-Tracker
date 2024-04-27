import * as React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ChakraProvider, Spinner } from '@chakra-ui/react';
import { UserContextProvider } from '@/providers/UserProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { commonRoutes } from '@/routes';
import { publicRoutes } from '@/routes/public';
import { protectedRoutes } from '@/routes/protected';
import NavbarWrapper from '@/components/nav/NavbarWrapper';


type AppProviderProps = {
  children: React.ReactNode;
};


export const AppProvider = ({ children }: AppProviderProps) => {
  const auth = { user: false }

  const permittedRoutes = auth.user ? protectedRoutes : publicRoutes;

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
            <RouterProvider router={router} />
          </UserContextProvider>
        </AuthProvider>
      </ChakraProvider>
    </React.Suspense>
  );
};